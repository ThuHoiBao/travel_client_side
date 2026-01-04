import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosCustomize';
import styles from './BookingPayment.module.scss';
import { toast } from 'react-toastify';
import { 
  FaCheckCircle, 
  FaClock, 
  FaPlane, 
  FaBarcode,
  FaCreditCard,
  FaSpinner,
  FaChevronDown,
  FaChevronUp,
  FaTag,
  FaBus,
  FaTimes,
  FaExclamationTriangle
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
  const [paymentMethod, setPaymentMethod] = useState('PAYOS');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
        console.log('Booking data loaded:', data);
        setError(null);
      } catch (err) {
        console.error('Error fetching booking:', err);
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
      toast.error('Không tìm thấy thông tin booking');
      return;
    }

    if (bookingData.remainingAmount <= 0) {
      toast.info('Booking đã được thanh toán đầy đủ');
      return;
    }

    // Check payment deadline
    if (bookingData.paymentDeadline) {
      const deadline = new Date(bookingData.paymentDeadline);
      const now = new Date();
      if (now >= deadline) {
        toast.error('Thời hạn thanh toán đã hết. Booking của bạn có thể đã bị hủy.');
        return;
      }
    }

    setShowConfirmModal(true);
  };

  const handleConfirmPayment = async () => {
  setShowConfirmModal(false);

   try {
      setPaymentProcessing(true);
      let apiEndpoint = '';
      let paymentRequest = {};

      if (paymentMethod === 'VNPAY') {
        apiEndpoint = '/payment/vnpay/create';
        paymentRequest = {
            bookingCode: bookingData.bookingCode,
            amount: bookingData.remainingAmount,
            orderInfo: `Thanh toan booking ${bookingData.bookingCode}`,
            locale: 'vn'
        };
      } else if (paymentMethod === 'PAYOS') {
        apiEndpoint = '/payment/payos/create'; 
        paymentRequest = {
            bookingCode: bookingData.bookingCode,
            amount: bookingData.remainingAmount,
            description: `Thanh toan ${bookingData.bookingCode}`,
            returnUrl: window.location.origin + "/payment-waiting",
            cancelUrl: window.location.origin + "/payment-cancel"
        };
      }

      console.log(`Creating ${paymentMethod} payment request:`, paymentRequest);

      const response = await axios.post(apiEndpoint, paymentRequest);

      console.log('Payment response:', response);
      
      let paymentUrl = null;
      let orderCode = null;

      if (response.data?.checkoutUrl) {
          paymentUrl = response.data.checkoutUrl; 
          orderCode = response.data.transactionId; 
      } else if (response.data?.paymentUrl) {
          paymentUrl = response.data.paymentUrl; 
          orderCode = response.data.transactionId;
      } else if (response.paymentUrl) {
          paymentUrl = response.paymentUrl;
          orderCode = response.data.transactionId; 
      } else if (response.data?.data?.checkoutUrl) {
          paymentUrl = response.data.data.checkoutUrl;
          orderCode = response.data.transactionId; 
      } else if (response.data?.url) {
          paymentUrl = response.data.url;
          orderCode = response.data.transactionId; 
      }

      if (paymentUrl && orderCode) {
        console.log('Redirecting to PayOS:', paymentUrl);
        
        sessionStorage.setItem('pendingPaymentOrderCode', orderCode);
        sessionStorage.setItem('pendingPaymentBookingCode', bookingData.bookingCode);
        
        const paymentWindow = window.open(paymentUrl, '_blank');
        
        setTimeout(() => {
          window.location.href = `/payment-waiting?orderCode=${orderCode}&bookingCode=${bookingData.bookingCode}`;
        }, 1000);
        
      } else {
        throw new Error('Không tìm thấy đường dẫn thanh toán từ phản hồi server');
      }

    }catch (error) {
      console.error('Payment error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error
      });
      
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
  }

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
                  <h4>
                    {bookingData.outboundTransport.vehicleType === 'PLANE' ? (
                    <FaPlane className={styles.icon} />
                     ) : (
                     <FaBus className={styles.icon} />
                   )}
                     THÔNG TIN VỀ CHUYẾN ĐI
                  </h4>
                  
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
                          {bookingData.outboundTransport.vehicleType === 'PLANE' ? (
                         <FaPlane className={styles.planeIcon} />
                           ) : (
                             <FaBus className={styles.planeIcon} />
                          )}
                        </div>
                        <div className={styles.routeInfo}>
                          <span className={styles.airportCode} title={bookingData.outboundTransport.startPointName}>
                            {bookingData.outboundTransport.startPoint}
                          </span>
                          <span className={styles.airportCode} title={bookingData.outboundTransport.endPointName}>
                            {bookingData.outboundTransport.endPoint}
                          </span>
                        </div>
                           <p className={styles.flightInfo}>{bookingData.outboundTransport.vehicleName}</p>
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
                          {bookingData.inboundTransport.vehicleType === 'PLANE' ? (
                            <FaPlane className={styles.planeIcon} />
                              ) : (
                                <FaBus className={styles.planeIcon} />
                          )}
                        </div>
                        <div className={styles.routeInfo}>
                          <span className={styles.airportCode} title={bookingData.inboundTransport.startPointName}>
                            {bookingData.inboundTransport.startPoint}
                          </span>
                          <span className={styles.airportCode} title={bookingData.inboundTransport.endPointName}>
                            {bookingData.inboundTransport.endPoint}
                          </span>
                        </div>
                           <p className={styles.flightInfo}>{bookingData.inboundTransport.vehicleName}</p>
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
              {bookingData.status === 'PENDING_PAYMENT' && !isPaymentExpired && (
                <div className={styles.paymentMethodSelection}>
                  <h4>Chọn phương thức thanh toán:</h4>
                  
                  <div 
                    className={`${styles.methodOption} ${paymentMethod === 'VNPAY' ? styles.selected : ''}`}
                    onClick={() => setPaymentMethod('VNPAY')}
                  >
                    <div className={styles.radioCircle}>
                      {paymentMethod === 'VNPAY' && <div className={styles.innerCircle} />}
                    </div>
                    <img 
                      src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" 
                      alt="VNPAY" 
                      className={styles.methodLogo} 
                    />
                    <span>Ví VNPAY / Ngân hàng</span>
                  </div>

                  <div 
                    className={`${styles.methodOption} ${paymentMethod === 'PAYOS' ? styles.selected : ''}`}
                    onClick={() => setPaymentMethod('PAYOS')}
                  >
                    <div className={styles.radioCircle}>
                      {paymentMethod === 'PAYOS' && <div className={styles.innerCircle} />}
                    </div>
                    <img 
                      src="data:image/png;base64,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" 
                      alt="PayOS" 
                      className={styles.methodLogo} 
                      style={{height: '25px'}} 
                    />
                    <span>Quét mã VietQR (PayOS)</span>
                  </div>
                </div>
              )}
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

      {showConfirmModal && (
        <div className={styles.modalOverlay} onClick={() => setShowConfirmModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <FaExclamationTriangle className={styles.modalIcon} />
              <h3>Xác nhận thanh toán</h3>
              <button className={styles.closeBtn} onClick={() => setShowConfirmModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <p>Bạn đang thực hiện thanh toán cho booking <strong>{bookingData.bookingCode}</strong>.</p>
              <div className={styles.modalAmount}>
                <span>Số tiền:</span>
                <span className={styles.amountValue}>{formatCurrency(bookingData.remainingAmount)}</span>
              </div>
              <p className={styles.modalNote}>Phương thức: <strong>{paymentMethod === 'VNPAY' ? 'VNPAY' : 'VietQR (PayOS)'}</strong></p>
              <p>Bạn có chắc chắn muốn tiếp tục?</p>
            </div>

            <div className={styles.modalFooter}>
              <button 
                className={styles.btnCancel} 
                onClick={() => setShowConfirmModal(false)}
              >
                Hủy bỏ
              </button>
              <button 
                className={styles.btnConfirm} 
                onClick={handleConfirmPayment}
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPayment;