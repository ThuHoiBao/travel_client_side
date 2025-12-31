import React from 'react';
import { LogIn, UserPlus, User, PenTool, MessageSquare, Heart, Trophy } from 'lucide-react';
import Avatar from '../../shared/Avatar/Avatar';
import Button from '../../shared/Button/Button';
import styles from './UserStats.module.scss';

const UserStats = ({ user = null, onCreatePostClick }) => {
  
  console.log('UserStats received user:', user); 
  if (!user) {
    return (
      <div className={styles.userStats}>
        <div className={styles.notLoggedIn}>
          <div className={styles.welcomeIcon}>
            <LogIn size={48} strokeWidth={1.5} />
          </div>
          <h3 className={styles.welcomeTitle}>Chào mừng bạn đến với cộng đồng!</h3>
          <p className={styles.welcomeText}>
            Đăng nhập để đăng bài, bình luận và kết nối với những người yêu du lịch
          </p>
        </div>
      </div>
    );
  }

  const stats = user.statistics || {};

  return (
    <div className={styles.userStats}>
      <div className={styles.userHeader}>
        <Avatar 
          src={user.avatar} 
          size="xl" 
          alt={user.fullName}
          shape="circle"
        />
        <div className={styles.userInfo}>
          <h3 className={styles.userName}>{user.fullName}</h3>
          <span className={styles.userRole}>
            <Trophy size={14} />
            Thành viên tích cực
          </span>
        </div>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <PenTool size={24} className={styles.statIcon} />
          <div className={styles.statValue}>{stats.totalPosts || 0}</div>
          <div className={styles.statLabel}>Bài viết</div>
        </div>
        <div className={styles.statItem}>
           <UserPlus size={24} className={styles.statIcon} />
          <div className={styles.statValue}>{stats.totalFollowers || 0}</div>
          <div className={styles.statLabel}>Theo dõi</div>
        </div>
        <div className={styles.statItem}>
          <Heart size={24} className={styles.statIcon} />
          <div className={styles.statValue}>{stats.totalLikesReceived || 0}</div>
          <div className={styles.statLabel}>Lượt thích</div>
        </div>
        <div className={styles.statItem}>
          <Trophy size={24} className={styles.statIcon} />
          <div className={styles.statValue}>{stats.reputationPoints || 0}</div>
          <div className={styles.statLabel}>Điểm uy tín</div>
        </div>
      </div>
      
      <div className={styles.userActions}>
        <Button
          variant="primary"
          size="md"
          fullWidth
          icon={<User size={18} />}
         onClick={onCreatePostClick}
        >
          Tạo bài viết
        </Button>
      </div>
    </div>
  );
};

export default UserStats;