// src/components/InformationComponent/TransactionList/TransactionListItem/RefundInfoModal/RefundInfoModal.jsx

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './RefundInfoModal.module.scss';
import { requestRefundApi } from '../../../../../services/booking/booking.ts'; 
import { FaMoneyCheckAlt, FaChevronDown, FaTimes } from 'react-icons/fa'; // Import thêm icon
// Giả định BANK_LIST được import từ 1 file riêng hoặc được định nghĩa ở đây
const BANK_LIST = [
    { code: 'AGR', name: 'Ngân hàng Agribank', icon: 'AGRIBANK' },
    { code: 'VTB', name: 'Ngân hàng VietinBank', icon: 'VietinBank' },
    { code: 'BIDV', name: 'Ngân hàng BIDV', icon: 'BIDV' },
    { code: 'ACB', name: 'Ngân hàng ACB', icon: 'ACB' },
    { code: 'TCB', name: 'Ngân hàng Techcombank', icon: 'TECHCOMBANK' },
    { code: 'VPB', name: 'Ngân hàng VPBank', icon: 'VPBank' },
    { code: 'HDB', name: 'Ngân hàng HDBank', icon: 'HDBank' },
    { code: 'LPB', name: 'Ngân hàng LienVietPostBank', icon: 'LienVietPostBank' },
    { code: 'SHB', name: 'Ngân hàng SHB', icon: 'SHB' },
    { code: 'TPB', name: 'Ngân hàng TPBank', icon: 'TPBank' },
    { code: 'SEAB', name: 'Ngân hàng SeaBank', icon: 'SeaBank' },
    { code: 'MB', name: 'Ngân hàng MB', icon: 'MB' },
    { code: 'MSB', name: 'Ngân hàng MSB', icon: 'MSB' },
    { code: 'VIB', name: 'Ngân hàng VIB', icon: 'VIB' },
    { code: 'NCB', name: 'Ngân hàng NCB', icon: 'NCB' },
    //...
];

// Component Modal chọn Ngân hàng
const BankSelectionModal = ({ onSelect, onClose }) => {
    const handleBankClick = (bankCode) => {
        onSelect(bankCode);
        onClose();
    };

    const bankSelectionJSX = (
        <div className={styles.bankSelectOverlay} onClick={onClose}>
            <div className={styles.bankSelectContent} onClick={e => e.stopPropagation()}>
                <div className={styles.bankSelectHeader}>
                    <h4>Chọn Ngân hàng hưởng thụ</h4>
                    <FaTimes className={styles.closeIcon} onClick={onClose} />
                </div>
                <div className={styles.bankList}>
                    {BANK_LIST.map(bank => (
                        <div key={bank.code} className={styles.bankItem} onClick={() => handleBankClick(bank.code)}>
                            {/* Thay thế icon bằng logo thực tế nếu có */}
                            <span className={styles.bankIconPlaceholder}>{bank.icon.substring(0, 2)}</span> 
                            <span className={styles.bankName}>{bank.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return createPortal(bankSelectionJSX, document.body);
};


// ✅ Thêm 'booking' vào props
const RefundInfoModal = ({ bookingID, booking, onClose, onBack, onRefetch }) => {
    // ✅ Khởi tạo state với dữ liệu sẵn có từ booking
    const [formData, setFormData] = useState({
        accountName: booking.accountName || '',
        accountNumber: booking.accountNumber || '',
        bank: booking.bank || '', // Mã bank (ví dụ: 'ACB', 'VTB')
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showBankModal, setShowBankModal] = useState(false); // State quản lý modal chọn Bank

    const selectedBank = BANK_LIST.find(b => b.code === formData.bank);
    const selectedBankName = selectedBank ? selectedBank.name : formData.bank;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    // HÀM CHỌN BANK TỪ MODAL CON
    const handleBankSelect = (bankCode) => {
        setFormData(prev => ({ ...prev, bank: bankCode }));
    };

    // HÀM XỬ LÝ ĐÓNG VÀ TẢI LẠI TRANG
    const handleCloseAndReload = () => {
        onClose(); 
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
            
            setSuccessMessage("Cảm ơn bạn! Yêu cầu hoàn tiền qua Ngân hàng của bạn đã thành công. Vui lòng đợi chúng tôi xử lí hoàn tiền lại.");
            
        } catch (err) { 
            console.error("Lỗi khi yêu cầu hoàn tiền Ngân hàng:", err);
            const apiError = err.response?.data?.message || "Lỗi khi gửi yêu cầu hoàn tiền.";
            setError(apiError);
        } finally {
            setIsProcessing(false);
        }
    };

    // --- JSX cho Modal Thông báo Thành công/Lỗi ---
    if (successMessage) {
        // ... (JSX thông báo thành công giữ nguyên)
         const successModalJSX = (
            <div className={styles.modalOverlay} onClick={onClose}>
                <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                    <h3 className={styles.successTitle}>Thông báo</h3>
                    <p className={styles.successMessage}>{successMessage}</p>
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
            {/* ✅ Hiển thị BankSelectionModal nếu showBankModal là true */}
            {showBankModal && (
                <BankSelectionModal 
                    onSelect={handleBankSelect} 
                    onClose={() => setShowBankModal(false)}
                />
            )}

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
                
                {/* ✅ THAY THẾ INPUT BẰNG CUSTOM SELECT */}
                <div className={styles.formGroup}>
                    <label htmlFor="bank">Ngân hàng hưởng thụ *</label>
                    <div className={styles.bankSelectTrigger} onClick={() => setShowBankModal(true)}>
                        <span className={formData.bank ? '' : styles.placeholder}>
                            {formData.bank ? selectedBankName : 'Chọn ngân hàng...'}
                        </span>
                        <FaChevronDown />
                    </div>
                    {/* Input ẩn để giữ trường 'bank' trong form data */}
                    <input type="hidden" name="bank" value={formData.bank} /> 
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