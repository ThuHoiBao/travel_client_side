// src/components/AdminComponent/Pages/DashboardPage/components/HotToursSection/HotToursSection.jsx

import React from 'react';
import styles from './HotToursSection.module.scss';
import { FaFire, FaStar, FaMoneyBillWave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HotToursSection = ({ hotTours }) => {
    const navigate = useNavigate();

    // Format tiền tệ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(amount);
    };

    // Xử lý click vào tour
    const handleTourClick = (tourId) => {
        navigate(`/admin/tours/${tourId}`);
    };

    return (
        <div className={styles.hotToursSection}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <FaFire className={styles.fireIcon} />
                    <h3>Hot Tours</h3>
                </div>
                <span className={styles.badge}>Top {hotTours.length}</span>
            </div>

            <div className={styles.toursList}>
                {hotTours.map((tour, index) => (
                    <div 
                        key={tour.tourId} 
                        className={styles.tourCard}
                        onClick={() => handleTourClick(tour.tourId)}
                    >
                        {/* Badge xếp hạng */}
                        <div className={styles.rankBadge}>
                            #{index + 1}
                        </div>
                        
                        <div className={styles.tourInfo}>
                            {/* Header của tour */}
                            <div className={styles.tourHeader}>
                                <h4 className={styles.tourName}>{tour.tourName}</h4>
                                <span className={styles.tourCode}>{tour.tourCode}</span>
                            </div>

                            {/* Thống kê tour */}
                            <div className={styles.tourStats}>
                                {/* Doanh thu */}
                                <div className={styles.stat}>
                                    🪙
                                    <div>
                                        <span className={styles.label}>Doanh thu</span>
                                        <span className={styles.value}>
                                            {formatCurrency(tour.revenue)}
                                        </span>
                                    </div>
                                </div>

                                {/* Số booking */}
                                <div className={styles.stat}>
                                    <span className={styles.bookingIcon}>📅</span>
                                    <div>
                                        <span className={styles.label}>Bookings</span>
                                        <span className={styles.value}>
                                            {tour.bookingCount}
                                        </span>
                                    </div>
                                </div>

                                {/* Đánh giá */}
                                <div className={styles.stat}>
                                    <FaStar className={styles.starIcon} />
                                    <div>
                                        <span className={styles.label}>Đánh giá</span>
                                        <span className={styles.value}>
                                            {tour.averageRating.toFixed(1)} ⭐
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thanh hiệu suất */}
                        <div className={styles.performanceBar}>
                            <div 
                                className={styles.progressFill}
                                style={{ 
                                    width: `${(tour.bookingCount / hotTours[0].bookingCount) * 100}%` 
                                }}
                            />
                        </div>
                    </div>
                ))}

                {hotTours.length === 0 && (
                    <div className={styles.emptyState}>
                        <FaFire />
                        <p>Chưa có dữ liệu hot tours</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotToursSection;