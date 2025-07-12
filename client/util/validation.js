// validation.js
export const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const validateSignup = ({ name, email, password }) => {
  if (!name || !email || !password) return "All fields are required";
  if (!isValidEmail(email)) return "Invalid email address";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null; // No error
};
