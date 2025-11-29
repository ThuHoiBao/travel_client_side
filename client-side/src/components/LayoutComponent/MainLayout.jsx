// src/components/LayoutComponent/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../HeaderComponent/Header'; 
import Footer from '../FooterComponent/Footer'; 

/**
 * MainLayout Component: Đóng vai trò là bố cục chung cho hầu hết các trang.
 * Header được đặt ở đây và chỉ được render MỘT LẦN.
 * <Outlet /> là nơi nội dung của Route con sẽ được hiển thị.
 */
const MainLayout = () => {
    return (
        <div className="main-layout-wrapper">
            <Header /> 
            
            {/* Vị trí mà các Route con (HomePage, HotelPage, v.v.) được render */}
            <main className="main-content">
                <Outlet /> 
            </main>
            
            {/* Footer được đặt ở đây để hiển thị trên mọi trang có Layout */}
            <Footer />
        </div>
    );
};

export default MainLayout;