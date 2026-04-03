'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

type SelectButtonsProp = {
  name: string;
  label: string;
  textChoices: string[];
};

function SelectButtons(props: SelectButtonsProp) {
  const { name, textChoices, label } = props;
  const [choice, setChoice] = useState('');

  useEffect(() => {
    setChoice(textChoices[0]);
  }, [textChoices]);

  
  return (
    <div className='mb-3'>
      <Label className='mb-3 capitalize'>{label}</Label>
      <div className='flex gap-3'>
        {textChoices.map((choiceItem) => (
          <Button
            key={choiceItem}
            type='button'
            variant={choice === choiceItem ? 'default' : 'outline'}
            onClick={() => setChoice(choiceItem)}
          >
            {choiceItem}
          </Button>
        ))}

        <input type='hidden' name={name} value={choice} />
      </div>
    </div>
  );
}

export default SelectButtons;
