// src/components/InformationComponent/TransactionList/ViewReviewModal/ViewReviewModal.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './ViewReviewModal.module.scss';
import { FaTimes, FaStar, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { getReviewByBookingIdApi } from '../../../../services/review/review.ts'; // Sửa đường dẫn nếu cần

const ViewReviewModal = ({ booking, onClose, formatPrice, formatDate }) => {
    const [reviewData, setReviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lightboxImage, setLightboxImage] = useState(null); // URL của ảnh đang xem

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const data = await getReviewByBookingIdApi(booking.bookingID);
                setReviewData(data);
            } catch (err) {
                setError("Không thể tải chi tiết đánh giá.");
                console.error("Fetch Review Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, [booking.bookingID]);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar key={index} color={index < rating ? "#ffc107" : "#e4e5e9"} />
        ));
    };

    if (loading) {
        return createPortal(<div className={styles.modalOverlay}><div className={styles.loading}>Đang tải...</div></div>, document.body);
    }

    if (error) {
        return createPortal(<div className={styles.modalOverlay}><div className={styles.error}>{error}</div></div>, document.body);
    }
    
    // --- JSX cho Lightbox (Xem ảnh lớn) ---
    const lightboxJSX = lightboxImage && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxImage(null)}>
            <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
                <img src={lightboxImage} alt="Ảnh đánh giá lớn" />
                <button className={styles.closeLightbox} onClick={() => setLightboxImage(null)}>
                    <FaTimes /> Đóng
                </button>
            </div>
        </div>
    );
    

    // --- JSX cho Modal Chính ---
    const modalJSX = (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}><FaTimes /></button>

                <h2 className={styles.modalTitle}>Chi tiết đánh giá của bạn</h2>
                
                {/* 1. Tour Info */}
                <div className={styles.tourSummary}>
                    <img src={booking.image || 'placeholder.png'} alt={booking.tourName} className={styles.tourImage} />
                    <div className={styles.tourDetails}>
                        <h4>{booking.tourName}</h4>
                        <p>Mã Booking: {booking.bookingCode}</p>
                        <p>Mã Tour: {booking.tourCode}</p>
                    </div>
                </div>
                
                {/* 2. Rating & Comment */}
                <div className={styles.reviewSection}>
                    <div className={styles.ratingDisplay}>
                        <div className={styles.stars}>{renderStars(reviewData.rating)}</div>
                        <span className={styles.ratingValue}>{reviewData.rating}/5</span>
                    </div>
                    
                    <p className={styles.comment}>{reviewData.comment}</p>
                </div>

                {/* 3. Image Gallery */}
                {reviewData.imageUrls && reviewData.imageUrls.length > 0 && (
                    <div className={styles.gallerySection}>
                        <h3>Ảnh đánh giá ({reviewData.imageUrls.length})</h3>
                        <div className={styles.imageGrid}>
                            {reviewData.imageUrls.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Ảnh ${index + 1}`}
                                    onClick={() => setLightboxImage(url)} // Mở lightbox
                                />
                            ))}
                        </div>
                    </div>
                )}
                
                {lightboxJSX}
            </div>
        </div>
    );

    return createPortal(modalJSX, document.body);
};

export default ViewReviewModal;