import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import styles from './Header.module.scss';
import { FaPhoneAlt, FaCoins, FaEdit, FaListAlt, FaBell, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa'; 
import { IoIosAirplane } from "react-icons/io"; 
import { GiShipBow } from "react-icons/gi";
import { useAuth } from '../../context/AuthContext';

const ProfileModal = ({ styles, onClose, user, onLogout }) => {
    const navigate = useNavigate();
    const fullName = user?.fullName || 'Thư Trần Anh';
    const coinBalance = user?.coinBalance || 0;
    
    const handleMenuClick = (tab) => {
        onClose();
        navigate(`/information/${tab}`);
    };

    const handleLogout = () => {
        onClose();
        onLogout();
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
                <li onClick={() => handleMenuClick('profile')}>
                    <FaEdit /> Hồ sơ cá nhân
                </li>
                <li onClick={() => handleMenuClick('transaction')}>
                    <FaListAlt /> Danh sách giao dịch
                </li>
                {/* <li><FaUndoAlt /> Đặt chỗ của tôi</li> */}
                {/* <li className={styles.highlightNew}><FaUndoAlt /> Hoàn tiền <span className={styles.newBadge}>NEW!</span></li> */}
                <li onClick={() => handleMenuClick('notifications')}>
                    <FaBell /> Thông báo
                </li>
                <li onClick={() => handleMenuClick('favorites')}>
                    <FaInfoCircle /> Tour yêu thích
                </li>
                {/* <li><FaGift /> Khuyến mãi</li> */}
                <li onClick={handleLogout}>
                    <FaSignOutAlt /> Đăng xuất
                </li> 
            </ul>
        </div>
    );
};

const Header = () => {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const navigate = useNavigate(); 
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;
    const isHomePage = currentPath === '/';

    useEffect(() => {
        const handleScroll = () => {
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
            window.removeEventListener('scroll', handleScroll);
            setScrolled(true); 
        }
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isHomePage, scrolled]); 
    
    const getNavLinkClass = (path) => {
        if (path === '/') {
             return currentPath === '/' ? styles.navLinkActive : styles.navLink;
        }
        return currentPath.startsWith(path) ? styles.navLinkActive : styles.navLink;
    };

    const handleProfileClick = () => {
        if (isAuthenticated) {
            setIsModalOpen(!isModalOpen);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setIsModalOpen(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isModalOpen && !e.target.closest(`.${styles.profileContainer}`)) {
                setIsModalOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isModalOpen]);

    const headerClasses = `${styles.header} ${scrolled ? styles.headerScrolled : ''}`;

    if (loading) {
        return (
           <div className={headerClasses}>
                <div className={styles.headerLeft}>
                    <span className={styles.logo}>Future</span>
                </div>
                <div className={styles.headerRight}>
                    <span className={styles.loading}>Đang tải...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={headerClasses}>
            <div className={styles.headerLeft}>
                <a  className={styles.logo} href="/"><span>Future</span></a>
                
                <Link to="/" className={getNavLinkClass('/')}>Trang chủ</Link>
                <Link to="/tours" className={getNavLinkClass('/tours')}>Tours</Link> 
                <Link to="/flights" className={getNavLinkClass('/flights')}><IoIosAirplane /> Vé máy bay</Link>
                <Link to="/entertainment" className={getNavLinkClass('/entertainment')}>Vui chơi giải trí</Link>
                <Link to="/trains" className={getNavLinkClass('/trains')}><GiShipBow /> Vé tàu</Link>
            </div>
            
            <div className={styles.headerRight}>
                {isAuthenticated && user ? (
                    <div className={styles.profileContainer}>
                        <span className={styles.phone}>
                            <FaPhoneAlt /> 1900 2045
                        </span>
                        <div 
                            className={`${styles.user} ${isModalOpen ? styles.userActive : ''}`} 
                            onClick={handleProfileClick}
                        >
                            {user.fullName || 'User'}
                            <FaCoins className={styles.coinIndicator} />
                        </div>
                        {isModalOpen && (
                            <ProfileModal 
                                styles={styles} 
                                onClose={() => setIsModalOpen(false)} 
                                user={user}
                                onLogout={handleLogout}
                            />
                        )}
                    </div>
                ) : (
                    <div className={styles.authContainer}>
                        <span className={styles.phone}>
                            <FaPhoneAlt /> 1900 2045
                        </span>
                        <div className={styles.authButtons}>
                            <Link to="/login" className={styles.loginButton}>
                                Đăng nhập
                            </Link>
                            <Link to="/register" className={styles.registerButton}>
                                Đăng ký
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;