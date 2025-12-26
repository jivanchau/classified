import { forwardRef, HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode, useEffect, useId, useState } from 'react';
import { useField } from 'formik';

type TextboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
  name: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  hint?: string;
  showPasswordToggle?: boolean;
  inputClassName?: string;
};

type FormikTextboxProps = TextboxProps & {
  validate?: (value: any) => string | Promise<string | undefined>;
};

const TEXTBOX_STYLE_ID = 'textbox-component-styles';

const textboxStyles = `
.cl-textbox {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-weight: 700;
  color: #0f172a;
}

.cl-textbox .input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.cl-textbox .input-control {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  background: #fff;
  color: #0f172a;
  font-weight: 600;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.cl-textbox .input-control:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.14);
}

.cl-textbox .input-control--with-icon {
  padding-left: 2.7rem;
}

.cl-textbox .input-control--with-action {
  padding-right: 3rem;
}

.cl-textbox .input-control--error {
  border-color: #f43f5e;
  color: #b91c1c;
  box-shadow: 0 0 0 4px rgba(244, 63, 94, 0.12);
}

.cl-textbox .input-control--error:focus {
  border-color: #f43f5e;
  box-shadow: 0 0 0 4px rgba(244, 63, 94, 0.16);
}

.cl-textbox .input-icon {
  position: absolute;
  left: 0.9rem;
  color: #94a3b8;
  display: inline-flex;
}

.cl-textbox .input-icon--right {
  left: auto;
  right: 0.9rem;
}

.cl-textbox .input-action {
  position: absolute;
  right: 0.35rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  border-radius: 10px;
  padding: 0.35rem;
  cursor: pointer;
  color: #475569;
}

.cl-textbox .input-action:hover {
  background: #f1f5f9;
}

.cl-textbox .field-hint {
  min-height: 1.2rem;
  display: flex;
  align-items: center;
}

.cl-textbox .field-error {
  color: #ef4444;
  font-weight: 600;
  font-size: 0.9rem;
}

.cl-textbox .muted {
  color: #475569;
  margin: 0;
  font-weight: 500;
}
`;

let stylesInjected = false;

const ensureTextboxStyles = () => {
  if (typeof document === 'undefined' || stylesInjected) return;
  if (document.getElementById(TEXTBOX_STYLE_ID)) {
    stylesInjected = true;
    return;
  }

  const styleTag = document.createElement('style');
  styleTag.id = TEXTBOX_STYLE_ID;
  styleTag.textContent = textboxStyles;
  document.head.appendChild(styleTag);
  stylesInjected = true;
};

const Textbox = forwardRef<HTMLInputElement, TextboxProps>((props, ref) => {
  const {
    label,
    name,
    type = 'text',
    placeholder,
    leftIcon,
    rightIcon,
    error,
    hint,
    className,
    inputClassName,
    id,
    showPasswordToggle = false,
    ...rest
  } = props;

  const inputId = id || `${name}-${useId()}`;
  const isPasswordField = type === 'password';
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const shouldTogglePassword = showPasswordToggle && isPasswordField;
  const computedType = shouldTogglePassword ? (isPasswordVisible ? 'text' : 'password') : type;

  useEffect(() => {
    ensureTextboxStyles();
  }, []);

  const hasLeftIcon = Boolean(leftIcon);
  const hasRightAdornment = Boolean(rightIcon) || shouldTogglePassword;
  const baseInputClasses = [
    'input-control',
    hasLeftIcon ? 'input-control--with-icon' : '',
    hasRightAdornment ? 'input-control--with-action' : '',
    error ? 'input-control--error' : '',
    inputClassName || ''
  ]
    .filter(Boolean)
    .join(' ');

  const mergedContainerClass = ['input-label', 'cl-textbox', className || ''].filter(Boolean).join(' ');
  const needsExtraRightPadding = rightIcon && shouldTogglePassword;
  const rightIconStyle = shouldTogglePassword ? { right: '2.6rem' } : undefined;

  return (
    <label className={mergedContainerClass} htmlFor={inputId}>
      {label && <span>{label}</span>}
      <div className="input-group">
        {leftIcon && (
          <span className="input-icon" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={computedType}
          placeholder={placeholder}
          className={baseInputClasses}
          style={needsExtraRightPadding ? { paddingRight: '4.5rem' } : undefined}
          {...rest}
        />
        {rightIcon && (
          <span className="input-icon input-icon--right" aria-hidden="true" style={rightIconStyle}>
            {rightIcon}
          </span>
        )}
        {shouldTogglePassword && (
          <button
            type="button"
            className="input-action"
            onClick={() => setIsPasswordVisible(prev => !prev)}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.88 4.24A9.93 9.93 0 0 1 12 4c4.5 0 8.27 2.94 10 7-1.23 2.98-3.7 5.29-6.76 6.47" />
                <path d="M6.12 6.12A9.99 9.99 0 0 0 2 11c1.23 2.98 3.7 5.29 6.76 6.47" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      <div className="field-hint">
        {error ? <span className="field-error">{error}</span> : hint ? <span className="muted">{hint}</span> : null}
      </div>
    </label>
  );
});

Textbox.displayName = 'Textbox';

const FormikTextbox = forwardRef<HTMLInputElement, FormikTextboxProps>((props, ref) => {
  const { validate, onChange, onBlur, error, ...rest } = props;
  const [field, meta] = useField({ name: props.name, type: props.type, validate });

  const handleChange: NonNullable<InputHTMLAttributes<HTMLInputElement>['onChange']> = event => {
    field.onChange(event);
    onChange?.(event);
  };

  const handleBlur: NonNullable<InputHTMLAttributes<HTMLInputElement>['onBlur']> = event => {
    field.onBlur(event);
    onBlur?.(event);
  };

  const mergedError = meta.touched && meta.error ? meta.error : error;

  return (
    <Textbox
      {...rest}
      {...field}
      ref={ref}
      type={props.type}
      onChange={handleChange}
      onBlur={handleBlur}
      error={mergedError}
    />
  );
});

FormikTextbox.displayName = 'FormikTextbox';

export default Textbox;
export { FormikTextbox };
export type { TextboxProps, FormikTextboxProps };
