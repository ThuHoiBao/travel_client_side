import React, { useState, useEffect } from 'react';
import styles from './PointRedemption.module.scss';
import { FaCoins } from 'react-icons/fa';

const PointRedemption = ({ userPoints, maxRedeemableAmount, onRedeem }) => {
  // Tỷ lệ quy đổi: 1 điểm = 1000đ
  const EXCHANGE_RATE = 1000; 
  
  // Tính số điểm tối đa có thể dùng (không vượt quá điểm user có và không vượt quá giá trị đơn hàng)
  // Math.floor để làm tròn xuống số nguyên
  const maxPointsUsable = Math.min(userPoints, Math.floor(maxRedeemableAmount / EXCHANGE_RATE));

  const [pointsToUse, setPointsToUse] = useState(0);
  const [isUsing, setIsUsing] = useState(false);

  // Hàm format tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleToggle = () => {
    if (isUsing) {
      // Nếu đang dùng mà tắt -> Reset về 0
      setPointsToUse(0);
      onRedeem(0); // Báo lên cha là dùng 0đ
      setIsUsing(false);
    } else {
      // Nếu bật lên -> Mặc định dùng max điểm
      setPointsToUse(maxPointsUsable);
      onRedeem(maxPointsUsable * EXCHANGE_RATE);
      setIsUsing(true);
    }
  };

  const handleInputChange = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 0;

    // Validate không cho nhập quá max
    if (val > maxPointsUsable) val = maxPointsUsable;
    if (val < 0) val = 0;

    setPointsToUse(val);
    onRedeem(val * EXCHANGE_RATE);
  };

  // Nếu user chưa đăng nhập hoặc 0 điểm thì ẩn luôn
  if (!userPoints || userPoints <= 0) return null;

  return (
    <div className={styles.pointContainer}>
      <div className={styles.header}>
        <div className={styles.title}>
            <FaCoins className={styles.icon} />
            <span>Dùng điểm thưởng</span>
        </div>
        
        {/* Nút Toggle Switch */}
        <label className={styles.switch}>
            <input 
                type="checkbox" 
                checked={isUsing}
                onChange={handleToggle}
                disabled={maxPointsUsable <= 0}
            />
            <span className={`${styles.slider} ${styles.round}`}></span>
        </label>
      </div>

      <div className={styles.balanceInfo}>
        Bạn có <b>{userPoints}</b> điểm (Trị giá: {formatCurrency(userPoints * EXCHANGE_RATE)})
      </div>

      {isUsing && (
        <div className={styles.redeemSection}>
            <div className={styles.inputGroup}>
                <input 
                    type="number" 
                    value={pointsToUse === 0 ? '' : pointsToUse} // Để trống nếu 0 cho dễ nhập
                    onChange={handleInputChange}
                    placeholder="Nhập điểm"
                />
                <span className={styles.suffix}>điểm</span>
            </div>
            
            <div className={styles.conversionResult}>
                Quy đổi: <span className={styles.highlight}>-{formatCurrency(pointsToUse * EXCHANGE_RATE)}</span>
            </div>
            
            <div className={styles.helperText}>
                (Tối đa {maxPointsUsable} điểm cho đơn này)
            </div>
        </div>
      )}
    </div>
  );
};

export default PointRedemption;