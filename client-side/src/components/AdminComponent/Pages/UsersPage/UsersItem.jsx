// src/components/AdminComponent/Pages/UsersPage/UsersItem.jsx
import React, { useState } from 'react';
import styles from './UsersItem.module.scss';
import { FaLock, FaUnlock, FaListAlt, FaEnvelope, FaPhone, FaBirthdayCake } from 'react-icons/fa';
import { LockUserModal, UserOrdersModal } from './UserModals/UserModals';

const UsersItem = ({ user, refetch, index }) => {
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <>
            <div 
                className={styles.userCard} 
                style={{ animationDelay: `${index * 0.03}s` }}
            >
                {/* Avatar Section - Vertical */}
                <div className={styles.avatarSection}>
                    <div className={styles.avatarWrapper}>
                        <img src={user.avatar} alt={user.fullName} className={styles.avatar} />
                        <div className={`${styles.statusDot} ${user.status ? styles.active : styles.inactive}`} />
                    </div>
                </div>

                {/* Content Section */}
                <div className={styles.contentSection}>
                    {/* Name and Status */}
                    <div className={styles.nameRow}>
                        <h3 className={styles.userName}>{user.fullName}</h3>
                        <span className={`${styles.statusBadge} ${user.status ? styles.statusActive : styles.statusLocked}`}>
                            {user.status ? 'Đang hoạt động' : 'Đã khóa'}
                        </span>
                    </div>

                    {/* Info Grid */}
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <FaEnvelope className={styles.infoIcon} />
                            <span className={styles.infoText}>{user.email}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <FaPhone className={styles.infoIcon} />
                            <span className={styles.infoText}>{user.phone}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <FaBirthdayCake className={styles.infoIcon} />
                            <span className={styles.infoText}>{formatDate(user.dateOfBirth)}</span>
                        </div>
                    </div>
                </div>

                {/* Actions Section */}
                <div className={styles.actionsSection}>
                    <button 
                        className={`${styles.actionBtn} ${user.status ? styles.btnLock : styles.btnUnlock}`}
                        onClick={() => setIsLockModalOpen(true)}
                    >
                        {user.status ? <FaLock /> : <FaUnlock />}
                    </button>

                    <button 
                        className={`${styles.actionBtn} ${styles.btnOrders}`}
                        onClick={() => setIsOrdersModalOpen(true)}
                    >
                        <FaListAlt />
                    </button>
                </div>
            </div>

            {/* MODALS */}
            {isLockModalOpen && (
                <LockUserModal 
                    user={user} 
                    onClose={() => setIsLockModalOpen(false)} 
                    onSuccess={refetch} 
                />
            )}

            {isOrdersModalOpen && (
                <UserOrdersModal 
                    user={user} 
                    onClose={() => setIsOrdersModalOpen(false)} 
                />
            )}
        </>
    );
};
export default UsersItem;