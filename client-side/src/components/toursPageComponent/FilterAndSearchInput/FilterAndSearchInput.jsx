// src/components/ToursPageComponent/FilterAndSearchInput/FilterAndSearchInput.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocations } from '../../../hook/useLocations.ts';
import styles from './FilterAndSearchInput.module.scss';

// Cấu hình các tùy chọn cứng
const BUDGET_OPTIONS = [
    'Dưới 5 triệu', 'Từ 5 - 10 triệu', 
    'Từ 10 - 20 triệu', 'Trên 20 triệu'
];

const TRANSPORTATION_OPTIONS = ['Xe', 'Máy bay'];

// Hàm Fuzzy Search đơn giản
const fuzzySearch = (list, query) => {
    if (!query) return list;
    const lowerQuery = query.toLowerCase().trim();
    return list.filter(item => 
        item.name.toLowerCase().includes(lowerQuery)
    );
};

const FilterAndSearchInput = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { startLocations, endLocations, loading: locationsLoading } = useLocations();

    // 1. Trạng thái Local cho các ô input/select
    const [searchNameTour, setSearchNameTour] = useState(searchParams.get('searchNameTour') || '');
    const [budget, setBudget] = useState(searchParams.get('budget') || '');
    const [startLocationId, setStartLocationId] = useState(searchParams.get('startLocationID') || '-1');
    const [endLocationId, setEndLocationId] = useState(searchParams.get('endLocationID') || '-1');
    const [transportation, setTransportation] = useState(searchParams.get('transportation') || '');

    // 2. Trạng thái cho Dropdown Search và Query
    const [startLocationSearch, setStartLocationSearch] = useState('');
    const [endLocationSearch, setEndLocationSearch] = useState('');
    const [isStartDropdownOpen, setIsStartDropdownOpen] = useState(false);
    const [isEndDropdownOpen, setIsEndDropdownOpen] = useState(false);

    // 3. Logic Fuzzy Search (Sử dụng useMemo để tối ưu)
    const filteredStartLocations = useMemo(() => {
        return fuzzySearch(startLocations, startLocationSearch);
    }, [startLocations, startLocationSearch]);

    const filteredEndLocations = useMemo(() => {
        return fuzzySearch(endLocations, endLocationSearch);
    }, [endLocations, endLocationSearch]);
    
    // Thiết lập tên hiển thị ban đầu dựa trên ID trong URL
    useEffect(() => {
        const currentStartLoc = startLocations.find(loc => loc.locationID.toString() === startLocationId);
        // Không setStartLocationSearch nếu đang gõ
        if (!isStartDropdownOpen) {
            setStartLocationSearch(currentStartLoc ? currentStartLoc.name : '');
        }
        
        const currentEndLoc = endLocations.find(loc => loc.locationID.toString() === endLocationId);
        // Không setEndLocationSearch nếu đang gõ
        if (!isEndDropdownOpen) {
            setEndLocationSearch(currentEndLoc ? currentEndLoc.name : '');
        }
    }, [startLocations, endLocations, startLocationId, endLocationId, isStartDropdownOpen, isEndDropdownOpen]);

    // 4. Hàm xử lý khi chọn địa điểm
    const handleLocationSelect = useCallback((location, type) => {
        if (type === 'start') {
            setStartLocationId(location.locationID.toString());
            setStartLocationSearch(location.name);
            setIsStartDropdownOpen(false);
        } else {
            setEndLocationId(location.locationID.toString());
            setEndLocationSearch(location.name);
            setIsEndDropdownOpen(false);
        }
    }, []);

    // 5. Hàm xử lý Tìm kiếm/Apply Filter
    const handleApplyFilter = (e) => {
        e.preventDefault();
        
        const newParams = {};
        
        // Chỉ thêm vào params nếu có giá trị
        if (searchNameTour) newParams.searchNameTour = searchNameTour;
        if (budget) newParams.budget = budget;
        if (startLocationId && startLocationId !== '-1') newParams.startLocationID = startLocationId;
        if (endLocationId && endLocationId !== '-1') newParams.endLocationID = endLocationId;
        if (transportation) newParams.transportation = transportation;

        // Cập nhật URL params
        setSearchParams(newParams, { replace: true });
        
        // Đóng dropdown sau khi áp dụng
        setIsStartDropdownOpen(false);
        setIsEndDropdownOpen(false);
    };

    // Hàm reset dropdown search khi mở/đóng
    const handleDropdownToggle = (type, isOpen) => {
        if (type === 'start') {
            setIsStartDropdownOpen(isOpen);
            if (isOpen) setStartLocationSearch(''); // Clear search on open
        } else {
            setIsEndDropdownOpen(isOpen);
            if (isOpen) setEndLocationSearch(''); // Clear search on open
        }
    };


    if (locationsLoading) return <div className={styles.filterContainer}>Đang tải bộ lọc...</div>;

    // ✨ KHÔNG CÒN KHỐI destinationHeader Ở ĐÂY

    return (
        <div className={styles.filterContainer}>
            {/* Thanh Tìm kiếm Tên Tour */}
            <form onSubmit={handleApplyFilter} className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Nơi bạn muốn đến..."
                    value={searchNameTour}
                    onChange={(e) => setSearchNameTour(e.target.value)}
                />
                {/* <button type="submit">Tìm kiếm</button> */}
            </form>
            
            <div className={styles.filterBlock}>
                {/* Ngân sách */}
                <div className={styles.filterSection}>
                    <h3 className={styles.filterTitle}>Ngân sách</h3>
                    <div className={styles.budgetOptions}>
                        {BUDGET_OPTIONS.map(opt => (
                            <button
                                key={opt}
                                className={budget === opt ? styles.active : ''}
                                onClick={() => setBudget(budget === opt ? '' : opt)}
                                type="button"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Điểm Khởi Hành */}
                <div className={styles.filterSection}>
                    <h3 className={styles.filterTitle}>Điểm khởi hành</h3>
                    <div className={styles.dropdown}>
                        <input
                            type="text"
                            // Hiển thị tên nếu dropdown đóng, hiển thị query nếu dropdown mở
                            value={isStartDropdownOpen ? startLocationSearch : (startLocations.find(loc => loc.locationID.toString() === startLocationId)?.name || 'Tất cả')}
                            onChange={(e) => setStartLocationSearch(e.target.value)}
                            onFocus={() => handleDropdownToggle('start', true)}
                            placeholder="Chọn hoặc tìm kiếm"
                            // Cho phép gõ khi dropdown mở, không cho gõ khi đóng để tránh lỗi hiển thị
                            readOnly={!isStartDropdownOpen}
                        />
                        {isStartDropdownOpen && (
                            <div className={styles.dropdownContent}>
                                {filteredStartLocations.map(loc => (
                                    <div 
                                        key={loc.locationID}
                                        className={styles.dropdownItem}
                                        onClick={() => handleLocationSelect(loc, 'start')}
                                    >
                                        {loc.name}
                                    </div>
                                ))}
                                {filteredStartLocations.length === 0 && <div className={styles.noResult}>Không tìm thấy</div>}
                            </div>
                        )}
                        <span className={styles.dropdownToggle} onClick={() => handleDropdownToggle('start', !isStartDropdownOpen)}>
                            {isStartDropdownOpen ? '▲' : '▼'}
                        </span>
                    </div>
                </div>

                {/* Điểm Đến */}
                <div className={styles.filterSection}>
                    <h3 className={styles.filterTitle}>Điểm đến</h3>
                    <div className={styles.dropdown}>
                        <input
                            type="text"
                            value={isEndDropdownOpen ? endLocationSearch : (endLocations.find(loc => loc.locationID.toString() === endLocationId)?.name || 'Tất cả')}
                            onChange={(e) => setEndLocationSearch(e.target.value)}
                            onFocus={() => handleDropdownToggle('end', true)}
                            placeholder="Chọn hoặc tìm kiếm"
                            readOnly={!isEndDropdownOpen}
                        />
                        {isEndDropdownOpen && (
                            <div className={styles.dropdownContent}>
                                {filteredEndLocations.map(loc => (
                                    <div 
                                        key={loc.locationID}
                                        className={styles.dropdownItem}
                                        onClick={() => handleLocationSelect(loc, 'end')}
                                    >
                                        {loc.name}
                                    </div>
                                ))}
                                {filteredEndLocations.length === 0 && <div className={styles.noResult}>Không tìm thấy</div>}
                            </div>
                        )}
                         <span className={styles.dropdownToggle} onClick={() => handleDropdownToggle('end', !isEndDropdownOpen)}>
                            {isEndDropdownOpen ? '▲' : '▼'}
                        </span>
                    </div>
                </div>

                {/* Phương Tiện */}
                <div className={styles.filterSection}>
                    <h3 className={styles.filterTitle}>Phương tiện</h3>
                    <div className={styles.transportationOptions}>
                        {TRANSPORTATION_OPTIONS.map(opt => (
                            <button
                                key={opt}
                                className={transportation === opt ? styles.active : ''}
                                onClick={() => setTransportation(transportation === opt ? '' : opt)}
                                type="button"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Nút Áp dụng */}
                <button 
                    className={styles.applyButton} 
                    onClick={handleApplyFilter}
                >
                    Áp dụng
                </button>
            </div>
        </div>
    );
};

export default FilterAndSearchInput;