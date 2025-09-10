import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { ItemDTO, ItemInfo, ItemTypeProps } from "../../../types/interfaces";
import showNotification from "../../../components/Notification/showNotification";
import { addItem, convertToJPG, getItemTypes, uploadImage } from "../../../services/itemService";
import "../../../styles/admin/addItemForm.scss";

interface AddItemProps {
  onClose: () => void;
  setItems: React.Dispatch<React.SetStateAction<ItemDTO[]>>;
}

const AddNewItem: React.FC<AddItemProps> = ({ onClose, setItems }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<ItemInfo>({
    defaultValues: {
      itemId: 0,
      itemName: "",
      itemTypeName: "",
      itemPrice: 0,
      isVeg: true,
      description: "",
      imageUrl: "",
    },
  });

  const [itemTypes, setItemTypes] = useState<ItemTypeProps[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemTypesData = async () => {
      try {
        const data = await getItemTypes();
        setItemTypes(data);
      } catch {
        showNotification.error("Failed to load item types.");
      }
    };

    fetchItemTypesData();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const itemName = getValues("itemName");
    if (!itemName) {
      showNotification.error("Please enter the item name before uploading an image.");
      return;
    }

    //  Get file extension (case-insensitive)
    const originalExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    const safeName = itemName.replace(/\s+/g, "_").toLowerCase();
    const finalFileName = `${safeName}.jpg`;

    let finalFile: File;

    if (originalExt === ".jpg" || originalExt === ".jpeg") {
      //  Already JPG — just rename
      finalFile = new File([file], finalFileName, { type: "image/jpeg" });
    } else {
      //  Not JPG — convert using canvas
      try {
        finalFile = await convertToJPG(file);
      } catch (error) {
        console.error("Conversion to JPG failed:", error);
        showNotification.error("Failed to convert image to JPG.");
        return;
      }
    }

    //  Local preview
    const preview = URL.createObjectURL(finalFile);
    setPreviewUrl(preview);

    const formData = new FormData();
    formData.append("image", finalFile);

    try {
      const uploadedUrl = await uploadImage(formData);
      if (!uploadedUrl) throw new Error("Upload failed.");

      setValue("imageUrl", uploadedUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
      showNotification.error("Image upload failed.");
      setValue("imageUrl", "");
    }
  };



  const onSubmit = async (data: ItemInfo) => {
    try {

      const finalItem: ItemDTO = {
        ...data,
        isVeg: data.isVeg,
        offers: [],
      };

      const response = await addItem(finalItem);
      if (!response) throw new Error("Failed to add item");

      const addedItem: ItemDTO | undefined = response.addedItem;

      if (addedItem) {
        setItems((prev) => [...prev, addedItem]);
        showNotification.success("Item added successfully!");
      } else {
        showNotification.error("Failed to retrieve added item.");
      }

      reset();
      setPreviewUrl(null);
      onClose();
    } catch (err) {
      console.error(err);
      showNotification.error("Error adding item.");
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Item Name */}
        <div className="form-group">
          <label htmlFor="itemName">Item Name</label>
          <div className="form-input">
            <input
              type="text"
              id="itemName"
              {...register("itemName", { required: "Item name is required" })}
            />
            {errors.itemName && <span className="error">{errors.itemName.message}</span>}
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <div className="form-input">
            <textarea
              id="description"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <span className="error">{errors.description.message}</span>}
          </div>
        </div>

        {/* Item Type */}
        <div className="form-group">
          <label htmlFor="itemTypeName">Item Type</label>
          <div className="form-input">
            <select
              id="itemTypeName"
              {...register("itemTypeName", { required: "Item type is required" })}
            >
              <option value="">-- Select Item Type --</option>
              {itemTypes.map((type) => (
                <option key={type.itemTypeId} value={type.itemTypeName}>
                  {type.itemTypeName}
                </option>
              ))}
            </select>
            {errors.itemTypeName && <span className="error">{errors.itemTypeName.message}</span>}
          </div>
        </div>

        {/* Price */}
        <div className="form-group">
          <label htmlFor="itemPrice">Price (₹)</label>
          <div className="form-input">
            <input
              type="number"
              step="0.01"
              id="itemPrice"
              {...register("itemPrice", {
                required: "Price is required",
                min: { value: 0.01, message: "Price must be greater than 0" },
                validate: (value) => value > 0 || "Must be a positive number",
              })}
            />
            {errors.itemPrice && <span className="error">{errors.itemPrice.message}</span>}
          </div>
        </div>

        {/* Veg / Non-Veg */}
        <div className="form-group radio-group">
          <label>Is Veg?</label>
          <div className="radio-options">
            <label className="radio-label">
              <input type="radio" value="1" {...register("isVeg", { required: true })} />
              Veg
            </label>
            <label className="radio-label">
              <input type="radio" value="0" {...register("isVeg", { required: true })} />
              Non-Veg
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label htmlFor="imageUrl">Upload Image</label>
          <div className="form-input">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button type="submit" className="submit-btn">Submit</button>
          <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddNewItem;
