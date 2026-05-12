import React, { useState, useMemo } from 'react';
import { BarChart3, CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { getTasks, getCategories } from '../../data/storage';
import { MONTH_NAMES } from '../../data/constants';
import { getStatusLabel, getStatusColor } from '../../utils/helpers';
import { formatShortDate } from '../../utils/dateUtils';
import './ProgressPage.css';

export default function ProgressPage() {
  const [tasks] = useState(getTasks());
  const [categories] = useState(getCategories());

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

  // Filter tasks for selected month
  const monthTasks = useMemo(() => {
    return tasks.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    });
  }, [tasks, selectedYear, selectedMonth]);

  const stats = useMemo(() => {
    const total = monthTasks.length;
    const completed = monthTasks.filter((t) => t.status === 'completed').length;
    const inProgress = monthTasks.filter((t) => t.status === 'in_progress').length;
    const notStarted = monthTasks.filter((t) => t.status === 'not_started').length;
    const avgProgress = total > 0
      ? Math.round(monthTasks.reduce((sum, t) => sum + (t.progress || 0), 0) / total)
      : 0;
    return { total, completed, inProgress, notStarted, avgProgress };
  }, [monthTasks]);

  // Stats per category
  const categoryStats = useMemo(() => {
    return categories.map((cat) => {
      const catTasks = monthTasks.filter((t) => t.categoryId === cat.id);
      const total = catTasks.length;
      const completed = catTasks.filter((t) => t.status === 'completed').length;
      const avgProgress = total > 0
        ? Math.round(catTasks.reduce((sum, t) => sum + (t.progress || 0), 0) / total)
        : 0;
      return { ...cat, total, completed, avgProgress };
    }).filter((c) => c.total > 0);
  }, [categories, monthTasks]);

  const incompleteTasks = useMemo(() => {
    return monthTasks
      .filter((t) => t.status !== 'completed')
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [monthTasks]);

  const years = [2025, 2026, 2027];

  return (
    <div className="progress-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">📊 Tổng kết tiến độ</h1>
          <p className="page-subtitle">Theo dõi hiệu suất công việc của bạn</p>
        </div>
        <div className="month-picker">
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
            {MONTH_NAMES.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-bg)', color: 'var(--primary)' }}>
            <BarChart3 size={20} />
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Tổng công việc</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-green-bg)', color: 'var(--accent-green)' }}>
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-green)' }}>{stats.completed}</div>
          <div className="stat-label">Hoàn thành</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-blue-bg)', color: 'var(--accent-blue)' }}>
            <Clock size={20} />
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>{stats.inProgress}</div>
          <div className="stat-label">Đang làm</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F1F5F9', color: '#64748B' }}>
            <AlertCircle size={20} />
          </div>
          <div className="stat-value" style={{ color: '#64748B' }}>{stats.notStarted}</div>
          <div className="stat-label">Chưa bắt đầu</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-yellow-bg)', color: 'var(--accent-yellow)' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-yellow)' }}>{stats.avgProgress}%</div>
          <div className="stat-label">Tiến độ TB</div>
        </div>
      </div>

      {/* Category Table */}
      {categoryStats.length > 0 && (
        <div className="card section-card">
          <h2 className="section-title">📋 Thống kê theo hạng mục</h2>
          <div className="category-table-wrapper">
            <table className="category-table">
              <thead>
                <tr>
                  <th>Hạng mục</th>
                  <th>Tổng</th>
                  <th>Hoàn thành</th>
                  <th>Tiến độ TB</th>
                  <th style={{ width: '30%' }}>Thanh tiến độ</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <span className="cat-name-cell">
                        <span className="category-dot" style={{ background: cat.color }} />
                        {cat.name}
                      </span>
                    </td>
                    <td><strong>{cat.total}</strong></td>
                    <td><strong style={{ color: 'var(--accent-green)' }}>{cat.completed}</strong></td>
                    <td><strong>{cat.avgProgress}%</strong></td>
                    <td>
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${cat.avgProgress}%`, background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Incomplete Tasks */}
      <div className="card section-card" style={{ marginTop: 20 }}>
        <h2 className="section-title">⏳ Công việc chưa hoàn thành</h2>
        {incompleteTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎉</div>
            <div className="empty-state-text">Tuyệt vời! Không có việc chưa hoàn thành trong tháng này.</div>
          </div>
        ) : (
          <div className="incomplete-list">
            {incompleteTasks.map((task) => {
              const cat = categories.find((c) => c.id === task.categoryId);
              return (
                <div key={task.id} className="incomplete-item">
                  <div className="incomplete-color" style={{ background: task.color }} />
                  <div className="incomplete-info">
                    <div className="incomplete-title">{task.title}</div>
                    <div className="incomplete-meta">
                      {cat && <span className="tag" style={{ background: `${cat.color}18`, color: cat.color }}>{cat.name}</span>}
                      <span className="incomplete-date">{formatShortDate(task.date)}</span>
                    </div>
                  </div>
                  <div className="incomplete-right">
                    <span className={`status-badge status-${task.status}`}>
                      <span className="dot" />
                      {getStatusLabel(task.status)}
                    </span>
                    <div className="progress-bar" style={{ width: 80 }}>
                      <div className="progress-bar-fill" style={{ width: `${task.progress}%` }} />
                    </div>
                    <span className="incomplete-pct">{task.progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
