import React from 'react';
import styles from './Notifications.module.scss';

const Notifications = ({ user }) => {
    return (
        <div className={styles.notifications}>
            <h1 className={styles.pageTitle}>Thông báo</h1>
            
            <div className={styles.emptyState}>
                <p>Bạn chưa có thông báo nào.</p>
            </div>
        </div>
    );
};

export default Notifications;


