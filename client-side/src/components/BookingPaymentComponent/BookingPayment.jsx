import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosCustomize';
import styles from './BookingPayment.module.scss';
import { 
  FaCheckCircle, 
  FaClock, 
  FaPlane, 
  FaBarcode,
  FaCreditCard,
  FaSpinner,
  FaChevronDown,
  FaChevronUp,
  FaTag
} from 'react-icons/fa';

const BookingPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingCode = searchParams.get('bookingCode');
  
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [showPassengers, setShowPassengers] = useState(false);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingCode) {
        setError('Không tìm thấy mã booking');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching booking data for code:', bookingCode);
        const response = await axios.get(`/bookings/payment/${bookingCode}`);
        
        const data = response.data || response;
        setBookingData(data);
        console.log('✅ Booking data loaded:', data);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching booking:', err);
        const errorMsg = err.response?.data?.message || 
                        err.response?.data?.error || 
                        'Không thể tải thông tin booking. Vui lòng thử lại.';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingCode]);

  // Countdown timer
  useEffect(() => {
    if (!bookingData?.paymentDeadline) return;

    const updateTimer = () => {
      const deadline = new Date(bookingData.paymentDeadline);
      const now = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeRemaining('Đã hết hạn');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [bookingData]);

  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      'PENDING_PAYMENT': 'Chờ thanh toán',
      'CONFIRMED': 'Đã xác nhận',
      'PAID': 'Đã thanh toán',
      'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getPassengerTypeText = (type) => {
    const typeMap = {
      'ADULT': 'Người lớn',
      'CHILD': 'Trẻ em',
      'TODDLER': 'Trẻ nhỏ',
      'INFANT': 'Em bé'
    };
    return typeMap[type] || type;
  };

  const handlePayment = async () => {
    // Validate booking data
    if (!bookingData) {
      alert('Không tìm thấy thông tin booking');
      return;
    }

    if (bookingData.remainingAmount <= 0) {
      alert('Booking đã được thanh toán đầy đủ');
      return;
    }

    // Check payment deadline
    if (bookingData.paymentDeadline) {
      const deadline = new Date(bookingData.paymentDeadline);
      const now = new Date();
      if (now >= deadline) {
        alert('Thời hạn thanh toán đã hết. Booking của bạn có thể đã bị hủy.');
        return;
      }
    }

    // Confirm with user
    const confirmPayment = window.confirm(
      `Bạn có chắc muốn thanh toán ${formatCurrency(bookingData.remainingAmount)} cho booking ${bookingData.bookingCode}?`
    );
    
    if (!confirmPayment) {
      return;
    }

    try {
      setPaymentProcessing(true);
      
      const paymentRequest = {
        bookingCode: bookingData.bookingCode,
        amount: bookingData.remainingAmount,
        orderInfo: `Booking ${bookingData.bookingCode}`, // Simplified format for easier extraction
        locale: 'vn'
      };

      console.log('📤 Creating payment request:', paymentRequest);

      const response = await axios.post('/payment/vnpay/create', paymentRequest);

      console.log('📥 Payment response:', response);
      
      // Handle different response structures
      let paymentData;
      if (response.data?.data) {
        paymentData = response.data.data;
      } else if (response.data) {
        paymentData = response.data;
      } else {
        paymentData = response;
      }
      
      console.log('💳 Payment data:', paymentData);

      // Check for payment URL
      if (paymentData.paymentUrl) {
        console.log('✅ Redirecting to VNPay:', paymentData.paymentUrl);
        // Store booking code in sessionStorage for return handling
        sessionStorage.setItem('pendingPaymentBookingCode', bookingData.bookingCode);
        window.location.href = paymentData.paymentUrl;
      } else if (paymentData.code === '00' && paymentData.url) {
        // Alternative response structure
        console.log('✅ Redirecting to VNPay (alternative):', paymentData.url);
        sessionStorage.setItem('pendingPaymentBookingCode', bookingData.bookingCode);
        window.location.href = paymentData.url;
      } else {
        // Payment creation failed
        const errorMessage = paymentData.message || 'Không thể tạo thanh toán';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Payment error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error
      });
      
      // Extract user-friendly error message
      let errorMessage = 'Không thể tạo thanh toán. Vui lòng thử lại sau.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message && !error.message.includes('Network Error')) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.spinner} />
          <p>Đang tải thông tin booking...</p>
        </div>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorContainer}>
          <h3>⚠️ {error || 'Không tìm thấy thông tin booking'}</h3>
          <button onClick={() => navigate('/')}>Về trang chủ</button>
        </div>
      </div>
    );
  }

  const isPaymentExpired = bookingData.paymentDeadline && 
    new Date(bookingData.paymentDeadline) <= new Date();

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        {/* Stepper */}
        <div className={styles.stepperContainer}>
          <h1 className={styles.pageTitle}>ĐẶT TOUR</h1>
          <div className={styles.stepper}>
            <div className={`${styles.step} ${styles.completed}`}>
              <div className={styles.icon}><FaCheckCircle /></div>
              <span>NHẬP THÔNG TIN</span>
            </div>
            <div className={`${styles.line} ${styles.completed}`}></div>
            <div className={`${styles.step} ${styles.active}`}>
              <div className={styles.icon}>2</div>
              <span>THANH TOÁN</span>
            </div>
            <div className={styles.line}></div>
            <div className={styles.step}>
              <div className={styles.icon}>3</div>
              <span>HOÀN TẤT</span>
            </div>
          </div>
        </div>

        <div className={styles.paymentLayout}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Booking Details */}
            <section className={styles.section}>
              <h2 className={styles.sectionHeader}>CHI TIẾT BOOKING</h2>
              <div className={styles.bookingDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Mã đặt chỗ:</span>
                  <span className={`${styles.value} ${styles.highlight}`}>
                    {bookingData.bookingCode}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Ngày tạo:</span>
                  <span className={styles.value}>
                    {formatDateTime(bookingData.createdDate)}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Trạng thái:</span>
                  <span className={`${styles.value} ${styles.statusBadge}`}>
                    {getStatusText(bookingData.status)}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Trị giá booking:</span>
                  <span className={`${styles.value} ${styles.price}`}>
                    {formatCurrency(bookingData.originalPrice)}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Số tiền đã thanh toán:</span>
                  <span className={styles.value}>
                    {formatCurrency(bookingData.paidAmount)}
                  </span>
                </div>
                <div className={`${styles.detailRow} ${styles.total}`}>
                  <span className={styles.label}>Số tiền còn lại:</span>
                  <span className={`${styles.value} ${styles.priceHighlight}`}>
                    {formatCurrency(bookingData.remainingAmount)}
                  </span>
                </div>
                
                {/* Applied Coupons */}
                {bookingData.appliedCouponCodes && bookingData.appliedCouponCodes.length > 0 && (
                  <div className={styles.detailRow}>
                    <span className={styles.label}>
                      <FaTag /> Mã giảm giá đã áp dụng:
                    </span>
                    <span className={styles.value}>
                      {bookingData.appliedCouponCodes.map((code, index) => (
                        <span key={index} className={styles.couponTag}>
                          {code}
                        </span>
                      ))}
                    </span>
                  </div>
                )}

                <div className={`${styles.detailRow} ${styles.deadline}`}>
                  <span className={styles.label}>
                    <FaClock /> Thời hạn thanh toán:
                  </span>
                  <span className={styles.value}>
                    {formatDateTime(bookingData.paymentDeadline)}
                    <span className={`${styles.timer} ${isPaymentExpired ? styles.expired : ''}`}>
                      {' '}(Còn lại: {timeRemaining})
                    </span>
                  </span>
                </div>

                {bookingData.status === 'PENDING_PAYMENT' && !isPaymentExpired && (
                  <div className={styles.warningBox}>
                    ⚠️ Vui lòng thanh toán trước thời hạn để giữ chỗ. 
                    Booking sẽ tự động hủy nếu quá hạn thanh toán.
                  </div>
                )}

                {isPaymentExpired && bookingData.status === 'PENDING_PAYMENT' && (
                  <div className={styles.errorBox}>
                    ❌ Thời hạn thanh toán đã hết. Booking này có thể đã bị hủy.
                  </div>
                )}
              </div>
            </section>

            {/* Passenger List */}
            <section className={styles.section}>
              <h2 
                className={styles.collapsibleHeader}
                onClick={() => setShowPassengers(!showPassengers)}
              >
                DANH SÁCH HÀNH KHÁCH ({bookingData.passengers?.length || 0} người)
                {showPassengers ? <FaChevronUp /> : <FaChevronDown />}
              </h2>
              
              {showPassengers && (
                <div className={styles.passengerTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Họ tên</th>
                        <th>Ngày sinh</th>
                        <th>Giới tính</th>
                        <th>Loại</th>
                        <th>Phòng đơn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingData.passengers?.map((passenger, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{passenger.fullName}</td>
                          <td>{formatDate(passenger.dateOfBirth)}</td>
                          <td>{passenger.gender}</td>
                          <td>{getPassengerTypeText(passenger.type)}</td>
                          <td>
                            {passenger.singleRoom ? (
                              <span className={styles.yesTag}>Có</span>
                            ) : (
                              <span className={styles.noTag}>Không</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>PHIẾU XÁC NHẬN BOOKING</h3>
              
              {/* Tour Info */}
              <div className={styles.tourSummary}>
                <img 
                  src={bookingData.tourImage} 
                  alt={bookingData.tourName} 
                  className={styles.tourImg}
                />
                <div className={styles.tourInfo}>
                  <h4>{bookingData.tourName}</h4>
                  <div className={styles.tourMeta}>
                    <div className={styles.metaItem}>
                      <FaBarcode /> {bookingData.bookingCode}
                    </div>
                    <div className={styles.metaItem}>
                      <FaBarcode /> {bookingData.tourCode}
                    </div>
                    <div className={styles.metaItem}>
                      <FaClock /> {bookingData.duration}
                    </div>
                  </div>
                </div>
              </div>

              {/* Flight Info */}
              {(bookingData.outboundTransport || bookingData.inboundTransport) && (
                <div className={styles.flightInfoContainer}>
                  <h4><FaPlane /> THÔNG TIN CHUYẾN BAY</h4>
                  
                  <div className={styles.flightSection}>
                    {/* Outbound */}
                    {bookingData.outboundTransport && (
                      <div className={styles.flightColumn}>
                        <div className={styles.topRow}>
                          <span className={styles.label}>
                            Ngày đi - {formatDate(bookingData.outboundTransport.departTime)}
                          </span>
                          <span className={styles.flightCode}>
                            {bookingData.outboundTransport.transportCode}
                          </span>
                        </div>
                        <div className={styles.timeRow}>
                          <span className={styles.time}>
                            {new Date(bookingData.outboundTransport.departTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                          </span>
                          <span className={styles.time}>
                            {new Date(bookingData.outboundTransport.arrivalTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                          </span>
                        </div>
                        <div className={styles.timelineBar}>
                          <div className={styles.dotLeft}></div>
                          <div className={styles.line}></div>
                          <div className={styles.dotRight}></div>
                          <FaPlane className={styles.planeIcon} />
                        </div>
                        <div className={styles.routeInfo}>
                          <span className={styles.airportCode} title={bookingData.outboundTransport.startPointName}>
                            {bookingData.outboundTransport.startPoint}
                          </span>
                          <span className={styles.airportCode} title={bookingData.outboundTransport.endPointName}>
                            {bookingData.outboundTransport.endPoint}
                          </span>
                        </div>
                      </div>
                    )}

                    {bookingData.outboundTransport && bookingData.inboundTransport && (
                      <div className={styles.dividerDashed}></div>
                    )}

                    {/* Inbound */}
                    {bookingData.inboundTransport && (
                      <div className={styles.flightColumn}>
                        <div className={styles.topRow}>
                          <span className={styles.label}>
                            Ngày về - {formatDate(bookingData.inboundTransport.departTime)}
                          </span>
                          <span className={styles.flightCode}>
                            {bookingData.inboundTransport.transportCode}
                          </span>
                        </div>
                        <div className={styles.timeRow}>
                          <span className={styles.time}>
                            {new Date(bookingData.inboundTransport.departTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                          </span>
                          <span className={styles.time}>
                            {new Date(bookingData.inboundTransport.arrivalTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                          </span>
                        </div>
                        <div className={styles.timelineBar}>
                          <div className={styles.dotLeft}></div>
                          <div className={styles.line}></div>
                          <div className={styles.dotRight}></div>
                          <FaPlane className={`${styles.planeIcon} ${styles.return}`} />
                        </div>
                        <div className={styles.routeInfo}>
                          <span className={styles.airportCode} title={bookingData.inboundTransport.startPointName}>
                            {bookingData.inboundTransport.startPoint}
                          </span>
                          <span className={styles.airportCode} title={bookingData.inboundTransport.endPointName}>
                            {bookingData.inboundTransport.endPoint}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className={styles.paymentSummary}>
                <div className={styles.summaryRow}>
                  <span>Tổng giá trị:</span>
                  <span>{formatCurrency(bookingData.originalPrice)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Đã thanh toán:</span>
                  <span className={styles.paidAmount}>
                    {formatCurrency(bookingData.paidAmount)}
                  </span>
                </div>
                <div className={`${styles.summaryRow} ${styles.total}`}>
                  <span>Còn phải trả:</span>
                  <span className={styles.remainingAmount}>
                    {formatCurrency(bookingData.remainingAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            {bookingData.status === 'PENDING_PAYMENT' && 
             bookingData.remainingAmount > 0 && 
             !isPaymentExpired && (
              <button 
                className={styles.btnPayment} 
                onClick={handlePayment}
                disabled={paymentProcessing}
              >
                {paymentProcessing ? (
                  <>
                    <FaSpinner className={styles.spinner} /> Đang xử lý...
                  </>
                ) : (
                  <>
                    <FaCreditCard /> Thanh toán {formatCurrency(bookingData.remainingAmount)}
                  </>
                )}
              </button>
            )}

            {bookingData.status === 'PAID' && (
              <div className={styles.successMessage}>
                <FaCheckCircle /> Đã thanh toán đầy đủ
              </div>
            )}

            {isPaymentExpired && bookingData.status === 'PENDING_PAYMENT' && (
              <div className={styles.expiredMessage}>
                ❌ Thời hạn thanh toán đã hết
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingPayment;