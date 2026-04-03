'use client';

import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

type CustomField = { name: string; value: string };

function CustomFieldsInput({ defaultFields = [] }: { defaultFields?: CustomField[] }) {
  const [fields, setFields] = useState<CustomField[]>(defaultFields);

  const add = () => setFields((prev) => [...prev, { name: '', value: '' }]);

  const remove = (index: number) => setFields((prev) => prev.filter((_, i) => i !== index));

  const update = (index: number, key: 'name' | 'value', val: string) => {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, [key]: val } : f)));
  };

  return (
    <div className='mb-4'>
      <Label className='mb-2 block'>Additional Fields</Label>
      <div className='space-y-3'>
        {fields.map((field, index) => (
          <div key={index} className='flex gap-2 items-start'>
            <Input
              placeholder='Field name (e.g. Material)'
              value={field.name}
              onChange={(e) => update(index, 'name', e.target.value)}
              className='flex-1'
            />
            <Input
              placeholder='Value (e.g. 100% Cotton)'
              value={field.value}
              onChange={(e) => update(index, 'value', e.target.value)}
              className='flex-[2]'
            />
            <Button type='button' variant='destructive' onClick={() => remove(index)}>
              ✕
            </Button>
          </div>
        ))}
      </div>
      <Button type='button' variant='outline' onClick={add} className='mt-3'>
        + Add Field
      </Button>
      <input type='hidden' name='customFields' value={JSON.stringify(fields)} />
    </div>
  );
}

export default CustomFieldsInput;
