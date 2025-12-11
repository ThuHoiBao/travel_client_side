// src/components/AdminComponent/Pages/UsersPage/UsersPage.jsx
import React, { useState, useMemo, useCallback } from 'react';
import styles from './UsersPage.module.scss';
import { FaUsers, FaSearch, FaRedoAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useAdminUsers from '../../../../hook/useAdminUsers.ts';
import useWebSocket from '../../../../hook/useWebSocket.ts';
import UsersItem from './UsersItem';

const UsersPage = () => {
    const [searchForm, setSearchForm] = useState({ fullName: '', phone: '', email: '' });
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 5;

    // Dùng useMemo để tránh re-render hook khi gõ phím liên tục (chỉ khi nhấn tìm kiếm mới update thực tế nếu muốn, ở đây tôi debounce bằng cách chỉ truyền state khi nhấn Search hoặc giữ nguyên reactive)
    // Để đơn giản theo yêu cầu: "tìm kiếm thì là 3 trường text... load tất cả user theo tìm kiếm"
    // Tôi sẽ truyền thẳng state vào hook, nhưng hook sẽ chạy mỗi khi state đổi. 
    // Tốt nhất là có nút Search để kích hoạt.
    
    const [activeSearch, setActiveSearch] = useState({ fullName: null, phone: null, email: null });

    const { users, loading, totalPages, totalElements, refetch } = useAdminUsers(activeSearch, currentPage, pageSize);

    // WebSocket lắng nghe cập nhật User
    useWebSocket({
        topic: '/topic/admin/users', // Nhớ config BE gửi vào topic này
        onMessage: () => refetch(),
        enabled: true
    });

    const handleSearch = () => {
        setCurrentPage(0);
        setActiveSearch({
            fullName: searchForm.fullName.trim() || null,
            phone: searchForm.phone.trim() || null,
            email: searchForm.email.trim() || null
        });
    };

    const handleReset = () => {
        setSearchForm({ fullName: '', phone: '', email: '' });
        setActiveSearch({ fullName: null, phone: null, email: null });
        setCurrentPage(0);
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
                            )) : <tr><td colSpan="6" className={styles.emptyState}>Không tìm thấy user nào</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination Controls Reuse from BookingsPage */}
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