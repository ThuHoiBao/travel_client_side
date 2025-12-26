import React, { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import axios from '../../../utils/axiosCustomize';
import styles from './CreatePost.module.scss';

const CreatePost = ({ isOpen, onClose, categories = [], onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTags, setLoadingTags] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchTags();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategoryId('');
    setSelectedTags([]);
    setTagInput('');
  };

  const fetchTags = async () => {
    setLoadingTags(true);
    try {
      const res = await axios.get('/forum/tags/popular', { params: { limit: 50 } });
      setAvailableTags(res.data.data || []);
    } catch (err) {
      console.error('Lấy tag thất bại:', err);
      setAvailableTags([]);
    } finally {
      setLoadingTags(false);
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = tagInput.trim();
      if (value && !selectedTags.includes(value) && selectedTags.length < 10) {
        setSelectedTags([...selectedTags, value]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const toggleExistingTag = (tagName) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName));
    } else if (selectedTags.length < 10) {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !categoryId) {
      alert('Vui lòng nhập đầy đủ tiêu đề, nội dung và chọn danh mục');
      return;
    }

    const plainText = content.replace(/<[^>]*>/g, '').trim();
    const summary = plainText.length > 200 
      ? plainText.substring(0, 197) + '...'
      : plainText;

    const payload = {
      title: title.trim(),
      content: content,
      summary: summary,
      categoryId: Number(categoryId),
      postType: 'BLOG',
      tagNames: selectedTags 
    };

    setLoading(true);
    try {
      await axios.post('/forum/posts', payload);
      onSuccess?.();
      resetForm();
      onClose();
    } catch (err) {
      console.error('Tạo bài thất bại:', err);
      alert('Tạo bài viết thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isFormValid = title.trim() && content.trim() && categoryId;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header với gradient */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.iconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2>Tạo bài viết mới</h2>
              <p>Chia sẻ trải nghiệm và câu chuyện du lịch của bạn</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Tiêu đề & Danh mục - 2 cột */}
          <div className={styles.topRow}>
            <div className={styles.formGroup}>
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7H20M4 12H20M4 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Tiêu đề bài viết
              </label>
              <input
                type="text"
                placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={styles.titleInput}
                maxLength={200}
              />
              <span className={styles.charCount}>{title.length}/200</span>
            </div>

            <div className={styles.formGroup}>
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7M3 7L12 2L21 7M3 7L12 12M21 7L12 12M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Danh mục
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className={styles.select}
              >
                <option value="">Chọn danh mục phù hợp</option>
                {categories.map(cat => (
                  <option key={cat.categoryID} value={cat.categoryID}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tag section - redesigned */}
          <div className={styles.tagSection}>
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 7H7.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Thẻ tag <span className={styles.tagLimit}>({selectedTags.length}/10)</span>
            </label>
            
            <div className={styles.tagInputArea}>
              <input
                type="text"
                placeholder="Nhập tag mới và nhấn Enter hoặc dấu phẩy..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className={styles.tagInput}
                disabled={selectedTags.length >= 10}
              />
              
              {/* Selected tags với animation */}
              {selectedTags.length > 0 && (
                <div className={styles.selectedTags}>
                  {selectedTags.map((tag, index) => (
                    <span key={tag} className={styles.tagPill} style={{ animationDelay: `${index * 0.05}s` }}>
                      <span className={styles.tagText}>{tag}</span>
                      <button onClick={() => removeTag(tag)} className={styles.tagRemove}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tag suggestions với loading state */}
            <div className={styles.tagSuggestions}>
              <p className={styles.suggestionTitle}>
                {loadingTags ? (
                  <>
                    <span className={styles.loader}></span>
                    Đang tải tag phổ biến...
                  </>
                ) : (
                  '🔥 Tag phổ biến'
                )}
              </p>
              {!loadingTags && availableTags.length > 0 && (
                <div className={styles.tagGrid}>
                  {availableTags.slice(0, 12).map(tag => (
                    <button
                      key={tag.tagID}
                      className={`${styles.tagSuggestion} ${selectedTags.includes(tag.tagName) ? styles.selected : ''}`}
                      onClick={() => toggleExistingTag(tag.tagName)}
                      disabled={selectedTags.length >= 10 && !selectedTags.includes(tag.tagName)}
                    >
                      <span className={styles.tagIcon}>#</span>
                      {tag.tagName}
                      {selectedTags.includes(tag.tagName) && (
                        <svg className={styles.checkIcon} width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nội dung editor */}
          <div className={styles.formGroup}>
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Nội dung bài viết
            </label>
            <div className={styles.editorWrapper}>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Bắt đầu viết câu chuyện của bạn... Nhấn vào nút Image để chèn ảnh"
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className={styles.footer}>
          <div className={styles.footerInfo}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Bài viết của bạn sẽ được xem xét trước khi xuất bản</span>
          </div>
          <div className={styles.footerActions}>
            <button onClick={onClose} disabled={loading} className={styles.cancelBtn}>
              Hủy bỏ
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
              className={`${styles.submitBtn} ${isFormValid ? styles.active : ''}`}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Đang đăng...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Đăng bài viết
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;