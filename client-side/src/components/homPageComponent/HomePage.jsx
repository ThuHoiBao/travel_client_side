// src/HomePage.jsx
import React from 'react';
import Header from '../HeaderComponent/Header'; 
import Banner from './BannerComponent/Banner'; 
import styles from './HomePage.module.scss'; 
import Footer from '../FooterComponent/Footer';

const HomePage = () => {
  return (
    <div className={styles.homePageWrapper}> 
      {/* HEADER: Vị trí tuyệt đối, nằm trên Banner */}
      <Header /> 

      {/* BANNER: Vị trí tương đối, chiếm không gian chính */}
      <Banner /> 

      {/* Phần nội dung trang chủ phía dưới banner */}
      <main className={styles.mainContent}>
        <h2 className={styles.recentToursTitle}>Tours du lịch bạn đã xem gần đây</h2>
        {/* Placeholder cho danh sách Tour */}
        <p>Thẻ tour du lịch sẽ được đặt tại đây...</p>
      </main>
      <Footer/>
    </div>
  );
};

export default HomePage;