import { Label } from '../ui/label';
import { fetchAllCompanies } from '@/utils/actions';

async function CompanySelect() {
  const companies = await fetchAllCompanies();

  return (
    <div className='mb-2'>
      <Label htmlFor='companyId' className='capitalize mb-2'>
        Company
      </Label>
      <select
        id='companyId'
        name='companyId'
        required
        defaultValue=''
        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      >
        <option value='' disabled>
          Select company
        </option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CompanySelect;
