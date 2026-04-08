export const formatCurrency = (amount: number | null) => {
  const value = amount || 0;
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
};

export const currency = '€';

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
