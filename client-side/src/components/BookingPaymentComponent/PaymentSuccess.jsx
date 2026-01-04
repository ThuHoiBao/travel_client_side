// PaymentSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaDownload, FaEnvelope, FaHome } from 'react-icons/fa';
import Confetti from 'react-confetti';
import styles from './PaymentResult.module.scss';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingCode = searchParams.get('bookingCode');

  const [showConfetti, setShowConfetti] = useState(true);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(confettiTimer);
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  return (
    <div className={styles.container}>
      {showConfetti && <Confetti />}

      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <FaCheckCircle />
        </div>

        <h1>Thanh toán thành công!</h1>
        <p className={styles.subtitle}>
          Cảm ơn bạn đã đặt tour. Chuyến đi của bạn đã sẵn sàng ✈️
        </p>

        <div className={styles.bookingCode}>
          Mã booking: <strong>{bookingCode}</strong>
        </div>

        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <span>Trạng thái</span>
            <strong className={styles.success}>Đã thanh toán</strong>
          </div>
          <div className={styles.infoItem}>
            <span>Phương thức</span>
            <strong>VNPay</strong>
          </div>
          <div className={styles.infoItem}>
            <span>Thời gian</span>
            <strong>{new Date().toLocaleString('vi-VN')}</strong>
          </div>
        </div>

        <div className={styles.notice}>
          <FaEnvelope />
          <span>Email xác nhận đã được gửi đến bạn</span>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
            onClick={() =>
              navigate(`/payment-booking?bookingCode=${bookingCode}`)
            }
          >
            <FaDownload />
            Xem chi tiết
          </button>

          <button className={styles.secondaryBtn} onClick={() => navigate('/')}>
            <FaHome />
            Trang chủ
          </button>
        </div>

        <div className={styles.countdown}>
          Tự động quay về trang chủ sau <strong>{countdown}s</strong>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
