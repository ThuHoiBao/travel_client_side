import React, { useState } from 'react';
import { X, Copy, Calendar } from 'lucide-react';
import styles from './CloneModal.module.scss';

const CloneModal = ({ isOpen, onClose, onClone, loading }) => {
  const [newDate, setNewDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newDate) {
      onClone(newDate);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <div className={styles.iconWrapper}>
              <Copy size={20} />
            </div>
            <h3>Sao chép Lịch Khởi Hành</h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            <p className={styles.description}>
              Vui lòng chọn ngày khởi hành mới cho bản sao này. 
              Toàn bộ thông tin về giá vé, vận chuyển và chính sách sẽ được giữ nguyên.
            </p>

            <div className={styles.formGroup}>
              <label htmlFor="newDate">Ngày khởi hành mới <span className={styles.required}>*</span></label>
              <div className={styles.inputWrapper}>
                <Calendar size={18} className={styles.inputIcon} />
                <input
                  id="newDate"
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  className={styles.input}
                  min={new Date().toISOString().split('T')[0]} // Không cho chọn ngày quá khứ
                />
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button 
              type="button" 
              className={styles.btnCancel} 
              onClick={onClose}
              disabled={loading}
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              className={styles.btnSubmit}
              disabled={loading || !newDate}
            >
              {loading ? <span className={styles.spinner}></span> : 'Sao chép ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CloneModal;