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
              <label htmlFor="offerText">Offer Name</label>
              <div className="form-input">
                <input
                  type="text"
                  id="offerText"
                  placeholder=" "
                  {...register('offerText', { required: 'Offer name is required' })}
                />
                {errors.offerText && <span className="error">{errors.offerText.message}</span>}
            </div>
          </div>

            {/* Discount Type */}
            <div className="form-group">
              <label htmlFor="discountType">Discount Type</label>
              <div className="form-input">
                 <select id="discountType" {...register('discountType')}>
                  <option value="" disabled hidden></option>
                  <option value="BOGO">BOGO</option>
                  <option value="FLAT">Flat</option>
                  <option value="PERCENTAGE">Percentage</option>
              </select>
              </div>
            </div>

            {/* Discount Value */}
            {discountType !== 'BOGO' && (
              <div className="form-group">
                <label htmlFor="discountValue">Discount Value</label>
                <div className="form-input">
                  <input
                    type="number"
                    id="discountValue"
                    placeholder=" "
                    {...register('discountValue', {
                      required: 'Discount value is required',
                      min: { value: 0.01, message: 'Must be greater than 0' },
                    })}
                  />
                  {errors.discountValue && <span className="error">{errors.discountValue.message}</span>}
                </div>
               </div>
            )}

            {/* Valid From */}
            <div className="form-group">
              <label htmlFor="validFrom">Valid From</label>
              
              <div className="form-input">
                <input type="datetime-local" id="validFrom" placeholder=" " {...register("validFrom", { required: true })} />
                {errors.validFrom && <span className="error">{errors.validFrom.message}</span>}
              </div>
            </div>

            {/* Valid To */}
            <div className="form-group">
              <label htmlFor="validTo">Valid To</label>
              <div className="form-input">
                <input type="datetime-local" id="validTo" placeholder=" " {...register("validTo", {
                    required: true,
                    validate: (toValue) => {
                      if (!validFrom || !toValue) return true;
                      return new Date(validFrom) < new Date(toValue)
                      || "Valid To must be after Valid From";
                  }
                })} />
                {errors.validTo && <span className="error">{errors.validTo.message}</span>}
              </div>
            </div>

            {/* Is Active */}
            <div className="form-group">
              <label htmlFor="isActive">Is Active?</label>
              <div className="form-input" style={{textAlign: "justify"}}>
                <input type="checkbox" id="isActive" {...register('isActive')} />
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

export default AddOffer;
