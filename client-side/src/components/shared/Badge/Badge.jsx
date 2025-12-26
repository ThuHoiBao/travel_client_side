import React from 'react';
import styles from './Badge.module.scss';

const Badge = ({ 
  label, 
  type = 'default',
  size = 'md',
  icon,
  className = '',
  ...props 
}) => {
  const badgeClass = `
    ${styles.badge}
    ${styles[`badge--${type}`]}
    ${styles[`badge--${size}`]}
    ${className}
  `.trim();

  return (
    <span className={badgeClass} {...props}>
      {icon && <span className={styles.badgeIcon}>{icon}</span>}
      <span className={styles.badgeLabel}>{label}</span>
    </span>
  );
};

export default Badge;