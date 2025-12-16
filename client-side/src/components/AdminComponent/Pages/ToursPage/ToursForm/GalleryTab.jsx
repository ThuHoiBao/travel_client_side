import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Star, Image, Video, Link, Upload, Youtube } from 'lucide-react';
import styles from './TabStyles.module.scss';
import { toast } from 'react-toastify'; 

// Hàm đơn giản để lấy ID video YouTube (chỉ hoạt động với format phổ biến)
const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
            let videoId = '';
            if (urlObj.searchParams.has('v')) {
                videoId = urlObj.searchParams.get('v');
            } else if (urlObj.hostname === 'youtu.be') {
                videoId = urlObj.pathname.substring(1);
            }
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
            }
        }
    } catch (e) {
        // console.error("Invalid URL:", e);
    }
    return null;
};

const GalleryTab = ({ images, setImages, mediaList, setMediaList }) => {
    
    // Cleanup local preview URLs on component unmount
    useEffect(() => {
        return () => {
            // Clean up image previews
            images.forEach(image => {
                if (image.previewUrl) {
                    URL.revokeObjectURL(image.previewUrl);
                }
            });
            // Clean up media previews
            mediaList.forEach(media => {
                if (media.previewUrl) {
                    URL.revokeObjectURL(media.previewUrl);
                }
            });
        };
    }, []);

    // --- Image handlers (Giữ nguyên) ---
    const handleAddImage = () => {
        const newImage = {
            imageURL: '',
            isMainImage: images.length === 0,
            file: null,
            previewUrl: null
        };
        setImages([...images, newImage]);
    };

    const handleImageChange = (index, field, value) => {
        const newImages = [...images];
        const currentImage = newImages[index];
        
        if (field === 'isMainImage') {
            if (value) {
                newImages.forEach((img, i) => { img.isMainImage = i === index; });
            } else {
                currentImage.isMainImage = false;
            }
        } 
        else if (field === 'file') {
            const file = value;
            
            if (!file) {
                currentImage.file = null;
                if (currentImage.previewUrl) URL.revokeObjectURL(currentImage.previewUrl);
                currentImage.previewUrl = null;
                setImages(newImages);
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("Kích thước file quá lớn (tối đa 5MB).");
                return;
            }
            
            if (currentImage.previewUrl) URL.revokeObjectURL(currentImage.previewUrl);
            
            currentImage.file = file;
            currentImage.imageURL = ''; 
            currentImage.previewUrl = URL.createObjectURL(file);
            
        } 
        else if (field === 'imageURL') {
            currentImage.imageURL = value;
            currentImage.file = null; 
            if (currentImage.previewUrl) URL.revokeObjectURL(currentImage.previewUrl);
            currentImage.previewUrl = null;
        } 
        else {
            currentImage[field] = value;
        }
        
        setImages(newImages);
    };

    const handleRemoveImage = (index) => {
        const removedImage = images[index];
        if (removedImage.previewUrl) URL.revokeObjectURL(removedImage.previewUrl);
        
        const newImages = images.filter((_, i) => i !== index);
        
        if (removedImage.isMainImage && newImages.length > 0) {
            newImages[0].isMainImage = true;
        }
        setImages(newImages);
    };

    // --- Media handlers (ĐÃ SỬA) ---
    const handleAddMedia = () => {
        const newMedia = {
            mediaUrl: '',
            thumbnailUrl: '',
            title: '',
            description: '',
            isPrimary: mediaList.length === 0,
            file: null,          // NEW: Lưu trữ file video
            previewUrl: null     // NEW: URL xem trước cục bộ
        };
        setMediaList([...mediaList, newMedia]);
    };

    const handleMediaChange = (index, field, value) => {
        const newMedia = [...mediaList];
        const currentMedia = newMedia[index];
        
        if (field === 'isPrimary' && value) {
            newMedia.forEach((m, i) => { m.isPrimary = i === index; });
        } 
        // NEW LOGIC FOR FILE UPLOAD
        else if (field === 'file') {
            const file = value;
            
            if (!file) {
                currentMedia.file = null;
                if (currentMedia.previewUrl) URL.revokeObjectURL(currentMedia.previewUrl);
                currentMedia.previewUrl = null;
                setMediaList(newMedia);
                return;
            }

            if (file.size > 50 * 1024 * 1024) { // Ví dụ: Giới hạn 50MB cho video
                toast.error("Kích thước file quá lớn (tối đa 50MB).");
                return;
            }
            
            if (currentMedia.previewUrl) URL.revokeObjectURL(currentMedia.previewUrl);
            
            currentMedia.file = file;
            currentMedia.mediaUrl = ''; // Xóa URL khi upload file
            currentMedia.previewUrl = URL.createObjectURL(file);
        }
        // NEW LOGIC FOR URL INPUT
        else if (field === 'mediaUrl') {
            currentMedia.mediaUrl = value;
            currentMedia.file = null; // Xóa file khi nhập URL
            if (currentMedia.previewUrl) URL.revokeObjectURL(currentMedia.previewUrl);
            currentMedia.previewUrl = null;
        }
        // END NEW LOGIC
        else {
            currentMedia[field] = value;
        }
        
        setMediaList(newMedia);
    };

    const handleRemoveMedia = (index) => {
        const removedMedia = mediaList[index];
        // Clean up object URL for uploaded video
        if (removedMedia.previewUrl) URL.revokeObjectURL(removedMedia.previewUrl);
        
        const newMedia = mediaList.filter((_, i) => i !== index);
        
        if (removedMedia.isPrimary && newMedia.length > 0) {
            newMedia[0].isPrimary = true;
        }
        setMediaList(newMedia);
    };

    // --- Render Functions ---
    const renderImageInput = (image, index) => {
        const isUrlActive = image.imageURL || !image.file;
        const isFileActive = image.file;
        
        return (
            <div className={styles.imageInputGroup}>
                {/* Input URL */}
                <div className={styles.formGroup}>
                    <label className={styles.labelWithIcon}>
                        <Link size={14} className={styles.inputIcon} />
                        URL hình ảnh
                    </label>
                    <input
                        type="text"
                        value={image.imageURL}
                        onChange={(e) => handleImageChange(index, 'imageURL', e.target.value)}
                        placeholder="Dán URL ảnh vào đây"
                        className={isFileActive ? styles.inputDisabled : ''}
                        disabled={isFileActive}
                    />
                </div>
                
                <p className={styles.separator}>HOẶC</p>

                {/* Input File Upload */}
                <div className={styles.formGroup}>
                    <label className={styles.labelWithIcon}>
                        <Upload size={14} className={styles.inputIcon} />
                        Tải ảnh lên (Tối đa 5MB)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(index, 'file', e.target.files[0])}
                        className={isUrlActive && image.imageURL ? styles.inputDisabled : ''}
                        key={image.previewUrl || image.imageURL || "empty_image" + index} 
                        disabled={isUrlActive && image.imageURL}
                    />
                    {image.file && <p className={styles.infoText}>Đã chọn: {image.file.name}</p>}
                </div>
            </div>
        );
    };

    const getSourceUrl = (item) => item.previewUrl || item.imageURL || item.mediaUrl;
    
    // NEW: Render Media Input
    const renderMediaInput = (media, index) => {
        const hasUrl = !!media.mediaUrl;
        const hasFile = !!media.file;
        
        return (
            <div className={styles.imageInputGroup}>
                {/* Input URL */}
                <div className={styles.formGroup}>
                    <label className={styles.labelWithIcon}>
                        <Youtube size={14} className={styles.inputIcon} />
                        URL Video (Youtube)
                    </label>
                    <input
                        type="text"
                        value={media.mediaUrl}
                        onChange={(e) => handleMediaChange(index, 'mediaUrl', e.target.value)}
                        placeholder="Dán URL Youtube (vd: https://youtu.be/abcde)"
                        className={hasFile ? styles.inputDisabled : ''}
                        disabled={hasFile}
                    />
                </div>
                
                <p className={styles.separator}>HOẶC</p>

                {/* Input File Upload */}
                <div className={styles.formGroup}>
                    <label className={styles.labelWithIcon}>
                        <Upload size={14} className={styles.inputIcon} />
                        Tải Video lên (Tối đa 50MB)
                    </label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleMediaChange(index, 'file', e.target.files[0])}
                        className={hasUrl ? styles.inputDisabled : ''}
                        key={media.previewUrl || media.mediaUrl || "empty_media" + index}
                        disabled={hasUrl}
                    />
                    {media.file && <p className={styles.infoText}>Đã chọn: {media.file.name}</p>}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.tabContainer}>
            {/* 1. Images Section */}
            <div className={styles.section}>
                {/* ... (Image Section code giữ nguyên) ... */}
                <div className={styles.sectionHeader}>
                    <h3>Bộ sưu tập Hình ảnh</h3>
                    <button className={styles.btnAdd} onClick={handleAddImage}>
                        <Plus size={18} />
                        Thêm ảnh
                    </button>
                </div>

                {images.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Image size={48} />
                        <p>Chưa có hình ảnh nào</p>
                        <button className={styles.btnPrimary} onClick={handleAddImage}>
                            Thêm ảnh đầu tiên
                        </button>
                    </div>
                ) : (
                    <div className={styles.itemList}>
                        {images.map((image, index) => {
                            const sourceUrl = getSourceUrl(image);
                            return (
                                <div key={index} className={styles.itemCard}>
                                    <div className={styles.cardHeader}>
                                        <h4>Ảnh #{index + 1}</h4>
                                        <div className={styles.itemActions}>
                                            <button 
                                                className={`${styles.btnAction} ${image.isMainImage ? styles.starred : ''}`}
                                                onClick={() => handleImageChange(index, 'isMainImage', !image.isMainImage)}
                                                title={image.isMainImage ? 'Ảnh chính' : 'Đặt làm ảnh chính'}
                                            >
                                                <Star size={18} />
                                            </button>
                                            
                                            <button
                                                className={styles.btnDelete}
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.grid2}>
                                        {/* Cột 1: Input */}
                                        <div>
                                            {renderImageInput(image, index)}
                                        </div>

                                        {/* Cột 2: Preview */}
                                        <div className={styles.previewBox}>
                                            {sourceUrl ? (
                                                <img 
                                                    src={sourceUrl} 
                                                    alt={`Preview ${index + 1}`} 
                                                    onError={(e) => e.target.style.display = 'none'} 
                                                    className={styles.imagePreview}
                                                />
                                            ) : (
                                                <div className={styles.previewPlaceholder}>
                                                    <Image size={32} />
                                                    <p>Xem trước ảnh</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 2. Media Section (Video) - ĐÃ SỬA */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3>Media (Video)</h3>
                    <button className={styles.btnAdd} onClick={handleAddMedia}>
                        <Plus size={18} />
                        Thêm video
                    </button>
                </div>

                {mediaList.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Video size={48} />
                        <p>Chưa có video nào</p>
                        <button className={styles.btnPrimary} onClick={handleAddMedia}>
                            Thêm video đầu tiên
                        </button>
                    </div>
                ) : (
                    <div className={styles.itemList}>
                        {mediaList.map((media, index) => {
                            const embedUrl = getYoutubeEmbedUrl(media.mediaUrl);
                            const isUploadedVideo = !!media.previewUrl;
                            
                            return (
                                <div key={index} className={styles.itemCard}>
                                    <div className={styles.cardHeader}>
                                        <h4>Video #{index + 1}</h4>
                                        <div className={styles.itemActions}>
                                            <button 
                                                className={`${styles.btnAction} ${media.isPrimary ? styles.starred : ''}`}
                                                onClick={() => handleMediaChange(index, 'isPrimary', !media.isPrimary)}
                                                title={media.isPrimary ? 'Video chính' : 'Đặt làm video chính'}
                                            >
                                                <Star size={18} />
                                            </button>
                                            <button
                                                className={styles.btnDelete}
                                                onClick={() => handleRemoveMedia(index)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.grid2}>
                                        {/* Cột 1: Thông tin video */}
                                        <div>
                                            {renderMediaInput(media, index)} {/* Thêm input upload/URL mới */}
                                            
                                            <div className={styles.formGroup}>
                                                <label>Thumbnail URL</label>
                                                <input
                                                    type="text"
                                                    value={media.thumbnailUrl}
                                                    onChange={(e) => handleMediaChange(index, 'thumbnailUrl', e.target.value)}
                                                    placeholder="URL ảnh đại diện video (nếu có)"
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Tiêu đề</label>
                                                <input
                                                    type="text"
                                                    value={media.title}
                                                    onChange={(e) => handleMediaChange(index, 'title', e.target.value)}
                                                    placeholder="Tiêu đề video"
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>Mô tả</label>
                                                <input
                                                    type="text"
                                                    value={media.description}
                                                    onChange={(e) => handleMediaChange(index, 'description', e.target.value)}
                                                    placeholder="Mô tả ngắn về video"
                                                />
                                            </div>
                                        </div>

                                        {/* Cột 2: Preview Video */}
                                        <div className={styles.previewBox}>
                                            {embedUrl ? (
                                                <div className={styles.videoWrapper}>
                                                    <iframe
                                                        src={embedUrl}
                                                        title="YouTube video player"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            ) : isUploadedVideo ? (
                                                <div className={styles.videoWrapper}>
                                                    <video controls className={styles.videoElement}>
                                                        <source 
                                                            src={media.previewUrl} 
                                                            type={media.file ? media.file.type : 'video/mp4'} 
                                                        />
                                                        Trình duyệt của bạn không hỗ trợ video.
                                                    </video>
                                                </div>
                                            ) : (
                                                <div className={styles.previewPlaceholder}>
                                                    <Video size={32} />
                                                    <p>Nhập URL Youtube hoặc Upload file để xem trước</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GalleryTab;