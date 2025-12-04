import React from 'react';
import styles from './UsersPage.module.scss';
import { FaUsers } from 'react-icons/fa';

const UsersPage = () => {
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>
                <FaUsers className={styles.icon} /> Quản lý Users
            </h1>
            <div className={styles.pageContent}>
                <p className={styles.infoText}>
                    Quản lý danh sách người dùng (khách hàng, admin, v.v.) và phân quyền.
                </p>
                <div className={styles.placeholderBox}>
                    Nội dung: Bảng người dùng, xem chi tiết, khóa/mở khóa tài khoản.
                </div>
            </div>
        </div>
    );
};
export default UsersPage;