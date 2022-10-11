export const ERROR_MESSAGES: Record<
  string,
  (name: string, ...args: any) => string
> = {
  required: (name) => `${name} is required`,
  email: (name) => `${name} field should be in e-mail format`,
  maxlength: (name, max: number) =>
    `${name} field can be up to ${max} characters long`,
  minlength: (name, min: number) =>
    `${name} field must be at least ${min} characters long`,
  pattern: (name) => `${name} field must contain letters only`,
};
