import React, { useState, useMemo } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { getIdeas, saveIdea, deleteIdea, getCategories } from '../../data/storage';
import { generateId } from '../../utils/helpers';
import Modal from '../common/Modal';
import IdeaForm from './IdeaForm';
import './IdeasPage.css';

export default function IdeasPage() {
  const [ideas, setIdeas] = useState(getIdeas());
  const [categories] = useState(getCategories());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set();
    ideas.forEach((idea) => {
      if (idea.tags) idea.tags.forEach((t) => tagSet.add(t));
    });
    return [...tagSet].sort();
  }, [ideas]);

  // Filter ideas
  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchSearch = !searchQuery ||
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (idea.note && idea.note.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchTag = filterTag === 'all' || (idea.tags && idea.tags.includes(filterTag));
      return matchSearch && matchTag;
    });
  }, [ideas, searchQuery, filterTag]);

  function handleSave(idea) {
    const updated = saveIdea(idea);
    setIdeas(updated);
    setShowForm(false);
    setEditingIdea(null);
  }

  function handleDelete(id) {
    const updated = deleteIdea(id);
    setIdeas(updated);
    setShowForm(false);
    setEditingIdea(null);
  }

  function openNewForm() {
    setEditingIdea(null);
    setShowForm(true);
  }

  function openEditForm(idea) {
    setEditingIdea(idea);
    setShowForm(true);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  // Generate gradient for cards without thumbnails
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  ];

  return (
    <div className="ideas-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">💡 Ý tưởng nhanh</h1>
          <p className="page-subtitle">Lưu lại những ý tưởng bất chợt</p>
        </div>
        <button className="btn btn-primary" onClick={openNewForm}>
          <Plus size={18} />
          Thêm ý tưởng
        </button>
      </div>

      {/* Search & Filter */}
      <div className="ideas-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm ý tưởng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>
        <div className="tag-filters">
          <button
            className={`tag-filter-btn ${filterTag === 'all' ? 'active' : ''}`}
            onClick={() => setFilterTag('all')}
          >
            Tất cả
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`tag-filter-btn ${filterTag === tag ? 'active' : ''}`}
              onClick={() => setFilterTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      {filteredIdeas.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💭</div>
          <div className="empty-state-text">
            {searchQuery || filterTag !== 'all'
              ? 'Không tìm thấy ý tưởng nào phù hợp.'
              : 'Chưa có ý tưởng nào. Hãy thêm ý tưởng đầu tiên!'}
          </div>
          {!searchQuery && filterTag === 'all' && (
            <button className="btn btn-primary" onClick={openNewForm}>
              <Plus size={18} /> Thêm ý tưởng
            </button>
          )}
        </div>
      ) : (
        <div className="ideas-grid">
          {filteredIdeas.map((idea, idx) => {
            const cat = categories.find((c) => c.id === idea.categoryId);
            return (
              <div
                key={idea.id}
                className="idea-card card-interactive"
                onClick={() => openEditForm(idea)}
              >
                <div
                  className="idea-thumbnail"
                  style={{
                    background: idea.thumbnail
                      ? `url(${idea.thumbnail}) center/cover`
                      : gradients[idx % gradients.length],
                  }}
                >
                  {!idea.thumbnail && (
                    <span className="idea-thumb-icon">💡</span>
                  )}
                </div>
                <div className="idea-card-body">
                  <h3 className="idea-title">{idea.title}</h3>
                  <p className="idea-note">{idea.note}</p>
                  <div className="idea-footer">
                    <span className="idea-date">{formatDate(idea.createdAt)}</span>
                    <div className="idea-tags">
                      {idea.tags && idea.tags.map((tag) => (
                        <span key={tag} className="tag tag-outline">{tag}</span>
                      ))}
                    </div>
                  </div>
                  {cat && (
                    <div className="idea-category">
                      <span className="category-dot" style={{ background: cat.color }} />
                      <span>{cat.name}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Idea Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingIdea(null); }}
        title={editingIdea ? 'Sửa ý tưởng' : 'Thêm ý tưởng mới'}
      >
        <IdeaForm
          idea={editingIdea}
          categories={categories}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={() => { setShowForm(false); setEditingIdea(null); }}
        />
      </Modal>
    </div>
  );
}
