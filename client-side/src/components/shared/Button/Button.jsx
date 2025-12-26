import React from 'react';
import styles from './Button.module.scss';

const Button = ({
  children,
  variant = 'default',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  className = '',
  fullWidth = false,
  ...props
}) => {
  const buttonClass = `
    ${styles.button}
    ${styles[`button--${variant}`]}
    ${styles[`button--${size}`]}
    ${fullWidth ? styles['button--fullWidth'] : ''}
    ${loading ? styles['button--loading'] : ''}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className={styles.buttonLoader}>
          <div className={styles.loaderSpinner}></div>
        </span>
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className={`${styles.buttonIcon} ${styles.buttonIconLeft}`}>
          {icon}
        </span>
      )}
      
      <span className={styles.buttonContent}>{children}</span>
      
      {icon && iconPosition === 'right' && !loading && (
        <span className={`${styles.buttonIcon} ${styles.buttonIconRight}`}>
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;