// src/components/ToursPageComponent/TourComponent/TourItemComponent/TourItemComponent.jsx

import React,{ useState } from 'react';

import styles from './TourItemComponent.module.scss';

import { addFavoriteTourApi, removeFavoriteTourApi } from '../../../../services/favoriteTour/favoriteTour.ts';

// Chức năng format tiền tệ (VND)

const formatCurrency = (amount) => {

    if (amount === undefined || amount === null) return 'Liên hệ';

    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ');

};



const TourItemComponent = ({ tour, currentUserId }) => {

    



    const [isFavorite, setIsFavorite] = useState(tour.isFavorite || false);

    const [isProcessing, setIsProcessing] = useState(false);



    if (!tour) return null;

    const allDepartureDates = tour.departureDates;

    // Hàm xử lý khi click vào ngày khởi hành

    const handleDateClick = (departureID, date) => {

        console.log(`Clicked Departure ID: ${departureID}`);

        console.log(`Clicked Date: ${date.fullDate} (${date.departureDate})`);

        // Logic chọn ngày (nếu cần) sẽ nằm ở đây

    };

    const handleToggleFavorite = async () => {

        if (!currentUserId) {

            alert("Bạn cần đăng nhập để thêm tour vào danh sách yêu thích!");

            return;

        }



        if (isProcessing) return; // Ngăn chặn click đúp



        setIsProcessing(true);

        try {

            if (isFavorite) {

                // Xóa khỏi yêu thích

                await removeFavoriteTourApi(currentUserId, tour.tourID);

                setIsFavorite(false);

            } else {

                // Thêm vào yêu thích

                await addFavoriteTourApi(currentUserId, tour.tourID);

                setIsFavorite(true);

            }

        } catch (error) {

            console.error("Failed to toggle favorite:", error);

            alert("Đã xảy ra lỗi khi cập nhật tour yêu thích.");

        } finally {

            setIsProcessing(false);

        }

    };

    return (

        <div className={styles.tourItem}>

        <   div className={styles.imageContainer}>



    <div 

        className={`${styles.heartIconToggle} ${isFavorite ? styles.isFavorite : ''} ${isProcessing ? styles.isProcessing : ''}`}

        onClick={handleToggleFavorite}

        title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}

    >

        <svg 

            width="30" 

            height="30" 

            viewBox="0 0 24 22" 

            fill={isFavorite ? "#ff4d4f" : "white"}

            stroke="rgba(0,0,0,0.3)"

            strokeWidth="1"

            style={{

                filter: 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.7))',

                transition: 'all 0.3s ease'

            }}

        >

            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>

        </svg>

    </div>

    

    <img src={tour.image} alt={tour.tourName} className={styles.tourImage} />

    

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