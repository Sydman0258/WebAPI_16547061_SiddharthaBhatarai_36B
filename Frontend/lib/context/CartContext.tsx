"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customNotes?: string;
  restaurantId?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: any) => void;
  updateQuantity: (id: string, amount: number) => void;
  clearCart: () => void;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);


  // Load cart after component mounts (client only)
  useEffect(() => {

    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    setIsLoaded(true);

  }, []);



  // Save cart whenever cart changes
  useEffect(() => {

    if (isLoaded) {
      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );
    }

  }, [cart, isLoaded]);



  const clearCart = () => {

    setCart([]);

    localStorage.removeItem("cart");

  };



  const addToCart = (item: any) => {

    const itemId =
      item._id ||
      item.id ||
      item.menuItemId;


    const itemRestaurantId =
      item.restaurantId ||
      item.restaurant?._id;



    setCart((prevCart) => {

      const existingItem = prevCart.find(
        (i) => i._id === itemId
      );


      if (existingItem) {

        return prevCart.map((i) =>
          i._id === itemId
            ? {
                ...i,
                quantity: i.quantity + 1,
              }
            : i
        );

      }



      return [
        ...prevCart,

        {
          _id: itemId,
          name: item.name,
          price: item.price,
          image: item.image,
          customNotes: item.customNotes,
          restaurantId: itemRestaurantId,
          quantity: 1,
        },

      ];

    });

  };




  const updateQuantity = (
    id: string,
    amount: number
  ) => {

    setCart((prev) =>

      prev

        .map((item) =>
          item._id === id
            ? {
                ...item,
                quantity:
                  item.quantity + amount,
              }
            : item
        )

        .filter(
          (item) =>
            item.quantity > 0
        )

    );

  };




  return (

    <CartContext.Provider

      value={{
        cart,
        addToCart,
        updateQuantity,
        clearCart,
        isLoaded,
      }}

    >

      {children}

    </CartContext.Provider>

  );

}





export function useCart() {

  const context = useContext(CartContext);


  if (!context) {

    throw new Error(
      "useCart must be used within a CartProvider"
    );

  }


  return context;

}