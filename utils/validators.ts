export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function passwordsMatch(password: string, confirm: string): boolean {
  return password === confirm && password.length > 0;
}

export function isPositiveNumber(value: string): boolean {
  const n = Number(value);
  return !Number.isNaN(n) && n > 0;
}
