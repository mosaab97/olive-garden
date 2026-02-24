const variants = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  outline:   'btn-outline',
  danger:    'btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost:     'btn text-olive-600 hover:bg-olive-50',
};

const sizes = {
  sm:  'text-xs px-3 py-1.5',
  md:  '',           // default, defined in .btn
  lg:  'text-base px-7 py-3',
};

const Button = ({
  children,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
};

export default Button;
