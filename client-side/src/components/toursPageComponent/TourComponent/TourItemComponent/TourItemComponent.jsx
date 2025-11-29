// src/components/ToursPageComponent/TourComponent/TourItemComponent/TourItemComponent.jsx
import React from 'react';
import styles from './TourItemComponent.module.scss';

// Chức năng format tiền tệ (VND)
const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'Liên hệ';
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ');
};

const TourItemComponent = ({ tour }) => {
    if (!tour) return null;

    // ✨ LẤY HẾT TẤT CẢ CÁC NGÀY KHỞI HÀNH
    const allDepartureDates = tour.departureDates;
    // Hàm xử lý khi click vào ngày khởi hành
    const handleDateClick = (departureID, date) => {
        console.log(`Clicked Departure ID: ${departureID}`);
        console.log(`Clicked Date: ${date.fullDate} (${date.departureDate})`);
        // Logic chọn ngày (nếu cần) sẽ nằm ở đây
    };
    return (
        <div className={styles.tourItem}>
            <div className={styles.imageContainer}>
                {/* Icon trái tim/Yêu thích */}
                <div className={styles.heartIcon}>
                    <i className="fas fa-heart"></i>
                </div> 
                
                <img src={tour.image} alt={tour.tourName} className={styles.tourImage} />
                
                {/* Badge Tiết kiệm (chỉ có nền hồng) */}
                <div className={styles.saleBadge}>
                    <p>Tiết kiệm</p> 
                </div>
            </div>
            
            <div className={styles.detailsContainer}>
                <h3 className={styles.tourName}>{tour.tourName}</h3>
                
                {/* KHỐI THÔNG TIN DẠNG GRID (2 cột) */}
                <div className={styles.infoGrid}>
                    {/* Hàng 1 - Cột 1: Mã Tour */}
                    <div className={styles.iconInfo}>
                        <i className="fas fa-qrcode"></i> Mã tour: <span className={styles.infoValue}> {tour.tourCode}</span>
                    </div>
                    {/* Hàng 1 - Cột 2: Khởi hành */}
                    <div className={styles.iconInfo}>
                        <i className="fas fa-plane-departure"></i> Khởi hành: <span className={`${styles.infoValue} ${styles.highlightValue}`}>{tour.startPointName}</span>
                    </div>
                    
                    {/* Hàng 2 - Cột 1: Thời gian */}
                    <div className={styles.iconInfo}>
                        <i className="fas fa-clock"></i> Thời gian: <span className={styles.infoValue}>{tour.duration}</span>
                    </div>
                    {/* Hàng 2 - Cột 2: Phương tiện */}
                    <div className={styles.iconInfo}>
                        <i className="fas fa-bus"></i> Phương tiện: <span className={styles.infoValue}>{tour.transportation}</span>
                    </div>
                </div>

                {/* Ngày Khởi hành */}
                <div className={styles.dateRow}>
                    <span className={styles.dateLabel}>
                        <i className="fas fa-calendar-alt"></i> Ngày khởi hành:
                    </span>
                    <div className={styles.dateBadges}>
                        {/* Nút Lùi */}
                        <div className={styles.dateNavButton}>&larr;</div> 
                        
                        {/* Hiển thị TẤT CẢ các ngày */}
                        {allDepartureDates.map((date, index) => (
                            <span 
                                key={index} 
                                // Mô phỏng ngày đầu tiên là ngày active
                                className={`${styles.dateBadge} ${index === 0 ? styles.activeDate : ''}`}
                                title={`Ngày: ${date.fullDate}`}
                                onClick={() => handleDateClick(date.departureID, date)} // ✨ THÊM ONCLICK ✨
                            >
                                {date.departureDate}
                            </span>
                        ))}
                        
                        {/* Nút Tiến */}
                        <div className={styles.dateNavButton}>&rarr;</div> 
                    </div>
                </div>

                {/* Giá và Hành động */}
                <div className={styles.priceActionRow}>
                    <div className={styles.priceBlock}>
                        Giá từ:
                        <p className={styles.priceValue}>{formatCurrency(tour.money)}</p>
                    </div>
                    <button className={styles.detailButton}>Xem chi tiết</button>
                </div>
            </div>
        </div>
    );
};

export default TourItemComponent;