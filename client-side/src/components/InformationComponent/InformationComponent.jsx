// src/components/InformationComponent/InformationComponent.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import SidebarMenu from './SidebarMenu/SidebarMenu';
import PersonalProfile from './PersonalProfile/PersonalProfile';
import TransactionList from './TransactionList/TransactionList';
import Notifications from './Notifications/Notifications';
import FavoriteTours from './FavoriteTours/FavoriteTours';
import useUser from '../../hook/useUser.ts';
import styles from './InformationComponent.module.scss';
import AvatarUploadModal from './AvatarUploadModal/AvatarUploadModal'; // ✨ IMPORT MODAL ✨
import { UserRequestDTO } from '../../dto/requestDTO/UserRequestDTO.ts';
const InformationComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { tab } = useParams();
    const { user ,setUser} = useUser(4);
    const sidebarRef = useRef(null);
    const containerRef = useRef(null);
    
    // Lấy active tab từ URL params hoặc mặc định là 'profile'
    const getActiveTab = () => {
        if (tab) return tab;
        const path = location.pathname;
        if (path.includes('/transaction')) return 'transaction';
        if (path.includes('/notifications')) return 'notifications';
        if (path.includes('/favorites')) return 'favorites';
        return 'profile'; // Mặc định là Hồ sơ cá nhân
    };
    
    const [activeTab, setActiveTab] = useState(getActiveTab());
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    // Hàm cập nhật user state sau khi upload thành công
    const handleAvatarUpdateSuccess = (updatedUserPlainObject) => {
        setUser(updatedUserPlainObject);
    };
    // Cập nhật activeTab khi URL thay đổi
    useEffect(() => {
        const newTab = getActiveTab();
        if (newTab !== activeTab) {
            setActiveTab(newTab);
        }
    }, [location.pathname, tab]);
    
    // Logic để sidebar dừng lại khi đến footer
    useEffect(() => {
        const handleScroll = () => {
            if (!sidebarRef.current || !containerRef.current) return;
            
            const sidebar = sidebarRef.current;
            const footer = document.querySelector('footer');
            
            if (!footer) return;
            
            const sidebarRect = sidebar.getBoundingClientRect();
            const footerRect = footer.getBoundingClientRect();
            
            // Tính toán khi footer bắt đầu xuất hiện
            const footerTop = footerRect.top;
            const sidebarBottom = sidebarRect.bottom;
            const viewportHeight = window.innerHeight;
            
            // Nếu footer đã xuất hiện trong viewport và sidebar đang che footer
            if (footerTop < viewportHeight && sidebarBottom > footerTop) {
                // Tính toán offset để sidebar không che footer
                const offset = sidebarBottom - footerTop + 20; // 20px padding
                const newTop = Math.max(90 - offset, -(sidebarRect.height - viewportHeight + 90));
                sidebar.style.top = `${newTop}px`;
            } else {
                // Reset về vị trí sticky ban đầu
                sidebar.style.top = '90px';
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        handleScroll(); // Gọi ngay để set initial position
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);
    
    // Hàm xử lý khi click vào menu item
    const handleMenuClick = (tab) => {
        setActiveTab(tab);
        navigate(`/information/${tab}`);
    };
    
    // Render component con dựa trên activeTab
    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <PersonalProfile user={user} />;
            case 'transaction':
                return <TransactionList user={user} />;
            case 'notifications':
                return <Notifications user={user} />;
            case 'favorites':
                return <FavoriteTours user={user} />;
            default:
                return <PersonalProfile user={user} />;
        }
    };
    
    return (
        <div className={styles.informationWrapper}>
            <div className={styles.container} ref={containerRef}>
                {/* Sidebar Menu bên trái */}
                <div ref={sidebarRef}>
                    <SidebarMenu 
                        user={user}
                        activeTab={activeTab}
                        onMenuClick={handleMenuClick}
                        onAvatarClick={() => setIsAvatarModalOpen(true)}
                    />
                </div>
                
                {/* Content bên phải */}
                <div className={styles.contentArea}>
                    {renderContent()}
                </div>
            </div>
            {/* ✨ MODAL AVATAR ✨ */}
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

