import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, X, Tags } from 'lucide-react';
import { Categories } from '../../lib/db.js';
import { toast } from 'sonner';

const EMPTY_FORM = { name: '', description: '' };

export default function SellerCategories() {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [dialog, setDialog] = useState(null); // null | 'add' | 'edit' | 'delete'
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const refresh = () => setCategories(Categories.getAll().sort((a, b) => a.name.localeCompare(b.name)));

    useEffect(() => { refresh(); }, []);

    const openAdd = () => { setForm(EMPTY_FORM); setSelected(null); setDialog('add'); };
    const openEdit = (c) => { setSelected(c); setForm({ name: c.name, description: c.description || '' }); setDialog('edit'); };
    const openDelete = (c) => { setSelected(c); setDialog('delete'); };
    const closeDialog = () => { setDialog(null); setSelected(null); };

    const handleSave = () => {
        if (!form.name.trim()) { toast.error('Category name is required'); return; }

        if (dialog === 'add') {
            Categories.create({ ...form });
            toast.success('Category added!');
        } else {
            Categories.update(selected.id, { ...form });
            toast.success('Category updated!');
        }
        refresh();
        closeDialog();
    };

    const handleDelete = () => {
        Categories.delete(selected.id);
        toast.success('Category deleted');
        refresh();
        closeDialog();
    };

    const filtered = categories.filter(c =>
        !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.description || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: '32px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '32px', color: '#1a1a1a', marginBottom: '4px' }}>Categories</h1>
                    <p style={{ color: '#888', fontSize: '14px' }}>{categories.length} {categories.length === 1 ? 'category' : 'categories'} total</p>
                </div>
                <button onClick={openAdd}
                    className="btn-forest"
                    style={{ padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <Plus size={18} /> Add Category
                </button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '360px' }}>
                <Search size={15} color="#aaa" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input-base" style={{ paddingLeft: '38px', borderRadius: '99px' }}
                    placeholder="Search categories..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Table */}
            <div style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f5ece0', borderBottom: '1px solid #e8d8c0' }}>
                                {['Name', 'Description', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#5a4030', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                                        <Tags size={40} style={{ opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
                                        No categories found
                                    </td>
                                </tr>
                            ) : filtered.map((c, i) => (
                                <tr key={c.id} style={{ borderBottom: '1px solid #f5ece0', transition: 'background 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#fdf9f3'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1a1a1a', fontSize: '14px' }}>
                                        {c.name}
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#666', fontSize: '14px' }}>
                                        {c.description || '—'}
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => openEdit(c)}
                                                style={{ background: '#e8f4f8', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#0077aa', transition: 'all 0.2s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#d0e8f0'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#e8f4f8'; }}>
                                                <Pencil size={14} />
                                            </button>
                                            <button onClick={() => openDelete(c)}
                                                style={{ background: '#fff5f5', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#c0392b', transition: 'all 0.2s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#ffe0e0'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Dialog */}
            {(dialog === 'add' || dialog === 'edit') && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontWeight: 700, fontSize: '20px', color: '#1a1a1a' }}>{dialog === 'add' ? 'Add Category' : 'Edit Category'}</h2>
                            <button onClick={closeDialog} style={{ background: '#f5f5f5', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '6px' }}>Category Name *</label>
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="input-base" placeholder="Name" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '6px' }}>Description</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="input-base" style={{ resize: 'vertical' }} placeholder="Optional description..." />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button onClick={handleSave} className="btn-forest" style={{ flex: 1, padding: '13px', borderRadius: '12px', fontSize: '15px' }}>
                                {dialog === 'add' ? 'Add Category' : 'Save Changes'}
                            </button>
                            <button onClick={closeDialog} style={{ padding: '13px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, background: '#f5f5f5', border: 'none', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Dialog */}
            {dialog === 'delete' && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '20px', padding: '32px', maxWidth: '400px', width: '100%' }}>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗑️</div>
                            <h2 style={{ fontWeight: 700, fontSize: '20px', color: '#1a1a1a', marginBottom: '8px' }}>Delete Category?</h2>
                            <p style={{ color: '#888', fontSize: '14px' }}>
                                "<strong>{selected?.name}</strong>" will be permanently removed.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={handleDelete} style={{ flex: 1, padding: '13px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, background: '#c0392b', color: 'white', border: 'none', cursor: 'pointer' }}>
                                Delete
                            </button>
                            <button onClick={closeDialog} style={{ flex: 1, padding: '13px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, background: '#f5f5f5', border: 'none', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
