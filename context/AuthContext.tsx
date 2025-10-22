
import React, { createContext, useState, useEffect, ReactNode, FC } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from session storage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = async (email: string, password: string): Promise<boolean> => {
    return new Promise(resolve => {
        setTimeout(() => { // Simulate async operation
            const users: User[] = JSON.parse(sessionStorage.getItem('users') || '[]');
            const userExists = users.some(user => user.email === email);
            if (userExists) {
                resolve(false);
            } else {
                const newUser = { id: Date.now().toString(), email, password };
                users.push(newUser);
                sessionStorage.setItem('users', JSON.stringify(users));
                resolve(true);
            }
        }, 500);
    });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    return new Promise(resolve => {
        setTimeout(() => { // Simulate async operation
            const users: User[] = JSON.parse(sessionStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                const { password, ...userToStore } = user;
                setCurrentUser(userToStore);
                sessionStorage.setItem('currentUser', JSON.stringify(userToStore));
                resolve(true);
            } else {
                resolve(false);
            }
        }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
