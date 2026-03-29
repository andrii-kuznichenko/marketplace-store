import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { pageLinks } from '@/utils/links';

function BreadCrumbs({ name }: { name: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbLink href={pageLinks.home} className='text-lg capitalize'>
          home
        </BreadcrumbLink>
        <BreadcrumbSeparator />
        <BreadcrumbLink href={pageLinks.products} className='text-lg capitalize'>
          products
        </BreadcrumbLink>
        <BreadcrumbSeparator />
        <BreadcrumbItem className='text-lg capitalize'>{name}</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadCrumbs;
