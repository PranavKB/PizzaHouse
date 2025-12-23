import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { ItemDTO, ItemInfo, ItemTypeProps } from "../../../types/interfaces";
import showNotification from "../../../components/Notification/showNotification";
import { addItem, convertToJPG, getItemTypes, uploadImage } from "../../../services/itemService";
import { Form, Input, InputNumber, Radio, Upload, Button, Select, Space, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

interface AddItemProps {
  onClose: () => void;
  setItems: React.Dispatch<React.SetStateAction<ItemDTO[]>>;
}

const AddNewItem: React.FC<AddItemProps> = ({ onClose, setItems }) => {
  const {
    control,
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
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

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

  const handleImageUpload = async ({ file, onSuccess, onError }: any) => {
    const itemName = getValues("itemName");
    if (!itemName) {
      showNotification.error("Please enter the item name before uploading an image.");
      onError("Item name missing");
      return;
    }

    setUploading(true);
    const originalExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const safeName = itemName.replace(/\s+/g, "_").toLowerCase();
    const finalFileName = `${safeName}.jpg`;

    let finalFile: File;

    if (originalExt === ".jpg" || originalExt === ".jpeg") {
      finalFile = new File([file], finalFileName, { type: "image/jpeg" });
    } else {
      try {
        finalFile = await convertToJPG(file);
      } catch (error) {
        showNotification.error("Failed to convert image to JPG.");
        onError(error);
        setUploading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append("image", finalFile);

    try {
      const uploadedUrl = await uploadImage(formData);
      if (!uploadedUrl) throw new Error("Upload failed.");
      setValue("imageUrl", uploadedUrl);
      onSuccess("OK");
      showNotification.success("Image uploaded!");
    } catch (error) {
      showNotification.error("Image upload failed.");
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ItemInfo) => {
    try {
      const finalItem: ItemDTO = {
        ...data,
        isVeg: String(data.isVeg) === 'true' || data.isVeg === true,
        offers: [],
      };

      const response = await addItem(finalItem);
      if (!response) throw new Error("Failed to add item");

      const addedItem: ItemDTO | undefined = response.addedItem;

      if (addedItem) {
        setItems((prev) => [...prev, addedItem]);
        showNotification.success("Item added successfully!");
      }

      reset();
      setFileList([]);
      onClose();
    } catch (err) {
      showNotification.error("Error adding item.");
    }
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <Title level={3}>Add New Pizza Item</Title>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item label="Item Name" required validateStatus={errors.itemName ? 'error' : ''} help={errors.itemName?.message}>
          <Controller
            name="itemName"
            control={control}
            rules={{ required: "Item name is required" }}
            render={({ field }) => <Input {...field} placeholder="e.g. Margherita Deluxe" />}
          />
        </Form.Item>

        <Form.Item label="Description" required validateStatus={errors.description ? 'error' : ''} help={errors.description?.message}>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => <Input.TextArea {...field} rows={3} placeholder="Fresh basil, mozzarella, and tomatoes..." />}
          />
        </Form.Item>

        <div style={{ display: 'flex', gap: '20px' }}>
          <Form.Item label="Item Type" style={{ flex: 1 }} required validateStatus={errors.itemTypeName ? 'error' : ''} help={errors.itemTypeName?.message}>
            <Controller
              name="itemTypeName"
              control={control}
              rules={{ required: "Item type is required" }}
              render={({ field }) => (
                <Select {...field} placeholder="Select type">
                  {itemTypes.map((type) => (
                    <Option key={type.itemTypeId} value={type.itemTypeName}>
                      {type.itemTypeName}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Price (₹)" style={{ flex: 1 }} required validateStatus={errors.itemPrice ? 'error' : ''} help={errors.itemPrice?.message}>
            <Controller
              name="itemPrice"
              control={control}
              rules={{ required: "Price is required", min: 0.01 }}
              render={({ field }) => <InputNumber {...field} style={{ width: '100%' }} min={0.01} step={0.01} />}
            />
          </Form.Item>
        </div>

        <Form.Item label="Dietary Preference">
          <Controller
            name="isVeg"
            control={control}
            render={({ field }) => (
              <Radio.Group {...field}>
                <Radio value={true}>Veg</Radio>
                <Radio value={false}>Non-Veg</Radio>
              </Radio.Group>
            )}
          />
        </Form.Item>

        <Form.Item label="Pizza Image">
          <Upload
            listType="picture"
            maxCount={1}
            customRequest={handleImageUpload}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
          >
            <Button icon={<UploadOutlined />} loading={uploading}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit">Add Item</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddNewItem;
