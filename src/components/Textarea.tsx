import React from 'react';

interface TextareaProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  rows?: number;
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  name,
  value,
  onChange,
  label,
  placeholder = '',
  required = false,
  error,
  rows = 4,
  className = '',
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="label">
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`textarea ${error ? 'border-red-500' : ''} ${className}`}
        style={{ 
          fontSize: className.includes('font-mono') ? '0.9rem' : '1rem',
          lineHeight: 1.5
        }}
      />
      {error && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{error}</div>}
    </div>
  );
};

export default Textarea; 