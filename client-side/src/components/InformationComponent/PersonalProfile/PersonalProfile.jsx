// src/components/InformationComponent/PersonalProfile/PersonalProfile.jsx

import React, { useState, useMemo, useEffect } from 'react';
import styles from './PersonalProfile.module.scss';
import { UserUpdateRequestDTO } from '../../../dto/requestDTO/UserUpdateRequestDTO.ts';
import { updateUserApi } from '../../../services/user/user.ts';

const PersonalProfile = ({ user }) => {
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        day: '',
        month: '',
        year: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [phoneError, setPhoneError] = useState('');
    
    const email = user?.email || '';
    const userID = user?.userID || 4;
    
    // Parse ngày sinh từ string (ISO format) thành ngày, tháng, năm
    const parsedDate = useMemo(() => {
        const dateOfBirth = user?.dateOfBirth || '';
        if (!dateOfBirth) {
            return { day: '', month: '', year: '' };
        }
        
        try {
            const date = new Date(dateOfBirth);
            if (isNaN(date.getTime())) {
                return { day: '', month: '', year: '' };
            }
            
            return {
                day: date.getDate().toString(),
                month: (date.getMonth() + 1).toString(), // getMonth() trả về 0-11
                year: date.getFullYear().toString()
            };
        } catch (error) {
            console.error('Error parsing date:', error);
            return { day: '', month: '', year: '' };
        }
    }, [user?.dateOfBirth]);
    
    // Cập nhật formData khi user data thay đổi
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                phone: user.phone || '',
                day: parsedDate.day,
                month: parsedDate.month,
                year: parsedDate.year
            });
        }
    }, [user, parsedDate]);
    
    const handleInputChange = (field, value) => {
        // Validation cho số điện thoại
        if (field === 'phone') {
            // Chỉ cho phép nhập số
            const numericValue = value.replace(/\D/g, '');
            
            // Kiểm tra độ dài tối đa 10 chữ số
            if (numericValue.length > 10) {
                setPhoneError('Số điện thoại chỉ được nhập tối đa 10 chữ số');
                return;
            }
            
            // Kiểm tra độ dài tối thiểu khi đã nhập đủ
            if (numericValue.length > 0 && numericValue.length < 10) {
                setPhoneError('Số điện thoại phải có đúng 10 chữ số');
            } else if (numericValue.length === 10) {
                setPhoneError(''); // Xóa lỗi khi đủ 10 chữ số
            } else {
                setPhoneError(''); // Xóa lỗi khi chưa nhập gì
            }
            
            setFormData(prev => ({
                ...prev,
                [field]: numericValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
        setMessage({ type: '', text: '' });
    };
    
    const handleSave = async () => {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            
            // Validation số điện thoại trước khi lưu
            if (formData.phone && formData.phone.length !== 10) {
                setPhoneError('Số điện thoại phải có đúng 10 chữ số');
                setLoading(false);
                return;
            }
            
            // Tạo dateOfBirth từ day, month, year
            // Sử dụng format trực tiếp để tránh lỗi timezone
            let dateOfBirth = '';
            if (formData.day && formData.month && formData.year) {
                // Format trực tiếp YYYY-MM-DD để tránh lỗi timezone
                const year = formData.year;
                const month = formData.month.padStart(2, '0'); // Đảm bảo 2 chữ số
                const day = formData.day.padStart(2, '0'); // Đảm bảo 2 chữ số
                dateOfBirth = `${year}-${month}-${day}`;
            }
            const formDataPayload = new FormData();
            // Tạo DTO

            // Backend (@ModelAttribute) sẽ tìm các field này
            formDataPayload.append('fullName', formData.fullName);
            formDataPayload.append('phone', formData.phone);
            
            // Gửi ngày sinh nếu có giá trị (hoặc chuỗi rỗng)
            if (dateOfBirth) {
                formDataPayload.append('dateOfBirth', dateOfBirth);
            } else {
                // Nếu muốn xóa ngày sinh (nếu backend cho phép null) hoặc gửi rỗng
                formDataPayload.append('dateOfBirth', ''); 
            }
            
            // Gọi API update
            await updateUserApi(userID, formDataPayload);
            
            setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
            
            // Reload page sau 1.5 giây để cập nhật dữ liệu
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
        } catch (error) {
            console.error('Error updating user:', error);
            setMessage({ type: 'error', text: 'Có lỗi xảy ra khi cập nhật thông tin.' });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className={styles.personalProfile}>
            <h1 className={styles.pageTitle}>Hồ Sơ Cá Nhân</h1>
            
            {/* Tabs */}
            <div className={styles.tabs}>
                <div className={`${styles.tab} ${styles.tabActive}`}>
                    Thông tin tài khoản
                </div>
            </div>
            
            {/* Personal Data Section */}
            <div className={styles.section}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Tên đầy đủ</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                    <p className={styles.helperText}>
                        Tên trong hồ sơ được rút ngắn từ họ tên của bạn.
                    </p>
                </div>
                
                <div className={styles.formGroup}>
                    <label className={styles.label}>Số điện thoại</label>
                    <input
                        type="text"
                        className={`${styles.input} ${phoneError ? styles.inputError : ''}`}
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Nhập 10 chữ số"
                        maxLength={10}
                    />
                    {phoneError && (
                        <p className={styles.errorText}>{phoneError}</p>
                    )}
                </div>
                
                <div className={styles.formGroup}>
                    <label className={styles.label}>Ngày sinh</label>
                    <div className={styles.dateInputs}>
                        <select 
                            className={styles.dateSelect} 
                            value={formData.day}
                            onChange={(e) => handleInputChange('day', e.target.value)}
                        >
                            <option value="">Ngày</option>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                <option key={d} value={d.toString()}>{d}</option>
                            ))}
                        </select>
                        <select 
                            className={styles.dateSelect} 
                            value={formData.month}
                            onChange={(e) => handleInputChange('month', e.target.value)}
                        >
                            <option value="">Tháng</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m.toString()}>{m}</option>
                            ))}
                        </select>
                        <select 
                            className={styles.dateSelect} 
                            value={formData.year}
                            onChange={(e) => handleInputChange('year', e.target.value)}
                        >
                            <option value="">Năm</option>
                            {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                <option key={y} value={y.toString()}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>
                            {/* Email Section */}
            <div className={styles.section}>
                <h2 className={styles.label}>Email</h2>
                {email && (
                    <div className={styles.formGroup}>
                        <input
                            type="email"
                            className={`${styles.input} ${styles.inputReadOnly}`}
                            value={email}
                            readOnly
                        />
                    </div>
                )}
                {/* <button className={styles.buttonAdd}>
                    + Thêm email
                </button> */}
            </div>
                {message.text && (
                    <div className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
                        {message.text}
                    </div>
                )}
                
                <div className={styles.buttonGroup}>
                    {/* <button className={styles.buttonSecondary}>Có lẽ để sau</button> */}
                    <button 
                        className={styles.buttonPrimary}
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? 'Đang lưu...' : 'Cập nhật'}
                    </button>
                </div>

                
            </div>
            
        </div>
    );
};

export default PersonalProfile;

