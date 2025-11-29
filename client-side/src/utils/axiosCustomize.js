import axios from 'axios';

// Tạo một instance của axios với cấu hình mặc định
const instance = axios.create({
    // Lấy URL từ file .env
    baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080/api', 
    
    // (Tùy chọn) Thời gian chờ tối đa (10 giây)
    timeout: 10000, 
    
    // (Tùy chọn) Headers mặc định
    headers: {
        'Content-Type': 'application/json',
    }
});

// --- (Nâng cao) Cấu hình Interceptors (Bộ đón chặn) ---
// Giúp tự động đính kèm Token vào mọi request hoặc xử lý lỗi chung

// 1. Trước khi gửi request đi
instance.interceptors.request.use(function (config) {
    // Ví dụ: Lấy token từ localStorage và gắn vào header
    // const token = localStorage.getItem('access_token');
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 2. Sau khi nhận response về
instance.interceptors.response.use(function (response) {
    // Trả về data luôn cho gọn (bỏ qua lớp .data của axios)
    // Ví dụ: thay vì response.data.data thì giờ chỉ cần response.data
    return response.data ? response.data : response; 
}, function (error) {
    // Xử lý lỗi chung (VD: Token hết hạn thì logout)
    return Promise.reject(error);
});

export default instance;