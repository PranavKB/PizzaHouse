import { useEffect, useState } from "react";
import type { MenuProps, OfferDTO } from "../../types/interfaces";
import '../../styles/header.scss';
import '../../styles/table.scss';
import '../../styles/modal.scss';
import { convertToUIDateTime, deleteOffer, getOffersDTO, getItemOfferIdMap, mapItemToOffers } from "../../services/offerService";
import showNotification from "../../components/Notification/showNotification";
import { useConfirm } from "../../components/ConfirmBox/useConfirm";
import Header from "../Header";
import { useItemsContext } from "../../context/ItemsContext";
const Offers: React.FC<MenuProps> = () => {

    const [offers, setOffers] = useState<OfferDTO[]>([]);
    const [itemOfferMap, setItemOfferMap] = useState<Record<number, number[]>>({});
    const { confirm, ConfirmModal } = useConfirm();
    const { setLoading } = useItemsContext();
    useEffect(() => {
      const fetchOffers = async () => {
        try {
          setLoading(true);
          const response = await getOffersDTO();
          setOffers(response);
        } catch (err: any) {
          showNotification.error('Failed to load offers.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };   
      const fetchItemOfferMap = async () => {
        try {
          const response = await getItemOfferIdMap();
          setItemOfferMap(response);
        } catch (err: any) {
          showNotification.error('Failed to load item-offer map.');
          console.error(err);
        }
      };

      fetchOffers();
      fetchItemOfferMap();
    }, []);

    const handleDeleteOffer = async (id: number) => {
      const confirmed = await confirm({ message: 'Are you sure you want to delete this offer?' });
      if (confirmed) {
        await deleteOffer(id);
        setOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== id));
      }
    };


    const handleSaveMapItems = async (itemId: number, offerIds: number[]) => {
        await mapItemToOffers(itemId, offerIds);
    }
    return (

        <div className="header-class">
            
                <>
                    <Header 
                      setOffers={setOffers}
                      offers={offers}
                      handleSaveMapItems={handleSaveMapItems}
                      itemOfferMap={itemOfferMap}
                      heading="Offers"
                    />
                    <div className="table-list-container">
                        <div className="table-list-header">
                            <div className="table-cell">Name</div>
                            <div className="table-cell">Discount Type</div>
                            <div className="table-cell">Discount Value</div>
                            <div className="table-cell">Validity</div>
                            <div className="table-cell">isActive ?</div>
                            <div className="table-cell">Action</div>
                        </div>
                        {offers.map(offer => (
                        <div className="table-list-row" key={offer.id}>
                            <div className="table-cell">{offer.offerText}</div>
                            <div className="table-cell">{offer.discountType}</div>
                            <div className="table-cell">{offer.discountValue}</div>
                            <div className="table-cell"><span>{convertToUIDateTime(offer.validFrom)}</span> to <br /><span>{convertToUIDateTime(offer.validTo)}</span></div>
                            <div className="table-cell">{offer.isActive ? 'Active' : 'Inactive'}</div>
                            <div className="table-cell">
                                {
                                  offer.validTo && new Date(offer.validTo) > new Date() && (
                                    <button onClick={() => handleDeleteOffer(offer.id)}>Delete</button>
                                  )
                                }
                            </div>
                        </div>
                        ))}
                        <ConfirmModal />
                    </div>
                </>
            

            
        </div>
    );
}

export default Offers