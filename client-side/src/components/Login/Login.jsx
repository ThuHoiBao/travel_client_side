import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import styles from './Login.module.scss';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import axios from '../../utils/axiosCustomize';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email không được để trống';
    if (!re.test(email)) return 'Email không hợp lệ';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Mật khẩu không được để trống';
    if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';
    
    if (name === 'email') {
      error = validateEmail(value);
    } else if (name === 'password') {
      error = validatePassword(value);
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      
      const response = await axios.post('/auth/login', formData);
      
      // Lưu tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('Login successful:', response.data);
      
      // Redirect theo role
      const userRole = response.data.user.role;
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại!';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          errorMessage = 'Email hoặc mật khẩu không đúng';
        } else if (status === 400) {
          if (data.message.includes('email')) {
            errorMessage = 'Vui lòng xác thực email trước khi đăng nhập';
          } else if (data.message.includes('khóa')) {
            errorMessage = 'Tài khoản đã bị khóa. Vui lòng liên hệ admin';
          } else {
            errorMessage = data.message || errorMessage;
          }
        } else {
          errorMessage = data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến server';
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setErrors({});
      
      console.log('Google credential:', credentialResponse);
      
      const response = await axios.post('/auth/google/login', {
        idToken: credentialResponse.credential
      });
      
      // Lưu tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('Google login successful:', response.data);
      
      // Redirect
      const userRole = response.data.user.role;
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
      
    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = error.response?.data?.message || 'Đăng nhập Google thất bại';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login Error
  const handleGoogleError = () => {
    console.error('Google login failed');
    setErrors({ general: 'Đăng nhập Google thất bại. Vui lòng thử lại!' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formCard}>
        <div className={styles.brandLogo}>
          <h2 style={{ textAlign: 'center', color: '#d97706', marginBottom: '0.5rem' }}>
            🌴 VietravelPlus
          </h2>
        </div>

        <h1 className={styles.title}>Đăng nhập</h1>
        <p className={styles.description}>
          Chào mừng bạn trở lại! Đăng nhập để khám phá những chuyến đi tuyệt vời.
        </p>

        {errors.general && (
          <div className={styles.errorBox}>
            <AlertCircle size={20} />
            {errors.general}
          </div>
        )}

        {/* Google Login Button */}
        <div className={styles.googleLoginWrapper}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
            logo_alignment="left"
          />
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <span>hoặc</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.formWrapper} onKeyPress={handleKeyPress}>
          {/* Email Field */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.icon} />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="example@email.com"
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
                autoComplete="email"
                disabled={loading}
              />
            </div>
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Mật khẩu
            </label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.icon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                className={`${styles.input} ${styles.withToggle} ${errors.password ? styles.error : ''}`}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.toggleBtn}
                tabIndex={-1}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className={styles.errorText}>{errors.password}</p>}
          </div>

          {/* Forgot Password */}
          <div className={styles.forgotPassword}>
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? (
              <span className={styles.loading}>Đang đăng nhập</span>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className={styles.footer}>
          Chưa có tài khoản?{' '}
          <Link to="/register" className={styles.linkBold}>
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;