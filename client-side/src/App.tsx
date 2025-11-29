// src/App.tsx (Cập nhật cuối cùng)

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/homPageComponent/HomePage'; 
import MainLayout from './components/LayoutComponent/MainLayout'; 
import ToursPage from './components/toursPageComponent/ToursPage';
import InformationComponent from './components/InformationComponent/InformationComponent';

// Các trang giả định
const HotelPage = () => <div>Trang Khách sạn</div>; 
const FlightsPage = () => <div>Trang Vé máy bay</div>; 
const EntertainmentPage = () => <div>Trang Vui chơi giải trí</div>;
const TrainsPage = () => <div>Trang Vé tàu</div>;
const LoginPage = () => <div>Trang Đăng nhập</div>; 
const AdminPage = () => <div>Trang Quản trị</div>; 

function App() {
  return (
    <Router>
      <Routes>
        
        {/* LAYOUT CHÍNH: Bọc tất cả các trang cần Header và Footer */}
        <Route element={<MainLayout />}>
             
            {/* Trang Chủ (Landing page) */}
            <Route path="/" element={<HomePage />} /> 
            
            {/* Trang Tours (Sẽ nhận params từ Banner) */}
            <Route path="/tours" element={<ToursPage />} /> 
            
            {/* Trang Information */}
            <Route path="/information" element={<InformationComponent />} />
            <Route path="/information/:tab" element={<InformationComponent />} />
            
            {/* Các trang khác */}
            <Route path="/hotel" element={<HotelPage />} />
            <Route path="/flights" element={<FlightsPage />} />
            <Route path="/entertainment" element={<EntertainmentPage />} />
            <Route path="/trains" element={<TrainsPage />} />

        </Route>
          
        {/* CÁC TRANG KHÔNG SỬ DỤNG LAYOUT */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />

      </Routes>
    </Router>
  );
}

export default App;