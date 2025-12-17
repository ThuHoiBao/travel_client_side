import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    FaTachometerAlt, FaBox, FaChartLine, FaCog, FaSignOutAlt, FaUsers, 
    FaTicketAlt, FaBell, FaCalendarCheck, FaTags , FaMapMarkerAlt, FaBuilding , FaPlaneDeparture
} from 'react-icons/fa';
import styles from './AdminSidebar.module.scss';

const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
    { name: "Quản lý Departure", path: '/admin/departures', icon: FaPlaneDeparture },
    { name: 'Quản lý Tours', path: '/admin/tours', icon: FaBox }, 
    { name: 'Quản lý người dùng', path: '/admin/users', icon: FaUsers }, 
    { name: 'Quản lý Bookings', path: '/admin/bookings', icon: FaCalendarCheck },
    { name: 'Quản lý Giảm giá', path: '/admin/coupons', icon: FaTags }, 
    {name: 'Quản lý Locations', path: '/admin/locations', icon: FaMapMarkerAlt } ,
    {name: 'Quản lý Branches Policies', path: '/admin/branches-policies', icon: FaMapMarkerAlt } ,
    { name: 'Quản lý Thông báo', path: '/admin/notifications', icon: FaBell }, 
    { name: 'Analytics', path: '/admin/analytics', icon: FaChartLine },
];

const AdminSidebar = () => {
    const location = useLocation();

    // Hàm kiểm tra đường dẫn active (để highlight đúng mục)
    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <div className={styles.adminSidebar}>
            
            {/* ✨ LOGO SECTION (Giống DashStack) ✨ */}
            <div className={styles.logoSection}>
                <h2 className={styles.logo}>Future <span className={styles.logo1}>Travel</span></h2>
            </div>

            <nav>
                <ul className={styles.menuList}>
                    {navItems.map(item => (
                        <li 
                            key={item.path} 
                            // Sử dụng styles.menuItemActive cho phần tử được chọn
                            className={`${styles.menuItem} ${isActive(item.path) ? styles.menuItemActive : ''}`}
                        >
                            <Link to={item.path}>
                                <item.icon className={styles.menuIcon} />
                                <span className={styles.menuLabel}>{item.name}</span>
                            </Link>
                            {/* ✨ LINE ĐỨNG XANH BÊN TRÁI ✨ */}
                            {isActive(item.path) && <div className={styles.activeLine} />}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className={styles.footerSection}>
                <hr className={styles.divider} />
                <ul className={styles.menuList}>
                    <li className={styles.menuItem}>
                        <Link to="/admin/settings">
                            <FaCog className={styles.menuIcon} />
                            <span className={styles.menuLabel}>Settings</span>
                        </Link>
                    </li>
                    <li className={`${styles.menuItem} ${styles.logout}`}>
                        <Link to="/logout">
                            <FaSignOutAlt className={styles.menuIcon} />
                            <span className={styles.menuLabel}>Logout</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminSidebar;