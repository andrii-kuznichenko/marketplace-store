import { SubmitButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import { createCompanyAction } from '@/utils/actions/companyActions';
import { isSuperAdmin } from '@/utils/roles';
import { redirect } from 'next/navigation';

async function CreateCompanyPage() {
  const superAdmin = await isSuperAdmin();
  if (!superAdmin) redirect('/');

  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>create company</h1>
      <div className='border p-8 rounded-md max-w-xl'>
        <FormContainer action={createCompanyAction}>
          <div className='grid gap-4 my-4'>
            <FormInput
              type='text'
              name='name'
              label='company name'
            />
            <FormInput
              type='text'
              name='clerkUserId'
              label='admin clerk user id'
            />
          </div>
          <SubmitButton text='create company' className='mt-4' />
        </FormContainer>
      </div>
    </section>
  );
}

export default CreateCompanyPage;
