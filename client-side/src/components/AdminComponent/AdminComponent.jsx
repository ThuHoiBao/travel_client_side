// src/components/AdminComponent/AdminComponent.jsx (UPDATED)

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout/AdminLayout';

// Import các Page Components đã tạo trước
import DashboardPage from './Pages/DashboardPage/DashboardPage';
// import SettingsPage from './Pages/SettingsPage/SettingsPage'; 

// Import các Page Components mới
import ToursPage from './Pages/ToursPage/ToursPage';
import UsersPage from './Pages/UsersPage/UsersPage';
import BookingsPage from './Pages/BookingsPage/BookingsPage';
import NotificationsPage from './Pages/NotificationsPage/NotificationsPage';
import CouponManagement from './Pages/CounponsPage/CouponManagement';
import LocationManager from './Pages/LocationsPage/LocationManager';
import BranchPolicyManagement from './Pages/BranchPolicyPage/BranchPolicyManagement';
import DepartureList from './Pages/DepartureManagement/DepartureList' 

const AdminComponent = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                
                <Route index element={<DashboardPage />} /> 
                <Route path="dashboard" element={<DashboardPage />} />
                
                {/* ✨ ROUTES MỚI ✨ */}
                <Route path="tours" element={<ToursPage />} /> 
                <Route path="departures" element={<DepartureList/>} />
                <Route path="users" element={<UsersPage />} />
                <Route path="bookings" element={<BookingsPage />} />
                <Route path="coupons" element={<CouponManagement />} />
                <Route path="locations" element={<LocationManager/> }/>
                <Route path="branches-policies" element={<BranchPolicyManagement/> }/>
                {/* ROUTES CŨ */}
                {/* <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="settings" element={<SettingsPage />} /> */}
            </Route>
        </Routes>
    );
};

export default AdminComponent;