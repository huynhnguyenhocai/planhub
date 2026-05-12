import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { TIME_SLOTS, TASK_COLORS, STATUSES } from '../../data/constants';
import { generateId } from '../../utils/helpers';
import { formatDateKey } from '../../utils/dateUtils';

export default function TaskForm({ task, preset, categories, onSave, onDelete, onCancel }) {
  const isEditing = !!task;

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: formatDateKey(new Date()),
    timeSlot: 'morning',
    categoryId: categories[0]?.id || '',
    color: TASK_COLORS[0],
    progress: 0,
    status: 'not_started',
  });

  useEffect(() => {
    if (task) {
      setForm({ ...task });
    } else if (preset) {
      setForm((prev) => ({
        ...prev,
        date: preset.date,
        timeSlot: preset.timeSlot,
      }));
    }
  }, [task, preset]);

  function handleChange(field, value) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-sync status with progress
      if (field === 'progress') {
        const p = Number(value);
        if (p === 100) updated.status = 'completed';
        else if (p > 0) updated.status = 'in_progress';
        else updated.status = 'not_started';
      }
      if (field === 'status') {
        if (value === 'completed') updated.progress = 100;
        else if (value === 'not_started') updated.progress = 0;
      }
      return updated;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      ...form,
      id: form.id || generateId('task'),
      progress: Number(form.progress),
      dismissed: form.dismissed || false,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Tiêu đề *</label>
        <input
          type="text"
          placeholder="Nhập tiêu đề công việc..."
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          autoFocus
          required
        />
      </div>

      <div className="form-group">
        <label>Mô tả</label>
        <textarea
          placeholder="Mô tả ngắn về công việc..."
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={2}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Ngày</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Khung giờ</label>
          <select
            value={form.timeSlot}
            onChange={(e) => handleChange('timeSlot', e.target.value)}
          >
            {TIME_SLOTS.map((s) => (
              <option key={s.id} value={s.id}>{s.icon} {s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
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
          <label>Trạng thái</label>
          <select
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Màu sắc</label>
        <div className="color-picker">
          {TASK_COLORS.map((c) => (
            <span
              key={c}
              className={`color-dot ${form.color === c ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => handleChange('color', c)}
            />
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Tiến độ: {form.progress}%</label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={form.progress}
          onChange={(e) => handleChange('progress', e.target.value)}
          style={{ padding: 0, border: 'none', boxShadow: 'none' }}
        />
        <div className="progress-bar" style={{ marginTop: 6 }}>
          <div className="progress-bar-fill" style={{ width: `${form.progress}%` }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 10 }}>
        <div>
          {isEditing && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(task.id)}
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
