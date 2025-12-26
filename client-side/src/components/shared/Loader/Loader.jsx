import React from 'react';
import styles from './Loader.module.scss';

const Loader = ({ size = 'md', color = 'primary', className = '' }) => {
  const loaderClass = `
    ${styles.loader}
    ${styles[`loader--${size}`]}
    ${styles[`loader--${color}`]}
    ${className}
  `.trim();

  return (
    <div className={loaderClass}>
      <div className={styles.loaderSpinner}></div>
    </div>
  );
};

export default Loader;