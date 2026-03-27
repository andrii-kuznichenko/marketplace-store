import ProductsContainer from '@/components/products/ProductsContainer';

type Layout = 'grid' | 'list' | 'carousel';
const LAYOUTS: Layout[] = ['grid', 'list', 'carousel'];

type SearchParams = Promise<{ layout?: string; search?: string }>;

async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const { layout, search = '' } = await searchParams;
  const safeLayout = LAYOUTS.includes(layout as Layout)
    ? (layout as Layout)
    : 'grid';

  return <ProductsContainer layout={safeLayout} search={search} />;
}

export default ProductsPage;
