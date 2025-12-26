import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  Pin,
  Sparkles,
  Share2
} from 'lucide-react';
import Avatar from '../../shared/Avatar/Avatar';
import Badge from '../../shared/Badge/Badge';
import styles from './PostCard.module.scss';

const PostCard = ({ 
  post, 
  onClick,
  showCategory = true,
  showTags = true,
  showStats = true
}) => {
  const {
    postID,
    title,
    summary,
    thumbnailUrl,
    authorName,
    authorAvatar,
    categoryName,
    viewCount,
    likeCount,
    commentCount,
    bookmarkCount,
    createdAt,
    isPinned,
    isFeatured,
    postTags = [],

  } = post;

  // if (status !== 'PUBLISHED') return null;

  return (
    <article className={styles.postCard} onClick={() => onClick(post)}>
      {/* Header: Author + Badges */}
      <div className={styles.postHeader}>
        <div className={styles.postAuthor}>
          <Avatar 
            src={authorAvatar} 
            size="md" 
            alt={authorName}
          />
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>
              {authorName}
            </span>
            <span className={styles.postDate}>
              {formatDistanceToNow(new Date(createdAt), { 
                addSuffix: true,
                locale: vi 
              })}
            </span>
          </div>
        </div>

        <div className={styles.postBadges}>
          {isPinned && <Badge icon={<Pin size={14} />} type="primary" label="Ghim" size="sm" />}
          {isFeatured && <Badge icon={<Sparkles size={14} />} type="warning" label="Nổi bật" size="sm" />}
          {showCategory && categoryName && (
            <Badge type="info" label={categoryName} size="sm" />
          )}
        </div>
      </div>

      {/* Body: Content + Thumbnail */}
      <div className={styles.postBody}>
        <div className={styles.postContent}>
          <h3 className={styles.postTitle}>{title}</h3>
          
          {summary && (
            <p className={styles.postSummary}>{summary}</p>
          )}

          {showTags && postTags.length > 0 && (
            <div className={styles.postTags}>
              {postTags.slice(0, 4).map(({ tag }) => (
                <span key={tag.tagID} className={styles.tag}>
                  #{tag.tagName}
                </span>
              ))}
              {postTags.length > 4 && (
                <span className={styles.moreTags}>+{postTags.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {thumbnailUrl && (
          <div className={styles.postThumbnail}>
            <img 
              src={thumbnailUrl} 
              alt={title}
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Footer: Stats + Actions */}
      {showStats && (
        <div className={styles.postFooter}>
          <div className={styles.postStats}>
            <div className={styles.statItem}>
              <Eye size={18} className={styles.statIcon} />
              <span className={styles.statCount}>{viewCount}</span>
            </div>
            <div className={styles.statItem}>
              <Heart size={18} className={styles.statIcon} />
              <span className={styles.statCount}>{likeCount}</span>
            </div>
            <div className={styles.statItem}>
              <MessageCircle size={18} className={styles.statIcon} />
              <span className={styles.statCount}>{commentCount}</span>
            </div>
            <div className={styles.statItem}>
              <Bookmark size={18} className={styles.statIcon} />
              <span className={styles.statCount}>{bookmarkCount}</span>
            </div>
          </div>

          <div className={styles.postActions}>
            <button className={styles.actionButton} onClick={(e) => { e.stopPropagation();}}>
              <Heart size={16} /> Thích
            </button>
            <button className={styles.actionButton} onClick={(e) => { e.stopPropagation();}}>
              <Bookmark size={16} /> Lưu
            </button>
            <button className={styles.actionButton} onClick={(e) => { e.stopPropagation();}}>
              <Share2 size={16} /> Chia sẻ
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;