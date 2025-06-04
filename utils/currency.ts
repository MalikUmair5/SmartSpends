export const getCurrencySymbol = (currency: 'USD' | 'PKR'): string => {
  switch (currency) {
    case 'USD':
      return '$';
    case 'PKR':
      return '₨';
    default:
      return '$';
  }
}; 