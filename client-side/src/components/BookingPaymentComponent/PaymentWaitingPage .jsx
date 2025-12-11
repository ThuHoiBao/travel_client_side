import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, Loader } from 'lucide-react';
import axios from '../../utils/axiosCustomize'; 
import { useNavigate } from 'react-router-dom';

const PaymentWaitingPage = () => {
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const orderCode = searchParams.get('orderCode');
  const bookingCode = searchParams.get('bookingCode');
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('PENDING');
  const [message, setMessage] = useState('Đang kiểm tra thanh toán...');
  const [checkCount, setCheckCount] = useState(0);

  useEffect(() => {
    if (!orderCode) {
      navigate('/');
      return;
    }

    let intervalId;
    let timeoutId;

    const checkPaymentStatus = async () => {
      try {
        console.log(`🔍 Checking payment status... (attempt ${checkCount + 1})`);
        
        const response = await axios.get(`/payment/check-status/${orderCode}`);
        
        const data = response.data || response; 

        console.log('Payment status response:', data);

        if (data.status === 'SUCCESS' || data.code === '00') {
          setStatus('SUCCESS');
          setMessage('Thanh toán thành công!');
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          
          setTimeout(() => {
            navigate(`/payment-success?bookingCode=${bookingCode}`);
          }, 2000);
          
        } else if (data.status === 'CANCELLED' || data.status === 'FAILED' || data.code === '99') {
          setStatus('FAILED');
          setMessage('Thanh toán thất bại hoặc đã bị hủy');
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          
        } else if (data.status === 'PENDING' || data.code === '01') {
          setMessage('Vui lòng hoàn tất thanh toán trên ứng dụng ngân hàng...');
          setCheckCount(prev => prev + 1);
        }

      } catch (error) {
        console.error('Error checking payment:', error);
        setMessage('Đang kiểm tra thanh toán... (đang thử lại)');
        setCheckCount(prev => prev + 1);
      }
    };

    checkPaymentStatus();

    intervalId = setInterval(checkPaymentStatus, 3000);

    timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      if (status === 'PENDING') {
        setStatus('FAILED');
        setMessage('Hết thời gian chờ thanh toán. Vui lòng kiểm tra lại.');
      }
    }, 300000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [orderCode, bookingCode, navigate]);

  const handleRetry = () => {
    navigate(`/booking-payment?bookingCode=${bookingCode}`);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        
        <div className="mb-6">
          {status === 'PENDING' && (
            <div className="inline-block">
              <Loader className="w-20 h-20 text-blue-500 animate-spin" />
            </div>
          )}
          {status === 'SUCCESS' && (
            <div className="inline-block">
              <CheckCircle className="w-20 h-20 text-green-500" />
            </div>
          )}
          {status === 'FAILED' && (
            <div className="inline-block">
              <XCircle className="w-20 h-20 text-red-500" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-4">
          {status === 'PENDING' && 'Đang xử lý thanh toán'}
          {status === 'SUCCESS' && 'Thanh toán thành công!'}
          {status === 'FAILED' && 'Thanh toán thất bại'}
        </h1>

        <p className="text-gray-600 mb-6">{message}</p>

        {status === 'PENDING' && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center text-sm text-blue-700 mb-2">
              <Clock className="w-4 h-4 mr-2" />
              <span>Mã đơn hàng: {orderCode}</span>
            </div>
            <p className="text-xs text-blue-600">
              Đã kiểm tra {checkCount} lần
            </p>
            <p className="text-xs text-blue-500 mt-2">
              💡 Vui lòng mở app ngân hàng và hoàn tất thanh toán
            </p>
          </div>
        )}

        {status === 'SUCCESS' && (
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700">
              Mã booking: <span className="font-bold">{bookingCode}</span>
            </p>
            <p className="text-xs text-green-600 mt-2">
              Đang chuyển hướng...
            </p>
          </div>
        )}

        {status === 'FAILED' && (
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Thử lại
            </button>
            <button
              onClick={handleGoHome}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Về trang chủ
            </button>
          </div>
        )}

        {status === 'PENDING' && (
          <button
            onClick={handleRefresh}
            className="text-sm text-blue-500 hover:text-blue-700 font-medium"
          >
            Làm mới trang
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentWaitingPage;