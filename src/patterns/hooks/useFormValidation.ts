

import { useState, useCallback, type FormEvent } from 'react';

export type ValidationSchema<T> = {
  [K in keyof T]?: (value: T[K], formData: T) => string | null;
};

export type FormErrors<T> = Partial<Record<keyof T, string>>;
export type FormTouched<T> = Partial<Record<keyof T, boolean>>;

export interface UseFormValidationOptions<T> {
  initialValues: T;
  validationSchema?: ValidationSchema<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

export function useFormValidation<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormValidationOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    <K extends keyof T>(field: K, value: T[K], currentValues: T): string | null => {
      if (!validationSchema || !validationSchema[field]) return null;
      const validator = validationSchema[field]!;
      return validator(value, currentValues);
    },
    [validationSchema]
  );

  const validateAll = useCallback(
    (currentValues: T): FormErrors<T> => {
      if (!validationSchema) return {};
      const newErrors: FormErrors<T> = {};

      for (const key in validationSchema) {
        if (Object.prototype.hasOwnProperty.call(validationSchema, key)) {
          const field = key as keyof T;
          const error = validateField(field, currentValues[field], currentValues);
          if (error) {
            newErrors[field] = error;
          }
        }
      }
      return newErrors;
    },
    [validationSchema, validateField]
  );

  const handleChange = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues((prev) => {
        const next = { ...prev, [field]: value };
        if (touched[field]) {
          const error = validateField(field, value, next);
          setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error || undefined,
          }));
        }
        return next;
      });
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    <K extends keyof T>(field: K) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const error = validateField(field, values[field], values);
      setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    },
    [values, validateField]
  );

  const resetForm = useCallback(
    (newValues?: T) => {
      setValues(newValues || initialValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    },
    [initialValues]
  );

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      if (e) e.preventDefault();

      const allTouched: FormTouched<T> = {};
      for (const key in values) {
        allTouched[key as keyof T] = true;
      }
      setTouched(allTouched);

      const validationErrors = validateAll(values);
      setErrors(validationErrors);

      const isValid = Object.keys(validationErrors).length === 0;
      if (!isValid) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateAll, onSubmit]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
  };
}
