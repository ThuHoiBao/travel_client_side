import React, { useState, useEffect } from 'react';
import styles from './TransactionListItem.module.scss';
import { FaTicketAlt, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa'; 
import TransactionDetailModal from './TransactionDetailModal/TransactionDetailModal';
import { LuClock3, LuZap, LuEye, LuStar, LuClipboardList } from "react-icons/lu"; 
import CancelOptionModal from './CancelOptionModal/CancelOptionModal';
import ReviewComponent from '../ReviewComponent/ReviewComponent'; 
import ViewReviewModal from '../ViewReviewModal/ViewReviewModal'; 
import { toast } from 'react-toastify';
import axios from '../../../../utils/axiosCustomize';
const TransactionListItem = ({ booking, refetch }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isViewReviewModalOpen, setIsViewReviewModalOpen] = useState(false);
    const handleOpenReviewModal = () => setIsReviewModalOpen(true);
    const handleCloseReviewModal = () => setIsReviewModalOpen(false);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const handlePaymentClick = async () => {
        if (!booking || !booking.bookingCode) {
            toast.error('Không tìm thấy thông tin booking!');
            return;
        }

        if (booking.timeLimit) {
            const deadline = new Date(booking.timeLimit);
            const now = new Date();
            if (now >= deadline) {
                toast.error('Thời hạn thanh toán đã hết. Booking của bạn có thể đã bị hủy.');
                return;
            }
        }

        try {
            setIsPaymentLoading(true);

            const paymentRequest = {
                bookingCode: booking.bookingCode,
                amount: booking.totalPrice,
                description: `Thanh toan ${booking.bookingCode}`,
                returnUrl: window.location.origin + "/payment-waiting",
                cancelUrl: window.location.origin + "/payment-cancel"
            };

            console.log('Creating PayOS payment request:', paymentRequest);

            const response = await axios.post('/payment/payos/create', paymentRequest);

            console.log('Payment response:', response);

            let paymentUrl = null;
            let orderCode = null;

            if (response.data?.checkoutUrl) {
                paymentUrl = response.data.checkoutUrl;
                orderCode = response.data.transactionId;
            } else if (response.data?.paymentUrl) {
                paymentUrl = response.data.paymentUrl;
                orderCode = response.data.transactionId;
            } else if (response.paymentUrl) {
                paymentUrl = response.paymentUrl;
                orderCode = response.data?.transactionId;
            } else if (response.data?.data?.checkoutUrl) {
                paymentUrl = response.data.data.checkoutUrl;
                orderCode = response.data.transactionId;
            } else if (response.data?.url) {
                paymentUrl = response.data.url;
                orderCode = response.data.transactionId;
            }

            if (paymentUrl && orderCode) {
                console.log('Redirecting to PayOS:', paymentUrl);

                sessionStorage.setItem('pendingPaymentOrderCode', orderCode);
                sessionStorage.setItem('pendingPaymentBookingCode', booking.bookingCode);

                const paymentWindow = window.open(paymentUrl, '_blank');

                if (!paymentWindow) {
                    toast.warning('Vui lòng cho phép popup để mở trang thanh toán!');
                }

                setTimeout(() => {
                    window.location.href = `/payment-waiting?orderCode=${orderCode}&bookingCode=${booking.bookingCode}`;
                }, 1000);

            } else {
                throw new Error('Không tìm thấy đường dẫn thanh toán từ phản hồi server');
            }

        } catch (error) {
            console.error('Payment error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                fullError: error
            });

            let errorMessage = 'Không thể tạo thanh toán. Vui lòng thử lại sau.';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message && !error.message.includes('Network Error')) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsPaymentLoading(false);
        }
    };
    const handleCancelClick = () => {
        setIsCancelModalOpen(true);
    };

    const handleCloseCancelModal = () => {
        setIsCancelModalOpen(false);
    };
    const handleDetailClick = () => {
        setIsModalOpen(true);
    };
    const handleOpenViewReviewModal = () => setIsViewReviewModalOpen(true);
    const handleCloseViewReviewModal = () => setIsViewReviewModalOpen(false);

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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING_PAYMENT': 
                return { 
                    backgroundColor: '#fff4e6',
                    color: '#d46b08',
                    border: '1px solid #ffd591'
                };
            case 'PENDING_CONFIRMATION': 
                return { 
                    backgroundColor: '#e6f7ff',
                    color: '#096dd9',
                    border: '1px solid #91d5ff'
                };
            case 'PAID': 
                return { 
                    backgroundColor: '#d4f4dd',
                    color: '#237804',
                    border: '1px solid #95de64'
                };
            case 'CANCELLED': 
            case 'OVERDUE_PAYMENT': 
                return { 
                    backgroundColor: '#fff1f0',
                    color: '#cf1322',
                    border: '1px solid #ffa39e'
                };
            case 'REVIEWED': 
                return { 
                    backgroundColor: '#e6fffb',
                    color: '#08979c',
                    border: '1px solid #87e8de'
                };
            case 'PENDING_REFUND': 
                return { 
                    backgroundColor: '#fff7e6',
                    color: '#d46b08',
                    border: '1px solid #ffc069'
                };
            default: 
                return { 
                    backgroundColor: '#f5f5f5',
                    color: '#595959',
                    border: '1px solid #d9d9d9'
                };
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


    const renderActionArea = () => {
        
        let primaryButton = null; 
        let statusDisplay = null;
        let timeLimitDisplay = null;
        let showPlaceholder = false;
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
                    <button 
                        key="pay" 
                        className={styles.btnPrimary}
                        onClick={handlePaymentClick}
                        disabled={isPaymentLoading}
                        style={{ opacity: isPaymentLoading ? 0.6 : 1 }}
                    >
                        {isPaymentLoading ? (
                            <>
                                <LuClock3 /> Đang chuyển...
                            </>
                        ) : (
                            <>
                                <LuZap /> Thanh toán
                            </>
                        )}
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
                    <button 
                        key="cancel" 
                        className={styles.btnDanger}
                        onClick={handleCancelClick} 
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
                break;
        }

        const placeholderButton = showPlaceholder ? <div key="placeholder" className={styles.btnPlaceholder}></div> : null;
        return (
            <div className={styles.actions}>
                <div className={styles.statusBadge} style={getStatusStyle(booking.bookingStatus)}>
                    {getStatusLabel(booking.bookingStatus)}
                </div>
                
                <div className={styles.price}>
                     {formatPrice(booking.totalPrice)}
                </div>
                
                {
                    (primaryButton || booking.bookingStatus ) && (
                        <div className={styles.buttonGroup}>
                            {primaryButton || (showPlaceholder && placeholderButton)}
                            {detailButton}
                        </div>
                    )
                }
                
                {timeLimitDisplay}
                
                {statusDisplay}
                
            </div>
        );
    };


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
                    onRefetch={refetch} 
                />
            )}
            {isReviewModalOpen && (
                <ReviewComponent
                    booking={booking}
                    onClose={handleCloseReviewModal}
                    onRefetch={refetch}
                />
            )}
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