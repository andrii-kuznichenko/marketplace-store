import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { currency } from '@/utils/format';
import { Prisma } from '@prisma/client';

const name = Prisma.ProductScalarFieldEnum.price;
type FormInputNumberProps = {
  defaultValue?: number;
};

function PriceInput({ defaultValue }: FormInputNumberProps) {
  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize mb-2'>
        Price({currency})
      </Label>
      <Input
        id={name}
        type='number'
        name={name}
        min={0}
        defaultValue={defaultValue || 100}
        required
      ></Input>
    </div>
  );
}

export default PriceInput;
