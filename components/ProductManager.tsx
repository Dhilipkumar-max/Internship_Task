import React, { FC, useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Omit<Product, 'id' | 'userId'>) => void;
    product: Product | null;
}> = ({ isOpen, onClose, onSave, product }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    
    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
        } else {
            setName('');
            setDescription('');
            setPrice(0);
        }
    }, [product]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave({ name, description, price });
    };

    return (
        <AnimatePresence>
        {isOpen && (
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
                onClick={onClose}
             >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
                    onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
                >
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Product Name</label>
                            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price</label>
                            <input id="price" type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value) || 0)} className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400" required min="0" step="0.01" />
                        </div>
                        <div className="flex items-center justify-end space-x-4">
                            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors">Cancel</button>
                            <button type="submit" className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md">Save Product</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
};

export const ProductManager: FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const { currentUser } = useAuth();

    const fetchProducts = () => {
        if (!currentUser) return;
        const allProducts: Product[] = JSON.parse(sessionStorage.getItem('products') || '[]');
        setProducts(allProducts.filter(p => p.userId === currentUser.id));
    };

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const handleSaveProduct = (productData: Omit<Product, 'id' | 'userId'>) => {
        if (!currentUser) return;
        const allProducts: Product[] = JSON.parse(sessionStorage.getItem('products') || '[]');

        if (editingProduct) { // Update
            const updatedProducts = allProducts.map(p => p.id === editingProduct.id ? { ...editingProduct, ...productData } : p);
            sessionStorage.setItem('products', JSON.stringify(updatedProducts));
            toast.success('Product updated successfully!');
        } else { // Create
            const newProduct: Product = { ...productData, id: Date.now().toString(), userId: currentUser.id };
            allProducts.push(newProduct);
            sessionStorage.setItem('products', JSON.stringify(allProducts));
            toast.success('Product added successfully!');
        }
        
        fetchProducts();
        closeModal();
    };

    const handleDeleteProduct = (productId: string) => {
        if(window.confirm('Are you sure you want to delete this product?')) {
            let allProducts: Product[] = JSON.parse(sessionStorage.getItem('products') || '[]');
            allProducts = allProducts.filter(p => p.id !== productId);
            sessionStorage.setItem('products', JSON.stringify(allProducts));
            toast.success('Product deleted successfully!');
            fetchProducts();
        }
    };
    
    const openModalForEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const openModalForCreate = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="container mx-auto p-4 sm:p-8 min-h-[calc(100vh-4rem)]">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">My Products</h1>
                <button onClick={openModalForCreate} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-transform hover:scale-105">
                    Add New Product
                </button>
            </div>
            
            <ProductModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSaveProduct} product={editingProduct} />

            {products.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    <p className="text-lg">No products yet</p>
                    <button onClick={openModalForCreate} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                        Add Your First Product
                    </button>
                </div>
            ) : (
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                >
                    {products.map(product => (
                        <motion.div 
                            key={product.id} 
                            className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300 border border-gray-100 hover:scale-[1.02] flex flex-col justify-between h-full"
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                            }}
                        >
                           <div>
                                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                                <p className="text-gray-500 mt-1 h-20 overflow-y-auto">{product.description}</p>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-xl font-bold text-indigo-600">₹{product.price.toFixed(2)}</span>
                                <div className="space-x-2">
                                    <button onClick={() => openModalForEdit(product)} className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-3 py-1 rounded-lg">Edit</button>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-3 py-1 rounded-lg">Delete</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};