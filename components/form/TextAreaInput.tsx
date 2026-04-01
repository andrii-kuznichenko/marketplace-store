import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

type TextAreaInputProps = {
  name: string;
  label?: string;
  defaultValue?: string;
};

function TextAreaInput({ name, label, defaultValue }: TextAreaInputProps) {
  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize mb-2'>
        {label || name}
      </Label>
      <Textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        rows={5}
        required
        className='leading-loose'
      />
    </div>
  );
}

export default TextAreaInput;
