import { IconType } from 'react-icons/lib';
import {
  CiBarcode,
  CiShoppingCart,
  CiHome,
  CiCircleAlert,
  CiBookmark,
  CiBoxes,
  CiCalculator1,
  CiFilter,
  CiCirclePlus,
} from 'react-icons/ci';

export const pageLinks = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/signup',
  about: '/about',
  products: '/products',
  cart: '/cart',
  favourites: '/favourites',
  orders: '/orders',
  adminSales: '/admin/sales',
  adminProducts: '/admin/products',
  adminCreateProduct: '/admin/products/create',
} as const;

type NavLink = {
  href: string;
  label: string;
  icon: IconType;
};

export const links: NavLink[] = [
  { href: pageLinks.home, label: 'home', icon: CiHome },
  { href: pageLinks.about, label: 'about', icon: CiCircleAlert },
  { href: pageLinks.products, label: 'products', icon: CiFilter },
  { href: pageLinks.cart, label: 'cart', icon: CiShoppingCart },
  { href: pageLinks.favourites, label: 'favorites', icon: CiBookmark },
  { href: pageLinks.orders, label: 'orders', icon: CiBarcode },
];

export const adminLinks: NavLink[] = [
  { href: pageLinks.adminSales, label: 'sales', icon: CiCalculator1 },
  { href: pageLinks.adminProducts, label: 'my products', icon: CiBoxes },
  {
    href: pageLinks.adminCreateProduct,
    label: 'create product',
    icon: CiCirclePlus,
  },
];

export const publicLinks: NavLink[] = [
  { href: pageLinks.home, label: 'home', icon: CiHome },
  { href: pageLinks.about, label: 'about', icon: CiCircleAlert },
  { href: pageLinks.products, label: 'products', icon: CiBoxes },
  { href: pageLinks.cart, label: 'cart', icon: CiShoppingCart },
];

export const authPromptLinks: Omit<NavLink, 'href'>[] = [
  { label: 'favorites', icon: CiBookmark },
  { label: 'orders', icon: CiBarcode },
];
