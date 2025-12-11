// src/components/InformationComponent/TransactionList/TransactionListItem/TransactionListItem.jsx
import React, { useState, useEffect } from 'react';
import styles from './TransactionListItem.module.scss';
import { FaTicketAlt, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa'; 
import TransactionDetailModal from './TransactionDetailModal/TransactionDetailModal';
import { LuClock3, LuZap, LuEye, LuStar, LuClipboardList } from "react-icons/lu"; 
import CancelOptionModal from './CancelOptionModal/CancelOptionModal';
import ReviewComponent from '../ReviewComponent/ReviewComponent'; 
import ViewReviewModal from '../ViewReviewModal/ViewReviewModal'; // ✨ IMPORT MỚI// ✨ IMPORT MỚI // Import Modal mới
const TransactionListItem = ({ booking, refetch }) => {
    const [timeLeft, setTimeLeft] = useState('');
    // State quản lý Modal
    const [isModalOpen, setIsModalOpen] = useState(false); 
    // State quản lý Modal Hủy Tour
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isViewReviewModalOpen, setIsViewReviewModalOpen] = useState(false);
    // ✨ HÀM MỞ/ĐÓNG REVIEW MODAL
    const handleOpenReviewModal = () => setIsReviewModalOpen(true);
    const handleCloseReviewModal = () => setIsReviewModalOpen(false);
    // Hàm mở Modal hủy
    const handleCancelClick = () => {
        setIsCancelModalOpen(true);
    };

    // Hàm đóng Modal hủy
    const handleCloseCancelModal = () => {
        setIsCancelModalOpen(false);
    };
    // Hàm mở/đóng Modal
    const handleDetailClick = () => {
        setIsModalOpen(true);
    };
    // ✨ HÀM MỞ/ĐÓNG XEM REVIEW MODAL
    const handleOpenViewReviewModal = () => setIsViewReviewModalOpen(true);
    const handleCloseViewReviewModal = () => setIsViewReviewModalOpen(false);
    // --- Helper Functions ---

    const getStatusLabel = (status) => {
        switch (status) {
            case 'PENDING_PAYMENT': return 'Chờ thanh toán';
            case 'PENDING_CONFIRMATION': return 'Chờ xác nhận';
            case 'PAID': return 'Đã thanh toán';
            case 'CANCELLED': return 'Đã hủy';
            case 'OVERDUE_PAYMENT': return 'Quá hạn thanh toán';
            case 'PENDING_REVIEW': return 'Chờ đánh giá';
            case 'REVIEWED': return 'Đã đánh giá';
            case 'PENDING_REFUND': return 'Chờ hoàn tiền';
            default: return status;
        }
    };

    // Hàm trả về màu nền cho Status Badge
    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING_PAYMENT': return { backgroundColor: '#ffc107', color: 'white' };
            case 'PENDING_CONFIRMATION': return { backgroundColor: '#007bff', color: 'white' };
            case 'PAID': return { backgroundColor: '#52c41a', color: 'white' };
            case 'CANCELLED': 
            case 'OVERDUE_PAYMENT': return { backgroundColor: '#ff4d4f', color: 'white' };
            // case 'PENDING_REVIEW': return { backgroundColor: '#f1513fff', color: 'white' };
            case 'REVIEWED': return { backgroundColor: '#17a2b8', color: 'white' };
            case 'PENDING_REFUND': return { backgroundColor: '#fa8c16', color: 'white' };
            default: return { backgroundColor: '#6c757d', color: 'white' };
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // --- Countdown Logic ---

    useEffect(() => {
        if (booking.bookingStatus !== 'PENDING_PAYMENT' || !booking.timeLimit) {
            setTimeLeft('');
            return () => {};
        }

        let interval; 

        const updateCountdown = () => {
            const now = new Date();
            const limit = new Date(booking.timeLimit); 
            const diff = limit.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft('Đã hết hạn');
                clearInterval(interval);
                return;
            }

            const totalSeconds = Math.floor(diff / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            setTimeLeft(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
        };

        updateCountdown(); 
        interval = setInterval(updateCountdown, 1000); 

        return () => clearInterval(interval); 
    }, [booking.timeLimit, booking.bookingStatus]);


    // --- Render Actions Area (Price, Status, Buttons) ---

    const renderActionArea = () => {
        
        let primaryButton = null; 
        let statusDisplay = null;
        let timeLimitDisplay = null;
        let showPlaceholder = false;
        // Định nghĩa nút Xem chi tiết (được sử dụng lại)
        const detailButton = (
            <button
                key="detail"
                className={styles.btnDetail}
                onClick={handleDetailClick}
             >
                <LuClipboardList /> Xem chi tiết
            </button>
        );

        switch (booking.bookingStatus) {
            case 'PENDING_PAYMENT':
                primaryButton = (
                    <button key="pay" className={styles.btnPrimary}>
                        <LuZap /> Thanh toán
                    </button>
                );
                timeLimitDisplay = timeLeft && (
                    <div className={styles.timeLimit}>
                        <LuClock3 /> Thời hạn: {timeLeft}
                    </div>
                );
                break;

            case 'PENDING_CONFIRMATION':
                primaryButton = (
                    // CẬP NHẬT: Thay thế hủy tour bằng việc mở Modal chọn phương thức hủy
                    <button 
                        key="cancel" 
                        className={styles.btnDanger}
                        onClick={handleCancelClick} // Gọi hàm mở modal hủy
                    >
                        Hủy tour
                    </button>
                );
                break;
                
            case 'PAID':
                primaryButton = (
                    <button key="review" className={styles.btnPrimary}
                    onClick={handleOpenReviewModal}>
                        <LuStar /> Đánh giá
                    </button>
                );
                break;
                
            case 'REVIEWED':
                primaryButton = (
                    <button key="view-review" className={styles.btnSecondary}
                    onClick={handleOpenViewReviewModal}>
                        <LuEye /> Xem đánh giá
                    </button>
                );
                break;

           case 'CANCELLED': {
                statusDisplay = booking.cancelReason && booking.cancelReason.trim() ? (
                    <div className={styles.cancelReason}>
                        <strong>Lý do hủy:</strong> {booking.cancelReason}
                    </div>
                ) : null;

                showPlaceholder = true;
                break;
            }

            default:
                showPlaceholder = true; 
                // OVERDUE_PAYMENT không có primaryButton
                break;
        }

        // --- Cấu trúc lại Actions Container ---
        const placeholderButton = showPlaceholder ? <div key="placeholder" className={styles.btnPlaceholder}></div> : null;
        return (
            <div className={styles.actions}>
                {/* 1. Status Badge */}
                <div className={styles.statusBadge} style={getStatusStyle(booking.bookingStatus)}>
                    {getStatusLabel(booking.bookingStatus)}
                </div>
                
                {/* 2. Price */}
                <div className={styles.price}>
                     {formatPrice(booking.totalPrice)}
                </div>
                
                {/* 3. Button Group (Nút Chính & Xem chi tiết) */}
                {/* Nếu có nút hành động chính HOẶC trạng thái không phải CANCELLED/PAID/OVERDUE_PAYMENT */}
                {
                    (primaryButton || booking.bookingStatus ) && (
                        <div className={styles.buttonGroup}>
                            {/* Nút hành động chính (nếu có) */}
                            {primaryButton || (showPlaceholder && placeholderButton)}
                            {/* Nút Xem chi tiết (luôn có, trừ trường hợp đặc biệt) */}
                            {detailButton}
                        </div>
                    )
                }
                
                {/* 4. Time Limit (Nếu có) */}
                {timeLimitDisplay}
                
                {/* 5. Cancel Reason (Nếu bị hủy) */}
                {statusDisplay}
                
            </div>
        );
    };


    // --- Render Main Component ---
    return (
        <div className={styles.transactionItem}>
            <div className={styles.header}>
                Booking: {booking.bookingCode} | Ngày tạo: {formatDate(booking.bookingDate)}
            </div>
            
            <div className={styles.content}>
                <img 
                    src={booking.image || 'https://via.placeholder.com/200x180?text=Tour+Image'} 
                    alt={booking.tourName}
                    className={styles.image}
                />
                
                <div className={styles.info}>
                    <h3 className={styles.tourName}>{booking.tourName}</h3>
                    
                    <p className={styles.detail}>
                        <FaCalendarAlt /> Ngày khởi hành: {formatDate(booking.departureDate)}
                    </p>
                    <p className={styles.detail}>
                        <FaTicketAlt /> Mã tour: {booking.tourCode}
                    </p>
                </div>
                
                {renderActionArea()}
            </div>
            {/* Modal Detail */}
            {isModalOpen && (
                <TransactionDetailModal 
                    booking={booking} 
                    onClose={() => setIsModalOpen(false)} 
                    formatPrice={formatPrice}
                    formatDate={formatDate}
                />
            )}
            {isCancelModalOpen && (
                <CancelOptionModal
                    booking={booking}
                    bookingID={booking.bookingID}
                    onClose={handleCloseCancelModal}
                    onRefetch={refetch} // <--- LỖI: refetch chưa được truyền
                />
            )}
            {/* ✨ MODAL VIẾT ĐÁNH GIÁ MỚI */}
            {isReviewModalOpen && (
                <ReviewComponent
                    booking={booking}
                    onClose={handleCloseReviewModal}
                    onRefetch={refetch}
                />
            )}
            {/* ✨ MODAL XEM ĐÁNH GIÁ MỚI */}
            {isViewReviewModalOpen && (
                <ViewReviewModal
                    booking={booking}
                    onClose={handleCloseViewReviewModal}
                    formatPrice={formatPrice}
                    formatDate={formatDate}
                />
            )}
        </div>
    );
};

export default TransactionListItem;