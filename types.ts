import {
  Cart,
  Product,
  ProductImage,
  ProductVariant,
  Stock,
} from "./app/generated/prisma";

export type CartItem = {
  id: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
  size: string | null;
  color: string | null;
  stockQty: number;
  prodVariantId: string;
  cartId: string;
};
export type CartItemServer = {
  productVariant: {
    id: string;
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
  cartId: string;
};

export type CartWithItems = Cart & {
  items: CartItemServer[];
};
export type ProductVariantsImagesStock = Product & {
  variants: (ProductVariant & { stock: Stock | null })[];
} & {
  images: ProductImage[];
};

export type CartStore = {
  cartId: string | null;
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  getCartTotal: () => (state: any) => any;
  setCartItems: (cartItems: CartItem[]) => void;
  setCartId: (cartId: string | null) => void;
  increaseItemQuantity: (productId: string) => void;
  decreaseItemQuantity: (productId: string) => void;
};
