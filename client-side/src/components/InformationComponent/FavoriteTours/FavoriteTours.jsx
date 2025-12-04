// src/components/InformationComponent/FavoriteTours/FavoriteTours.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { getUserFavoriteToursApi, removeFavoriteTourApi } from '../../../services/favoriteTour/favoriteTour.ts';
import FavoriteTourItem from './FavoriteTourItem/FavoriteTourItem.jsx';
import styles from './FavoriteTours.module.scss';
import { FaHeartBroken } from 'react-icons/fa'; // Dùng icon fa-heart-broken cho empty state

const FavoriteTours = ({ user }) => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUserId = user?.userID;

    // Hàm fetch data, sử dụng useCallback để đảm bảo ổn định
    const fetchFavoriteTours = useCallback(async () => {
        if (!currentUserId) {
            setLoading(false);
            setError("Vui lòng đăng nhập để xem danh sách tour yêu thích.");
            setTours([]);
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            // Gọi API mới
            const data = await getUserFavoriteToursApi(currentUserId);
            setTours(data);
        } catch (err) {
            console.error("Error fetching favorite tours:", err);
            setError("Không thể tải danh sách tour yêu thích.");
            setTours([]);
        } finally {
            setLoading(false);
        }
    }, [currentUserId]);

    useEffect(() => {
        fetchFavoriteTours();
    }, [fetchFavoriteTours]);

    // Xử lý khi user xác nhận bỏ yêu thích (được gọi từ FavoriteTourItem)
    const handleRemoveTour = async (tourId) => {
        if (!currentUserId) return;
        
        setLoading(true); // Hiển thị loading trong khi xử lý xóa
        try {
            await removeFavoriteTourApi(currentUserId, tourId);
            
            // Cập nhật state local ngay lập tức hoặc load lại data
            // Phương pháp load lại data đảm bảo trạng thái đồng bộ với BE
            await fetchFavoriteTours();
        } catch (err) {
            console.error("Error removing favorite tour:", err);
            alert("Đã xảy ra lỗi khi bỏ yêu thích tour.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.favoriteTours}>
                <h1 className={styles.pageTitle}>Tour yêu thích</h1>
                <div className={styles.loadingState}>
                    <p>Đang tải danh sách tour yêu thích...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.favoriteTours}>
                <h1 className={styles.pageTitle}>Tour yêu thích</h1>
                <div className={styles.errorState}>
                    <p>Lỗi: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.favoriteTours}>
            <div className={styles.headerContainer}> 
                <h1 className={styles.mainTitle}>
                    {/* Sử dụng Icon trái tim */}
                    <i className="fas fa-heart" /> 
                    Tour yêu thích 
                </h1>
                
                <div className={styles.blueDivider} /> 
                
                {/* Sử dụng thẻ p cho dòng phụ đề (số lượng) */}
                <p className={styles.subtitleCount}>
                    Bạn có <span className={styles.countValue}>{tours.length}</span> chương trình tour yêu thích
                </p>
            </div>
            
            {tours.length === 0 ? (
                <div className={styles.emptyState}>
                    <FaHeartBroken style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }} />
                    <p>Bạn chưa có tour yêu thích nào. Hãy thêm một vài tour để dễ dàng theo dõi nhé!</p>
                </div>
            ) : (
                <div className={styles.toursList}>
                    {tours.map(tour => (
                        <FavoriteTourItem 
                            key={tour.tourID} 
                            tour={tour} 
                            onRemove={handleRemoveTour}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoriteTours;