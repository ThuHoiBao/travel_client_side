// src/components/AdminComponent/Pages/UsersPage/UsersItem.jsx
import React, { useState } from 'react';
import styles from './UsersItem.module.scss';
import { FaLock, FaUnlock, FaListAlt } from 'react-icons/fa';
import { LockUserModal, UserOrdersModal } from './UserModals/UserModals';

const UsersItem = ({ user, refetch }) => {
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <>
            <tr className={styles.userRow}>
                <td>
                    <div className={styles.userInfo}>
                        <img src={user.avatar} alt="Avatar" className={styles.avatar} />
                        <span className={styles.fullName}>{user.fullName}</span>
                    </div>
                </td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{formatDate(user.dateOfBirth)}</td>
                <td>
                    <span className={`${styles.statusBadge} ${user.status ? styles.active : styles.locked}`}>
                        {user.status ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                </td>
                <td>
                    <div className={styles.actions}>
                        {/* Nút Khóa / Mở Khóa */}
                        <button 
                            className={`${styles.actionBtn} ${user.status ? styles.btnLock : styles.btnUnlock}`}
                            onClick={() => setIsLockModalOpen(true)}
                            title={user.status ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                        >
                            {user.status ? <FaLock /> : <FaUnlock />}
                        </button>

                        {/* Nút Xem Đơn Hàng */}
                        <button 
                            className={`${styles.actionBtn} ${styles.btnOrders}`}
                            onClick={() => setIsOrdersModalOpen(true)}
                            title="Xem đơn hàng"
                        >
                            <FaListAlt />
                        </button>
                    </div>
                </td>
            </tr>

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