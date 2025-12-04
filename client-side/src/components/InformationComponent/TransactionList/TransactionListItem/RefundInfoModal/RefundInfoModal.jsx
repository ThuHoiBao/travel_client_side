// src/components/InformationComponent/TransactionList/TransactionListItem/RefundInfoModal/RefundInfoModal.jsx

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './RefundInfoModal.module.scss';
import { requestRefundApi } from '../../../../../services/booking/booking.ts'; 
import { FaMoneyCheckAlt } from 'react-icons/fa';

const RefundInfoModal = ({ bookingID, onClose, onBack, onRefetch }) => {
    const [formData, setFormData] = useState({
        accountName: '',
        accountNumber: '',
        bank: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ HÀM XỬ LÝ ĐÓNG VÀ TẢI LẠI TRANG
    const handleCloseAndReload = () => {
        // Gọi onClose để đóng Modal
        onClose(); 
        // Sau đó tải lại trang
        window.location.reload(); 
    };
    
    const handleConfirmRefund = async () => {
        setError(null);
        if (!formData.accountName || !formData.accountNumber || !formData.bank) {
            setError("Vui lòng điền đầy đủ các thông tin bắt buộc.");
            return;
        }

        setIsProcessing(true);
        try {
            await requestRefundApi(bookingID, formData);
            
            // ✅ KHÔNG GỌI onRefetch() ở đây. Chỉ set thông báo thành công.
            setSuccessMessage("Cảm ơn bạn! Yêu cầu hoàn tiền qua Ngân hàng của bạn đã thành công. Vui lòng đợi chúng tôi xử lí hoàn tiền lại.");
            
        } catch (err) { 
            console.error("Lỗi khi yêu cầu hoàn tiền Ngân hàng:", err);
            // Lấy thông báo lỗi cụ thể từ response nếu có
            const apiError = err.response?.data?.message || "Lỗi khi gửi yêu cầu hoàn tiền.";
            setError(apiError);
        } finally {
            setIsProcessing(false);
        }
    };

    // --- JSX cho Modal Thông báo Thành công/Lỗi ---
    if (successMessage) {
        const successModalJSX = (
            <div className={styles.modalOverlay} onClick={onClose}>
                <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                    <h3 className={styles.successTitle}>Thông báo</h3>
                    <p className={styles.successMessage}>{successMessage}</p>
                    {/* ✅ ĐÍNH KÈM HÀM XỬ LÝ MỚI VÀO NÚT ĐÓNG */}
                    <button 
                        className={styles.btnPrimary} 
                        onClick={handleCloseAndReload} // Tải lại trang khi nhấn Đóng
                    >
                        Đóng
                    </button>
                </div>
            </div>
        );
        return createPortal(successModalJSX, document.body); 
    }

    // --- JSX cho Modal Nhập thông tin Hoàn tiền ---
    const refundInfoModalJSX = (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <FaMoneyCheckAlt className={styles.icon} />
                <h3 className={styles.title}>Thông Tin Hoàn Tiền Ngân Hàng</h3>
                <p className={styles.description}>Vui lòng điền thông tin tài khoản để nhận tiền hoàn trả.</p>

                <div className={styles.formGroup}>
                    <label htmlFor="accountName">Tên chủ tài khoản *</label>
                    <input type="text" id="accountName" name="accountName" value={formData.accountName} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="accountNumber">Số tài khoản *</label>
                    <input type="text" id="accountNumber" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="bank">Ngân hàng hưởng thụ *</label>
                    <input type="text" id="bank" name="bank" value={formData.bank} onChange={handleChange} required />
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.buttonGroup}>
                    <button className={styles.btnSecondary} onClick={onBack} disabled={isProcessing}>Quay lại</button>
                    <button 
                        className={styles.btnPrimary} 
                        onClick={handleConfirmRefund} 
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Đang gửi...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
    
    return createPortal(refundInfoModalJSX, document.body); 
};

export default RefundInfoModal;