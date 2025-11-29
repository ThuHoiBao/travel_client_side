// src/components/ToursPageComponent/ToursPage.jsx (CẬP NHẬT)

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchToursApi } from '../../services/tours/tours.ts';
import { useLocations } from '../../hook/useLocations.ts';
import FilterAndSearchInput from './FilterAndSearchInput/FilterAndSearchInput.jsx'; 
// ✨ IMPORT COMPONENT TOUR MỚI ✨
import TourComponent from './TourComponent/TourComponent.jsx'; 
import styles from './ToursPage.module.scss'; 

const ToursPage = () => {
    const [searchParams] = useSearchParams();
    const { endLocations, loading: locationsLoading } = useLocations(); 
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const currentSearchParams = Object.fromEntries(searchParams.entries());

    const currentEndPointInfo = useMemo(() => {
        const endLocationId = currentSearchParams.endLocationID || '-1';
        return endLocations.find(loc => loc.locationID.toString() === endLocationId);
    }, [endLocations, currentSearchParams.endLocationID]);

    useEffect(() => {
        const fetchTours = async () => {
            setLoading(true);
            setError(null);
            
            const requestData = currentSearchParams;

            try {
                // data đã là mảng plain object từ searchToursApi
                const data = await searchToursApi(requestData); 
                setTours(data);
            } catch (err) {
                setError("Có lỗi xảy ra khi tìm kiếm tour.");
                setTours([]); 
                console.error("Fetch tours error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
        
    }, [searchParams]); 
// Kiểm tra xem người dùng đã chọn điểm đến cụ thể hay chưa
    const isSpecificDestinationSelected = currentEndPointInfo && currentEndPointInfo.locationID !== -1;
    return (
        <div className={styles.toursPageLayout}>
            {/* Cột Trái: Bộ Lọc */}
            <div className={styles.filterColumn}>
                <FilterAndSearchInput /> 
            </div>

            {/* Cột Phải: Thông tin Điểm đến và Kết Quả */}
            <div className={styles.resultsColumn}>
                
                {/* KHỐI THÔNG TIN ĐIỂM ĐẾN (Logic CẬP NHẬT) */}
                <div className={styles.destinationHeader}>
                    {isSpecificDestinationSelected ? (
                        <>
                            {/* Hiển thị thông tin điểm đến cụ thể */}
                            <h2>Du Lịch {currentEndPointInfo.name}</h2>
                            <p>{currentEndPointInfo.description || 'Khám phá điểm đến hấp dẫn này.'}</p>
                        </>
                    ) : (
                        <>
                            {/* Hiển thị thông điệp chung khi chọn 'Tất cả' */}
                            <h2>Du lịch cùng Future Travel</h2>
                            <p>Hãy tận hưởng trải nghiệm du lịch chuyên nghiệp, mang lại cho bạn những khoảnh khắc tuyệt vời và nâng tầm cuộc sống. Chúng tôi cam kết mang đến những chuyến đi đáng nhớ, giúp bạn khám phá thế giới theo cách hoàn hảo nhất.</p>
                        </>
                    )}
                </div>
                
                <h3 className={styles.tourCount}>Tìm thấy {tours.length} chương trình tour</h3>
                
                {loading || locationsLoading && <p>Đang tải dữ liệu...</p>}
                {error && <p className={styles.errorMessage}>Lỗi: {error}</p>}
                
                {/* ✨ SỬ DỤNG COMPONENT TOUR MỚI ✨ */}
                {!loading && !error && (
                    <TourComponent tours={tours} />
                )}
                
                {/* Xóa logic hiển thị 'Không tìm thấy' cũ vì đã được xử lý trong TourComponent */}
                
            </div>
        </div>
    );
};

export default ToursPage;