import { IconType } from 'react-icons/lib';
import {
  CiBarcode,
  CiShoppingCart,
  CiHome,
  CiCircleAlert,
  CiBookmark,
  CiBoxes,
} from 'react-icons/ci';

type NavLink = {
  href: string;
  label: string;
  icon: IconType;
};

export const links: NavLink[] = [
  { href: '/', label: 'home', icon: CiHome },
  { href: '/about', label: 'about', icon: CiCircleAlert },
  { href: '/products', label: 'products', icon: CiBoxes },
  { href: '/cart', label: 'cart', icon: CiShoppingCart },
  { href: '/favourites', label: 'favorites', icon: CiBookmark },
  { href: '/orders', label: 'orders', icon: CiBarcode },
];

export const publicLinks: NavLink[] = [
  { href: '/', label: 'home', icon: CiHome },
  { href: '/about', label: 'about', icon: CiCircleAlert },
  { href: '/products', label: 'products', icon: CiBoxes },
  { href: '/cart', label: 'cart', icon: CiShoppingCart },
];

export const authPromptLinks: Omit<NavLink, 'href'>[] = [
  { label: 'favourites', icon: CiBookmark },
  { label: 'orders', icon: CiBarcode },
];
