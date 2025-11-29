// src/components/HeaderComponent/Header.jsx (ĐÃ CHỈNH SỬA)

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import styles from './Header.module.scss';
import { FaPhoneAlt, FaCoins, FaEdit, FaTicketAlt, FaListAlt, FaUndoAlt, FaBell, FaInfoCircle, FaGift, FaSignOutAlt } from 'react-icons/fa'; 
import { IoIosAirplane } from "react-icons/io"; 
import { GiShipBow } from "react-icons/gi";
import useUser from '../../hook/useUser.ts'; 

// --- Component Profile Modal (Dropdown) ---
const ProfileModal = ({ styles, onClose, user }) => {
    const navigate = useNavigate();
    const fullName = user?.fullName || 'Thư Trần Anh';
    const coinBalance = user?.coinBalance || 0;
    
    const handleMenuClick = (tab) => {
        onClose(); // Đóng modal
        navigate(`/information/${tab}`);
    };
    
    return (
        <div className={styles.profileModal}>
            <div className={styles.modalHeader}>
                <span className={styles.modalUsername}>{fullName}</span>
                <span className={styles.modalStatus}>
                    <FaCoins className={styles.coinIcon} /> {coinBalance} Điểm
                </span>
                <span className={styles.memberTier}>
                    Bạn là thành viên Future Travel
                </span>
            </div>
            <ul className={styles.modalMenu}>
                <li onClick={() => handleMenuClick('profile')}><FaEdit /> Hồ sơ cá nhân</li>
                {/* <li><FaTicketAlt /> Thẻ của tôi</li> */}
                <li onClick={() => handleMenuClick('transaction')}><FaListAlt /> Danh sách giao dịch</li>
                {/* <li><FaUndoAlt /> Đặt chỗ của tôi</li> */}
                {/* <li className={styles.highlightNew}><FaUndoAlt /> Hoàn tiền <span className={styles.newBadge}>NEW!</span></li> */}
                <li onClick={() => handleMenuClick('notifications')}><FaBell /> Thông báo </li>
                <li onClick={() => handleMenuClick('favorites')}><FaInfoCircle /> Tour yêu thích</li>
                {/* <li><FaGift /> Khuyến mãi</li> */}
                <li onClick={onClose}><FaSignOutAlt /> Đăng xuất</li> 
            </ul>
        </div>
    );
};
// ------------------------------------------

const Header = () => {
    // Hardcode userID duy nhất tại đây
    const userID = 4;
    
    const [isLoggedIn, setIsLoggedIn] = useState(true); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    // Lấy thông tin user từ API
    const { user, loading: userLoading, error: userError } = useUser(userID);
    
    // 1. Lấy vị trí hiện tại
    const location = useLocation();
    const currentPath = location.pathname; 
    
    // Kiểm tra xem có phải là Trang Chủ không
    const isHomePage = currentPath === '/'; // 👈 BIẾN QUAN TRỌNG

    // LOGIC LẮNG NGHE CUỘN TRANG
    useEffect(() => {
        const handleScroll = () => {
            // Logic cuộn CHỈ ÁP DỤNG cho Trang Chủ
            if (isHomePage) {
                const isScrolled = window.scrollY > 2; 
                if (isScrolled !== scrolled) {
                    setScrolled(isScrolled);
                }
            }
        };

        if (isHomePage) {
            window.addEventListener('scroll', handleScroll);
        } else {
            // Nếu không phải trang chủ, loại bỏ listener (đảm bảo sạch sẽ)
            window.removeEventListener('scroll', handleScroll);
            // Thiết lập scrolled = true để luôn áp dụng màu nền
            setScrolled(true); 
        }
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isHomePage, scrolled]); // Thêm isHomePage vào dependency array
    
    // 2. Hàm kiểm tra và áp dụng class Active (Giữ nguyên)
    const getNavLinkClass = (path) => {
        if (path === '/') {
             return currentPath === '/' ? styles.navLinkActive : styles.navLink;
        }
        return currentPath.startsWith(path) ? styles.navLinkActive : styles.navLink;
    };


    const handleProfileClick = () => {
        if (isLoggedIn) {
            setIsModalOpen(!isModalOpen);
        }
    };

    // 3. Render: Áp dụng class HeaderScrolled tùy theo trạng thái và trang
    // Nếu là Trang Chủ: dùng logic scrolled. 
    // Nếu không phải Trang Chủ: Luôn luôn áp dụng headerScrolled (vì isHomePage=false sẽ set scrolled=true trong useEffect)
    const headerClasses = `${styles.header} ${scrolled ? styles.headerScrolled : ''}`;

    return (
        <div className={headerClasses}>
            <div className={styles.headerLeft}>
                <span className={styles.logo}>Future</span>
                
                {/* Sử dụng Link và getNavLinkClass cho tất cả các liên kết */}
                <Link to="/" className={getNavLinkClass('/')}>Trang chủ</Link>
                <Link to="/tours" className={getNavLinkClass('/tours')}>Tours</Link> 
                <Link to="/flights" className={getNavLinkClass('/flights')}><IoIosAirplane /> Vé máy bay</Link>
                <Link to="/entertainment" className={getNavLinkClass('/entertainment')}>Vui chơi giải trí</Link>
                <Link to="/trains" className={getNavLinkClass('/trains')}><GiShipBow /> Vé tàu</Link>
            </div>
            
            <div className={styles.headerRight}>
                {/* Trạng thái đã đăng nhập (Giữ nguyên) */}
                {isLoggedIn ? (
                    <div className={styles.profileContainer}>
                        <span className={styles.phone}><FaPhoneAlt /> 1900 2045</span>
                        <div 
                            className={`${styles.user} ${isModalOpen ? styles.userActive : ''}`} 
                            onClick={handleProfileClick}
                        >
                            {user?.fullName || 'Trần Anh Thư'}
                            <FaCoins className={styles.coinIndicator} />
                        </div>
                        {isModalOpen && <ProfileModal styles={styles} onClose={() => setIsModalOpen(false)} user={user} />}
                    </div>
                ) : (
                    // Trạng thái chưa đăng nhập (Giữ nguyên)
                    <div className={styles.authContainer}>
                        <span className={styles.phone}><FaPhoneAlt /> 1900 2045</span>
                        <div className={styles.authButtons}>
                            <Link to="/login" className={styles.loginButton}>Đăng nhập</Link>
                            <button className={styles.registerButton}>Đăng ký</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;