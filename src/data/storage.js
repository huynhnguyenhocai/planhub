/**
 * localStorage abstraction layer for PlanHub
 * Designed to be easily swapped with Firebase/Supabase later
 */

const KEYS = {
  tasks: 'planhub_tasks',
  ideas: 'planhub_ideas',
  categories: 'planhub_categories',
  settings: 'planhub_settings',
  initialized: 'planhub_initialized',
};

function getItem(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error(`Error reading ${key}:`, e);
    return null;
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key}:`, e);
  }
}

// ─── Tasks ────────────────────────────────────────────

export function getTasks() {
  return getItem(KEYS.tasks) || [];
}

export function saveTask(task) {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === task.id);
  if (index >= 0) {
    tasks[index] = { ...tasks[index], ...task };
  } else {
    tasks.push(task);
  }
  setItem(KEYS.tasks, tasks);
  return tasks;
}

export function deleteTask(id) {
  const tasks = getTasks().filter((t) => t.id !== id);
  setItem(KEYS.tasks, tasks);
  return tasks;
}

export function updateTaskStatus(id, status) {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.status = status;
    if (status === 'completed') task.progress = 100;
    setItem(KEYS.tasks, tasks);
  }
  return tasks;
}

export function dismissTask(id) {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.dismissed = true;
    setItem(KEYS.tasks, tasks);
  }
  return tasks;
}

// ─── Ideas ────────────────────────────────────────────

export function getIdeas() {
  return getItem(KEYS.ideas) || [];
}

export function saveIdea(idea) {
  const ideas = getIdeas();
  const index = ideas.findIndex((i) => i.id === idea.id);
  if (index >= 0) {
    ideas[index] = { ...ideas[index], ...idea };
  } else {
    ideas.push(idea);
  }
  setItem(KEYS.ideas, ideas);
  return ideas;
}

export function deleteIdea(id) {
  const ideas = getIdeas().filter((i) => i.id !== id);
  setItem(KEYS.ideas, ideas);
  return ideas;
}

// ─── Categories ───────────────────────────────────────

export function getCategories() {
  return getItem(KEYS.categories) || [];
}

export function saveCategory(category) {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === category.id);
  if (index >= 0) {
    categories[index] = { ...categories[index], ...category };
  } else {
    categories.push(category);
  }
  setItem(KEYS.categories, categories);
  return categories;
}

export function deleteCategory(id) {
  const categories = getCategories().filter((c) => c.id !== id);
  setItem(KEYS.categories, categories);
  return categories;
}

// ─── Settings ─────────────────────────────────────────

export function getSettings() {
  return getItem(KEYS.settings) || { theme: 'light', sidebarCollapsed: false };
}

export function saveSettings(settings) {
  setItem(KEYS.settings, settings);
  return settings;
}

// ─── Init ─────────────────────────────────────────────

export function isInitialized() {
  return getItem(KEYS.initialized) === true;
}

export function markInitialized() {
  setItem(KEYS.initialized, true);
}

export function initializeData(sampleData) {
  if (isInitialized()) return;
  setItem(KEYS.categories, sampleData.categories);
  setItem(KEYS.tasks, sampleData.tasks);
  setItem(KEYS.ideas, sampleData.ideas);
  setItem(KEYS.settings, sampleData.settings);
  markInitialized();
}

// ─── Export all as single object (for easy future swap) ─

const StorageService = {
  getTasks,
  saveTask,
  deleteTask,
  updateTaskStatus,
  dismissTask,
  getIdeas,
  saveIdea,
  deleteIdea,
  getCategories,
  saveCategory,
  deleteCategory,
  getSettings,
  saveSettings,
  isInitialized,
  initializeData,
};

export default StorageService;
