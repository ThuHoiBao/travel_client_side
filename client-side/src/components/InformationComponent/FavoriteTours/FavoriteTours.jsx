import React from 'react';
import styles from './FavoriteTours.module.scss';

const FavoriteTours = ({ user }) => {
    return (
        <div className={styles.favoriteTours}>
            <h1 className={styles.pageTitle}>Tour yêu thích</h1>
            
            <div className={styles.emptyState}>
                <p>Bạn chưa có tour yêu thích nào.</p>
            </div>
        </div>
    );
};

export default FavoriteTours;


