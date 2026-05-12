import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Upload, X } from 'lucide-react';
import { generateId } from '../../utils/helpers';
import { formatDateKey } from '../../utils/dateUtils';

export default function IdeaForm({ idea, categories, onSave, onDelete, onCancel }) {
  const isEditing = !!idea;
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    note: '',
    tags: [],
    categoryId: categories[0]?.id || '',
    thumbnail: null,
    createdAt: new Date().toISOString(),
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (idea) {
      setForm({ ...idea });
    }
  }, [idea]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addTag() {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      handleChange('tags', [...form.tags, tag]);
    }
    setTagInput('');
  }

  function removeTag(tag) {
    handleChange('tags', form.tags.filter((t) => t !== tag));
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500000) {
      alert('Ảnh quá lớn! Vui lòng chọn ảnh dưới 500KB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange('thumbnail', reader.result);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      ...form,
      id: form.id || generateId('idea'),
      createdAt: form.createdAt || new Date().toISOString(),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Tiêu đề *</label>
        <input
          type="text"
          placeholder="Nhập tiêu đề ý tưởng..."
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          autoFocus
          required
        />
      </div>

      <div className="form-group">
        <label>Ghi chú</label>
        <textarea
          placeholder="Mô tả chi tiết ý tưởng của bạn..."
          value={form.note}
          onChange={(e) => handleChange('note', e.target.value)}
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>Hạng mục</label>
        <select
          value={form.categoryId}
          onChange={(e) => handleChange('categoryId', e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Tags</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            type="text"
            placeholder="Nhập tag rồi nhấn Enter..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            style={{ flex: 1 }}
          />
          <button type="button" className="btn btn-secondary btn-sm" onClick={addTag}>Thêm</button>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {form.tags.map((tag) => (
            <span key={tag} className="tag" style={{ cursor: 'pointer' }} onClick={() => removeTag(tag)}>
              {tag} <X size={12} style={{ marginLeft: 4 }} />
            </span>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Ảnh thumbnail</label>
        {form.thumbnail ? (
          <div className="image-preview">
            <img src={form.thumbnail} alt="Preview" />
            <button
              type="button"
              className="image-preview-remove"
              onClick={() => handleChange('thumbnail', null)}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            className="image-upload-area"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={24} style={{ marginBottom: 8 }} />
            <div>Bấm để chọn ảnh (tối đa 500KB)</div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 10 }}>
        <div>
          {isEditing && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(idea.id)}
            >
              <Trash2 size={15} />
              Xóa
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Hủy</button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </div>
    </form>
  );
}
