import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  name,
  value,
  onChange,
  options,
  label,
  placeholder = 'Select an option',
  required = false,
  error,
  className = '',
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`input ${error ? 'border-red-500' : ''} ${className}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default Select; 