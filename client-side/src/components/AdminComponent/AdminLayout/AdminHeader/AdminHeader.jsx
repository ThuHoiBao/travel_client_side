import React from 'react';
import { FaSearch, FaBell, FaGlobe, FaCaretDown } from 'react-icons/fa';
import styles from './AdminHeader.module.scss';

const AdminHeader = () => {
    const adminUser = {
        name: "Moni Roy", // Tên như trong ảnh
        role: "Admin",
        avatar: "https://placehold.co/35x35/D81B60/FFFFFF/png?text=MR" // Avatar placeholder
    };

    return (
        <header className={styles.adminHeader}>
            {/* Left Section: Thường dùng để căn chỉnh với Sidebar */}
            <div className={styles.leftSection}>
                {/* Icon menu cho mobile (hiện tại không dùng) */}
            </div>

            {/* Center Section: Thanh tìm kiếm */}
            <div className={styles.centerSection}>
                <div className={styles.searchBar}>
                    <FaSearch className={styles.searchIcon} />
                    <input type="text" placeholder="Search..." />
                </div>
            </div>

            {/* Right Section: Icons và Profile */}
            <div className={styles.rightSection}>
                
                {/* Notifications
                <div className={styles.iconButton}>
                    <FaBell />
                    <span className={styles.badge}>3</span>
                </div>
                 */}
                {/* Language (Sử dụng cờ và text như mẫu) */}
                <div className={styles.languageSelect}>
                    <i className="flag-icon flag-icon-gb"></i> {/* Giả định có thư viện icon cờ */}
                    <FaGlobe className={styles.languageIcon} /> 
                    <span>English</span>
                    <FaCaretDown className={styles.dropdownIcon} />
                </div>
                
                {/* Profile */}
                <div className={styles.profile}>
                    <img src={adminUser.avatar} alt="Admin Avatar" className={styles.avatar} />
                    <div className={styles.userText}>
                        <span className={styles.userName}>{adminUser.name}</span>
                        <span className={styles.userRole}>{adminUser.role}</span>
                    </div>
                    <FaCaretDown className={styles.dropdownIcon} />
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;