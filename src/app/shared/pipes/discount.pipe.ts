// discount.ts
export function calculateDiscount(price: number, discount: number): number {
  if (!price) return 0;
  if (!discount) return price;
  return price - (price * discount) / 100;
}
