'use client';

import { useState } from 'react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

type Gender = 'MEN' | 'WOMEN';
type MainCategory = 'TOPS' | 'BOTTOMS' | 'DRESSES' | 'OUTERWEAR' | 'ACCESSORIES';
type Subcategory = string;

const genderLabels: Record<Gender, string> = {
  MEN: 'Men',
  WOMEN: 'Women',
};

const categoryLabels: Record<MainCategory, string> = {
  TOPS: 'Tops',
  BOTTOMS: 'Bottoms',
  DRESSES: 'Dresses',
  OUTERWEAR: 'Outerwear',
  ACCESSORIES: 'Accessories',
};

const subcategoryLabels: Record<string, string> = {
  T_SHIRTS: 'T-Shirts',
  SHIRTS: 'Shirts',
  BLOUSES: 'Blouses',
  SWEATSHIRTS: 'Sweatshirts',
  HOODIES: 'Hoodies',
  TANK_TOPS: 'Tank Tops',
  CROP_TOPS: 'Crop Tops',
  JEANS: 'Jeans',
  TROUSERS: 'Trousers',
  SHORTS: 'Shorts',
  SKIRTS: 'Skirts',
  JOGGERS: 'Joggers',
  JACKETS: 'Jackets',
  COATS: 'Coats',
  BLAZERS: 'Blazers',
  VESTS: 'Vests',
  BAGS: 'Bags',
  HATS: 'Hats',
  SCARVES: 'Scarves',
  BELTS: 'Belts',
  JEWELRY: 'Jewelry',
  CHAINMAIL_PIECES: 'Chainmail Pieces',
};

const categoriesByGender: Record<Gender, MainCategory[]> = {
  MEN: ['TOPS', 'BOTTOMS', 'OUTERWEAR', 'ACCESSORIES'],
  WOMEN: ['TOPS', 'BOTTOMS', 'OUTERWEAR', 'ACCESSORIES'],
};

const subcategoriesByGenderAndCategory: Record<Gender, Partial<Record<MainCategory, Subcategory[]>>> = {
  MEN: {
    TOPS: ['T_SHIRTS', 'SHIRTS', 'SWEATSHIRTS', 'HOODIES', 'TANK_TOPS', 'CROP_TOPS'],
    BOTTOMS: ['JEANS', 'TROUSERS', 'SHORTS', 'JOGGERS'],
    OUTERWEAR: ['JACKETS', 'COATS', 'BLAZERS', 'VESTS'],
    ACCESSORIES: ['BAGS', 'HATS', 'SCARVES', 'BELTS', 'JEWELRY', 'CHAINMAIL_PIECES'],
  },
  WOMEN: {
    TOPS: ['T_SHIRTS', 'SHIRTS', 'BLOUSES', 'SWEATSHIRTS', 'HOODIES', 'TANK_TOPS', 'CROP_TOPS'],
    BOTTOMS: ['JEANS', 'TROUSERS', 'SHORTS', 'SKIRTS', 'JOGGERS'],
    OUTERWEAR: ['JACKETS', 'COATS', 'BLAZERS', 'VESTS'],
    ACCESSORIES: ['BAGS', 'HATS', 'SCARVES', 'BELTS', 'JEWELRY', 'CHAINMAIL_PIECES'],
  },
};

type Props = {
  defaultGender?: Gender;
  defaultMainCategory?: MainCategory;
  defaultSubcategory?: string;
};

function CategorySelectGroup({ defaultGender, defaultMainCategory, defaultSubcategory }: Props) {
  const [gender, setGender] = useState<Gender>(defaultGender ?? 'MEN');

  const availableCategories = categoriesByGender[gender];
  const initialCategory = defaultMainCategory && availableCategories.includes(defaultMainCategory)
    ? defaultMainCategory
    : availableCategories[0];

  const [mainCategory, setMainCategory] = useState<MainCategory>(initialCategory);

  const availableSubcategories = subcategoriesByGenderAndCategory[gender][mainCategory] ?? [];
  const initialSubcategory = defaultSubcategory && availableSubcategories.includes(defaultSubcategory)
    ? defaultSubcategory
    : availableSubcategories[0];

  const [subcategory, setSubcategory] = useState<string>(initialSubcategory ?? '');

  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender);
    const newCategories = categoriesByGender[newGender];
    const newCategory = newCategories.includes(mainCategory) ? mainCategory : newCategories[0];
    setMainCategory(newCategory);
    const newSubs = subcategoriesByGenderAndCategory[newGender][newCategory] ?? [];
    setSubcategory(newSubs[0] ?? '');
  };

  const handleCategoryChange = (newCategory: MainCategory) => {
    setMainCategory(newCategory);
    const newSubs = subcategoriesByGenderAndCategory[gender][newCategory] ?? [];
    setSubcategory(newSubs[0] ?? '');
  };

  return (
    <div className='space-y-4 mb-4'>
      {/* Gender */}
      <div>
        <Label className='mb-2 block capitalize'>Gender</Label>
        <div className='flex flex-wrap gap-2'>
          {(['MEN', 'WOMEN'] as Gender[]).map((g) => (
            <Button
              key={g}
              type='button'
              variant={gender === g ? 'default' : 'outline'}
              onClick={() => handleGenderChange(g)}
            >
              {genderLabels[g]}
            </Button>
          ))}
        </div>
        <input type='hidden' name='gender' value={gender} />
      </div>

      {/* Main Category */}
      <div>
        <Label className='mb-2 block capitalize'>Category</Label>
        <div className='flex flex-wrap gap-2'>
          {availableCategories.map((cat) => (
            <Button
              key={cat}
              type='button'
              variant={mainCategory === cat ? 'default' : 'outline'}
              onClick={() => handleCategoryChange(cat)}
            >
              {categoryLabels[cat]}
            </Button>
          ))}
        </div>
        <input type='hidden' name='mainCategory' value={mainCategory} />
      </div>

      {/* Subcategory */}
      <div>
        <Label className='mb-2 block capitalize'>Subcategory</Label>
        <div className='flex flex-wrap gap-2'>
          {availableSubcategories.map((sub) => (
            <Button
              key={sub}
              type='button'
              variant={subcategory === sub ? 'default' : 'outline'}
              onClick={() => setSubcategory(sub)}
            >
              {subcategoryLabels[sub] ?? sub}
            </Button>
          ))}
        </div>
        <input type='hidden' name='subcategory' value={subcategory} />
      </div>
    </div>
  );
}

export default CategorySelectGroup;
