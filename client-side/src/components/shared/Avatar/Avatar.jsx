import React from 'react';
import styles from './Avatar.module.scss';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  shape = 'circle',
  fallback = '👤',
  className = '',
  ...props 
}) => {
  const [hasError, setHasError] = React.useState(false);
  
  const avatarClass = `
    ${styles.avatar}
    ${styles[`avatar--${size}`]}
    ${styles[`avatar--${shape}`]}
    ${className}
  `.trim();

  const handleError = () => {
    setHasError(true);
  };

  if (!src || hasError) {
    return (
      <div className={`${avatarClass} ${styles.avatarFallback}`} {...props}>
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={avatarClass}
      onError={handleError}
      {...props}
    />
  );
};

export default Avatar;