import { useForm } from "react-hook-form";
import type { OfferDTO } from "../../types/interfaces";
import { addOffer, formatDateTimeLocal } from "../../services/offerService";
import showNotification from "../../components/Notification/showNotification";

interface AddOfferProps {
  onClose: () => void;
  setOffers: React.Dispatch<React.SetStateAction<OfferDTO[]>>;
}

const AddOffer: React.FC<AddOfferProps> = ({ onClose, setOffers }) => {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<OfferDTO>({
    defaultValues: {
      id: 0,
      validFrom: formatDateTimeLocal(new Date()),
      validTo: formatDateTimeLocal(new Date()),
      discountType: 'FLAT',
      isActive: true,
      offerText: '',
      discountValue: null
    },
  });

  const discountType = watch('discountType');  
  const validFrom = watch('validFrom');

  const onSubmit = async (data: OfferDTO) => {
    const payload = {
      ...data,
      discountValue: data.discountType === 'BOGO' ? null : Number(data.discountValue),
    };

    try {
      const addedOffer = await addOffer(payload);
      if (!addedOffer) throw new Error('Failed to add offer');
      setOffers((prevOffers) => [...prevOffers, addedOffer]);

      reset();
      onClose(); // Close popup after submission
    } catch (error) {
      console.error(error);
      showNotification.error('Error adding offer');
    }
  };

  return (
        <div className="form-container">
          <h2>Add New Offer</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Offer Text */}
            <div className="form-group">
              {errors.offerText && <span className="error">{errors.offerText.message}</span>}
              <input
                type="text"
                id="offerText"
                placeholder=" "
                {...register('offerText', { required: 'Offer name is required' })}
              />
              <div className="cut"></div>
              <label className="placeholder" htmlFor="offerText">Offer Name</label>
            </div>

            {/* Discount Type */}
            <div className="form-group">
              <select id="discountType" {...register('discountType')}>
                <option value="" disabled hidden></option>
                <option value="BOGO">BOGO</option>
                <option value="FLAT">Flat</option>
                <option value="PERCENTAGE">Percentage</option>
              </select>
              <div className="cut"></div>
              <label className="placeholder" htmlFor="discountType">Discount Type</label>
            </div>

            {/* Discount Value */}
            {discountType !== 'BOGO' && (
              <div className="form-group">
                {errors.discountValue && <span className="error">{errors.discountValue.message}</span>}
                <input
                  type="number"
                  id="discountValue"
                  placeholder=" "
                  {...register('discountValue', {
                    required: 'Discount value is required',
                    min: { value: 0.01, message: 'Must be greater than 0' },
                  })}
                />
                <div className="cut cut-short"></div>
                <label className="placeholder" htmlFor="discountValue">Discount Value</label>
                
              </div>
            )}

            {/* Valid From */}
            <div className="form-group">
              {errors.validFrom && <span className="error">{errors.validFrom.message}</span>}
              <input type="datetime-local" id="validFrom" placeholder=" " {...register("validFrom", { required: true })} />
              <div className="cut"></div>
              <label className="placeholder" htmlFor="validFrom">Valid From</label>
            </div>

            {/* Valid To */}
            <div className="form-group">
              {errors.validTo && <span className="error">{errors.validTo.message}</span>}
              <input type="datetime-local" id="validTo" placeholder=" " {...register("validTo", {
                  required: true,
                  validate: (toValue) => {
                    if (!validFrom || !toValue) return true;
                    return new Date(validFrom) < new Date(toValue)
                      || "Valid To must be after Valid From";
                  }
                })} />
              <div className="cut"></div>
              <label className="placeholder" htmlFor="validTo">Valid To</label>
            </div>

            {/* Is Active */}
            <div className="form-group">
              <div><label htmlFor="isActive">Is Active</label></div>
              <div><input type="checkbox" id="isActive" {...register('isActive')} /></div>
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

export default AddOffer;
