import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { CartItem } from "@/shared/types";
import { products as staticProducts } from "@/shared/staticData";

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: number, quantity?: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  sessionId: string;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => {
    let id = localStorage.getItem("sessionId");
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("sessionId", id);
    }
    return id;
  });

  useEffect(() => {
    const savedCart = localStorage.getItem(`cart-${sessionId}`);
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, [sessionId]);

  const saveCartToLocalStorage = (cartItems: CartItem[]) => {
    localStorage.setItem(`cart-${sessionId}`, JSON.stringify(cartItems));
  };

  const addToCart = (productId: number, quantity = 1) => {
    setIsLoading(true);
    const product = staticProducts.find((p) => p.id === productId);
    if (!product) {
      setIsLoading(false);
      return;
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product_id === productId
      );
      let newItems;

      if (existingItem) {
        newItems = prevItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: Date.now(),
          session_id: sessionId,
          product_id: productId,
          quantity,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        newItems = [...prevItems, newItem];
      }

      saveCartToLocalStorage(newItems);
      return newItems;
    });
    setIsLoading(false);
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    setIsLoading(true);
    setItems((prevItems) => {
      const newItems =
        quantity <= 0
          ? prevItems.filter((item) => item.id !== itemId)
          : prevItems.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            );

      saveCartToLocalStorage(newItems);
      return newItems;
    });
    setIsLoading(false);
  };

  const removeFromCart = (itemId: number) => {
    setIsLoading(true);
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== itemId);
      saveCartToLocalStorage(newItems);
      return newItems;
    });
    setIsLoading(false);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        getTotalPrice,
        getTotalItems,
        sessionId,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
