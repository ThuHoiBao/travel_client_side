// src/components/AdminComponent/Pages/UsersPage/UsersPage.jsx

import React, { useState, useEffect } from 'react';
import styles from './UsersPage.module.scss';
import { FaUsers, FaSearch, FaRedoAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useAdminUsers from '../../../../hook/useAdminUsers.ts';
import useWebSocket from '../../../../hook/useWebSocket.ts';
import UsersItem from './UsersItem';
import { useLocation, useNavigate } from 'react-router-dom'; // Thêm useNavigate để xóa URL khi reset

const UsersPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Logic lấy tham số từ URL ngay lập tức (Synchronous)
    // Giúp state có dữ liệu ngay từ lần render đầu tiên
    const getInitialEmail = () => {
        const params = new URLSearchParams(location.search);
        return params.get('search') || '';
    };

    const initialEmail = getInitialEmail();

    // 2. Khởi tạo state với giá trị từ URL
    const [searchForm, setSearchForm] = useState({ 
        fullName: '', 
        phone: '', 
        email: initialEmail // Điền sẵn vào ô input
    });

    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 5;

    // 3. Quan trọng: activeSearch có giá trị ngay lập tức -> Hook useAdminUsers sẽ chạy search luôn
    const [activeSearch, setActiveSearch] = useState({ 
        fullName: null, 
        phone: null, 
        email: initialEmail || null // Nếu có email thì search luôn
    });

    // 4. Hook API (Giả định hook này đã có useEffect phụ thuộc vào activeSearch)
    const { users, loading, totalPages, totalElements, refetch } = useAdminUsers(activeSearch, currentPage, pageSize);

    // 5. WebSocket
    useWebSocket({
        topic: '/topic/admin/users',
        onMessage: () => refetch(),
        enabled: true
    });

    // 6. Xử lý trường hợp User đang ở trang này mà click vào thông báo khác (URL thay đổi nhưng không reload component)
    useEffect(() => {
        const newEmailParam = getInitialEmail();
        
        // Chỉ cập nhật nếu URL khác với state hiện tại để tránh loop
        if (newEmailParam !== searchForm.email) {
            setSearchForm(prev => ({ ...prev, email: newEmailParam }));
            setActiveSearch(prev => ({ ...prev, email: newEmailParam || null }));
            setCurrentPage(0);
        }
    }, [location.search]);

    const handleSearch = () => {
        setCurrentPage(0);
        setActiveSearch({
            fullName: searchForm.fullName.trim() || null,
            phone: searchForm.phone.trim() || null,
            email: searchForm.email.trim() || null
        });
    };

    const handleReset = () => {
        // Reset form và state tìm kiếm
        setSearchForm({ fullName: '', phone: '', email: '' });
        setActiveSearch({ fullName: null, phone: null, email: null });
        setCurrentPage(0);
        
        // Xóa param ?search=... trên URL để nhìn cho sạch
        navigate('/admin/users', { replace: true });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) setCurrentPage(newPage);
    };

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}><FaUsers className={styles.icon} /> Quản Lý Users</h1>

            <div className={styles.filterBar}>
                <div className={styles.filterItem}>
                    <input 
                        className={styles.filterInput} placeholder="Họ và tên..." 
                        value={searchForm.fullName} 
                        onChange={e => setSearchForm({...searchForm, fullName: e.target.value})} 
                    />
                </div>
                <div className={styles.filterItem}>
                    <input 
                        className={styles.filterInput} placeholder="Số điện thoại..." 
                        value={searchForm.phone} 
                        onChange={e => setSearchForm({...searchForm, phone: e.target.value})} 
                    />
                </div>
                <div className={styles.filterItem}>
                    <input 
                        className={styles.filterInput} placeholder="Email..." 
                        value={searchForm.email} 
                        onChange={e => setSearchForm({...searchForm, email: e.target.value})} 
                    />
                </div>
                <button className={styles.searchButton} onClick={handleSearch}><FaSearch /> Tìm kiếm</button>
                <button className={styles.resetButton} onClick={handleReset}><FaRedoAlt /> Làm mới</button>
            </div>

            <div className={styles.tableWrapper}>
                {loading ? <div className={styles.loadingState}>Đang tải...</div> : (
                    <table className={styles.usersTable}>
                        <thead>
                            <tr>
                                <th>Khách Hàng</th>
                                <th>Số điện thoại</th>
                                <th>Email</th>
                                <th>Ngày sinh</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? users.map(user => (
                                <UsersItem key={user.userID} user={user} refetch={refetch} />
                            )) : (
                                <tr>
                                    <td colSpan="6">
                                        <div className={styles.emptyState}>
                                            {activeSearch.email 
                                                ? `Không tìm thấy user có email: ${activeSearch.email}` 
                                                : "Không tìm thấy user nào"}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {!loading && totalElements > 0 && (
                <div className={styles.pagination}>
                    <span>Showing {Math.min(totalElements, currentPage * pageSize + 1)} - {Math.min(totalElements, (currentPage + 1) * pageSize)} of {totalElements}</span>
                    <div className={styles.paginationControls}>
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} className={styles.pageButton}><FaChevronLeft /></button>
                        <span className={styles.pageNumber}>{currentPage + 1} / {totalPages}</span>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} className={styles.pageButton}><FaChevronRight /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;