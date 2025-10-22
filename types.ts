
export interface User {
  id: string;
  email: string;
  password?: string; // Optional because we don't store it in the current user session object
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  userId: string;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password:string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

// FIX: Add missing AlertMessage interface.
export interface AlertMessage {
  type: 'success' | 'error';
  message: string;
}
