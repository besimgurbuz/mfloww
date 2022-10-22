export const ERROR_MESSAGES: Record<
  string,
  (name: string, ...args: any) => string
> = {
  required: (name) => `${name} is required`,
  email: () => `This field should be in e-mail format`,
  maxlength: (_, max: number) =>
    `This field can be up to ${max} characters long`,
  minlength: (_, min: number) =>
    `This field must be at least ${min} characters long`,
  pattern: () => `This field is not valid`,
};
