import React from 'react';
import styles from './BookingsPage.module.scss';
import { FaCalendarCheck } from 'react-icons/fa';

const BookingsPage = () => {
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>
                <FaCalendarCheck className={styles.icon} /> Quản lý Bookings
            </h1>
            <div className={styles.pageContent}>
                <p className={styles.infoText}>
                    Xác nhận, hủy, theo dõi trạng thái và thanh toán của các đơn đặt tour.
                </p>
                <div className={styles.placeholderBox}>
                    Nội dung: Bảng đơn hàng, bộ lọc trạng thái, chi tiết đơn hàng.
                </div>
            </div>
        </div>
    );
};
export default BookingsPage;