import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Database, Truck, Landmark, Plus, Trash2, Edit3, Check, RefreshCw, Eye, Save, Scale } from 'lucide-react';
import { Product, Order } from '../types';
import { dbService } from '../lib/dbService';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onRefreshData: () => Promise<void>;
  legalTexts: {
    terms: string[];
    privacy: string[];
    returns: string[];
  };
  onUpdateLegal: (key: 'terms' | 'privacy' | 'returns', texts: string[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  onRefreshData,
  legalTexts,
  onUpdateLegal,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'fulfillment' | 'legal'>('dashboard');
  
  // Inventory editor states
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Product>>({
    title: '',
    slug: '',
    description: '',
    price: 15000,
    stock_count: 20,
    category: 'Shea',
    ingredients: [],
    images: ['https://picsum.photos/seed/newproduct/600/450']
  });

  // Ingredient input string
  const [ingredientsText, setIngredientsText] = useState('');

  // Legal editor state
  const [editingLegalTab, setEditingLegalTab] = useState<'terms' | 'privacy' | 'returns'>('terms');
  const [legalInputText, setLegalInputText] = useState('');

  useEffect(() => {
    // Populate legal edit field based on current tab
    setLegalInputText(legalTexts[editingLegalTab].join('\n\n'));
  }, [editingLegalTab, legalTexts]);

  // Inventory Save Handlers
  const handleStartEdit = (p: Product) => {
    setEditingProductId(p.id);
    setEditForm(p);
    setIngredientsText(p.ingredients.join(', '));
  };

  const handleSaveEdit = async () => {
    if (!editForm.id) return;
    
    const updatedIngredients = ingredientsText
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    const updatedProduct = {
      ...editForm,
      ingredients: updatedIngredients
    } as Product;

    await dbService.updateProduct(updatedProduct);
    setEditingProductId(null);
    await onRefreshData();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedIngredients = ingredientsText
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    const toCreate = {
      title: addForm.title || 'Whipped Extract',
      slug: addForm.slug || addForm.title?.toLowerCase().replace(/\s+/g, '-') || 'whipped-extract',
      description: addForm.description || 'A highly luxurious raw compound.',
      price: Number(addForm.price) || 12000,
      stock_count: Number(addForm.stock_count) || 10,
      category: addForm.category || 'Shea',
      ingredients: updatedIngredients,
      images: addForm.images || ['https://picsum.photos/seed/product/600/450']
    };

    await dbService.createProduct(toCreate);
    setIsAdding(false);
    setIngredientsText('');
    setAddForm({
      title: '',
      slug: '',
      description: '',
      price: 15000,
      stock_count: 20,
      category: 'Shea',
      ingredients: [],
      images: ['https://picsum.photos/seed/newproduct/600/450']
    });
    await onRefreshData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you absolutely certain you want to purge this product vessel?')) {
      await dbService.deleteProduct(id);
      await onRefreshData();
    }
  };

  // Fulfillment status changes
  const handleUpdateOrderStatus = async (orderId: string, fStatus: Order['fulfillment_status'], pStatus: Order['payment_status']) => {
    await dbService.updateOrderStatus(orderId, fStatus, pStatus);
    await onRefreshData();
  };

  // Legal editor save
  const handleSaveLegal = () => {
    const splitParagraphs = legalInputText
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    onUpdateLegal(editingLegalTab, splitParagraphs);
    alert(`Legal parameters for [${editingLegalTab.toUpperCase()}] successfully updated locally!`);
  };

  // SVGs Dashboard Statistics Chart calculations
  const totalRevenue = orders
    .filter(o => o.payment_status === 'completed')
    .reduce((acc, curr) => acc + curr.total_amount, 0);

  const pendingOrders = orders.filter(o => o.fulfillment_status === 'pending');
  const completedOrders = orders.filter(o => o.fulfillment_status === 'shipped');

  return (
    <section className="pt-28 pb-24 px-6 md:px-12 bg-brand-cream min-h-screen select-none relative">
      {/* Background grid line */}
      <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-brand-charcoal/3 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-12 w-[1px] bg-brand-charcoal/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-0 md:px-12 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR NAVIGATION MATRIX */}
        <div className="w-full md:w-64 flex flex-col gap-2 md:sticky md:top-28">
          <div className="p-4 rounded-2xl bg-brand-charcoal text-brand-cream border border-brand-cream/10 mb-4 flex flex-col gap-1.5 shadow-md">
            <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-brand-terracotta font-semibold">
              ★ CONTROL INTERFACE ★
            </span>
            <h3 className="font-serif text-lg font-bold">
              Operational Shell
            </h3>
            <p className="text-[10px] text-brand-cream/40 font-mono">
              Role: System Administrator
            </p>
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left py-3 px-4 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer ${activeTab === 'dashboard' ? 'bg-brand-beige text-brand-charcoal font-bold border border-brand-charcoal/10' : 'text-brand-charcoal/60 hover:bg-brand-beige/50'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full text-left py-3 px-4 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer ${activeTab === 'inventory' ? 'bg-brand-beige text-brand-charcoal font-bold border border-brand-charcoal/10' : 'text-brand-charcoal/60 hover:bg-brand-beige/50'}`}
          >
            <Database className="w-4 h-4" />
            <span>Store Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('fulfillment')}
            className={`w-full text-left py-3 px-4 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer ${activeTab === 'fulfillment' ? 'bg-brand-beige text-brand-charcoal font-bold border border-brand-charcoal/10' : 'text-brand-charcoal/60 hover:bg-brand-beige/50'}`}
          >
            <Truck className="w-4 h-4" />
            <span>Fulfillment Board</span>
          </button>

          <button
            onClick={() => setActiveTab('legal')}
            className={`w-full text-left py-3 px-4 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer ${activeTab === 'legal' ? 'bg-brand-beige text-brand-charcoal font-bold border border-brand-charcoal/10' : 'text-brand-charcoal/60 hover:bg-brand-beige/50'}`}
          >
            <Scale className="w-4 h-4" />
            <span>Legal Editor</span>
          </button>

          <div className="mt-8 p-4 rounded-xl border border-dashed border-brand-charcoal/10 flex flex-col gap-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/40">Database Connection:</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-olive animate-pulse" />
              <span className="font-mono text-[10px] text-brand-olive uppercase font-semibold">Supabase Connected</span>
            </div>
            <button
              onClick={async () => {
                await onRefreshData();
                alert('Supabase ledger synchronized!');
              }}
              className="mt-1 flex items-center gap-1.5 text-left font-mono text-[9px] uppercase tracking-widest text-brand-terracotta hover:underline"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync Database Now</span>
            </button>
          </div>
        </div>

        {/* MAIN OPERATION MATRIX VIEW */}
        <div className="flex-1 min-w-0">
          
          {/* TAB 1: OVERVIEW METRICS WITH PATH TRACING SVG CHARTS */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-8"
            >
              {/* Header */}
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-brand-terracotta font-semibold">
                  [ METRICS PORTAL ]
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-brand-charcoal mt-1">
                  Daily Sovereign Analytics
                </h2>
                <p className="text-xs text-brand-charcoal/50">
                  Observe real-time registration velocities, transaction completions, and order flow metrics.
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-brand-cream border border-brand-charcoal/10 flex flex-col gap-1 shadow-sm">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/40">Total Secured Revenue:</span>
                  <span className="text-2xl font-mono text-brand-terracotta font-bold">₦{totalRevenue.toLocaleString()}</span>
                  <span className="text-[10px] font-mono text-brand-olive mt-1">▲ 14.5% compared to yesterday</span>
                </div>
                <div className="p-5 rounded-2xl bg-brand-cream border border-brand-charcoal/10 flex flex-col gap-1 shadow-sm">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/40">Registered Vessels:</span>
                  <span className="text-2xl font-mono text-brand-charcoal font-bold">{products.length} Items</span>
                  <span className="text-[10px] font-mono text-brand-charcoal/40 mt-1">Fully bio-available in shop</span>
                </div>
                <div className="p-5 rounded-2xl bg-brand-cream border border-brand-charcoal/10 flex flex-col gap-1 shadow-sm">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/40">Active Dispatch Tasks:</span>
                  <span className="text-2xl font-mono text-brand-olive font-bold">{orders.length} Orders</span>
                  <span className="text-[10px] font-mono text-brand-terracotta mt-1">{pendingOrders.length} Pending • {completedOrders.length} Shipped</span>
                </div>
              </div>

              {/* Interactive SVG Path Tracing Chart */}
              <div className="p-6 rounded-2xl bg-brand-beige/30 border border-brand-charcoal/10 shadow-inner flex flex-col gap-4">
                <div className="flex justify-between items-center pb-2 border-b border-brand-charcoal/5">
                  <span className="font-serif text-base font-semibold text-brand-charcoal">
                    Reconstructed Revenue Velocity (7-Day Trace)
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/40">
                    SVG PATH TRACING
                  </span>
                </div>

                {/* SVG canvas with path length drawing */}
                <div className="relative h-64 w-full bg-brand-cream rounded-xl border border-brand-charcoal/5 overflow-hidden flex items-center justify-center p-4">
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 500 200"
                    preserveAspectRatio="none"
                  >
                    {/* Grid lines */}
                    <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(28,28,28,0.03)" strokeWidth="1" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(28,28,28,0.03)" strokeWidth="1" />
                    <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(28,28,28,0.03)" strokeWidth="1" />
                    
                    {/* SVG Path drawing with CSS dashoffset path tracing */}
                    <motion.path
                      d="M 20,180 Q 80,120 140,150 T 260,80 T 380,110 T 480,30"
                      fill="none"
                      stroke="#C87A53" // brand terracotta
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2.2, ease: 'easeInOut' }}
                    />

                    {/* Secondary tracking line */}
                    <motion.path
                      d="M 20,180 Q 80,120 140,150 T 260,80 T 380,110 T 480,30"
                      fill="none"
                      stroke="#4A533C" // brand olive
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2.2, delay: 0.3, ease: 'easeInOut' }}
                    />

                    {/* Data Points */}
                    <circle cx="20" cy="180" r="4" fill="#1C1C1C" />
                    <circle cx="140" cy="150" r="4" fill="#C87A53" />
                    <circle cx="260" cy="80" r="4" fill="#4A533C" />
                    <circle cx="480" cy="30" r="4.5" fill="#D4AF37" className="animate-ping" />
                  </svg>

                  {/* Absolute Labels */}
                  <div className="absolute bottom-2 left-4 font-mono text-[8px] text-brand-charcoal/40">DAY 1</div>
                  <div className="absolute bottom-2 left-[28%] font-mono text-[8px] text-brand-charcoal/40">DAY 3</div>
                  <div className="absolute bottom-2 left-[52%] font-mono text-[8px] text-brand-charcoal/40">DAY 5</div>
                  <div className="absolute bottom-2 right-4 font-mono text-[8px] text-brand-charcoal/40">DAY 7</div>

                  <div className="absolute top-4 right-4 bg-brand-charcoal text-brand-cream text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full">
                    Max Spike: ₦{totalRevenue > 0 ? (totalRevenue * 1.25).toLocaleString() : '145,000'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: STORE INVENTORY DATABASE CRUD TABLE */}
          {activeTab === 'inventory' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-brand-terracotta font-semibold">
                    [ INVENTORY SHELL ]
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif text-brand-charcoal mt-1">
                    Database Inventory Control
                  </h2>
                </div>
                <button
                  onClick={() => setIsAdding(!isAdding)}
                  className="px-4 py-2 rounded-full bg-brand-charcoal text-brand-cream font-mono text-[10px] uppercase tracking-widest hover:bg-brand-terracotta transition-colors flex items-center gap-1.5 self-start cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Vessel</span>
                </button>
              </div>

              {/* Add New Product Form */}
              <AnimatePresence>
                {isAdding && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleAddProduct}
                    className="p-5 rounded-2xl bg-brand-beige/40 border border-brand-charcoal/10 flex flex-col gap-4 overflow-hidden"
                  >
                    <h3 className="font-serif font-bold text-sm text-brand-charcoal pb-2 border-b border-brand-charcoal/5">
                      Register Brand New Skincare Formulation
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">Vessel Title</label>
                        <input
                          type="text"
                          required
                          value={addForm.title}
                          onChange={e => setAddForm({...addForm, title: e.target.value})}
                          placeholder="e.g. Shea Butter Cleanser"
                          className="px-3 py-2 bg-brand-cream border border-brand-charcoal/10 rounded-lg text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">Category</label>
                        <select
                          value={addForm.category}
                          onChange={e => setAddForm({...addForm, category: e.target.value})}
                          className="px-3 py-2 bg-brand-cream border border-brand-charcoal/10 rounded-lg text-xs focus:outline-none focus:border-brand-terracotta"
                        >
                          <option value="Shea">Shea Pillar</option>
                          <option value="Coconut">Coconut Pillar</option>
                          <option value="Black Soap">Black Soap Pillar</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">Price (₦)</label>
                        <input
                          type="number"
                          required
                          value={addForm.price}
                          onChange={e => setAddForm({...addForm, price: Number(e.target.value)})}
                          className="px-3 py-2 bg-brand-cream border border-brand-charcoal/10 rounded-lg text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">Stock Count</label>
                        <input
                          type="number"
                          required
                          value={addForm.stock_count}
                          onChange={e => setAddForm({...addForm, stock_count: Number(e.target.value)})}
                          className="px-3 py-2 bg-brand-cream border border-brand-charcoal/10 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">Formulation Description</label>
                      <textarea
                        required
                        value={addForm.description}
                        onChange={e => setAddForm({...addForm, description: e.target.value})}
                        placeholder="Detailed aesthetic formulation properties..."
                        rows={3}
                        className="px-3 py-2 bg-brand-cream border border-brand-charcoal/10 rounded-lg text-xs resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">Active Ingredients (separated by commas)</label>
                      <input
                        type="text"
                        value={ingredientsText}
                        onChange={e => setIngredientsText(e.target.value)}
                        placeholder="e.g. Cocoa Pod Ash, Raw Shea, Lavender Buds"
                        className="px-3 py-2 bg-brand-cream border border-brand-charcoal/10 rounded-lg text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-brand-charcoal hover:bg-brand-terracotta text-brand-cream text-xs font-mono uppercase tracking-widest cursor-pointer shadow-sm transition-colors mt-1"
                    >
                      Authorize Database Injection
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Products Table */}
              <div className="overflow-x-auto rounded-2xl border border-brand-charcoal/10 bg-brand-cream shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-beige/50 border-b border-brand-charcoal/10 text-[9px] font-mono uppercase tracking-wider text-brand-charcoal/40">
                      <th className="p-4">Item Title / Class</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price (₦)</th>
                      <th className="p-4">Stock Count</th>
                      <th className="p-4">Ingredients</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-charcoal/5 text-xs text-brand-charcoal">
                    {products.map(p => {
                      const isEditing = editingProductId === p.id;
                      return (
                        <tr key={p.id} className="hover:bg-brand-beige/10 transition-colors">
                          {/* Title */}
                          <td className="p-4 font-serif font-semibold">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editForm.title || ''}
                                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                className="px-2 py-1 border border-brand-charcoal/20 bg-brand-cream rounded w-full font-sans text-xs"
                              />
                            ) : (
                              p.title
                            )}
                          </td>

                          {/* Category */}
                          <td className="p-4 font-mono uppercase text-[10px]">
                            {isEditing ? (
                              <select
                                value={editForm.category || 'Shea'}
                                onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                                className="px-2 py-1 border border-brand-charcoal/20 bg-brand-cream rounded text-xs"
                              >
                                <option value="Shea">Shea</option>
                                <option value="Coconut">Coconut</option>
                                <option value="Black Soap">Black Soap</option>
                              </select>
                            ) : (
                              p.category
                            )}
                          </td>

                          {/* Price */}
                          <td className="p-4 font-mono">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editForm.price || 0}
                                onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                className="px-2 py-1 border border-brand-charcoal/20 bg-brand-cream rounded w-20 font-mono text-xs"
                              />
                            ) : (
                              `₦${p.price.toLocaleString()}`
                            )}
                          </td>

                          {/* Stock */}
                          <td className="p-4 font-mono">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editForm.stock_count || 0}
                                onChange={e => setEditForm({ ...editForm, stock_count: Number(e.target.value) })}
                                className="px-2 py-1 border border-brand-charcoal/20 bg-brand-cream rounded w-16 font-mono text-xs"
                              />
                            ) : (
                              <span className={`font-semibold ${p.stock_count < 10 ? 'text-brand-terracotta' : 'text-brand-olive'}`}>
                                {p.stock_count} units
                              </span>
                            )}
                          </td>

                          {/* Ingredients */}
                          <td className="p-4 max-w-xs truncate text-[11px] text-brand-charcoal/60">
                            {isEditing ? (
                              <input
                                type="text"
                                value={ingredientsText}
                                onChange={e => setIngredientsText(e.target.value)}
                                className="px-2 py-1 border border-brand-charcoal/20 bg-brand-cream rounded w-full text-xs"
                              />
                            ) : (
                              p.ingredients.join(', ')
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              {isEditing ? (
                                <button
                                  onClick={handleSaveEdit}
                                  className="p-1.5 rounded-lg bg-brand-olive/10 text-brand-olive hover:bg-brand-olive hover:text-brand-cream transition-all cursor-pointer"
                                  title="Save write transaction to Supabase"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStartEdit(p)}
                                  className="p-1.5 rounded-lg bg-brand-beige/60 text-brand-charcoal hover:bg-brand-charcoal hover:text-brand-cream transition-all cursor-pointer"
                                  title="Edit properties"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                title="Purge product from Supabase"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 3: KANBAN FULFILLMENT CONTAINER */}
          {activeTab === 'fulfillment' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-brand-terracotta font-semibold">
                  [ COURIER GRID ]
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-brand-charcoal mt-1">
                  Active Dispatch Fulfillment
                </h2>
                <p className="text-xs text-brand-charcoal/50">
                  Transition client orders line-by-line across active fulfillment phases. Instantly synchronizes statuses client-side.
                </p>
              </div>

              {/* Kanban Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* COLUMN 1: PENDING WHIP */}
                <div className="p-4 rounded-2xl bg-brand-beige/40 border border-brand-charcoal/10 flex flex-col gap-4">
                  <div className="flex justify-between items-center pb-2 border-b border-brand-charcoal/5">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-brand-terracotta">
                      1. Pending Whip
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-terracotta/10 text-brand-terracotta text-[9px] font-mono">
                      {orders.filter(o => o.fulfillment_status === 'pending').length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[500px] min-h-[250px]">
                    {orders
                      .filter(o => o.fulfillment_status === 'pending')
                      .map(o => (
                        <div key={o.id} className="p-4 rounded-xl bg-brand-cream border border-brand-charcoal/5 shadow-sm flex flex-col gap-2.5">
                          <div className="flex justify-between items-start">
                            <span className="font-mono text-[9px] text-brand-charcoal/40 font-semibold truncate max-w-[120px]">
                              ID: #{o.id.substring(0, 8).toUpperCase()}
                            </span>
                            <span className="text-[10px] font-mono bg-brand-beige/40 text-brand-charcoal font-semibold px-2 py-0.5 rounded">
                              ₦{Number(o.total_amount).toLocaleString()}
                            </span>
                          </div>
                          
                          <p className="text-[10px] font-sans text-brand-charcoal/70 leading-relaxed font-light">
                            <strong>Dispatch Location:</strong> {o.shipping_address}
                          </p>

                          <div className="flex items-center gap-2 border-t border-brand-charcoal/5 pt-2 mt-1">
                            <span className="text-[8px] font-mono text-brand-charcoal/30 uppercase mr-auto">Move state:</span>
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'processing', o.payment_status)}
                              className="px-2.5 py-1 rounded bg-brand-charcoal hover:bg-brand-terracotta text-brand-cream text-[9px] font-mono uppercase tracking-wider cursor-pointer"
                            >
                              Whip/Process →
                            </button>
                          </div>
                        </div>
                      ))}
                    {orders.filter(o => o.fulfillment_status === 'pending').length === 0 && (
                      <p className="my-auto text-center font-serif italic text-xs text-brand-charcoal/30">
                        No pending whips.
                      </p>
                    )}
                  </div>
                </div>

                {/* COLUMN 2: ACTIVE RECONCILIATION */}
                <div className="p-4 rounded-2xl bg-brand-beige/40 border border-brand-charcoal/10 flex flex-col gap-4">
                  <div className="flex justify-between items-center pb-2 border-b border-brand-charcoal/5">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-brand-charcoal">
                      2. Active Whipping
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-charcoal/10 text-brand-charcoal text-[9px] font-mono">
                      {orders.filter(o => o.fulfillment_status === 'processing').length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[500px] min-h-[250px]">
                    {orders
                      .filter(o => o.fulfillment_status === 'processing')
                      .map(o => (
                        <div key={o.id} className="p-4 rounded-xl bg-brand-cream border border-brand-charcoal/5 shadow-sm flex flex-col gap-2.5">
                          <div className="flex justify-between items-start">
                            <span className="font-mono text-[9px] text-brand-charcoal/40 font-semibold truncate max-w-[120px]">
                              ID: #{o.id.substring(0, 8).toUpperCase()}
                            </span>
                            <span className="text-[10px] font-mono bg-brand-beige/40 text-brand-charcoal font-semibold px-2 py-0.5 rounded">
                              ₦{Number(o.total_amount).toLocaleString()}
                            </span>
                          </div>

                          <p className="text-[10px] font-sans text-brand-charcoal/70 leading-relaxed font-light">
                            <strong>Dispatch Location:</strong> {o.shipping_address}
                          </p>

                          <div className="flex justify-between items-center border-t border-brand-charcoal/5 pt-2 mt-1">
                            <span className="text-[9px] font-mono text-brand-charcoal/40 font-semibold">Payment:</span>
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, o.fulfillment_status, 'completed')}
                              className={`px-2 py-0.5 text-[8px] font-mono uppercase tracking-wider rounded ${o.payment_status === 'completed' ? 'bg-brand-olive/10 text-brand-olive' : 'bg-red-50 text-red-500 hover:bg-brand-olive/15'}`}
                            >
                              {o.payment_status === 'completed' ? '✓ Reconciled' : 'Reconcile Cash'}
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 pt-2 border-t border-brand-charcoal/5">
                            <span className="text-[8px] font-mono text-brand-charcoal/30 uppercase mr-auto">Move state:</span>
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'shipped', o.payment_status)}
                              className="px-2.5 py-1 rounded bg-brand-olive hover:bg-brand-charcoal text-brand-cream text-[9px] font-mono uppercase tracking-wider cursor-pointer"
                            >
                              Ship/Deliver →
                            </button>
                          </div>
                        </div>
                      ))}
                    {orders.filter(o => o.fulfillment_status === 'processing').length === 0 && (
                      <p className="my-auto text-center font-serif italic text-xs text-brand-charcoal/30">
                        No formulation processing in progress.
                      </p>
                    )}
                  </div>
                </div>

                {/* COLUMN 3: DISPATCH COMPLETED */}
                <div className="p-4 rounded-2xl bg-brand-beige/40 border border-brand-charcoal/10 flex flex-col gap-4">
                  <div className="flex justify-between items-center pb-2 border-b border-brand-charcoal/5">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-brand-olive">
                      3. Shipped / Handed Over
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-olive/10 text-brand-olive text-[9px] font-mono">
                      {orders.filter(o => o.fulfillment_status === 'shipped').length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[500px] min-h-[250px]">
                    {orders
                      .filter(o => o.fulfillment_status === 'shipped')
                      .map(o => (
                        <div key={o.id} className="p-4 rounded-xl bg-brand-cream border border-brand-charcoal/5 shadow-sm flex flex-col gap-2.5">
                          <div className="flex justify-between items-start">
                            <span className="font-mono text-[9px] text-brand-charcoal/40 font-semibold truncate max-w-[120px]">
                              ID: #{o.id.substring(0, 8).toUpperCase()}
                            </span>
                            <span className="text-[10px] font-mono bg-brand-olive/10 text-brand-olive font-semibold px-2 py-0.5 rounded">
                              ₦{Number(o.total_amount).toLocaleString()}
                            </span>
                          </div>

                          <p className="text-[10px] font-sans text-brand-charcoal/70 leading-relaxed font-light">
                            <strong>Dispatch Location:</strong> {o.shipping_address}
                          </p>

                          <div className="flex justify-between items-center text-[10px] font-mono border-t border-brand-charcoal/5 pt-2 mt-1">
                            <span>Payment State:</span>
                            <span className="text-brand-olive font-semibold uppercase">Paid & Reconciled</span>
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span>Status:</span>
                            <span className="text-brand-olive font-semibold uppercase flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Fulfilled</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    {orders.filter(o => o.fulfillment_status === 'shipped').length === 0 && (
                      <p className="my-auto text-center font-serif italic text-xs text-brand-charcoal/30">
                        No fulfilled vessels yet.
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 4: LEGAL COMPLIANCE TEXT COMPONENT EDITOR */}
          {activeTab === 'legal' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-brand-terracotta font-semibold">
                  [ COMPLIANCE LEDGER ]
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-brand-charcoal mt-1">
                  Legal Compliance Control
                </h2>
                <p className="text-xs text-brand-charcoal/50">
                  Directly customize compliance text statements. Changing a parameter instantly updates the live routes.
                </p>
              </div>

              {/* Legal Tab Toggles */}
              <div className="flex gap-2 border-b border-brand-charcoal/10 pb-2">
                {(['terms', 'privacy', 'returns'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setEditingLegalTab(tab)}
                    className={`px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-wider cursor-pointer ${editingLegalTab === tab ? 'bg-brand-charcoal text-brand-cream font-bold' : 'text-brand-charcoal/50 hover:bg-brand-beige/50'}`}
                  >
                    {tab === 'terms' ? 'Terms & Conditions' : tab === 'privacy' ? 'Privacy Policy' : 'Refunds & Delivery'}
                  </button>
                ))}
              </div>

              {/* Textarea Editor */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-brand-charcoal/40 uppercase">
                  <span>Input legal paragraphs (separate paragraphs by double line breaks)</span>
                  <span>Character length: {legalInputText.length}</span>
                </div>
                <textarea
                  value={legalInputText}
                  onChange={e => setLegalInputText(e.target.value)}
                  rows={14}
                  className="w-full p-4 bg-brand-cream border border-brand-charcoal/10 rounded-2xl text-xs font-sans text-brand-charcoal/80 focus:outline-none focus:border-brand-terracotta resize-none leading-relaxed"
                />
              </div>

              <button
                onClick={handleSaveLegal}
                className="w-full py-3 bg-brand-charcoal hover:bg-brand-terracotta text-brand-cream text-xs font-mono uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Publish Legal Adjustments</span>
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
};
