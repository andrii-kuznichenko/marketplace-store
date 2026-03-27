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
  { href: '/favorites', label: 'favorites', icon: CiBookmark },
  { href: '/cart', label: 'cart', icon: CiShoppingCart },
  { href: '/orders', label: 'orders', icon: CiBarcode },
];
