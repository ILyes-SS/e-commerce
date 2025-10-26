export type CartItem = {
  id: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
  size: string | null;
  color: string | null;
  unit: string | null;
  weight: number | null;
  dimension: number | null;
  stockQty: number;
};
export type CartItemServer = {
  productVariant: {
    product: {
      id: string;
      image: string;
      name: string;
      slug: string;
      description: string;
      weight: number | null;
      dimension: number | null;
      lowStock: number;
      categoryId: string;
      brandId: string;
    };
    price: number;
    size: string | null;
    color: string | null;
    unit: string | null;
    stock: {
      qty: number;
    };
  };
  id: string;
  quantity: number;
};
export type CartStore = {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => (state: any) => any;
  setCartItems: (cartItems: CartItem[]) => void;
};
