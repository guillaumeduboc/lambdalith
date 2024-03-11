export const fibonacci = (n: number): number => {
  if (n < 0) {
    throw new Error('Negative numbers are not allowed');
  }

  if (n <= 1) {
    return n;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
};
