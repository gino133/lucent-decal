const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const base = 'font-label-bold text-label-bold rounded-lg active:scale-95 transition-all';
  const variants = {
    primary: 'bg-secondary-fixed text-on-secondary-fixed hover:opacity-90',
    secondary: 'border-2 border-on-surface text-on-surface hover:bg-on-surface hover:text-background',
    outline: 'border border-outline hover:bg-surface-container transition-all',
    danger: 'bg-error-container text-error hover:bg-error hover:text-on-error',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};
export default Button;