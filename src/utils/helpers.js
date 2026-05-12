/**
 * Misc helper functions for PlanHub
 */

/**
 * Generate a unique ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get status label in Vietnamese
 */
export function getStatusLabel(status) {
  const labels = {
    not_started: 'Chưa bắt đầu',
    in_progress: 'Đang làm',
    completed: 'Hoàn thành',
  };
  return labels[status] || status;
}

/**
 * Get status color
 */
export function getStatusColor(status) {
  const colors = {
    not_started: '#94A3B8',
    in_progress: '#3B82F6',
    completed: '#10B981',
  };
  return colors[status] || '#94A3B8';
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str, maxLen = 50) {
  if (!str) return '';
  return str.length > maxLen ? str.substring(0, maxLen) + '...' : str;
}

/**
 * Debounce function
 */
export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
