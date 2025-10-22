import React, { FC } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar: FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-extrabold text-indigo-700 tracking-tight">ProdManager</Link>
          
          <div className="flex items-center space-x-6">
            {currentUser ? (
              <>
                <NavLink 
                    to="/products" 
                    className={({isActive}) => `text-gray-600 hover:text-indigo-600 font-medium transition-colors ${isActive ? 'text-indigo-600' : ''}`}
                >
                    Products
                </NavLink>
                <span className="text-gray-500 hidden sm:block">Welcome, {currentUser.email}</span>
                <button 
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-rose-500 to-red-500 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink 
                    to="/login"
                    className={({isActive}) => `text-gray-600 hover:text-indigo-600 font-medium transition-colors ${isActive ? 'text-indigo-600' : ''}`}
                >
                    Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({isActive}) => `text-gray-600 hover:text-indigo-600 font-medium transition-colors ${isActive ? 'text-indigo-600' : ''}`}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};