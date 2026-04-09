'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';
import { Trash2, Edit, Plus, Upload, ChevronDown, ChevronRight, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import Papa from 'papaparse';

export default function DashboardClient({ initialProducts, initialCategories }: { initialProducts: any[], initialCategories: string[] }) {
  const supabase = createClient();
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceAnchor, setPriceAnchor] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [amazonLink, setAmazonLink] = useState('');
  const [badge, setBadge] = useState('');
  const [rating, setRating] = useState('4.8');
  const [reviewsCount, setReviewsCount] = useState('120');
  const [viewCount, setViewCount] = useState('89');
  const [shortTitle, setShortTitle] = useState('');
  const [accessories, setAccessories] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [existingGifUrl, setExistingGifUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const groupedProducts = products.reduce((acc: any, product: any) => {
    const cat = product.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("products").update({ is_active: !currentStatus }).eq("id", id);
    if (!error) {
      setProducts(products.map((p: any) => p.id === id ? { ...p, is_active: !currentStatus } : p));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        // Map rows to Supabase rows
        const productsToInsert = rows.map(row => ({
          name: row.name || "Untitled",
          description: row.description || "",
          price: parseFloat(row.price) || 0,
          category: row.category || "Fashion",
          amazon_link: row.amazon_link || "",
          badge: row.badge || null,
          user_id: products[0]?.user_id || "", 
          is_active: true
        }));

        if (productsToInsert.length > 0) {
          const { data, error } = await supabase.from("products").insert(productsToInsert).select();
          if (error) {
            alert("Upload failed: " + error.message);
          } else if (data) {
            setProducts([...data, ...products]);
            alert("CSV Upload successful!");
          }
        }
      },
      error: (error) => {
        alert("Failed to parse CSV: " + error.message);
      }
    });

    // clear the file input
    event.target.value = "";
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    
    // Insert into Supabase
    const { data, error } = await supabase.from('categories').insert([{ name: newCategoryName }]).select().single();
    if (!error && data) {
      setCategories([...categories, data.name]);
      setCategory(data.name);
      setNewCategoryName('');
      setIsCategoryModalOpen(false);
    } else {
      alert(error?.message || 'Error occurred');
    }
  };

  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditingId(product.id);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setPriceAnchor(product.price_anchor || '');
      setCategory(product.category);
      setAmazonLink(product.amazon_link);
      setBadge(product.badge || '');
      setRating(product.rating ? product.rating.toString() : '4.8');
      setReviewsCount(product.reviews_count || '120');
      setViewCount(product.view_count ? product.view_count.toString() : '89');
      setShortTitle(product.short_title || '');
      setAccessories(product.accessories || []);
      setExistingGifUrl(product.gif_url);
    } else {
      setEditingId(null);
      setName('');
      setDescription('');
      setPrice('');
      setPriceAnchor('');
      setCategory('');
      setAmazonLink('');
      setBadge('');
      setRating('4.8');
      setReviewsCount('120');
      setViewCount('89');
      setShortTitle('');
      setAccessories([]);
      setFile(null);
      setExistingGifUrl('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
  
    let gifUrl = existingGifUrl;
  
    // Upload File if selected
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-gifs')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });
  
      if (uploadError) {
        alert('File upload failed: ' + uploadError.message);
        setIsSubmitting(false);
        return;
      }
      
      const { data: publicUrlData } = supabase.storage.from('product-gifs').getPublicUrl(fileName);
      gifUrl = publicUrlData.publicUrl;
    }
  
    const existingProduct = editingId ? products.find((p: any) => p.id === editingId) : null;
    const payload = {
      name,
      short_title: shortTitle || null,
      description,
      price: parseFloat(price),
      price_anchor: priceAnchor ? parseFloat(priceAnchor) : null,
      category: category || 'Uncategorized',
      amazon_link: amazonLink,
      badge,
      gif_url: gifUrl,
      rating: parseFloat(rating),
      reviews_count: reviewsCount,
      view_count: parseInt(viewCount, 10),
      accessories: accessories.length > 0 ? accessories : null,
      is_active: editingId ? existingProduct?.is_active ?? true : true,
    };
  
    if (editingId) {
      const { data, error } = await supabase.from('products').update(payload).eq('id', editingId).select().single();
      if (!error && data) {
        setProducts(products.map(p => p.id === editingId ? data : p));
      }
    } else {
      const { data, error } = await supabase.from('products').insert([payload]).select().single();
      if (!error && data) {
        setProducts([data, ...products]);
      }
    }
  
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string, currentGifUrl: string | null) => {
    if (!window.confirm('Delete product?')) return;
  
    await supabase.from('products').delete().eq('id', id);
  
    // Cleanup file from storage
    if (currentGifUrl) {
      const pathArray = currentGifUrl.split('/');
      const fileName = pathArray[pathArray.length - 1]; // Naive extract
      if (fileName) {
         await supabase.storage.from('product-gifs').remove([fileName]);
      }
    }
  
    setProducts(products.filter(p => p.id !== id));
  };

  // Section delete confirmation and logic
  const handleDeleteCategory = async (cat: string) => {
    if (!window.confirm(`Are you sure you want to delete '${cat}' and all its products?`)) return;
    // Remove all products in this category
    const { error: prodErr } = await supabase.from('products').delete().eq('category', cat);
    // Remove the category itself
    const { error: catErr } = await supabase.from('categories').delete().eq('name', cat);
    if (!prodErr && !catErr) {
      setProducts(products.filter(p => p.category !== cat));
      setCategories(categories.filter(c => c !== cat));
    } else {
      alert(prodErr?.message || catErr?.message || 'Error deleting section');
    }
  };

  // Section edit modal state
  const [editSectionModal, setEditSectionModal] = useState<{ open: boolean, oldName: string, newName: string }>({ open: false, oldName: '', newName: '' });

  // Open edit modal
  const handleEditCategory = (oldName: string) => {
    setEditSectionModal({ open: true, oldName, newName: oldName });
  };

  // Save section name
  const saveEditCategory = async () => {
    const { oldName, newName } = editSectionModal;
    if (!newName || newName === oldName) {
      setEditSectionModal({ open: false, oldName: '', newName: '' });
      return;
    }
    const { error } = await supabase.from('categories').update({ name: newName }).eq('name', oldName);
    if (!error) {
      setCategories(categories.map(c => c === oldName ? newName : c));
      setProducts(products.map(p => p.category === oldName ? { ...p, category: newName } : p));
    } else {
      alert(error?.message || 'Error updating section');
    }
    setEditSectionModal({ open: false, oldName: '', newName: '' });
  };

  // Navbar customization state
  const [navbarItems, setNavbarItems] = useState<any[]>([]);
  const [isNavbarModalOpen, setIsNavbarModalOpen] = useState(false);
  const [navbarModalMode, setNavbarModalMode] = useState<'add' | 'edit'>('add');
  const [navbarModalInput, setNavbarModalInput] = useState('');
  const [navbarModalEditId, setNavbarModalEditId] = useState<number | null>(null);
  const [navbarLoading, setNavbarLoading] = useState(false);
  const [navbarError, setNavbarError] = useState('');

  // Fetch navbar config from Supabase
  useEffect(() => {
    const fetchNavbar = async () => {
      setNavbarLoading(true);
      const { data, error } = await supabase.from('navbar').select('*').order('order', { ascending: true });
      if (!error && data && data.length > 0) {
        setNavbarItems(data);
        setNavbarLoading(false);
        return;
      }

      const { data: categories, error: categoriesError } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
      const defaultSections = ['All', 'Dresses', 'Bags', 'Accessories'];
      const overrideSet = ['Fashion', 'fashion', 'Dresses', 'dresses', 'Bags', 'bags', 'Accessories', 'accessories', 'jwellary', 'jewelry', 'bangles', 'necklaces', 'earrings', 'Jewelry', 'Bangles', 'Necklaces', 'Earrings'];

      const additionalSections = (categories || [])
        .map((c: any) => c.name)
        .filter((name: string) => !overrideSet.includes(name) && !defaultSections.includes(name));

      const initialItems = [
        ...defaultSections,
        ...additionalSections,
      ].map((name, index) => ({ id: Date.now() + index, name, visible: true }));

      setNavbarItems(initialItems);
      setNavbarLoading(false);
      if (error) setNavbarError(error.message);
      if (categoriesError) setNavbarError(categoriesError.message);
    };
    fetchNavbar();
  }, []);

  // Save navbar config to Supabase
  const saveNavbarConfig = async (items: any[]) => {
    setNavbarLoading(true);
    setNavbarError('');
    await supabase.from('navbar').delete().neq('id', 0);
    for (let i = 0; i < items.length; i++) {
      await supabase.from('navbar').insert({ ...items[i], order: i });
    }
    setNavbarItems([...items]);
    setNavbarLoading(false);
  };

  const openNavbarModal = (mode: 'add' | 'edit', item?: any) => {
    setNavbarModalMode(mode);
    setNavbarModalInput(item?.name || '');
    setNavbarModalEditId(item?.id ?? null);
    setIsNavbarModalOpen(true);
  };

  const closeNavbarModal = () => {
    setIsNavbarModalOpen(false);
    setNavbarModalInput('');
    setNavbarModalEditId(null);
  };

  const handleNavbarModalSave = () => {
    if (!navbarModalInput.trim()) return;
    if (navbarModalMode === 'add') {
      setNavbarItems([...navbarItems, { name: navbarModalInput.trim(), id: Date.now(), visible: true }]);
    } else if (navbarModalMode === 'edit' && navbarModalEditId !== null) {
      setNavbarItems(navbarItems.map(item => item.id === navbarModalEditId ? { ...item, name: navbarModalInput.trim() } : item));
    }
    closeNavbarModal();
  };

  const handleRemoveNavbarItem = (id: number) => {
    setNavbarItems(navbarItems.filter(item => item.id !== id));
  };
  const handleToggleNavbarItem = (id: number) => {
    setNavbarItems(navbarItems.map(item => item.id === id ? { ...item, visible: !item.visible } : item));
  };
  const handleReorderNavbarItems = (from: number, to: number) => {
    const updated = [...navbarItems];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setNavbarItems(updated);
  };

  const visibleNavbarSections = navbarItems.filter(item => item.visible).map(item => item.name);
  const productCategoryOptions = Array.from(new Set([...visibleNavbarSections, ...categories]));
  if (category && !productCategoryOptions.includes(category)) {
    productCategoryOptions.unshift(category);
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Catalog Management</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsCategoryModalOpen(true)} 
            className="bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-200 transition"
          >
            <Plus size={16} /> Add Section
          </button>
          <button 
            onClick={() => handleOpenModal()} 
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Bulk Upload Section */}
      <div className="mb-8 border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center hover:bg-gray-100 transition relative">
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileUpload} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="mx-auto text-gray-400 mb-2" size={32} />
        <p className="text-gray-700 font-medium">Bulk Upload Products</p>
        <p className="text-sm text-gray-500 mt-1">Drag and drop a CSV file here, or click to browse</p>
      </div>

      {/* Responsive Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
        {Object.entries(groupedProducts).length === 0 ? (
          <div className="text-center py-12 text-gray-500 w-full col-span-full">
            No products found. Add some to get started!
          </div>
        ) : (
          Object.entries(groupedProducts).map(([cat, categoryProducts]: [string, any]) => (
            <div key={cat} className="border rounded-lg bg-white overflow-hidden shadow-sm flex flex-col max-h-[600px]">
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-800">{cat}</h3>
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-2">
                    {categoryProducts.length} items
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditCategory(cat)} className="p-1 rounded hover:bg-gray-200" title="Edit Section">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDeleteCategory(cat)} className="p-1 rounded hover:bg-red-100" title="Delete Section">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-left text-sm">
                  <thead className="border-b uppercase text-gray-500 bg-white">
                    <tr>
                      <th className="p-4 w-16">Image</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Price</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryProducts.map((p: any) => (
                      <tr key={p.id} className="border-b hover:bg-gray-50 group">
                        <td className="p-4">
                          {p.gif_url ? (
                            <img src={p.gif_url} alt={p.name} className="w-12 h-12 object-cover rounded shadow-sm group-hover:scale-110 transition" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                              <ImageIcon size={24} />
                            </div>
                          )}
                        </td>
                        <td className="p-4 font-medium max-w-[200px] truncate text-gray-800">
                          {p.name}
                          <div className="text-xs text-gray-400 font-normal mt-0.5">{p.badge || 'No Badge'}</div>
                        </td>
                        <td className="p-4 font-semibold text-gray-700">₹{p.price}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => toggleActiveStatus(p.id, p.is_active)}
                            className={`flex items-center justify-center gap-1 mx-auto px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                              p.is_active 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {p.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                            {p.is_active ? 'Active' : 'Hidden'}
                          </button>
                        </td>
                        <td className="p-4 flex gap-3 justify-end text-right">
                          <button onClick={() => handleOpenModal(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(p.id, p.gif_url)} className="p-2 text-red-600 hover:bg-red-50 rounded transition" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Short Title</label>
                  <input value={shortTitle} onChange={e => setShortTitle(e.target.value)} type="text" className="w-full border rounded p-2" placeholder="Short product title for cards" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded p-2">
                    <option value="">None</option>
                    {productCategoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Price (₹)</label>
                  <input required value={price} onChange={e => setPrice(e.target.value)} type="number" step="0.01" className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Original Price (₹) (Crossed out)</label>
                  <input value={priceAnchor} onChange={e => setPriceAnchor(e.target.value)} type="number" step="0.01" className="w-full border rounded p-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description (Why buy this?)</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full border rounded p-2"></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Amazon Affiliate Link</label>
                  <input required value={amazonLink} onChange={e => setAmazonLink(e.target.value)} type="url" className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Badge (e.g. Bestseller)</label>
                  <input value={badge} onChange={e => setBadge(e.target.value)} type="text" className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Star Rating</label>
                  <input required value={rating} onChange={e => setRating(e.target.value)} type="number" step="0.1" min="0" max="5" className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reviews Count</label>
                  <input value={reviewsCount} onChange={e => setReviewsCount(e.target.value)} type="text" placeholder="e.g. 1.2k" className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fake View Count Today</label>
                  <input required value={viewCount} onChange={e => setViewCount(e.target.value)} type="number" className="w-full border rounded p-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Accessories (Hold Ctrl/Cmd to select multiple)</label>
                  <select 
                    multiple 
                    className="w-full border rounded p-2 min-h-[100px]"
                    value={accessories.includes('__none') ? ['__none'] : accessories}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                      if (selected.includes('__none')) {
                        setAccessories([]);
                      } else {
                        setAccessories(selected);
                      }
                    }}
                  >
                    <option value="__none">None (clear bundle selection)</option>
                    {products.filter(p => p.id !== editingId).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select items that should show up in "Shop The Look" bundle. Choose None to clear the bundle.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Media (.gif, .mp4, .png)</label>
                  <input type="file" accept="image/*,video/mp4" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full border rounded p-2" />
                  {existingGifUrl && !file && <p className="text-xs text-gray-500 mt-1">Current File Linked</p>}
                </div>
              </div>
              <div className="flex gap-4 justify-end mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Section / Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Section Name</label>
                <input 
                  required 
                  value={newCategoryName} 
                  onChange={e => setNewCategoryName(e.target.value)} 
                  type="text" 
                  placeholder="e.g. Trendy Bags"
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                />
              </div>
              <div className="flex gap-4 justify-end mt-6">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Section</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Section Modal */}
      {editSectionModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-xl font-bold mb-4">Edit Section Name</h2>
            <input
              type="text"
              value={editSectionModal.newName}
              onChange={e => setEditSectionModal(m => ({ ...m, newName: e.target.value }))}
              className="w-full border rounded p-2 mb-4"
              placeholder="Section name"
            />
            <div className="flex gap-4 justify-end">
              <button onClick={() => setEditSectionModal({ open: false, oldName: '', newName: '' })} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={saveEditCategory} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar Customization Panel */}
      <div className="mt-10 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold">Navbar Customization</h2>
            <p className="text-sm text-gray-500">Use the pencil icon next to each item to edit its label.</p>
          </div>
          <button onClick={() => openNavbarModal('add')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Manage Navbar</button>
        </div>
        <div className="flex flex-col gap-3 overflow-x-auto pb-2">
          {navbarItems.length === 0 ? (
            <div className="border rounded px-4 py-4 bg-gray-50 text-gray-600">
              No navbar items found. Click "Add Navbar Item" to create one.
            </div>
          ) : (
            navbarItems.map((item, idx) => (
              <div key={item.id} className="border rounded px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={item.visible ? 'font-medium' : 'font-medium line-through text-gray-400'}>{item.name}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">{item.visible ? 'Visible' : 'Hidden'}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => openNavbarModal('edit', item)} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Edit</button>
                  <button onClick={() => handleRemoveNavbarItem(item.id)} className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">Delete</button>
                  <button onClick={() => handleToggleNavbarItem(item.id)} className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">{item.visible ? 'Hide' : 'Show'}</button>
                  {idx > 0 && <button onClick={() => handleReorderNavbarItems(idx, idx-1)} className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">Move Up</button>}
                  {idx < navbarItems.length-1 && <button onClick={() => handleReorderNavbarItems(idx, idx+1)} className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">Move Down</button>}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button onClick={() => saveNavbarConfig(navbarItems)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Navbar</button>
          {navbarLoading && <div className="text-blue-600">Saving...</div>}
          {navbarError && <div className="text-red-600">{navbarError}</div>}
        </div>
      </div>

      {isNavbarModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{navbarModalMode === 'add' ? 'Add Navbar Item' : 'Edit Navbar Item'}</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
            <input
              type="text"
              value={navbarModalInput}
              onChange={e => setNavbarModalInput(e.target.value)}
              className="w-full border rounded p-2 mb-4"
              placeholder="Enter navbar label"
            />
            <div className="flex gap-4 justify-end">
              <button onClick={closeNavbarModal} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={handleNavbarModalSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{navbarModalMode === 'add' ? 'Add' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
