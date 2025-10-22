import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ProductManager } from './components/ProductManager';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar />
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProtectedRoute />}>
              <Route index element={<ProductManager />} />
            </Route>
            <Route path="*" element={<Navigate to="/products" />} />
          </Routes>
        </main>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;