export function roundMoney(n: number) {
  return Math.round(n * 100) / 100;
}

export function computeLineTotal(quantity: number, unitPrice: number) {
  return roundMoney(quantity * unitPrice);
}

export function computeQuoteTotals(
  lines: { quantity: number; unit_price: number }[],
  taxEnabled: boolean,
  taxRatePercent: number,
) {
  const subtotal = roundMoney(
    lines.reduce((s, l) => s + l.quantity * l.unit_price, 0),
  );
  const tax_amount = taxEnabled
    ? roundMoney(subtotal * (taxRatePercent / 100))
    : 0;
  const total = roundMoney(subtotal + tax_amount);
  return { subtotal, tax_amount, total };
}
