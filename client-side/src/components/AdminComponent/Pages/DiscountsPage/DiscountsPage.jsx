import React from 'react';
import styles from './DiscountsPage.module.scss';
import { FaTags } from 'react-icons/fa';

const DiscountsPage = () => {
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>
                <FaTags className={styles.icon} /> Quản lý Giảm giá (Coupons)
            </h1>
            <div className={styles.pageContent}>
                <p className={styles.infoText}>
                    Tạo, quản lý và theo dõi hiệu suất sử dụng của các mã giảm giá và chiến dịch khuyến mãi.
                </p>
                <div className={styles.placeholderBox}>
                    Nội dung: Bảng mã Coupon, thêm/sửa, thống kê sử dụng.
                </div>
            </div>
        </div>
    );
};
export default DiscountsPage;