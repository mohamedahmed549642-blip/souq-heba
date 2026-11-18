export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '0 ج.م';
  const num = Number(amount);
  return `${num.toLocaleString('en-US')} ج.م`;
};
