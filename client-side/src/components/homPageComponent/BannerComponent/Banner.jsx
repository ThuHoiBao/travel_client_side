// src/components/homPageComponent/BannerComponent/Banner.jsx
import React, { useState } from 'react';
import styles from './Banner.module.scss';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa'; 
import { FaSearch, FaRegThumbsUp, FaRegCreditCard } from 'react-icons/fa'; // Icons cho bottom strip
import axios from 'axios'; 
import rightArrowImage from "../../../assets/images/right-arrow.png"
// ⚠️ THÊM DÒNG IMPORT CÁC FILE ẢNH CỦA BẠN VÀO ĐÂY
import searchIcon from '../../../assets/images/flight.png'; // Thay bằng đường dẫn ảnh thật của bạn
import thumbsUpIcon from '../../../assets/images/rating.png'; // Thay bằng đường dẫn ảnh thật của bạn
import creditCardIcon from '../../../assets/images/endow.png'; // Thay bằng đường dẫn ảnh thật của bạn
const Banner = () => {
  const [searchData, setSearchData] = useState({
    destination: '',
    startDate: '',
    budget: 'Chọn mức giá', // Đổi từ departure sang budget
  });
  
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false); 

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };
    
  // Hàm chọn ngân sách
  const handleBudgetSelect = (value) => {
      setSearchData(prev => ({ ...prev, budget: value }));
      setIsBudgetOpen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Dữ liệu tìm kiếm:', searchData);
  };
    
  // Danh sách các lựa chọn ngân sách (dựa trên ảnh F880D4EE-8D02-4F76-9B49-67E5F78CE37A.png)
  const budgetOptions = [
      'Dưới 5 triệu',
      'Từ 5 - 10 triệu',
      'Từ 10 - 20 triệu',
      'Trên 20 triệu',
  ];

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
            
        <h1 className={styles.headline}>Hơn 1000+ Tour, Khám Phá Ngay</h1>
        <p className={styles.subHeadline}>Giá tốt – hỗ trợ 24/7 – khắp nơi</p>



        <form className={styles.searchBox} onSubmit={handleSubmit}>
          {/* Input 1: Nơi muốn đi */}
          <div className={styles.inputGroup}>
            <FaSearch className={styles.icon} />
            <input
              type="text"
              name="destination"
              className={styles.inputField}
              placeholder="Bạn muốn đi đâu?"
              value={searchData.destination}
              onChange={handleChange}
              required
            />
          </div>

          {/* Input 2: Ngày khởi hành */}
          <div className={styles.inputGroup}>
            <FaCalendarAlt className={styles.icon} />
            <input
                type={isDateFocused || searchData.startDate ? 'date' : 'text'}
                name="startDate"
                className={`${styles.inputField} ${!isDateFocused && !searchData.startDate ? styles.placeholderFlexibility : ''}`}
                placeholder="Linh hoạt"
                value={searchData.startDate}
                onChange={handleChange}
                onFocus={() => setIsDateFocused(true)}
                onBlur={() => setIsDateFocused(false)}
            />
          </div>
          
          {/* Input 3: Khởi hành từ */}
          <div className={styles.inputGroup}>
            <FaMapMarkerAlt className={styles.icon} />
            <select
              name="departure"
              className={styles.selectField}
              value={searchData.departure}
              onChange={handleChange}
            >
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              {/* Thêm các lựa chọn khác */}
            </select>
          </div>

          {/* Button: Tìm */}
          <button type="submit" className={styles.searchButton}>
            Tìm
          </button>
        </form>

        {/* Khối thông tin tour nổi bật bên phải banner */}
        <div className={styles.sideInfoBox}>
            <p className={styles.sideTitle}>Tour Hàn Quốc 5N4Đ</p>
            <p className={styles.sideDetails}>HCM – Seoul – Đảo Nami</p>
            <p className={styles.sideDetails}>Công Viên Everland</p>
            <p className={styles.priceLabel}>Giá chỉ từ</p>
            <p className={styles.priceValue}>15.990.000 <small>VNĐ/khách</small></p>
            {/* SỬA LỖI HIỂN THỊ ẢNH: Sử dụng thẻ <img> và gán biến vào src */}
             <div className={styles.arrowIcon}>
                <img src={rightArrowImage} alt="Mũi tên" style={{width: '20px', height: '20px'}} /> 
            </div>
            {/* KẾT THÚC SỬA LỖI */}
        </div>
      </div>
      
      {/* Dải thông tin dưới cùng */}
{/* Dải thông tin dưới cùng */}
      <div className={styles.bottomInfoStrip}>
          <div className={styles.infoItem}>
              {/* ⚠️ Thay thế FaSearch bằng thẻ <img> */}
              <img src={searchIcon} alt="Search Icon" className={styles.infoIconImage} /> 
              <p><strong>1.000+ tours</strong></p>
              <p>Chất lượng trong và ngoài nước</p>
          </div>
          <div className={styles.infoItem}>
              {/* ⚠️ Thay thế FaRegThumbsUp bằng thẻ <img> */}
              <img src={thumbsUpIcon} alt="Thumbs Up Icon" className={styles.infoIconImage} />
              <p><strong>10K+ đánh giá 5 sao</strong></p>
              <p>Từ những khách hàng đã đặt tour</p>
          </div>
          <div className={styles.infoItem}>
              {/* ⚠️ Thay thế FaRegCreditCard bằng thẻ <img> */}
              <img src={creditCardIcon} alt="Credit Card Icon" className={styles.infoIconImage} />
              <p><strong>100+ ưu đãi mỗi ngày</strong></p>
              <p>Cho khách đặt sớm, theo nhóm, phút chót</p>
          </div>
      </div>
    </div>
  );
};

export default Banner;