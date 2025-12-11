import React, { useState, useMemo, useEffect } from 'react';
import styles from './PersonalProfile.module.scss';
import { UserUpdateRequestDTO } from '../../../dto/requestDTO/UserUpdateRequestDTO.ts';
import { updateUserApi } from '../../../services/user/user.ts';
import { useAuth } from '../../../context/AuthContext.jsx';

const PersonalProfile = () => {
    const { user, updateUser } = useAuth();
    
    const userData = user?.data || user;
    
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        day: '',
        month: '',
        year: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [phoneError, setPhoneError] = useState('');
    
    const email = userData?.email || '';
    const userID = userData?.userId || userData?.id;
    
    const parsedDate = useMemo(() => {
        const dateOfBirth = userData?.dateOfBirth || '';
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
                month: (date.getMonth() + 1).toString(), 
                year: date.getFullYear().toString()
            };
        } catch (error) {
            console.error('Error parsing date:', error);
            return { day: '', month: '', year: '' };
        }
    }, [userData?.dateOfBirth]); 
    
    useEffect(() => {
        if (userData) {
            setFormData({
                fullName: userData.fullName || '',
                phoneNumber: userData.phoneNumber || '',
                day: parsedDate.day,
                month: parsedDate.month,
                year: parsedDate.year
            });
        }
    }, [userData, parsedDate]); 
    
    const handleInputChange = (field, value) => {
        if (field === 'phoneNumber') {
            const numericValue = value.replace(/\D/g, '');
            
            if (numericValue.length > 10) {
                setPhoneError('Số điện thoại chỉ được nhập tối đa 10 chữ số');
                return;
            }
            
            if (numericValue.length > 0 && numericValue.length < 10) {
                setPhoneError('Số điện thoại phải có đúng 10 chữ số');
            } else if (numericValue.length === 10) {
                setPhoneError(''); 
            } else {
                setPhoneError(''); 
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

            if (formData.phoneNumber && formData.phoneNumber.length !== 10) {
                setPhoneError('Số điện thoại phải có đúng 10 chữ số');
                setLoading(false);
                return;
            }

            const formDataPayload = new FormData();
            
            if (formData.fullName) {
                formDataPayload.append('fullName', formData.fullName);
            }
            
            if (formData.phoneNumber) {
                formDataPayload.append('phoneNumber', formData.phoneNumber);
            }

            if (formData.day && formData.month && formData.year) {
                const year = formData.year;
                const month = formData.month.padStart(2, '0');
                const day = formData.day.padStart(2, '0');
                const dateOfBirth = `${year}-${month}-${day}`;
                formDataPayload.append('dateOfBirth', dateOfBirth);
            }

            console.log('Sending FormData:');
            for (let [key, value] of formDataPayload.entries()) {
                console.log(`  ${key}: ${value}`);
            }

            const response = await updateUserApi(userID, formDataPayload);

            updateUser({
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                dateOfBirth: formData.day && formData.month && formData.year 
                    ? `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`
                    : userData?.dateOfBirth
            });

            setMessage({
                type: 'success',
                text: 'Cập nhật thông tin thành công!'
            });


        } catch (error) {
            console.error('Error updating user:', error);
            console.error('Error response:', error.response?.data);
            
            const errorMessage = error.response?.data?.message 
                || error.response?.data?.error
                || 'Có lỗi xảy ra khi cập nhật thông tin.';
            
            setMessage({
                type: 'error',
                text: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };
    
    if (!userData) {
        return (
            <div className={styles.personalProfile}>
                <div className={styles.loading}>Đang tải thông tin ...</div>
            </div>
        );
    }

    return (
        <div className={styles.personalProfile}>
            <h1 className={styles.pageTitle}>Hồ Sơ Cá Nhân</h1>
            
            <div className={styles.tabs}>
                <div className={`${styles.tab} ${styles.tabActive}`}>
                    Thông tin tài khoản
                </div>
            </div>
            
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
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
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
                </div>
                
                {message.text && (
                    <div className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
                        {message.text}
                    </div>
                )}
                
                <div className={styles.buttonGroup}>
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