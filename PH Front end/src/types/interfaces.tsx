export interface LoginPageProps {
  setIsAuthenticated: (value: boolean) => void;
}

export interface MenuProps {
  setIsAuthenticated: (value: boolean) => void;
}

export interface CounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset?: () => void;
}

export interface ItemInfo{
  itemId: number;
  itemName: string;
  itemTypeName: string;
  itemPrice: number;
  isVeg: boolean;
  description: string;
  imageUrl: string;
}

export interface Item extends ItemInfo {
  offerItems?: OfferItem[];
}

export interface ItemDTO extends ItemInfo {
  offers: OfferDTO[];
}

export interface UserType {
  id: number;
  name: string;
  description: string;
}

type DiscountType = 'FLAT' | 'PERCENTAGE' | 'BOGO';

export interface Offer {
  offerId: number;
  offerText: string;
  discountType: DiscountType;
  discountValue: number | null;
  validFrom?: string;
  validTo?: string;
  isActive?: boolean;
}

export interface OfferItem {
  id: number;
  item: Item;
  offer: Offer;
}

export interface OfferDTO{
  id:number
  discountValue: number | null;
  discountType: DiscountType;
  isActive: boolean;
  offerText: string;
  validFrom: string;
  validTo: string;
}

export interface ItemTypeProps {
  itemTypeId: number;
  itemTypeName: string;
  itemTypeDescription?: string;
}
