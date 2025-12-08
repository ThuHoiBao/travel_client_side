// src/components/AdminComponent/Pages/BookingsPage/AdminBookingModals/AdminBookingModals.jsx
import React, { useState } from 'react';
import styles from './AdminBookingModals.module.scss';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import { updateBookingStatusApi } from '../../../../../services/booking/booking.ts';

// CANCEL REASONS
const CANCEL_REASONS = [
    "Xin lỗi quý khách do tình hình thời tiết nên không thể khởi hành chuyến đi",
    "Không đủ số lượng khách tham gia tour",
    "Có sự cố về phương tiện vận chuyển",
    "Khác (Nhập lý do)"
];

// 1. MODAL XÁC NHẬN ĐƠN HÀNG (PENDING_CONFIRMATION -> PAID)
export const ConfirmBookingModal = ({ booking, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await updateBookingStatusApi({
                bookingID: booking.bookingID,
                bookingStatus: 'PAID'
            });
            alert('✅ Xác nhận booking thành công!');
            onSuccess();
            onClose();
        } catch (error) {
            alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <FaCheckCircle className={styles.iconSuccess} />
                    <h2>Xác nhận booking</h2>
                </div>
                
                <div className={styles.modalBody}>
                    <p className={styles.confirmText}>
                        Bạn chắc chắn sẽ xác nhận chuyến đi của khách hàng <strong>{booking.contactFullName}</strong> đúng không?
                    </p>
                    
                    <div className={styles.bookingInfo}>
                        <img src={booking.image || '/placeholder.png'} alt={booking.tourName} />
                        <div>
                            <p><strong>Booking:</strong> {booking.bookingCode}</p>
                            <p><strong>Tour:</strong> {booking.tourName}</p>
                            <p><strong>Mã Tour:</strong> {booking.tourCode}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button 
                        className={styles.btnCancel} 
                        onClick={onClose}
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button 
                        className={styles.btnConfirm} 
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// 2. MODAL HỦY ĐƠN VÀ HOÀN TIỀN (CHO PENDING_CONFIRMATION, PAID)
export const CancelWithRefundModal = ({ booking, onClose, onSuccess }) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [loading, setLoading] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const totalRefund = booking.totalPrice + (booking.paidByCoin || 0);

    const handleCancel = async () => {
        const finalReason = selectedReason === CANCEL_REASONS[3] ? customReason : selectedReason;
        
        if (!finalReason || finalReason.trim() === '') {
            alert('Vui lòng chọn hoặc nhập lý do hủy!');
            return;
        }

        try {
            setLoading(true);
            await updateBookingStatusApi({
                bookingID: booking.bookingID,
                bookingStatus: 'CANCELLED',
                cancelReason: finalReason
            });
            alert('✅ Hủy booking và hoàn tiền thành công!');
            onSuccess();
            onClose();
        } catch (error) {
            alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <FaExclamationTriangle className={styles.iconWarning} />
                    <h2>Xác nhận hủy tour và hoàn tiền</h2>
                </div>
                
                <div className={styles.modalBody}>
                    <div className={styles.bookingInfo}>
                        <img src={booking.image || '/placeholder.png'} alt={booking.tourName} />
                        <div>
                            <p><strong>Booking:</strong> {booking.bookingCode}</p>
                            <p><strong>Tour:</strong> {booking.tourName}</p>
                            <p><strong>Mã Tour:</strong> {booking.tourCode}</p>
                        </div>
                    </div>

                    <div className={styles.refundInfo}>
                        <h4>Thông tin hoàn tiền</h4>
                        <p><strong>Ngân hàng:</strong> {booking.bank || booking.refundBank || 'N/A'}</p>
                        <p><strong>Số TK:</strong> {booking.accountNumber || booking.refundAccountNumber || 'N/A'}</p>
                        <p><strong>Chủ TK:</strong> {booking.accountName || booking.refundAccountName || 'N/A'}</p>
                        <p className={styles.refundAmount}>
                            <strong>Số tiền hoàn:</strong> {formatPrice(totalRefund)}
                        </p>
                    </div>

                    <div className={styles.reasonSection}>
                        <h4>Chọn lý do hủy chuyến đi <span className={styles.required}>*</span></h4>
                        {CANCEL_REASONS.map((reason, index) => (
                            <label key={index} className={styles.radioLabel}>
                                <input 
                                    type="radio" 
                                    name="cancelReason" 
                                    value={reason}
                                    checked={selectedReason === reason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                />
                                {reason}
                            </label>
                        ))}
                        
                        {selectedReason === CANCEL_REASONS[3] && (
                            <textarea
                                className={styles.customReasonInput}
                                placeholder="Nhập lý do khác..."
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                rows={3}
                            />
                        )}
                    </div>

                    <div className={styles.warningBox}>
                        <FaExclamationTriangle />
                        <p>Lưu ý: Bạn phải chắc chắn hoàn tiền cho khách hàng trước khi bấm xác nhận!</p>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button 
                        className={styles.btnCancel} 
                        onClick={onClose}
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button 
                        className={styles.btnDanger} 
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận hủy'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// 3. MODAL HỦY ĐƠN KHÔNG HOÀN TIỀN (CHO PENDING_PAYMENT)
export const CancelWithoutRefundModal = ({ booking, onClose, onSuccess }) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        const finalReason = selectedReason === CANCEL_REASONS[3] ? customReason : selectedReason;
        
        if (!finalReason || finalReason.trim() === '') {
            alert('Vui lòng chọn hoặc nhập lý do hủy!');
            return;
        }

        try {
            setLoading(true);
            await updateBookingStatusApi({
                bookingID: booking.bookingID,
                bookingStatus: 'CANCELLED',
                cancelReason: finalReason
            });
            alert('✅ Hủy booking thành công!');
            onSuccess();
            onClose();
        } catch (error) {
            alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <FaExclamationTriangle className={styles.iconWarning} />
                    <h2>Xác nhận hủy tour</h2>
                </div>
                
                <div className={styles.modalBody}>
                    <div className={styles.bookingInfo}>
                        <img src={booking.image || '/placeholder.png'} alt={booking.tourName} />
                        <div>
                            <p><strong>Booking:</strong> {booking.bookingCode}</p>
                            <p><strong>Tour:</strong> {booking.tourName}</p>
                            <p><strong>Mã Tour:</strong> {booking.tourCode}</p>
                        </div>
                    </div>

                    <div className={styles.reasonSection}>
                        <h4>Chọn lý do hủy chuyến đi <span className={styles.required}>*</span></h4>
                        {CANCEL_REASONS.map((reason, index) => (
                            <label key={index} className={styles.radioLabel}>
                                <input 
                                    type="radio" 
                                    name="cancelReason" 
                                    value={reason}
                                    checked={selectedReason === reason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                />
                                {reason}
                            </label>
                        ))}
                        
                        {selectedReason === CANCEL_REASONS[3] && (
                            <textarea
                                className={styles.customReasonInput}
                                placeholder="Nhập lý do khác..."
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                rows={3}
                            />
                        )}
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button 
                        className={styles.btnCancel} 
                        onClick={onClose}
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button 
                        className={styles.btnDanger} 
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận hủy'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// 4. MODAL HOÀN TIỀN (CHO PENDING_REFUND)
export const ProcessRefundModal = ({ booking, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const totalRefund = booking.totalPrice + (booking.paidByCoin || 0);

    const handleConfirmRefund = async () => {
        try {
            setLoading(true);
            await updateBookingStatusApi({
                bookingID: booking.bookingID,
                bookingStatus: 'CANCELLED',
                cancelReason: 'Khách hàng yêu cầu hủy đơn và hoàn tiền tài khoản.'
            });
            alert('✅ Xác nhận hoàn tiền thành công!');
            onSuccess();
            onClose();
        } catch (error) {
            alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <FaCheckCircle className={styles.iconSuccess} />
                    <h2>Xác nhận hoàn tiền và hủy tour</h2>
                </div>
                
                <div className={styles.modalBody}>
                    <div className={styles.bookingInfo}>
                        <img src={booking.image || '/placeholder.png'} alt={booking.tourName} />
                        <div>
                            <p><strong>Booking:</strong> {booking.bookingCode}</p>
                            <p><strong>Tour:</strong> {booking.tourName}</p>
                            <p><strong>Mã Tour:</strong> {booking.tourCode}</p>
                        </div>
                    </div>

                    <div className={styles.refundInfo}>
                        <h4>Thông tin tài khoản hoàn tiền</h4>
                        <p><strong>Ngân hàng:</strong> {booking.refundBank || 'N/A'}</p>
                        <p><strong>Số TK:</strong> {booking.refundAccountNumber || 'N/A'}</p>
                        <p><strong>Chủ TK:</strong> {booking.refundAccountName || 'N/A'}</p>
                        <p className={styles.refundAmount}>
                            <strong>Số tiền cần hoàn:</strong> {formatPrice(totalRefund)}
                        </p>
                    </div>

                    <div className={styles.infoBox}>
                        <p><strong>Lý do hoàn tiền:</strong> Khách hàng yêu cầu hủy đơn và hoàn tiền tài khoản.</p>
                    </div>

                    <div className={styles.warningBox}>
                        <FaExclamationTriangle />
                        <p>Lưu ý: Bạn phải chắc chắn hoàn tiền cho khách hàng trước khi bấm xác nhận!</p>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button 
                        className={styles.btnCancel} 
                        onClick={onClose}
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button 
                        className={styles.btnConfirm} 
                        onClick={handleConfirmRefund}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
};