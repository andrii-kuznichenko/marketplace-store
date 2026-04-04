import { SubmitButton } from '@/components/form/Buttons';
import CheckBoxInput from '@/components/form/CheckBoxInput';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import FileInputContainer from '@/components/form/FileInputContainer';
import PriceInput from '@/components/form/PriceInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import CategorySelectGroup from '@/components/form/CategorySelectGroup';
import SizesInput from '@/components/form/SizesInput';
import CustomFieldsInput from '@/components/form/CustomFieldsInput';
import { Label } from '@/components/ui/label';
import {
  addProductImagesAction,
  addProductVideoAction,
  deleteProductFilesAction,
  reorderProductMediaAction,
  updateProductFilesAction,
} from '@/utils/actions/adminMediaActions';
import {
  fetchAdminProductDetails,
  fetchAdminProductsForLinking,
} from '@/utils/actions/adminProductQueries';
import {
  unlinkColorVariantAction,
  updateProductAction,
} from '@/utils/actions/adminProductActions';
import { Gender, MainCategory, Subcategory } from '@prisma/client';

async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchAdminProductDetails(id);
  const products = await fetchAdminProductsForLinking(id);

  const { name, description, price, color, featured, gender, mainCategory, subcategory, sizes, customFields, colorGroup } = product;

  const colorVariants = colorGroup?.products.filter((p) => p.id !== id) ?? [];

  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>
        update product: "{name}"
      </h1>
      <div className='border p-8 rounded-md'>
        <FileInputContainer
          media={product.media}
          name={name}
          updateAction={updateProductFilesAction}
          deleteAction={deleteProductFilesAction}
          reorderAction={reorderProductMediaAction}
          addImagesAction={addProductImagesAction}
          addVideoAction={addProductVideoAction}
        />

        <FormContainer action={updateProductAction}>
          <div className='grid gap-4 md:grid-cols-2 my-4'>
            <input type='hidden' name='id' value={id} />
            <FormInput type='text' name='name' label='product name' defaultValue={name} />
            <PriceInput defaultValue={price} />
            <FormInput
              type='text'
              name='color'
              label='color (e.g. Navy Blue)'
              defaultValue={color ?? ''}
            />
          </div>

          <CategorySelectGroup
            defaultGender={(gender as Gender) ?? undefined}
            defaultMainCategory={(mainCategory as MainCategory) ?? undefined}
            defaultSubcategory={(subcategory as Subcategory) ?? undefined}
          />

          <SizesInput defaultSizes={sizes} />

          <TextAreaInput
            name='description'
            label='product description'
            defaultValue={description}
          />

          <CustomFieldsInput defaultFields={customFields} />

          {products.length > 0 && !product.colorGroupId && (
            <div className='mb-4'>
              <Label htmlFor='linkToProductId' className='mb-2 block'>
                Link as color variant of...
              </Label>
              <select
                id='linkToProductId'
                name='linkToProductId'
                defaultValue=''
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
              >
                <option value=''>— None —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}{p.color ? ` (${p.color})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className='mt-6'>
            <CheckBoxInput name='featured' label='featured' defaultChecked={featured} />
          </div>
          <SubmitButton text='update product' className='mt-8' />
        </FormContainer>

        {colorVariants.length > 0 && (
          <div className='mt-8 border-t pt-6'>
            <h2 className='text-lg font-semibold mb-3'>Color Variants</h2>
            <div className='flex flex-wrap gap-2 mb-4'>
              {colorVariants.map((v) => (
                <span
                  key={v.id}
                  className='px-3 py-1.5 rounded-md border border-border bg-muted text-sm'
                >
                  {v.name}{v.color ? ` — ${v.color}` : ''}
                </span>
              ))}
            </div>
            <FormContainer action={unlinkColorVariantAction}>
              <input type='hidden' name='productId' value={id} />
              <SubmitButton text='Unlink from color group' />
            </FormContainer>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminEditProductPage;
