// src/components/InformationComponent/SidebarMenu/SidebarMenu.jsx

import React from 'react';
import { FaEdit, FaListAlt, FaBell, FaInfoCircle, FaSignOutAlt, FaCoins } from 'react-icons/fa';
import styles from './SidebarMenu.module.scss';

const SidebarMenu = ({ user, activeTab, onMenuClick ,onAvatarClick}) => {
    const fullName = user?.fullName || 'Thư Trần Anh';
    const coinBalance = user?.coinBalance || 0;
    const avatar = user?.avatar || "https://th.bing.com/th/id/OIP.KMh7jiRqiGInQryreHc-UwHaHa?w=180&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";
    
    const menuItems = [
        { id: 'profile', label: 'Hồ sơ cá nhân', icon: FaEdit },
        { id: 'transaction', label: 'Danh sách giao dịch', icon: FaListAlt },
        { id: 'notifications', label: 'Thông báo', icon: FaBell },
        { id: 'favorites', label: 'Tour yêu thích', icon: FaInfoCircle },
    ];
    
    return (
        <div className={styles.sidebar}>
            {/* User Profile Section */}
            <div className={styles.profileSection}>
                <div className={styles.avatar} onClick={onAvatarClick}> 
                    <img src={avatar} alt={fullName} className={styles.avatarImage} />
                </div>
                <div className={styles.userInfo}>
                    <h3 className={styles.userName}>{fullName}</h3>
                    
                </div>
                <div className={styles.memberBadge}>
                    Bạn là thành viên Future Travel
                </div>
            </div>
            
            {/* Menu Items */}
            <ul className={styles.menuList}>
                <li className={`${styles.menuItem} ${styles.coinDisplay}`}>
                    <FaCoins className={styles.menuIcon} />
                    <span>{coinBalance.toLocaleString('vi-VN')} Điểm</span>
                </li>
                
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                        <li
                            key={item.id}
                            className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                            onClick={() => onMenuClick(item.id)}
                        >
                            <Icon className={styles.menuIcon} />
                            <span>{item.label}</span>
                        </li>
                    );
                })}
                
                <li className={styles.menuItem}>
                    <FaSignOutAlt className={styles.menuIcon} />
                    <span>Đăng xuất</span>
                </li>
            </ul>
        </div>
    );
};

export default SidebarMenu;

