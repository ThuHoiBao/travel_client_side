// src/components/InformationComponent/TransactionList/TransactionListItem/RefundInfoModal/RefundInfoModal.jsx

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './RefundInfoModal.module.scss';
import { requestRefundApi } from '../../../../../services/booking/booking.ts'; 
import { FaMoneyCheckAlt, FaTimes, FaChevronDown, FaCheckCircle } from 'react-icons/fa';

const BANK_LIST = [
    { code: 'VCB', name: 'Vietcombank', shortName: 'VCB', bin: '970436', color: '#0c8e57' },
    { code: 'VTB', name: 'VietinBank', shortName: 'VTB', bin: '970415', color: '#003da5' },
    { code: 'BIDV', name: 'BIDV', shortName: 'BIDV', bin: '970418', color: '#a1272f' },
    { code: 'AGR', name: 'Agribank', shortName: 'AGR', bin: '970405', color: '#0066b2' },
    { code: 'ACB', name: 'ACB', shortName: 'ACB', bin: '970416', color: '#00a7d0' },
    { code: 'TCB', name: 'Techcombank', shortName: 'TCB', bin: '970407', color: '#e91c23' },
    { code: 'VPB', name: 'VPBank', shortName: 'VPB', bin: '970432', color: '#1e5c96' },
    { code: 'HDB', name: 'HDBank', shortName: 'HDB', bin: '970437', color: '#f4a920' },
    { code: 'LPB', name: 'LienVietPostBank', shortName: 'LPB', bin: '970449', color: '#e84e1f' },
    { code: 'SHB', name: 'SHB', shortName: 'SHB', bin: '970443', color: '#ff6b35' },
    { code: 'TPB', name: 'TPBank', shortName: 'TPB', bin: '970423', color: '#6f31a8' },
    { code: 'SEAB', name: 'SeaBank', shortName: 'SEAB', bin: '970440', color: '#ff9500' },
    { code: 'MB', name: 'MB Bank', shortName: 'MB', bin: '970422', color: '#e30613' },
    { code: 'MSB', name: 'MSB', shortName: 'MSB', bin: '970426', color: '#c41e3a' },
    { code: 'VIB', name: 'VIB', shortName: 'VIB', bin: '970441', color: '#ffc20e' },
    { code: 'NCB', name: 'NCB', shortName: 'NCB', bin: '970419', color: '#00308e' },
    { code: 'SAC', name: 'Sacombank', shortName: 'SAC', bin: '970403', color: '#1e6dd2' },
    { code: 'EXIM', name: 'Eximbank', shortName: 'EXIM', bin: '970431', color: '#007ac3' },
];

const getBankLogo = (bank) => (bank.bin ? `https://api.vietqr.io/img/${bank.bin}.png` : '');

const handleLogoError = (event) => {
    const fallbackEl = event.currentTarget.nextElementSibling;
    if (fallbackEl) fallbackEl.style.display = 'flex';
    event.currentTarget.style.display = 'none';
};

const BankSelectionModal = ({ onSelect, onClose }) => {
    const handleBankClick = (bankCode) => {
        onSelect(bankCode);
        onClose();
    };

    const bankSelectionJSX = (
        <div className={styles.bankSelectOverlay} onClick={onClose}>
            <div className={styles.bankSelectContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.bankSelectHeader}>
                    <h4>Chọn Ngân hàng hưởng thụ</h4>
                    <FaTimes className={styles.closeIcon} onClick={onClose} />
                </div>
                <div className={styles.bankGrid}>
                    {BANK_LIST.map((bank) => (
                        <div
                            key={bank.code}
                            className={styles.bankCard}
                            onClick={() => handleBankClick(bank.code)}
                        >
                            <div className={styles.bankEmblem}>
                                <img
                                    src={getBankLogo(bank)}
                                    alt={bank.name}
                                    className={styles.bankLogo}
                                    loading="lazy"
                                    onError={handleLogoError}
                                />
                                <div
                                    className={styles.logoFallback}
                                    style={{ backgroundColor: bank.color }}
                                >
                                    {bank.shortName}
                                </div>
                            </div>
                            <div className={styles.bankInfo}>
                                <span className={styles.bankName}>{bank.name}</span>
                                <span className={styles.bankCode}>BIN: {bank.bin}</span>
                            </div>
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

        // --- JSX cho Modal Thông báo Thành công ---
        if (successMessage) {
            const successModalJSX = (
                <div className={styles.modalOverlay} onClick={onClose}>
                    <div
                        className={`${styles.modalContent} ${styles.successContent}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.successIcon}>
                            <FaCheckCircle />
                        </div>
                        <h3 className={styles.successTitle}>Thành công!</h3>
                        <p className={styles.successMessage}>{successMessage}</p>
                        <div className={styles.successActions}>
                            <button 
                                className={styles.successButton} 
                                onClick={handleCloseAndReload}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            );
            return createPortal(successModalJSX, document.body); 
        }

        // --- JSX cho Modal Nhập thông tin Hoàn tiền ---
        const refundInfoModalJSX = (
            <div className={styles.modalOverlay} onClick={onClose}>
                {showBankModal && (
                    <BankSelectionModal 
                        onSelect={handleBankSelect} 
                        onClose={() => setShowBankModal(false)}
                    />
                )}

                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.headerSection}>
                        <div className={styles.icon}>
                            <FaMoneyCheckAlt />
                        </div>
                        <h3 className={styles.title}>Thông Tin Hoàn Tiền Ngân Hàng</h3>
                        <p className={styles.description}>Điền thông tin tài khoản để nhận tiền hoàn trả</p>
                    </div>

                    <div className={styles.formSection}>
                        <div className={styles.formGroup}>
                            <label htmlFor="accountName">Tên chủ tài khoản *</label>
                            <input 
                                type="text" 
                                id="accountName" 
                                name="accountName" 
                                value={formData.accountName} 
                                onChange={handleChange} 
                                placeholder="Nhập tên chủ tài khoản"
                                required 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="accountNumber">Số tài khoản *</label>
                            <input 
                                type="text" 
                                id="accountNumber" 
                                name="accountNumber" 
                                value={formData.accountNumber} 
                                onChange={handleChange} 
                                placeholder="Nhập số tài khoản"
                                required 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Ngân hàng hưởng thụ *</label>
                            <div className={styles.bankSelectTrigger} onClick={() => setShowBankModal(true)}>
                                {selectedBank ? (
                                    <div className={styles.selectedBankInfo}>
                                        <div className={styles.bankEmblem}>
                                            <img
                                                src={getBankLogo(selectedBank)}
                                                alt={selectedBank.name}
                                                className={styles.bankLogo}
                                                onError={handleLogoError}
                                            />
                                            <div
                                                className={styles.logoFallback}
                                                style={{ backgroundColor: selectedBank.color }}
                                            >
                                                {selectedBank.shortName}
                                            </div>
                                        </div>
                                        <div className={styles.selectedBankText}>
                                            <span className={styles.bankName}>{selectedBank.name}</span>
                                            <span className={styles.bankCode}>BIN: {selectedBank.bin}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <span className={styles.placeholder}>Chọn ngân hàng...</span>
                                )}
                                <FaChevronDown />
                            </div>
                            <input type="hidden" name="bank" value={formData.bank} /> 
                        </div>

                        {error && <div className={styles.error}>{error}</div>}
                    </div>

                    <div className={styles.buttonGroup}>
                        <button className={styles.btnSecondary} onClick={onBack} disabled={isProcessing}>Hủy</button>
                        <button 
                            className={styles.btnPrimary} 
                            onClick={handleConfirmRefund} 
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    </div>
                </div>
            </div>
        );
    
    return createPortal(refundInfoModalJSX, document.body); 
};

export default RefundInfoModal;