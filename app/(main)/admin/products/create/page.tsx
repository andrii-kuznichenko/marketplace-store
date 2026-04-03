import { SubmitButton } from '@/components/form/Buttons';
import CheckBoxInput from '@/components/form/CheckBoxInput';
import CompanySelect from '@/components/form/CompanySelect';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import ImageInput from '@/components/form/ImageInput';
import VideoInput from '@/components/form/VideoInput';
import PriceInput from '@/components/form/PriceInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import CategorySelectGroup from '@/components/form/CategorySelectGroup';
import SizesInput from '@/components/form/SizesInput';
import CustomFieldsInput from '@/components/form/CustomFieldsInput';
import { createProductAction, fetchAdminProductDetails } from '@/utils/actions';
import { isSuperAdmin } from '@/utils/roles';
import { faker } from '@faker-js/faker';
import { Gender, MainCategory, Subcategory } from '@prisma/client';

async function CreateProductPage({
  searchParams,
}: {
  searchParams: Promise<{ variantOf?: string }>;
}) {
  const superAdmin = await isSuperAdmin();
  const { variantOf } = await searchParams;

  const source = variantOf ? await fetchAdminProductDetails(variantOf) : null;

  const name = source?.name ?? faker.commerce.productName();
  const description = source?.description ?? faker.lorem.paragraph({ min: 10, max: 12 });
  const price = source?.price ?? 100;

  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>
        {source ? `New color variant of "${source.name}"` : 'Create product'}
      </h1>
      <div className='border p-8 rounded-md'>
        <FormContainer action={createProductAction}>
          {source && <input type='hidden' name='linkToProductId' value={source.id} />}

          <div className='grid gap-4 md:grid-cols-2 my-4'>
            <FormInput type='text' name='name' label='product name' defaultValue={name} />
            <PriceInput defaultValue={price} />
            <FormInput type='text' name='color' label='color (e.g. Navy Blue)' />
            {superAdmin && <CompanySelect />}
          </div>

          <div className='grid gap-4 md:grid-cols-2 my-4'>
            <ImageInput />
            <VideoInput />
          </div>

          <CategorySelectGroup
            defaultGender={(source?.gender as Gender) ?? undefined}
            defaultMainCategory={(source?.mainCategory as MainCategory) ?? undefined}
            defaultSubcategory={(source?.subcategory as Subcategory) ?? undefined}
          />

          <SizesInput />

          <TextAreaInput
            name='description'
            label='product description'
            defaultValue={description}
          />

          <CustomFieldsInput defaultFields={source?.customFields ?? []} />

          <div className='mt-6'>
            <CheckBoxInput name='featured' label='featured' />
          </div>
          <SubmitButton text='create product' className='mt-8' />
        </FormContainer>
      </div>
    </section>
  );
}

export default CreateProductPage;
