export const phoneRegex = /^09[0-9]{9}$/;
export const codeMeliRegex = /^\d{10}$/;
export const persianRegex = /^[\u0600-\u06FF\s]+$/;

export const formatPhoneNumber = (phone) => {
  if (!phone) return "+98";
  const digits = phone.replace(/\D/g, "").replace(/^98/, "").slice(0, 10);
  let formatted = "+98";

  if (digits.length > 0) formatted += "  " + digits.slice(0, 3);
  if (digits.length > 3) formatted += "  " + digits.slice(3, 6);
  if (digits.length > 6) formatted += "  " + digits.slice(6, 10);

  return formatted;
};

export const validatePassword = (value) => {
  const errors = [];
  if (value.length < 8) errors.push("حداقل ۸ کاراکتر");
  if (!/[A-Z]/.test(value)) errors.push("یک حرف بزرگ (A-Z)");
  if (!/[a-z]/.test(value)) errors.push("یک حرف کوچک (a-z)");
  if (!/[0-9]/.test(value)) errors.push("یک عدد (0-9)");
  if (!/[@$!%*?&]/.test(value)) errors.push("یک کاراکتر خاص (@$!%*?&)");
  return errors;
};

export const validateCodeMeli = (value) => {
  if (!codeMeliRegex.test(value)) return false;
  const digits = value.split("").map(Number);
  const check = digits.pop();
  const sum = digits.reduce((acc, digit, i) => acc + digit * (10 - i), 0);
  const remainder = sum % 11;
  return remainder < 2 ? check === remainder : check === 11 - remainder;
};
