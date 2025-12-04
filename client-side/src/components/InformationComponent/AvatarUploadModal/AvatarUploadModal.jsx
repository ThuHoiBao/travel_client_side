// src/components/InformationComponent/AvatarUploadModal/AvatarUploadModal.jsx

import React, { useState, useRef } from 'react';
import { FaTimes, FaCamera } from 'react-icons/fa';
import styles from './AvatarUploadModal.module.scss'; 
import { updateUserApi } from '../../../services/user/user.ts'; 
// Lưu ý: Dữ liệu user từ hook đã là plain object, nhưng ta vẫn dùng UserRequestDTO để đảm bảo kiểu
const DEFAULT_AVATAR = "https://th.bing.com/th/id/OIP.KMh7jiRqiGInQryreHc-UwHaHa?w=180&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";

const AvatarUploadModal = ({ user, onClose, onUpdateSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    // Sử dụng avatar hiện tại của user cho preview ban đầu
    const [previewUrl, setPreviewUrl] = useState(user?.avatar || DEFAULT_AVATAR); 
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    if (!user) return null;

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleUpdate = async () => {
        if (!selectedFile) {
            alert("Vui lòng chọn ảnh đại diện mới.");
            return;
        }

        setLoading(true);
        try {
            // 1. Tạo FormData cho API Multipart/form-data
            const formData = new FormData();
            formData.append('avatar', selectedFile);
            
            // 2. Gọi API PUT /users/{userID} với FormData
            // API chỉ cần nhận file avatar, các trường khác là null/empty
            const response = await updateUserApi(user.userID, formData);

            // 3. Xử lý thành công
            // alert("Cập nhật Avatar thành công!");
            // Gọi hàm success để component cha (InformationComponent) cập nhật lại user data
            onUpdateSuccess(response); 
            onClose();

        } catch (error) {
            console.error("Lỗi cập nhật avatar:", error);
            alert("Lỗi khi cập nhật Avatar. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                
                {/* Close Icon (Góc phải) */}
                <FaTimes className={styles.closeIcon} onClick={onClose} />

                <h3 className={styles.modalTitle}>Cập nhật Ảnh đại diện</h3>

                {/* Avatar Preview */}
                <div className={styles.avatarPreviewContainer}>
                    <img src={previewUrl} alt="Avatar Preview" className={styles.avatarPreview} />
                    {loading && <div className={styles.loader}>Đang tải...</div>}
                </div>

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept="image/*"
                />

                <div className={styles.buttonGroup}>
                    {/* Button Chọn ảnh */}
                    <button 
                        className={styles.selectButton} 
                        onClick={handleUploadClick}
                        disabled={loading}
                    >
                        <FaCamera className={styles.buttonIcon} /> Chọn ảnh đại diện
                    </button>
                    
                    {/* Button Cập nhật */}
                    <button 
                        className={styles.updateButton} 
                        onClick={handleUpdate}
                        // Chỉ cho phép cập nhật khi có file mới được chọn
                        disabled={loading || !selectedFile} 
                    >
                        {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarUploadModal;