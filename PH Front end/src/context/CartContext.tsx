import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { ItemDTO, OfferDTO } from '../types/interfaces';

export interface CartItem extends ItemDTO {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  cartOrderId: number;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setCartOrderId: React.Dispatch<React.SetStateAction<number>>;
  addToCart: (item: ItemDTO, quantity?: number) => void;
  decrementItem: (itemId: number) => void;
  clearCart: () => void;
  isOfferActiveFn: (offer?: OfferDTO) => boolean;
  getBestOffer: (item: ItemDTO) => OfferDTO | undefined;
  getDiscountedPrice: (item: ItemDTO, offer?: OfferDTO) => number;
  applyAllActiveOffers: (item: CartItem) => {
    totalAfterDiscount: number;
    totalDiscount: number;
  };
}

  const CartContext = createContext<CartContextType | undefined>(undefined);
    
  const isOfferActiveFn = (offer?: OfferDTO) => {
    if (!offer || !offer.isActive) return false;
    const now = new Date();
    return (!offer.validFrom || new Date(offer.validFrom) <= now) &&
          (!offer.validTo || new Date(offer.validTo) >= now);
  }; 

function getBestOffer(item: ItemDTO): OfferDTO | undefined {
  const offers = item.offers || [];
  let maxDiscount = 0;
  let bestOffer: OfferDTO | undefined;

  for (const offer of offers) {

    if (!isOfferActiveFn(offer)) continue;

    if(offer.discountType === 'BOGO') {
      continue;
    }

    const discountedPrice = getDiscountedPrice(item, offer);
    const discount = item.itemPrice - discountedPrice;

    if (discount > maxDiscount) {
      maxDiscount = discount;
      bestOffer = offer;
    }
  }

  return bestOffer;
}

function applyAllActiveOffers(item: CartItem): {
  totalAfterDiscount: number;
  totalDiscount: number;
} {
  const { itemPrice, quantity, offers } = item;

  const originalTotal = itemPrice * quantity;
  let total = originalTotal;

  const activeOffers = (offers || [])
    .filter(isOfferActiveFn);

  
  //  percentage discounts sequentially
  const percentageDiscounts = activeOffers.filter((o) => o.discountType === 'PERCENTAGE');
  for (const offer of percentageDiscounts) {
    const percent = offer.discountValue ?? 0;
    total = Math.round(total * (1 - percent / 100));
  }

  //  flat discounts
  const flatDiscounts = activeOffers
    .filter((o) => o.discountType === 'FLAT')
    .reduce((sum, o) => sum + (o.discountValue ?? 0), 0);

  total = Math.max(total - flatDiscounts, 0);

  //  BOGO logic last
  const hasBogo = activeOffers.some((o) => o.discountType === 'BOGO');
  if (hasBogo) {
    const payableQty = Math.ceil(quantity / 2);
    const bogoTotal = itemPrice * payableQty;
    total = Math.min(total, bogoTotal); //  min to avoid over-discounting
  }

  const totalDiscount = originalTotal - total;

  return {
    totalAfterDiscount: total,
    totalDiscount,
  };
}


function getDiscountedPrice(item: ItemDTO, offer?: OfferDTO): number {
  const { itemPrice } = item;
  if (!offer || !isOfferActiveFn(offer)) return itemPrice;

  switch (offer.discountType) {
    case 'PERCENTAGE':
      return Math.max(Math.round(itemPrice * (1 - (offer.discountValue ?? 0) / 100)), 0);
    case 'FLAT':
      return Math.max(itemPrice - (offer.discountValue ?? 0), 0);
    default:
      return itemPrice;
  }
}


export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOrderId, setCartOrderId] = useState<number>(0);

  const addToCart = (item: ItemDTO, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.itemId === item.itemId);
      if (existing) {
        return prev.map((i) =>
          i.itemId === item.itemId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const decrementItem = (itemId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.itemId === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, decrementItem, clearCart, isOfferActiveFn, getBestOffer, getDiscountedPrice, applyAllActiveOffers, cartOrderId, setCartOrderId }}
    >
      {children}
    </CartContext.Provider>
  );
};
