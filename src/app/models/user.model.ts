// Type for email
export type Email = string;

// Type for phone number
export type PhoneNumber = string;

// Main user interface with readonly properties
export interface User {
  readonly id: number;
  name: string;
  readonly email: Email;
  phone: PhoneNumber;
  address?: string;
}

// Type for creating a new user (without id)
export type CreateUserDto = Omit<User, 'id'>;

// Type for updating a user (all fields optional except id)
export type UpdateUserDto = Partial<Omit<User, 'id'>> & {
  readonly id: number;
};

// Type for user profile (public fields only)
export type UserProfile = Pick<User, 'id' | 'name'>;

// Type guard to validate email format
export function isValidEmail(email: string): email is Email {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Type guard to validate phone number
export function isValidPhone(phone: string): phone is PhoneNumber {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
}

// Type guard to check if object is a User
export function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj
  );
}
