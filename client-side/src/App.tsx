// src/App.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/HeaderComponent/Header'; // Header bạn đã tạo
import HomePage from './components/homPageComponent/HomePage'; // Trang chủ (Tours)

// Giả định các Component cho các trang khác
const HotelPage = () => <div>Trang Khách sạn</div>; 
const FlightsPage = () => <div>Trang Vé máy bay</div>; 
const LoginPage = () => <div>Trang Đăng nhập</div>; 
const AdminPage = () => <div>Trang Quản trị</div>; 
// ...

function App() {
  return (
    <Router>
      <Routes>
          
          {/* -------------------------------------------------- */}
          {/* 1. CÁC TRANG CÓ SỬ DỤNG HEADER (Phần lớn trang web) */}
          {/* -------------------------------------------------- */}
          {/* ⚠️ Đặt Header trực tiếp bên trong element của từng Route */}
          
          <Route 
              path="/" 
              element={
                  <>
                      <Header /> {/* Header hiển thị trên trang chủ */}
                      <HomePage />
                  </>
              } 
          />
          
          <Route 
              path="/hotel" 
              element={
                  <>
                      <Header /> {/* Header hiển thị trên trang khách sạn */}
                      <HotelPage />
                  </>
              } 
          />
          
          <Route 
              path="/flights" 
              element={
                  <>
                      <Header /> {/* Header hiển thị trên trang vé máy bay */}
                      <FlightsPage />
                  </>
              } 
          />
          
          {/* -------------------------------------------------- */}
          {/* 2. CÁC TRANG KHÔNG SỬ DỤNG HEADER (Login, Admin,...) */}
          {/* -------------------------------------------------- */}
          {/* ⚠️ Chỉ render Component chính, KHÔNG có Header */}
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />

      </Routes>
    </Router>
  );
}

export default App;