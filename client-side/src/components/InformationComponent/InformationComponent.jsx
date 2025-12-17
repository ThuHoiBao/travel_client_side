import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import SidebarMenu from './SidebarMenu/SidebarMenu';
import PersonalProfile from './PersonalProfile/PersonalProfile';
import TransactionList from './TransactionList/TransactionList';
import FavoriteTours from './FavoriteTours/FavoriteTours';
import styles from './InformationComponent.module.scss';
import AvatarUploadModal from './AvatarUploadModal/AvatarUploadModal';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiUser, FiHome, FiChevronRight } from 'react-icons/fi';

const InformationComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { tab } = useParams();
    const { user, updateUser, loading, isAuthenticated } = useAuth(); 
    
    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [loading, isAuthenticated, navigate]);
    
    // Xác định tab đang active
    const getActiveTab = () => {
        if (tab) return tab;
        const path = location.pathname;
        if (path.includes('/transaction')) return 'transaction';
        if (path.includes('/notifications')) return 'notifications';
        if (path.includes('/favorites')) return 'favorites';
        return 'profile';
    };
    
    const [activeTab, setActiveTab] = useState(getActiveTab());
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    
    // Lấy tên tab hiện tại để hiển thị
    const getTabTitle = () => {
        switch (activeTab) {
            case 'profile':
                return 'Hồ Sơ Cá Nhân';
            case 'transaction':
                return 'Danh Sách Giao Dịch';
            case 'favorites':
                return 'Tour Yêu Thích';
            default:
                return 'Thông Tin Tài Khoản';
        }
    };

    const getTabDescription = () => {
        switch (activeTab) {
            case 'profile':
                return 'Quản lý thông tin cá nhân';
            case 'transaction':
                return 'Theo dõi lịch sử giao dịch';
            case 'favorites':
                return 'Danh sách các tour du lịch yêu thích';
            default:
                return 'Quản lý tài khoản của bạn';
        }
    };
    
    // Callback khi cập nhật avatar thành công
    const handleAvatarUpdateSuccess = (updatedUserPlainObject) => {
        updateUser(updatedUserPlainObject);
    };
    
    // Cập nhật active tab khi URL thay đổi
    useEffect(() => {
        const newTab = getActiveTab();
        if (newTab !== activeTab) {
            setActiveTab(newTab);
        }
    }, [location.pathname, tab]);
    
    // Xử lý click menu
    const handleMenuClick = (tab) => {
        setActiveTab(tab);
        navigate(`/information/${tab}`);
    };
    
    // Render nội dung theo tab
    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <PersonalProfile />;
            case 'transaction':
                return <TransactionList user={user} />;
            case 'favorites':
                return <FavoriteTours user={user}/>;
            default:
                return <PersonalProfile />;
        }
    };
    
    // Loading state
    if (loading) {
        return (
            <div className={styles.informationWrapper}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Đang tải thông tin...</p>
                </div>
            </div>
        );
    }
    
    // Error state - không có user
    if (!user) {
        return (
            <div className={styles.informationWrapper}>
                <div className={styles.errorContainer}>
                    <p>Không tìm thấy thông tin người dùng</p>
                    <button onClick={() => navigate('/login')}>
                        Đăng nhập lại
                    </button>
                </div>
            </div>
        );
    }
    
    // Main render
    return (
        <div className={styles.informationWrapper}>
            {/* Page Header - Banner trên cùng */}
            <div className={styles.pageHeader}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerIcon}>
                            <FiUser />
                        </div>
                        <div className={styles.headerText}>
                            <h1>{getTabTitle()}</h1>
                            <p>{getTabDescription()}</p>
                        </div>
                    </div>

                    {/* Breadcrumb */}
                    <div className={styles.breadcrumb}>
                        <a href="/">
                            <FiHome /> Trang chủ
                        </a>
                        <FiChevronRight />
                        <span>Tài khoản</span>
                        <FiChevronRight />
                        <span>{getTabTitle()}</span>
                    </div>
                </div>
            </div>

            {/* Container chính */}
            <div className={styles.container}>
                {/* Sidebar - Cố định bên trái */}
                <div className={styles.sidebarWrapper}>
                    <SidebarMenu 
                        user={user}
                        activeTab={activeTab}
                        onMenuClick={handleMenuClick}
                        onAvatarClick={() => setIsAvatarModalOpen(true)}
                    />
                </div>
                
                {/* Content Area - Có thể cuộn */}
                <div className={styles.contentArea}>
                    {renderContent()}
                </div>
            </div>
            
            {/* Avatar Upload Modal */}
            {isAvatarModalOpen && user && (
                <AvatarUploadModal
                    user={user}
                    onClose={() => setIsAvatarModalOpen(false)}
                    onUpdateSuccess={handleAvatarUpdateSuccess}
                />
            )}
        </div>
    );
};

export default InformationComponent;