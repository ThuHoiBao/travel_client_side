// src/components/InformationComponent/TransactionList/TransactionList.jsx
import React, { useState, useCallback } from 'react';
import useBookings from '../../../hook/useBookings.ts';
import useWebSocket from '../../../hook/useWebSocket.ts';
import TransactionListItem from './TransactionListItem/TransactionListItem';
import styles from './TransactionList.module.scss';

const statusTabs = [
    { key: null, label: 'Tất cả' },
    { key: 'PENDING_PAYMENT', label: 'Chờ thanh toán' },
    { key: 'PENDING_CONFIRMATION', label: 'Chờ xác nhận' },
    { key: 'PAID', label: 'Đã thanh toán' },
    { key: 'CANCELLED', label: 'Hủy booking' },
    { key: 'OVERDUE_PAYMENT', label: 'Quá hạn thanh toán' },
    { key: 'REVIEWED', label: 'Đã đánh giá' },
    { key: 'PENDING_REFUND', label: 'Chờ hoàn tiền' }
];

const TransactionList = ({ user }) => {
    const [activeStatus, setActiveStatus] = useState(null);
    
    const { bookings, loading, error, refetch } = useBookings(user?.id || user?.userID || -1, activeStatus);
    console.log('📄 Fetched bookings:', user?.userID );
    // ✨ WEBSOCKET: Lắng nghe cập nhật từ backend cho user cụ thể
    const handleWebSocketMessage = useCallback((updatedBooking) => {
        console.log('🔔 User received booking update:', updatedBooking);
        // Refetch để cập nhật danh sách
        refetch();
    }, [refetch]);

    // Subscribe to user-specific topic
    useWebSocket({
        topic: `/topic/user/${user?.id || user?.userID}/bookings`,
        onMessage: handleWebSocketMessage,
        enabled: !!(user?.id || user?.userID)
    });

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
                    <p>Không có giao dịch nào ở trạng thái <strong>{getLabelFromKey(activeStatus)}</strong>.</p>
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