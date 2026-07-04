import clsx from 'clsx';
import './SkeletonLoader.css';

const SkeletonLoader = ({ className, width, height, circle, variant = 'rectangular' }) => {
  const style = { width, height };

  return (
    <div
      className={clsx(
        'skeleton-loader',
        circle && 'skeleton-circle',
        variant === 'text' && 'skeleton-text',
        className
      )}
      style={style}
    />
  );
};

export default SkeletonLoader;
