'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export interface FormValues {
  name: string;
  phone: string;
  whatsappPreference: boolean;
  serviceId: string;
  location: string;
  message: string;
}

export interface ServiceOption {
  id: string;
  name: string;
}

export interface ContactFormUIProps {
  services?: ServiceOption[];
  onSubmitSimulated?: (values: FormValues) => Promise<boolean>;
  className?: string;
}

const defaultServices: ServiceOption[] = [
  { id: 'ac-core-cutting', name: 'AC Core Cutting' },
  { id: 'rcc-core-cutting', name: 'RCC Core Cutting' },
  { id: 'ac-drain-hole', name: 'AC Drain Hole' },
  { id: 'concrete-wall-drilling', name: 'Concrete Wall Drilling' },
  { id: 'pipe-cable-passage', name: 'Pipe & Cable Passage' },
  { id: 'other', name: 'Other Services' },
];

export const ContactFormUI: React.FC<ContactFormUIProps> = ({
  services = defaultServices,
  onSubmitSimulated,
  className,
}) => {
  const [values, setValues] = useState<FormValues>({
    name: '',
    phone: '',
    whatsappPreference: true,
    serviceId: services[0]?.id || 'ac-core-cutting',
    location: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormValues, string>> = {};

    if (!values.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

    const phoneRegex = /^[0-[1-9]]?[0-9]{10}$/;
    if (!values.phone.trim()) {
      newErrors.phone = 'Please enter your phone number.';
    } else if (values.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }

    if (!values.location.trim()) {
      newErrors.location = 'Please enter your service location or city.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmitSimulated) {
        const success = await onSubmitSimulated(values);
        if (success) {
          setIsSuccess(true);
        } else {
          setServerError('Failed to send quote request. Please try calling directly.');
        }
      } else {
        // UI Demonstration delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsSuccess(true);
      }
    } catch {
      setServerError('An unexpected error occurred. Please try calling directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={clsx('bg-white rounded-xl border border-emerald-200 p-8 shadow-sm text-center space-y-4', className)}>
        <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-brand-navy">Quote Request Received!</h3>
        <p className="text-sm text-brand-muted max-w-md mx-auto">
          Thank you, <strong className="text-brand-navy">{values.name}</strong>. We will review your job details for{' '}
          <strong className="text-brand-navy">{values.location}</strong> and contact you shortly.
        </p>
        <div className="pt-4">
          <Button variant="outline" size="sm" onClick={() => setIsSuccess(false)}>
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={clsx('bg-white rounded-xl border border-brand-border p-6 sm:p-8 shadow-xs space-y-5', className)}
    >
      <h3 className="text-xl font-bold text-brand-navy border-b border-brand-border pb-3">
        Request a Free Quote
      </h3>

      {serverError && (
        <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200" role="alert">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-brand-navy mb-1">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          placeholder="e.g. Rahul Sharma"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={clsx(
            'w-full px-4 py-2.5 text-sm rounded-md border bg-brand-bg/50 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-brand-accent-blue focus:bg-white',
            {
              'border-red-400 bg-red-50/50': errors.name,
              'border-brand-border': !errors.name,
            }
          )}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-xs text-red-600 font-medium">
            {errors.name}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-brand-navy mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={values.phone}
          onChange={(e) => setValues({ ...values, phone: e.target.value })}
          placeholder="e.g. 9876543210"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          className={clsx(
            'w-full px-4 py-2.5 text-sm rounded-md border bg-brand-bg/50 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-brand-accent-blue focus:bg-white',
            {
              'border-red-400 bg-red-50/50': errors.phone,
              'border-brand-border': !errors.phone,
            }
          )}
        />
        {errors.phone && (
          <p id="phone-error" className="mt-1 text-xs text-red-600 font-medium">
            {errors.phone}
          </p>
        )}
      </div>

      {/* WhatsApp Preference */}
      <div className="flex items-center space-x-2 pt-1">
        <input
          id="whatsappPreference"
          type="checkbox"
          checked={values.whatsappPreference}
          onChange={(e) => setValues({ ...values, whatsappPreference: e.target.checked })}
          className="h-4 w-4 rounded border-brand-border text-brand-navy focus:ring-brand-accent-blue"
        />
        <label htmlFor="whatsappPreference" className="text-sm font-medium text-brand-text select-none">
          I prefer updates on WhatsApp
        </label>
      </div>

      {/* Service Selection */}
      <div>
        <label htmlFor="serviceId" className="block text-sm font-semibold text-brand-navy mb-1">
          Service Required <span className="text-red-500">*</span>
        </label>
        <select
          id="serviceId"
          value={values.serviceId}
          onChange={(e) => setValues({ ...values, serviceId: e.target.value })}
          className="w-full px-4 py-2.5 text-sm rounded-md border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-accent-blue"
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-semibold text-brand-navy mb-1">
          Area / Location <span className="text-red-500">*</span>
        </label>
        <input
          id="location"
          type="text"
          value={values.location}
          onChange={(e) => setValues({ ...values, location: e.target.value })}
          placeholder="e.g. City Name, Area / Sector"
          aria-invalid={!!errors.location}
          aria-describedby={errors.location ? 'location-error' : undefined}
          className={clsx(
            'w-full px-4 py-2.5 text-sm rounded-md border bg-brand-bg/50 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-brand-accent-blue focus:bg-white',
            {
              'border-red-400 bg-red-50/50': errors.location,
              'border-brand-border': !errors.location,
            }
          )}
        />
        {errors.location && (
          <p id="location-error" className="mt-1 text-xs text-red-600 font-medium">
            {errors.location}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-brand-navy mb-1">
          Job Details / Requirements <span className="text-xs text-brand-muted font-normal">(Optional)</span>
        </label>
        <textarea
          id="message"
          rows={3}
          value={values.message}
          onChange={(e) => setValues({ ...values, message: e.target.value })}
          placeholder="e.g. Need 3 core cutting holes for split AC installation on 2nd floor concrete wall."
          className="w-full px-4 py-2.5 text-sm rounded-md border border-brand-border bg-brand-bg/50 focus:outline-none focus:ring-2 focus:ring-brand-accent-blue focus:bg-white transition-colors"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        rightIcon={<Send className="h-4 w-4" aria-hidden="true" />}
        className="w-full"
      >
        Submit Quote Request
      </Button>
    </form>
  );
};
