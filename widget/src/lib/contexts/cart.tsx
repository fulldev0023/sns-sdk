import { type ReactNode, createContext, useState } from "react";

interface CartItem {
  domain: string;
  storage: number;
  price: number;
}

type Domain = string;
type Cart = Record<Domain, CartItem>;

export interface CartContextValue {
  cart: Cart;
  isCartEmpty: boolean;
  addToCart: (x: CartItem) => void;
  emptyCart: () => void;
  removeFromCart: (x: Domain) => void;
}

export const CartContext = createContext<CartContextValue>({
  cart: {},
  isCartEmpty: true,
  addToCart: () => {},
  emptyCart: () => {},
  removeFromCart: () => {},
});

export const CartContextProvider = ({ children }: { children: ReactNode }) => {
  const [cart, updateCart] = useState<Cart>({});

  const addToCart = (item: CartItem) => {
    updateCart({
      ...cart,
      [item.domain]: item,
    });
  };

  const removeFromCart = (domain: Domain) => {
    const tempCart = { ...cart };
    delete tempCart[domain];
    updateCart(tempCart);
  };

  const emptyCart = () => updateCart({});

  const isCartEmpty = !Object.values(cart).length;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        isCartEmpty,
        emptyCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
