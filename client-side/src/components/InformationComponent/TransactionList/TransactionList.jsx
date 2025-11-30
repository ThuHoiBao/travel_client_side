// src/components/InformationComponent/TransactionList/TransactionList.jsx
import React, { useState } from 'react';
import useBookings from '../../../hook/useBookings.ts';
import TransactionListItem from './TransactionListItem/TransactionListItem';
import styles from './TransactionList.module.scss';

// Định nghĩa trạng thái và label hiển thị (Phải khớp với enum BookingStatus bên BE)
const statusTabs = [
    { key: null, label: 'Tất cả' },
    { key: 'PENDING_PAYMENT', label: 'Chờ thanh toán' },
    { key: 'PENDING_CONFIRMATION', label: 'Chờ xác nhận' },
    { key: 'PAID', label: 'Đã thanh toán' },
    { key: 'CANCELLED', label: 'Hủy booking' },
    { key: 'OVERDUE_PAYMENT', label: 'Quá hạn thanh toán' },
    { key: 'PENDING_REVIEW', label: 'Chờ đánh giá' },
    { key: 'REVIEWED', label: 'Đã đánh giá' }
];

const TransactionList = ({ user }) => {
    // Ban đầu, activeStatus là null để lấy 'Tất cả'
    const [activeStatus, setActiveStatus] = useState(null); 
    
    // Giả định user có thuộc tính userID
    const { bookings, loading, error, refetch } = useBookings(user?.id || user?.userID || -1, activeStatus);

    // Lấy label từ key
    const getLabelFromKey = (key) => {
        return statusTabs.find(tab => tab.key === key)?.label || 'Tất cả';
    };

    return (
        <div className={styles.transactionList}>
            <h1 className={styles.pageTitle}>Danh sách giao dịch</h1>
            
            <div className={styles.statusTabs}>
                {statusTabs.map(tab => (
                    <button
                        key={tab.key || 'all'}
                        // Kiểm tra nếu null thì tab 'Tất cả' được active
                        className={`${styles.tab} ${activeStatus === tab.key ? styles.active : ''}`}
                        onClick={() => setActiveStatus(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading && <div className={styles.loading}>Đang tải danh sách giao dịch...</div>}
            
            {error && <div className={styles.error}>{error}</div>}
            
            {!loading && !error && bookings.length === 0 && (
                <div className={styles.emptyState}>
                    <p>Không có giao dịch nào ở trạng thái **{getLabelFromKey(activeStatus)}**.</p>
                </div>
            )}

            {!loading && !error && bookings.length > 0 && (
                <div className={styles.bookingList}>
                    {bookings.map(booking => (
                        <TransactionListItem key={booking.bookingID} booking={booking} refetch={refetch} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionList;