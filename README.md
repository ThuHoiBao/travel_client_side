# Future Travel — Client-Side Application

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-4.9.5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_Router-7.8.2-CA4245?style=for-the-badge&logo=reactrouter" alt="React Router" />
  <img src="https://img.shields.io/badge/Ant_Design-5.29.1-0170FE?style=for-the-badge&logo=antdesign" alt="Ant Design" />
  <img src="https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?style=for-the-badge&logo=bootstrap" alt="Bootstrap" />
</p>

---

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt & Chạy dự án](#cài-đặt--chạy-dự-án)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Kiến trúc & Luồng dữ liệu](#kiến-trúc--luồng-dữ-liệu)
- [Các trang & Định tuyến](#các-trang--định-tuyến)
- [Xác thực & Phân quyền](#xác-thực--phân-quyền)
- [Giao tiếp với Backend](#giao-tiếp-với-backend)
- [Biến môi trường](#biến-môi-trường)
- [Scripts](#scripts)

---

## Giới thiệu

**Future Travel** là ứng dụng web đặt tour du lịch trực tuyến được xây dựng bằng React 18 và TypeScript. Hệ thống cung cấp trải nghiệm tìm kiếm, xem chi tiết, đặt chỗ và thanh toán tour du lịch hoàn chỉnh cho khách hàng, đồng thời tích hợp bảng điều khiển quản trị đầy đủ tính năng cho admin.

Ứng dụng kết nối với backend Spring Boot thông qua RESTful API, WebSocket real-time và tích hợp chatbot AI hỗ trợ tư vấn tour thông minh.

---

## Tính năng

### Dành cho Khách hàng

| Tính năng | Mô tả |
|-----------|-------|
| **Trang chủ** | Hiển thị tour nổi bật, điểm đến hấp dẫn, banner khuyến mãi |
| **Tìm kiếm Tour** | Lọc theo điểm đến, ngân sách, phương tiện, đánh giá, khoảng thời gian |
| **Chi tiết Tour** | Thông tin đầy đủ: lịch trình, hình ảnh, lịch khởi hành, đánh giá, tour liên quan |
| **Đặt Tour** | Form đặt chỗ nhiều hành khách, áp dụng mã giảm giá, đổi điểm thưởng |
| **Thanh toán** | Thanh toán qua VNPay / PayOS, đồng hồ đếm ngược, theo dõi trạng thái |
| **Hồ sơ cá nhân** | Cập nhật thông tin, đổi avatar, xem lịch sử giao dịch |
| **Tour yêu thích** | Lưu và quản lý danh sách tour yêu thích |
| **Yêu cầu hoàn tiền** | Gửi thông tin tài khoản ngân hàng để hoàn tiền khi hủy tour |
| **Đánh giá Tour** | Viết review sau khi hoàn thành chuyến đi |
| **Chatbot AI** | Hỏi đáp tư vấn tour thông minh được hỗ trợ bởi Gemini AI |
| **Thông báo real-time** | Nhận thông báo tức thời qua WebSocket |

### Dành cho Admin

| Tính năng | Mô tả |
|-----------|-------|
| **Dashboard** | Thống kê doanh thu, số lượng đặt tour, người dùng mới |
| **Quản lý Tour** | CRUD tour: thêm, sửa, xóa, cập nhật hình ảnh/video |
| **Quản lý Lịch khởi hành** | Tạo, clone, cập nhật giá và phương tiện cho từng chuyến |
| **Quản lý Người dùng** | Tìm kiếm, cập nhật trạng thái tài khoản |
| **Quản lý Đặt tour** | Xem, tìm kiếm, cập nhật trạng thái booking |
| **Quản lý Mã giảm giá** | Tạo và quản lý coupon toàn hệ thống hoặc theo chuyến |
| **Quản lý Điểm đến** | CRUD locations, upload hình ảnh điểm đến |
| **Quản lý Chi nhánh & Chính sách** | Thông tin chi nhánh, mẫu chính sách hủy/hoàn tiền |
| **Thông báo Admin** | Quản lý và gửi thông báo hệ thống |
| **Phân tích AI** | Phân tích dữ liệu kinh doanh được hỗ trợ bởi AI |

---

## Công nghệ sử dụng

### Core

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| [React](https://reactjs.org/) | 18.3.1 | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | 4.9.5 | Type safety |
| [React Router DOM](https://reactrouter.com/) | 7.8.2 | Client-side routing |
| [Create React App](https://create-react-app.dev/) | 5.0.1 | Build toolchain |

### UI & Giao diện

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| [Ant Design](https://ant.design/) | 5.29.1 | Component library chính |
| [Bootstrap](https://getbootstrap.com/) | 5.3.8 | Responsive grid & utilities |
| [React Bootstrap](https://react-bootstrap.github.io/) | 2.10.10 | Bootstrap components for React |
| [Lucide React](https://lucide.dev/) | 0.542.0 | Icon library |
| [React Icons](https://react-icons.github.io/) | 5.5.0 | Icon bổ sung |
| [FontAwesome](https://fontawesome.com/) | 7.0.1 | Icon bổ sung |
| [Swiper](https://swiperjs.com/) | 11.2.10 | Carousel / slider |
| [Tippy.js](https://atomiks.github.io/tippyjs/) | 4.2.6 | Tooltip & popover |
| [SASS](https://sass-lang.com/) | 1.96.0 | CSS preprocessor |

### Form & Input

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| [React Select](https://react-select.com/) | 5.10.2 | Dropdown select nâng cao |
| [React DatePicker](https://reactdatepicker.com/) | 8.10.0 | Date picker |
| [React iMask](https://imask.js.org/) | 7.6.1 | Input masking (số điện thoại, thẻ, ...) |
| [RC Slider](https://slider-react-component.vercel.app/) | 11.1.9 | Thanh kéo lọc giá |

### Dữ liệu & State Management

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| [Axios](https://axios-http.com/) | 1.13.2 | HTTP client với interceptors |
| [Redux Toolkit](https://redux-toolkit.js.org/) | 2.8.2 | Global state (chuẩn bị mở rộng) |
| [React Redux](https://react-redux.js.org/) | 9.2.0 | Redux binding cho React |
| [Recharts](https://recharts.org/) | 3.6.0 | Biểu đồ dashboard |
| [date-fns](https://date-fns.org/) | 4.1.0 | Xử lý ngày tháng |
| [Fuse.js](https://fusejs.io/) | 7.1.0 | Tìm kiếm mờ (fuzzy search) |

### Real-time & Xác thực

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| [StompJS](https://stomp-js.github.io/) | 7.2.1 | STOMP over WebSocket |
| [SockJS Client](https://github.com/sockjs/sockjs-client) | 1.6.1 | WebSocket fallback |
| [Socket.io Client](https://socket.io/) | 4.8.1 | WebSocket alternative |
| [@react-oauth/google](https://github.com/MomenSherif/react-oauth) | 0.12.2 | Google OAuth 2.0 |

### Tiện ích UI

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| [React Toastify](https://fkhadra.github.io/react-toastify/) | 11.0.5 | Notification toast |
| [React Confetti](https://github.com/alampros/react-confetti) | 6.4.0 | Hiệu ứng ăn mừng thanh toán thành công |
| [React Quill](https://zenoamaro.github.io/react-quill/) | 2.0.0 | Rich text editor (admin) |
| [React Markdown](https://github.com/remarkjs/react-markdown) | 10.1.0 | Render markdown trong chatbot |

---

## Yêu cầu hệ thống

- **Node.js** ≥ 16.x
- **npm** ≥ 8.x hoặc **yarn** ≥ 1.22
- Backend [Tourism_Backend](../Tourism_Backend/README.md) đang chạy tại `http://localhost:8080`

---

## Cài đặt & Chạy dự án

### 1. Clone repository

```bash
git clone <repository-url>
cd client-side
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` tại thư mục gốc:

```env
REACT_APP_API_URL=http://localhost:8080
```

### 4. Chạy ứng dụng (Development)

```bash
npm start
```

Ứng dụng sẽ chạy tại: **http://localhost:3000**

### 5. Build Production

```bash
npm run build
```

Output sẽ được tạo trong thư mục `/build`.

### 6. Chạy Tests

```bash
npm test
```

---

## Cấu trúc dự án

```
client-side/
├── public/                         # Static assets & index.html
├── src/
│   ├── assets/
│   │   ├── fonts/                  # Custom fonts
│   │   └── images/                 # Hình ảnh tĩnh
│   │
│   ├── components/
│   │   ├── AdminComponent/         # Toàn bộ giao diện Admin
│   │   │   ├── AdminLayout/        # Layout admin (sidebar, header)
│   │   │   ├── AdminProtectedRoute.jsx
│   │   │   ├── AdminProfile.jsx
│   │   │   └── Pages/
│   │   │       ├── BookingsPage/   # Quản lý đặt tour
│   │   │       ├── BranchPolicyPage/ # Chi nhánh & chính sách
│   │   │       ├── CounsPage/      # Mã giảm giá
│   │   │       ├── DashboardPage/  # Thống kê
│   │   │       ├── DepartureManagement/ # Lịch khởi hành
│   │   │       ├── LocationsPage/  # Điểm đến
│   │   │       ├── NotificationsPage/ # Thông báo
│   │   │       ├── ToursPage/      # Quản lý tour
│   │   │       └── UsersPage/      # Quản lý người dùng
│   │   │
│   │   ├── BookingPaymentComponent/ # Thanh toán & kết quả
│   │   │   ├── BookingPayment.jsx
│   │   │   ├── PaymentSuccess.jsx
│   │   │   ├── PaymentFailed.jsx
│   │   │   ├── PaymentError.jsx
│   │   │   └── PaymentWaitingPage.jsx
│   │   │
│   │   ├── ChatbotWidget/          # Widget chatbot AI
│   │   │   ├── ChatbotWidget.jsx
│   │   │   └── chatbotUtils.js
│   │   │
│   │   ├── Commons/                # Component dùng chung
│   │   │   └── ConfirmModal.jsx
│   │   │
│   │   ├── DestinationSearchComponent/ # Tìm kiếm điểm đến
│   │   ├── FooterComponent/        # Footer chung
│   │   ├── HeaderComponent/        # Header chung
│   │   ├── homPageComponent/       # Trang chủ
│   │   │
│   │   ├── InformationComponent/   # Hồ sơ người dùng
│   │   │   ├── FavoriteTours/      # Tour yêu thích
│   │   │   ├── PersonalProfile/    # Thông tin cá nhân
│   │   │   ├── SidebarMenu/        # Sidebar điều hướng
│   │   │   └── TransactionList/    # Lịch sử giao dịch
│   │   │       └── TransactionListItem/
│   │   │           └── RefundInfoModal/ # Modal yêu cầu hoàn tiền
│   │   │
│   │   ├── LayoutComponent/
│   │   │   └── MainLayout.jsx      # Layout chính (có header/footer)
│   │   │
│   │   ├── Login/                  # Trang đăng nhập
│   │   ├── RegisterComponent/      # Trang đăng ký
│   │   ├── TourBookingComponent/   # Form đặt tour
│   │   │   ├── DateInput/
│   │   │   ├── PointRedemption/    # Đổi điểm thưởng
│   │   │   └── TourBooking.jsx
│   │   │
│   │   ├── TourDetailComponent/    # Chi tiết tour
│   │   │   ├── ImageModal/         # Gallery hình ảnh
│   │   │   ├── RelatedTours/       # Tour liên quan
│   │   │   ├── TourCalendar/       # Lịch khởi hành
│   │   │   ├── TourInformation/    # Thông tin tổng quát
│   │   │   ├── TourItinerary/      # Lịch trình
│   │   │   ├── TourPolicy/         # Chính sách tour
│   │   │   └── TourReview/         # Đánh giá & review
│   │   │
│   │   ├── toursPageComponent/     # Danh sách tour
│   │   ├── VerifyEmail/            # Xác thực email
│   │   └── ProtectedRoute.jsx      # Route bảo vệ (user)
│   │
│   ├── context/
│   │   └── AuthContext.jsx         # Global auth state
│   │
│   ├── data/
│   │   └── vietnam-provinces.json  # Dữ liệu tỉnh/thành Việt Nam
│   │
│   ├── dto/
│   │   ├── requestDTO/             # Kiểu dữ liệu gửi lên server
│   │   └── responseDTO/            # Kiểu dữ liệu nhận từ server
│   │
│   ├── hook/                       # Custom React Hooks
│   │   ├── useAdminBookings.ts
│   │   ├── useAdminUsers.ts
│   │   ├── useBookings.ts
│   │   ├── useDashboard.ts
│   │   ├── useFavoriteDestinations.ts
│   │   ├── useFeaturedTours.ts
│   │   ├── useLocations.ts
│   │   ├── useSpecialTours.ts
│   │   ├── useUser.ts
│   │   └── useWebSocket.ts
│   │
│   ├── services/                   # API service layer
│   │   ├── api.ts                  # API client cấu hình
│   │   ├── mapbox.ts               # Mapbox integration
│   │   ├── websocket.js            # WebSocket client
│   │   ├── booking/
│   │   ├── dashboard/
│   │   ├── favoriteTour/
│   │   ├── location/
│   │   ├── payment/
│   │   ├── review/
│   │   ├── tours/
│   │   └── user/
│   │
│   ├── utils/
│   │   ├── axiosCustomize.js       # Axios interceptors & cấu hình
│   │   └── ScrollToTop.jsx         # Scroll to top khi chuyển route
│   │
│   ├── App.tsx                     # Root component & routing
│   ├── index.tsx                   # Entry point
│   ├── App.css
│   └── index.css
│
├── .env                            # Biến môi trường
└── package.json
```

---

## Kiến trúc & Luồng dữ liệu

```
┌─────────────────────────────────────────────────────────────┐
│                       React Application                     │
│                                                             │
│  ┌─────────────┐   ┌──────────────┐   ┌───────────────┐   │
│  │  Components │◄─►│ Custom Hooks │◄─►│   Services /  │   │
│  │  (UI Layer) │   │ (Data Layer) │   │   API Client  │   │
│  └─────────────┘   └──────────────┘   └───────┬───────┘   │
│         │                 │                    │            │
│  ┌──────▼─────────────────▼────────┐           │            │
│  │         Context API             │           │            │
│  │  (AuthContext — Global State)   │           │            │
│  └─────────────────────────────────┘           │            │
│                                                │            │
└────────────────────────────────────────────────┼────────────┘
                                                 │
                          ┌──────────────────────▼──────────┐
                          │         Backend API             │
                          │   Spring Boot — localhost:8080  │
                          │                                 │
                          │  ┌──────────┐  ┌────────────┐  │
                          │  │ REST API  │  │ WebSocket  │  │
                          │  │  (HTTP)   │  │  (STOMP)   │  │
                          │  └──────────┘  └────────────┘  │
                          └─────────────────────────────────┘
```

### Quản lý State

| Phương thức | Phạm vi | Dữ liệu |
|-------------|---------|---------|
| **Context API** | Global | User session, authentication |
| **Custom Hooks** | Component-level | API data, loading/error states |
| **Local State** | Component | Form data, UI state |
| **Redux Toolkit** | Global (sẵn sàng mở rộng) | Được cài đặt, sẵn sàng sử dụng |

---

## Các trang & Định tuyến

### Public Routes (có Header/Footer)

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/` | `HomePage` | Trang chủ |
| `/tours` | `ToursPage` | Danh sách & tìm kiếm tour |
| `/tour/:tourCode` | `TourDetail` | Chi tiết tour |
| `/order-booking` | `TourBooking` | Form đặt tour |
| `/payment-booking` | `BookingPayment` | Trang thanh toán |
| `/payment-success` | `PaymentSuccess` | Thanh toán thành công |
| `/payment-failed` | `PaymentFailed` | Thanh toán thất bại |
| `/payment-waiting` | `PaymentWaitingPage` | Đang chờ xác nhận |
| `/payment-error` | `PaymentError` | Lỗi thanh toán |
| `/information` | `InformationComponent` | Hồ sơ người dùng |
| `/information/:tab` | `InformationComponent` | Tab cụ thể trong hồ sơ |
| `/register` | `Register` | Đăng ký tài khoản |
| `/login` | `Login` | Đăng nhập |
| `/verify-email` | `VerifyEmail` | Xác thực email |

### Admin Routes (không có Header/Footer, yêu cầu role ADMIN)

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/admin/login` | `AdminLogin` | Đăng nhập admin |
| `/admin/dashboard` | `DashboardPage` | Bảng thống kê |
| `/admin/profile` | `AdminProfile` | Hồ sơ admin |
| `/admin/tours` | `ToursPage (Admin)` | Quản lý tour |
| `/admin/departures` | `DepartureList` | Quản lý lịch khởi hành |
| `/admin/users` | `UsersPage` | Quản lý người dùng |
| `/admin/bookings` | `BookingsPage` | Quản lý đặt tour |
| `/admin/coupons` | `CouponManagement` | Quản lý mã giảm giá |
| `/admin/locations` | `LocationManager` | Quản lý điểm đến |
| `/admin/branches-policies` | `BranchPolicyManagement` | Chi nhánh & chính sách |
| `/admin/notifications` | `NotificationsPage` | Thông báo hệ thống |

---

## Xác thực & Phân quyền

### Luồng xác thực

```
Người dùng
    │
    ├── Đăng nhập email/mật khẩu ──► POST /api/auth/login
    │                                        │
    └── Đăng nhập Google OAuth  ──► POST /api/auth/google/login
                                             │
                                      ┌──────▼──────┐
                                      │  JWT Tokens  │
                                      │  accessToken (15 phút)
                                      │  refreshToken (7 ngày)
                                      └──────┬──────┘
                                             │ Lưu vào localStorage
                                      ┌──────▼──────────┐
                                      │   AuthContext   │
                                      │  isAuthenticated│
                                      │  user profile   │
                                      └─────────────────┘
```

### Token Refresh tự động

Axios interceptor tự động:
1. Phát hiện response `401 Unauthorized`
2. Gọi `POST /api/auth/refresh-token` với refresh token
3. Cập nhật `accessToken` mới vào localStorage
4. Tự động retry request gốc
5. Nếu refresh thất bại → logout và redirect về `/login`

### Phân quyền Routes

```jsx
// Route bảo vệ người dùng (cần đăng nhập)
<ProtectedRoute>
  <InformationComponent />
</ProtectedRoute>

// Route bảo vệ Admin (cần role ADMIN)
<AdminProtectedRoute>
  <DashboardPage />
</AdminProtectedRoute>
```

---

## Giao tiếp với Backend

### REST API

**Base URL:** `http://localhost:8080/api`

**Cấu hình Axios** (`src/utils/axiosCustomize.js`):
- Tự động đính kèm `Bearer <accessToken>` vào mỗi request
- Tự động refresh token khi nhận `401`
- Xử lý lỗi tập trung và hiển thị toast notification

### WebSocket (Real-time)

**Endpoint:** `http://localhost:8080/ws` (STOMP over SockJS)

```javascript
// Subscribe nhận thông báo người dùng
stompClient.subscribe('/topic/user/<userId>', callback);

// Subscribe cập nhật trạng thái booking
stompClient.subscribe('/topic/booking/<bookingCode>', callback);
```

### Các nhóm API chính

| Nhóm | Endpoint | Mô tả |
|------|----------|-------|
| Auth | `/api/auth/*` | Đăng nhập, đăng ký, refresh token |
| Tours | `/api/tours/*` | Duyệt, tìm kiếm, chi tiết tour |
| Booking | `/api/bookings/*` | Đặt tour, hủy, hoàn tiền |
| Payment | `/api/payment/*` | Tạo thanh toán, callback |
| User | `/api/users/*` | Hồ sơ, cập nhật thông tin |
| Reviews | `/api/reviews/*` | Gửi và xem đánh giá |
| Notifications | `/api/notifications/*` | Thông báo người dùng |
| Chatbot | `/api/chatbot/*` | Hỏi đáp AI |
| Admin | `/api/admin/*` | Các nghiệp vụ quản trị |

---

## Biến môi trường

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `REACT_APP_API_URL` | `http://localhost:8080` | URL của backend API |

> **Lưu ý bảo mật:** Với môi trường production, hãy chuyển Google OAuth Client ID sang biến môi trường `REACT_APP_GOOGLE_CLIENT_ID` thay vì nhúng trực tiếp vào code.

---

## Scripts

| Script | Lệnh | Mô tả |
|--------|------|-------|
| **Development** | `npm start` | Khởi chạy dev server tại port 3000 |
| **Production Build** | `npm run build` | Build tối ưu vào thư mục `/build` |
| **Test** | `npm test` | Chạy Jest test runner ở chế độ watch |
| **Eject** | `npm run eject` | Xuất cấu hình CRA (không thể hoàn tác) |

---

<p align="center">Made with ❤️ — Future Travel Team</p>
