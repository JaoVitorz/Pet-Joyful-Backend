// Validation Schemas
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export function validateEmail(email: string): boolean {
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return passwordRegex.test(password);
}

export function validateName(name: string): boolean {
  return name.trim().length >= 3;
}

export const validationSchemas = {
  email: {
    validate: validateEmail,
    message: 'Email inválido',
  },
  password: {
    validate: validatePassword,
    message: 'Senha deve ter no mínimo 8 caracteres, incluindo letras e números',
  },
  name: {
    validate: validateName,
    message: 'Nome deve ter no mínimo 3 caracteres',
  },
};
