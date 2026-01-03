import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  MessageCircle,
  Heart,
  MoreVertical,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import styles from './UserPostsManagement.module.scss';

const UserPostsManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  });

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockData = [
        {
          postId: 1,
          title: 'Khám phá 10 địa điểm du lịch đẹp nhất Việt Nam 2024',
          summary: 'Cùng điểm qua những địa điểm du lịch không thể bỏ qua trong năm nay',
          status: 'PUBLISHED',
          thumbnailUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
          category: { categoryName: 'Du lịch', color: '#3b82f6' },
          viewCount: 1234,
          likeCount: 89,
          commentCount: 45,
          publishedAt: '2024-01-15T10:30:00',
          createdAt: '2024-01-14T08:00:00'
        },
        {
          postId: 2,
          title: 'Hướng dẫn chi tiết cách đặt vé máy bay giá rẻ',
          summary: 'Chia sẻ kinh nghiệm săn vé máy bay tiết kiệm nhất',
          status: 'PUBLISHED',
          thumbnailUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
          category: { categoryName: 'Kinh nghiệm', color: '#10b981' },
          viewCount: 856,
          likeCount: 67,
          commentCount: 23,
          publishedAt: '2024-01-10T14:20:00',
          createdAt: '2024-01-09T16:30:00'
        },
        {
          postId: 3,
          title: 'Review khách sạn 5 sao tại Đà Nẵng',
          summary: 'Trải nghiệm nghỉ dưỡng sang trọng bên bờ biển',
          status: 'DRAFT',
          thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          category: { categoryName: 'Review', color: '#f59e0b' },
          viewCount: 0,
          likeCount: 0,
          commentCount: 0,
          publishedAt: null,
          createdAt: '2024-01-20T09:00:00'
        }
      ];

      setPosts(mockData);
      
      const published = mockData.filter(p => p.status === 'PUBLISHED').length;
      const draft = mockData.filter(p => p.status === 'DRAFT').length;
      const totalViews = mockData.reduce((sum, p) => sum + p.viewCount, 0);
      const totalLikes = mockData.reduce((sum, p) => sum + p.likeCount, 0);
      const totalComments = mockData.reduce((sum, p) => sum + p.commentCount, 0);

      setStats({
        total: mockData.length,
        published,
        draft,
        totalViews,
        totalLikes,
        totalComments
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      setPosts(posts.filter(p => p.postId !== postId));
      setShowDeleteModal(false);
      alert('Xóa bài viết thành công!');
    } catch (error) {
      alert('Không thể xóa bài viết');
    }
  };

  const handleToggleStatus = async (postId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      setPosts(posts.map(p => 
        p.postId === postId ? { ...p, status: newStatus } : p
      ));
    } catch (error) {
      alert('Không thể thay đổi trạng thái');
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        post.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || post.status.toLowerCase() === filterStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xuất bản';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Sub-components được định nghĩa bên trong để dùng styles module
  const StatCard = ({ icon: Icon, label, value, bgClass }) => (
    <div className={`${styles.statCard} ${bgClass}`}>
      <div className={styles.statContent}>
        <div>
          <p className={styles.label}>{label}</p>
          <p className={styles.value}>{value.toLocaleString()}</p>
        </div>
        <div className={`${styles.iconWrapper} ${bgClass}`}>
          <Icon />
        </div>
      </div>
    </div>
  );

  const PostCard = ({ post }) => (
    <div className={styles.postCard}>
      <div className={styles.cardBody}>
        {/* Thumbnail */}
        <div className={styles.thumbnail}>
          {post.thumbnailUrl ? (
            <img 
              src={post.thumbnailUrl} 
              alt={post.title}
            />
          ) : (
            <div className={styles.placeholder}>
              <ImageIcon />
            </div>
          )}
          <span className={`${styles.statusBadge} ${post.status === 'PUBLISHED' ? styles.published : styles.draft}`}>
            {post.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Nháp'}
          </span>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.headerRow}>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <button 
              className={styles.menuBtn}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreVertical size={20} className="text-gray-400" />
            </button>
          </div>

          <p className={styles.summary}>{post.summary}</p>

          <div className={styles.metaInfo}>
            <span 
              className={styles.categoryBadge}
              style={{ 
                backgroundColor: `${post.category.color}15`,
                color: post.category.color 
              }}
            >
              {post.category.categoryName}
            </span>
            <span className={styles.date}>
              <Calendar size={12} />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <span><Eye size={16} /> {post.viewCount}</span>
            <span><Heart size={16} /> {post.likeCount}</span>
            <span><MessageCircle size={16} /> {post.commentCount}</span>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button 
              className={styles.btnView}
              onClick={() => window.open(`/forum/posts/${post.postId}`, '_blank')}
            >
              <Eye size={16} /> Xem
            </button>
            <button 
              className={styles.btnEdit}
              onClick={() => window.location.href = `/forum/posts/${post.postId}/edit`}
            >
              <Edit2 size={16} /> Sửa
            </button>
            <button 
              className={styles.btnToggle}
              onClick={() => handleToggleStatus(post.postId, post.status)}
            >
              {post.status === 'PUBLISHED' ? (
                <><EyeOff size={16} /> Ẩn</>
              ) : (
                <><Eye size={16} /> Xuất bản</>
              )}
            </button>
            <button 
              className={styles.btnDelete}
              onClick={() => {
                setSelectedPost(post);
                setShowDeleteModal(true);
              }}
            >
              <Trash2 size={16} /> Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1>Quản lý bài viết</h1>
              <p>Quản lý và theo dõi các bài viết của bạn</p>
            </div>
            <button 
              className={styles.createBtn}
              onClick={() => window.location.href = '/forum/posts/create'}
            >
              <Plus size={20} />
              Tạo bài viết mới
            </button>
          </div>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <StatCard icon={FileText} label="Tổng bài viết" value={stats.total} bgClass="bg-blue-500" />
            <StatCard icon={Eye} label="Đã xuất bản" value={stats.published} bgClass="bg-green-500" />
            <StatCard icon={EyeOff} label="Bản nháp" value={stats.draft} bgClass="bg-yellow-500" />
            <StatCard icon={TrendingUp} label="Lượt xem" value={stats.totalViews} bgClass="bg-purple-500" />
            <StatCard icon={Heart} label="Lượt thích" value={stats.totalLikes} bgClass="bg-red-500" />
            <StatCard icon={MessageCircle} label="Bình luận" value={stats.totalComments} bgClass="bg-indigo-500" />
          </div>

          {/* Search and Filter */}
          <div className={styles.filterBar}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className={styles.filterWrapper}>
              <Filter className={styles.filterIcon} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText className={styles.emptyIcon} />
            <h3>Chưa có bài viết nào</h3>
            <p>
              {searchTerm || filterStatus !== 'all' 
                ? 'Không tìm thấy bài viết phù hợp với bộ lọc của bạn'
                : 'Bắt đầu tạo bài viết đầu tiên của bạn ngay hôm nay!'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button 
                className={styles.createBtn}
                style={{ margin: '0 auto' }}
                onClick={() => window.location.href = '/forum/posts/create'}
              >
                <Plus size={20} />
                Tạo bài viết đầu tiên
              </button>
            )}
          </div>
        ) : (
          <div className={styles.postList}>
            {filteredPosts.map(post => (
              <PostCard key={post.postId} post={post} />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalIcon}>
                <Trash2 size={24} />
              </div>
              <h3>Xác nhận xóa bài viết</h3>
              <p>
                Bạn có chắc chắn muốn xóa bài viết "<strong>{selectedPost?.title}</strong>"? 
                Hành động này không thể hoàn tác.
              </p>
              <div className={styles.modalActions}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={styles.btnCancel}
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDeletePost(selectedPost.postId)}
                  className={styles.btnConfirm}
                >
                  Xóa bài viết
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPostsManagement;