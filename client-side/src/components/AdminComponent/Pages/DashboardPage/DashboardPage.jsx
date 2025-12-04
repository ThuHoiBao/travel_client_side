// src/components/AdminComponent/Pages/DashboardPage/DashboardPage.jsx
import React from 'react';
import styles from './DashboardPage.module.scss';
import { FaTachometerAlt } from 'react-icons/fa';

const DashboardPage = () => {
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>
                <FaTachometerAlt className={styles.icon} /> Dashboard
            </h1>
            <div className={styles.pageContent}>
                <p className={styles.infoText}>
                    Chào mừng trở lại! Đây là tổng quan về hoạt động hệ thống.
                </p>
                <div className={styles.placeholderBox}>
                    Nội dung: Biểu đồ thống kê, Total User, Total Orders... (Giống ảnh DashStack)
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;