import { SubmitButton } from '@/components/form/Buttons';
import CheckBoxInput from '@/components/form/CheckBoxInput';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import FileInputContainer from '@/components/form/FileInputContainer';
import PriceInput from '@/components/form/PriceInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import {
  addProductImagesAction,
  addProductVideoAction,
  deleteProductFilesAction,
  fetchAdminProductDetails,
  reorderProductMediaAction,
  updateProductAction,
  updateProductFilesAction,
} from '@/utils/actions';

async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchAdminProductDetails(id);
  const { name, description, price } = product;

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
            <FormInput
              type='text'
              name='name'
              label='product name'
              defaultValue={name}
            />
            <PriceInput defaultValue={price} />
          </div>
          <TextAreaInput
            name='description'
            label='product description'
            defaultValue={description}
          />
          <div className='mt-6'>
            <CheckBoxInput name='featured' label='featured' />
          </div>
          <SubmitButton text='update product' className='mt-8' />
        </FormContainer>
      </div>
    </section>
  );
}

export default AdminEditProductPage;