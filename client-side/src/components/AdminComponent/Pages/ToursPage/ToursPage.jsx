import React from 'react';
import styles from './ToursPage.module.scss';
import { FaBox } from 'react-icons/fa';

const ToursPage = () => {
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>
                <FaBox className={styles.icon} /> Quản lý Tours
            </h1>
            <div className={styles.pageContent}>
                <p className={styles.infoText}>
                    Tạo, chỉnh sửa và quản lý các chương trình tour du lịch.
                </p>
                <div className={styles.placeholderBox}>
                    Nội dung: Bảng quản lý Tour, thêm/sửa/xóa tour, quản lý hình ảnh và lịch trình.
                </div>
            </div>
        </div>
    );
};
export default ToursPage;