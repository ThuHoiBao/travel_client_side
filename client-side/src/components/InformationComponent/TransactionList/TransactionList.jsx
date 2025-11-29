// src/components/InformationComponent/TransactionList/TransactionList.jsx

import React from 'react';
import styles from './TransactionList.module.scss';

const TransactionList = ({ user }) => {
    return (
        <div className={styles.transactionList}>
            <h1 className={styles.pageTitle}>Danh sách giao dịch</h1>
            
            <div className={styles.emptyState}>
                <p>Bạn chưa có giao dịch nào.</p>
            </div>
        </div>
    );
};

export default TransactionList;


