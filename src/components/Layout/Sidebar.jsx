import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, BarChart3, Lightbulb, Bell, Plus, X } from 'lucide-react';
import { getCategories, saveCategory, deleteCategory as deleteCat } from '../../data/storage';
import { generateId } from '../../utils/helpers';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/', icon: Calendar, label: 'Lịch công việc' },
  { to: '/progress', icon: BarChart3, label: 'Tổng kết tiến độ' },
  { to: '/ideas', icon: Lightbulb, label: 'Ý tưởng nhanh' },
  { to: '/reminders', icon: Bell, label: 'Nhắc nhở' },
];

export default function Sidebar() {
  const [categories, setCategories] = useState(getCategories());
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#8B5CF6');

  const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];

  function handleAddCategory() {
    if (!newName.trim()) return;
    const cat = { id: generateId('cat'), name: newName.trim(), color: newColor };
    const updated = saveCategory(cat);
    setCategories(updated);
    setNewName('');
    setAdding(false);
  }

  function handleDeleteCategory(id) {
    const updated = deleteCat(id);
    setCategories(updated);
  }

  return (
    <aside className="sidebar" id="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <span>P</span>
        </div>
        <span className="logo-text">PlanHub</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-label">MENU</div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.to === '/'}
          >
            <item.icon size={20} />
            <span className="nav-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Categories */}
      <div className="sidebar-categories">
        <div className="nav-label">HẠNG MỤC</div>
        <div className="category-list">
          {categories.map((cat) => (
            <div key={cat.id} className="category-item">
              <span className="category-dot" style={{ background: cat.color }} />
              <span className="category-name">{cat.name}</span>
              <button
                className="category-delete"
                onClick={() => handleDeleteCategory(cat.id)}
                title="Xóa"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {adding ? (
          <div className="category-add-form animate-fade-in">
            <input
              type="text"
              placeholder="Tên hạng mục..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              autoFocus
            />
            <div className="color-picker" style={{ marginTop: 8 }}>
              {colors.map((c) => (
                <span
                  key={c}
                  className={`color-dot ${newColor === c ? 'active' : ''}`}
                  style={{ background: c, width: 20, height: 20 }}
                  onClick={() => setNewColor(c)}
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <button className="btn btn-primary btn-sm" onClick={handleAddCategory}>Thêm</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setAdding(false)}>Hủy</button>
            </div>
          </div>
        ) : (
          <button className="add-category-btn" onClick={() => setAdding(true)}>
            <Plus size={16} />
            <span className="nav-text">Thêm hạng mục</span>
          </button>
        )}
      </div>
    </aside>
  );
}
