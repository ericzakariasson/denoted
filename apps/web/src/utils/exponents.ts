export function exponentialToDecimal(expNumber: number): string {
    const [base, exponent] = expNumber.toString().split('e+');
    if (!exponent) return base;
    const numOfZeros = parseInt(exponent) - (base.length - 1);
    return base.replace('.', '') + '0'.repeat(numOfZeros);
  }
  