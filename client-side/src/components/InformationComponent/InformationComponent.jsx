import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import SidebarMenu from './SidebarMenu/SidebarMenu';
import PersonalProfile from './PersonalProfile/PersonalProfile';
import TransactionList from './TransactionList/TransactionList';
import FavoriteTours from './FavoriteTours/FavoriteTours';
import styles from './InformationComponent.module.scss';
import AvatarUploadModal from './AvatarUploadModal/AvatarUploadModal';
import { useAuth } from '../../context/AuthContext.jsx';

const InformationComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { tab } = useParams();
    const { user, updateUser, loading, isAuthenticated } = useAuth(); 
    
    const sidebarRef = useRef(null);
    const containerRef = useRef(null);
    
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [loading, isAuthenticated, navigate]);
    
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
    
    const handleAvatarUpdateSuccess = (updatedUserPlainObject) => {
        updateUser(updatedUserPlainObject);
    };
    
    useEffect(() => {
        const newTab = getActiveTab();
        if (newTab !== activeTab) {
            setActiveTab(newTab);
        }
    }, [location.pathname, tab]);
    
    useEffect(() => {
        const handleScroll = () => {
            if (!sidebarRef.current || !containerRef.current) return;
            
            const sidebar = sidebarRef.current;
            const footer = document.querySelector('footer');
            
            if (!footer) return;
            
            const sidebarRect = sidebar.getBoundingClientRect();
            const footerRect = footer.getBoundingClientRect();
            
            const footerTop = footerRect.top;
            const sidebarBottom = sidebarRect.bottom;
            const viewportHeight = window.innerHeight;
            
            if (footerTop < viewportHeight && sidebarBottom > footerTop) {
                const offset = sidebarBottom - footerTop + 20;
                const newTop = Math.max(90 - offset, -(sidebarRect.height - viewportHeight + 90));
                sidebar.style.top = `${newTop}px`;
            } else {
                sidebar.style.top = '90px';
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        handleScroll();
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);
    
    const handleMenuClick = (tab) => {
        setActiveTab(tab);
        navigate(`/information/${tab}`);
    };
    
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
    
    return (
        <div className={styles.informationWrapper}>
            <div className={styles.container} ref={containerRef}>
                <div ref={sidebarRef}>
                    <SidebarMenu 
                        user={user}
                        activeTab={activeTab}
                        onMenuClick={handleMenuClick}
                        onAvatarClick={() => setIsAvatarModalOpen(true)}
                    />
                </div>
                
                <div className={styles.contentArea}>
                    {renderContent()}
                </div>
            </div>
            
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