import { Prisma } from '@prisma/client';

export type actionFunction = (
  prevState: any,
  formData: FormData,
) => Promise<{ message: string }>;

export type CartItem = {
  productId: string;
  image: string;
  title: string;
  price: string;
  amount: string;
  company: string;
};

export type GuestCartItem = {
  productId: string;
  amount: number;
  size: string;
};

export type CartState = {
  cartItems: CartItem[];
  numItemsInCart: number;
  cartTotal: number;
  shipping: number;
  tax: number;
  orderTotal: number;
};

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: {
    product: {
      include: {
        company: true;
        sizes: true;
        media: true;
      };
    };
  };
}>;
