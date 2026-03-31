export type actionFunction = (
  prevState: any,
  formData: FormData,
) => Promise<{ message: string }>;

export type Cartitem = {
  productId: string;
  image: string;
  title: string;
  price: string;
  amount: string;
  company: string;
};

export type CartState = {
  cartItems: Cartitem[];
  numItemsInCart: number;
  cartTotal: number;
  shipping: number;
  tax: number;
  orderTotal: number;
};
