import { formatCurrency } from '@/utils/format';
import { Separator } from '../ui/separator';
import { Card, CardTitle } from '../ui/card';
import FormContainer from '../form/FormContainer';
import { createOrderAction } from '@/utils/actions/orderActions';
import { SubmitButton } from '../form/Buttons';

export type CartTotalsData = {
  cartTotal: number;
  shipping: number;
  tax: number;
  orderTotal: number;
};

function CartTotals({
  cart,
  hideOrderButton = false,
}: {
  cart: CartTotalsData;
  hideOrderButton?: boolean;
}) {
  const { cartTotal, shipping, tax, orderTotal } = cart;
  return (
    <div>
      <Card className='p-8'>
        <CartTotalRow label='Subtotal' amount={cartTotal} />
        <CartTotalRow label='Shipping' amount={shipping} />
        <CartTotalRow label='Tax (19% VAT)' amount={tax} vat />
        <CardTitle className='mt-8 font-bold'>
          <CartTotalRow label='Order Total' amount={orderTotal} lastRow />
        </CardTitle>
      </Card>
      {!hideOrderButton && (
        <FormContainer action={createOrderAction}>
          <SubmitButton text='Place Order' className='w-full mt-8' />
        </FormContainer>
      )}
    </div>
  );
}

function CartTotalRow({
  label,
  amount,
  lastRow = false,
  vat = false,
}: {
  label: string;
  amount: number;
  lastRow?: boolean;
  vat?: boolean;
}) {
  return (
    <>
      <h4 className='flex justify-between text-sm'>
        <span className={vat ? 'text-muted-foreground text-xs' : ''}>
          {label}
        </span>
        <span className={vat ? 'text-muted-foreground text-xs' : ''}>
          {formatCurrency(amount)}
        </span>
      </h4>
      {!lastRow && <Separator className='my-2' />}
    </>
  );
}

export default CartTotals;
