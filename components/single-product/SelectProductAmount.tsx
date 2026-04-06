import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type SelectProductAmountProps = {
  amount: number;
  setAmount: (value: number) => void;
  isLoading: boolean;
};

function SelectProductAmount(props: SelectProductAmountProps) {
  const { amount, isLoading, setAmount } = props;

  return (
    <>
      <h4 className='mb-2'>Amount: </h4>
      <Select
        defaultValue={amount.toString()}
        onValueChange={(value) => setAmount(Number(value))}
        disabled={isLoading}
      >
        <SelectTrigger className='w-25'>
          <SelectValue placeholder={amount} />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 10 }, (_, index) => {
            const selectValue = (index + 1).toString();
            return (
              <SelectItem key={index} value={selectValue}>
                {selectValue}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
}

export default SelectProductAmount;
