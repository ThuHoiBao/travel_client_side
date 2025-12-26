import React from 'react';
import Badge from '../../shared/Badge/Badge';
import { 
  BookOpen, 
  MessageSquare, 
  Lightbulb, 
  MapPin, 
  Utensils,
  FolderOpen 
} from 'lucide-react';
import styles from './CategorySidebar.module.scss';

const CategorySidebar = ({ 
  categories = [], 
  selectedCategory,
  onSelectCategory 
}) => {
  const handleCategoryClick = (categoryId) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId === selectedCategory ? null : categoryId);
    }
  };

  const totalPosts = categories.reduce((sum, cat) => sum + (cat.postCount || 0), 0);

  // Map tên icon (string) → component Lucide
  const iconMap = {
    BookOpen: <BookOpen size={20} />,
    MessageSquare: <MessageSquare size={20} />,
    Lightbulb: <Lightbulb size={20} />,
    MapPin: <MapPin size={20} />,
    Utensils: <Utensils size={20} />
  };

  return (
    <div className={styles.categorySidebar}>
      <div className={styles.sidebarHeader}>
        <h3 className={styles.sidebarTitle}>DANH MỤC</h3>
        <span className={styles.sidebarCount}>{categories.length} danh mục</span>
      </div>
      
      <div className={styles.categoryList}>
        {/* Mục "Tất cả bài viết" */}
        <div 
          className={`${styles.categoryItem} ${!selectedCategory ? styles.active : ''}`}
          onClick={() => handleCategoryClick(null)}
        >
          <div className={styles.categoryInfo}>
            <span className={styles.categoryIcon}>
              <FolderOpen size={20} />
            </span>
            <span className={styles.categoryName}>Tất cả bài viết</span>
          </div>
          <Badge label={totalPosts} type="secondary" size="sm" />
        </div>
        
        {/* Các danh mục khác */}
        {categories.map(category => (
          <div
            key={category.categoryID}
            className={`${styles.categoryItem} ${
              selectedCategory === category.categoryID ? styles.active : ''
            }`}
            onClick={() => handleCategoryClick(category.categoryID)}
          >
            <div className={styles.categoryInfo}>
              <span className={styles.categoryIcon}>
                {iconMap[category.icon] || <BookOpen size={20} />} {/* fallback nếu icon không tồn tại */}
              </span>
              <span className={styles.categoryName}>
                {category.categoryName}
              </span>
            </div>
            <Badge 
              label={category.postCount || 0} 
              type={selectedCategory === category.categoryID ? 'primary' : 'secondary'}
              size="sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;