// src/components/HeaderComponent/Header.jsx
import React, { useState, useEffect } from 'react';
import styles from './Header.module.scss';
import { FaPhoneAlt, FaCoins, FaEdit, FaTicketAlt, FaListAlt, FaUndoAlt, FaBell, FaInfoCircle, FaGift, FaSignOutAlt } from 'react-icons/fa'; 
import { IoIosAirplane } from "react-icons/io"; 
import { GiShipBow } from "react-icons/gi"; 

// --- Component Profile Modal (Dropdown) ---
const ProfileModal = ({ styles, onClose }) => {
    return (
        <div className={styles.profileModal}>
            <div className={styles.modalHeader}>
                <span className={styles.modalUsername}>Thư Trần Anh</span>
                <span className={styles.modalStatus}>
                    <FaCoins className={styles.coinIcon} /> 0 Điểm
                </span>
                <span className={styles.memberTier}>
                    Bạn là thành viên **Bronze Priority**
                </span>
            </div>
            <ul className={styles.modalMenu}>
                <li><FaEdit /> Chỉnh sửa hồ sơ</li>
                <li><FaTicketAlt /> Thẻ của tôi</li>
                <li><FaListAlt /> Danh sách giao dịch</li>
                <li><FaUndoAlt /> Đặt chỗ của tôi</li>
                <li className={styles.highlightNew}><FaUndoAlt /> Hoàn tiền <span className={styles.newBadge}>NEW!</span></li>
                <li><FaBell /> Thông báo giá vé máy bay</li>
                <li><FaInfoCircle /> Thông tin hành khách đã lưu</li>
                <li><FaGift /> Khuyến mãi</li>
                <li onClick={onClose}><FaSignOutAlt /> Đăng xuất</li> 
            </ul>
        </div>
    );
};
// ------------------------------------------

const Header = () => {
    // THAY ĐỔI TRẠNG THÁI NÀY ĐỂ KIỂM TRA ĐĂNG NHẬP/CHƯA ĐĂNG NHẬP
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Quản lý màu nền khi cuộn
    const [scrolled, setScrolled] = useState(false);

    // LOGIC LẮNG NGHE CUỘN TRANG (Scroll Listener)
    useEffect(() => {
        const handleScroll = () => {
            // Thay đổi màu sau khi cuộn 100px
            const isScrolled = window.scrollY > 100; 
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        // Cleanup function
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);
    // ------------------------------------

    const handleProfileClick = () => {
        if (isLoggedIn) {
            setIsModalOpen(!isModalOpen);
        }
    };

    return (
        // Áp dụng class headerScrolled khi cuộn
        <div className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
            <div className={styles.headerLeft}>
                <span className={styles.logo}>Future</span>
                <a href="#" className={styles.navLink}>Khách sạn</a>
                <a href="#" className={styles.navLinkActive}>Tours</a> 
                <a href="#" className={styles.navLink}><IoIosAirplane /> Vé máy bay</a>
                <a href="#" className={styles.navLink}>Vui chơi giải trí</a>
                <a href="#" className={styles.navLink}><GiShipBow /> Vé tàu</a>
            </div>
            
            <div className={styles.headerRight}>
                {/* Trạng thái đã đăng nhập (Hiển thị tên và coin) */}
                {isLoggedIn ? (
                    <div className={styles.profileContainer}>
                        <span className={styles.phone}><FaPhoneAlt /> 1900 2045</span>
                        <div 
                            className={`${styles.user} ${isModalOpen ? styles.userActive : ''}`} 
                            onClick={handleProfileClick}
                        >
                             Trần Anh Thư
                            <FaCoins className={styles.coinIndicator} />
                        </div>
                        {isModalOpen && <ProfileModal styles={styles} onClose={() => setIsModalOpen(false)} />}
                    </div>
                ) : (
                    // Trạng thái chưa đăng nhập (Hiển thị nút Đăng nhập/Đăng ký)
                    <div className={styles.authContainer}>
                         <span className={styles.phone}><FaPhoneAlt /> 1900 2045</span>
                        <div className={styles.authButtons}>
                            <button className={styles.loginButton}>
                                Đăng nhập
                            </button>
                            <button className={styles.registerButton}>
                                Đăng ký
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;