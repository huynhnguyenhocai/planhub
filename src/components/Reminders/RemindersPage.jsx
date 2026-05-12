import React, { useState, useMemo } from 'react';
import { AlertTriangle, CalendarClock, Check, X } from 'lucide-react';
import { getTasks, updateTaskStatus, dismissTask, getCategories } from '../../data/storage';
import { getDaysUntil, formatDateDisplay } from '../../utils/dateUtils';
import { getStatusLabel } from '../../utils/helpers';
import './RemindersPage.css';

export default function RemindersPage() {
  const [tasks, setTasks] = useState(getTasks());
  const [categories] = useState(getCategories());

  const { overdue, upcoming } = useMemo(() => {
    const active = tasks.filter((t) => t.status !== 'completed' && !t.dismissed);
    const overdue = [];
    const upcoming = [];

    active.forEach((t) => {
      const days = getDaysUntil(t.date);
      if (days < 0) {
        overdue.push({ ...t, daysUntil: days });
      } else if (days <= 3) {
        upcoming.push({ ...t, daysUntil: days });
      }
    });

    overdue.sort((a, b) => a.daysUntil - b.daysUntil);
    upcoming.sort((a, b) => a.daysUntil - b.daysUntil);

    return { overdue, upcoming };
  }, [tasks]);

  function handleComplete(id) {
    const updated = updateTaskStatus(id, 'completed');
    setTasks(updated);
  }

  function handleDismiss(id) {
    const updated = dismissTask(id);
    setTasks(updated);
  }

  function getDaysLabel(days) {
    if (days === 0) return 'Hôm nay';
    if (days === 1) return 'Ngày mai';
    if (days === -1) return 'Hôm qua';
    if (days < 0) return `Quá hạn ${Math.abs(days)} ngày`;
    return `Còn ${days} ngày`;
  }

  function ReminderCard({ item }) {
    const cat = categories.find((c) => c.id === item.categoryId);
    const isOverdue = item.daysUntil < 0;

    return (
      <div className={`reminder-card ${isOverdue ? 'overdue' : 'upcoming'} animate-fade-in`}>
        <div className="reminder-color" style={{ background: item.color }} />
        <div className="reminder-body">
          <div className="reminder-header">
            <h4 className="reminder-title">{item.title}</h4>
            <span className={`reminder-days ${isOverdue ? 'text-red' : 'text-blue'}`}>
              {getDaysLabel(item.daysUntil)}
            </span>
          </div>
          {item.description && (
            <p className="reminder-desc">{item.description}</p>
          )}
          <div className="reminder-meta">
            <span className="tag tag-outline">📌 Task</span>
            <span className="reminder-date">📅 {formatDateDisplay(item.date)}</span>
            {cat && (
              <span className="tag" style={{ background: `${cat.color}18`, color: cat.color }}>
                {cat.name}
              </span>
            )}
            <span className={`status-badge status-${item.status}`}>
              <span className="dot" />
              {getStatusLabel(item.status)}
            </span>
          </div>
        </div>
        <div className="reminder-actions">
          <button
            className="btn btn-success btn-sm"
            onClick={() => handleComplete(item.id)}
            title="Đánh dấu hoàn thành"
          >
            <Check size={16} />
            Xong
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => handleDismiss(item.id)}
            title="Bỏ qua nhắc nhở"
          >
            <X size={16} />
            Bỏ qua
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reminders-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">🔔 Nhắc nhở</h1>
          <p className="page-subtitle">Các công việc quá hạn và sắp tới</p>
        </div>
      </div>

      {/* Overdue */}
      <div className="reminder-section">
        <div className="section-header overdue-header">
          <AlertTriangle size={20} />
          <h2>Quá hạn ({overdue.length})</h2>
        </div>
        {overdue.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 24px' }}>
            <div className="empty-state-icon">✅</div>
            <div className="empty-state-text">Không có công việc quá hạn!</div>
          </div>
        ) : (
          <div className="reminder-list">
            {overdue.map((item) => <ReminderCard key={item.id} item={item} />)}
          </div>
        )}
      </div>

      {/* Upcoming */}
      <div className="reminder-section">
        <div className="section-header upcoming-header">
          <CalendarClock size={20} />
          <h2>Sắp tới — 3 ngày ({upcoming.length})</h2>
        </div>
        {upcoming.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 24px' }}>
            <div className="empty-state-icon">🎯</div>
            <div className="empty-state-text">Không có việc sắp tới trong 3 ngày.</div>
          </div>
        ) : (
          <div className="reminder-list">
            {upcoming.map((item) => <ReminderCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  );
}
