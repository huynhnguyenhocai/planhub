import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Filter } from 'lucide-react';
import { getTasks, saveTask, deleteTask, getCategories } from '../../data/storage';
import { getWeekDates, formatWeekRange, formatDateKey } from '../../utils/dateUtils';
import { TIME_SLOTS, TASK_COLORS } from '../../data/constants';
import { DAY_NAMES } from '../../data/constants';
import { isToday } from '../../utils/dateUtils';
import TaskForm from './TaskForm';
import Modal from '../common/Modal';
import './CalendarPage.css';

export default function CalendarPage() {
  const [baseDate, setBaseDate] = useState(new Date());
  const [tasks, setTasks] = useState(getTasks());
  const [categories] = useState(getCategories());
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [presetSlot, setPresetSlot] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterColor, setFilterColor] = useState('all');

  const weekDates = getWeekDates(baseDate);

  const navigateWeek = useCallback((dir) => {
    setBaseDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + dir * 7);
      return d;
    });
  }, []);

  const goToday = useCallback(() => setBaseDate(new Date()), []);

  const filteredTasks = tasks.filter((t) => {
    if (filterCategory !== 'all' && t.categoryId !== filterCategory) return false;
    if (filterColor !== 'all' && t.color !== filterColor) return false;
    return true;
  });

  function getTasksForSlot(date, slotId) {
    const dateKey = formatDateKey(date);
    return filteredTasks.filter((t) => t.date === dateKey && t.timeSlot === slotId);
  }

  function handleAddClick(date, slotId) {
    setPresetSlot({ date: formatDateKey(date), timeSlot: slotId });
    setEditingTask(null);
    setShowForm(true);
  }

  function handleEditClick(task) {
    setEditingTask(task);
    setPresetSlot(null);
    setShowForm(true);
  }

  function handleSave(task) {
    const updated = saveTask(task);
    setTasks(updated);
    setShowForm(false);
    setEditingTask(null);
  }

  function handleDelete(id) {
    const updated = deleteTask(id);
    setTasks(updated);
    setShowForm(false);
    setEditingTask(null);
  }

  return (
    <div className="calendar-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">📅 Lịch công việc</h1>
          <p className="page-subtitle">{formatWeekRange(weekDates)}</p>
        </div>
        <div className="calendar-controls">
          <div className="week-nav">
            <button className="btn btn-ghost btn-icon" onClick={() => navigateWeek(-1)} title="Tuần trước">
              <ChevronLeft size={20} />
            </button>
            <button className="btn btn-secondary btn-sm" onClick={goToday}>
              <CalendarDays size={16} />
              Hôm nay
            </button>
            <button className="btn btn-ghost btn-icon" onClick={() => navigateWeek(1)} title="Tuần sau">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="filter-group">
            <Filter size={16} className="filter-icon" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả hạng mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả màu</option>
              {TASK_COLORS.map((c) => (
                <option key={c} value={c} style={{ color: c }}>● {c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="week-grid">
        {weekDates.map((date, dayIdx) => (
          <div key={dayIdx} className={`day-column ${isToday(date) ? 'today' : ''}`}>
            <div className="day-header">
              <span className="day-name">{DAY_NAMES[dayIdx]}</span>
              <span className={`day-number ${isToday(date) ? 'today-number' : ''}`}>
                {date.getDate()}
              </span>
            </div>
            <div className="day-slots">
              {TIME_SLOTS.map((slot) => {
                const slotTasks = getTasksForSlot(date, slot.id);
                return (
                  <div key={slot.id} className="time-slot">
                    <div className="slot-label">
                      <span>{slot.icon} {slot.label}</span>
                    </div>
                    <div className="slot-tasks">
                      {slotTasks.map((task) => {
                        const cat = categories.find((c) => c.id === task.categoryId);
                        return (
                          <div
                            key={task.id}
                            className={`task-card task-status-${task.status}`}
                            onClick={() => handleEditClick(task)}
                          >
                            <div className="task-color-bar" style={{ background: task.color }} />
                            <div className="task-card-body">
                              <div className="task-title">{task.title}</div>
                              {cat && (
                                <span className="task-category-dot" style={{ background: cat.color }} title={cat.name} />
                              )}
                              <div className="task-progress-mini">
                                <div className="task-progress-fill" style={{ width: `${task.progress}%`, background: task.color }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button className="add-task-btn" onClick={() => handleAddClick(date, slot.id)}>
                      + Thêm
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Task Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingTask(null); }}
        title={editingTask ? 'Sửa công việc' : 'Thêm công việc mới'}
      >
        <TaskForm
          task={editingTask}
          preset={presetSlot}
          categories={categories}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={() => { setShowForm(false); setEditingTask(null); }}
        />
      </Modal>
    </div>
  );
}
