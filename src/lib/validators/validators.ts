export function isValidEmail(email: string): boolean {
  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  return regex.test(email.trim());
}