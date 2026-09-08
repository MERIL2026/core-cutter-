'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Send, CheckCircle2, AlertCircle, Phone, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { trackEvent } from '@/lib/analytics';
import { defaultBusinessProfile } from '@/content/business';

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

  useEffect(() => {
    const handlePrefill = (e: Event) => {
      const customEvent = e as CustomEvent<Partial<FormValues>>;
      if (customEvent.detail) {
        setValues((prev) => ({
          ...prev,
          ...(customEvent.detail.name ? { name: customEvent.detail.name } : {}),
          ...(customEvent.detail.phone ? { phone: customEvent.detail.phone } : {}),
          ...(customEvent.detail.serviceId ? { serviceId: customEvent.detail.serviceId } : {}),
        }));
      }
    };
    window.addEventListener('quote_prefill', handlePrefill);
    return () => window.removeEventListener('quote_prefill', handlePrefill);
  }, []);

  const [hasTrackedStart, setHasTrackedStart] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const handleFieldInteraction = () => {
    if (!hasTrackedStart) {
      setHasTrackedStart(true);
      trackEvent({
        event_name: 'quote_start',
        metadata: {
          trigger: 'form_interaction',
          service_id: values.serviceId,
        },
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormValues, string>> = {};

    if (!values.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    } else if (values.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const digitsOnly = values.phone.replace(/\D/g, '');
    if (!values.phone.trim()) {
      newErrors.phone = 'Please enter your phone number.';
    } else if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      newErrors.phone = 'Please enter a valid phone number (at least 7 to 10 digits).';
    }

    if (!values.location.trim()) {
      newErrors.location = 'Please enter your service location or city.';
    } else if (values.location.trim().length < 2) {
      newErrors.location = 'Location must be at least 2 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setIsRateLimited(false);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmitSimulated) {
        const success = await onSubmitSimulated(values);
        if (success) {
          setIsSuccess(true);
          trackEvent({
            event_name: 'quote_submit',
            metadata: {
              service_id: values.serviceId,
              is_simulated: true,
            },
          });
        } else {
          setServerError('Failed to send quote request. Please try calling directly.');
        }
        return;
      }

      // Real POST /api/enquiries Submission
      const sourcePage = typeof window !== 'undefined' ? window.location.pathname : undefined;

      const payload = {
        name: values.name.trim(),
        phone: values.phone.trim(),
        whatsappPreference: values.whatsappPreference,
        serviceId: values.serviceId,
        location: values.location.trim(),
        message: values.message.trim() || undefined,
        sourcePage,
        honeypot: honeypot || undefined,
      };

      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 201 && data.success) {
        setIsSuccess(true);
        if (data.id) {
          setSubmittedId(data.id);
        }
        // Dispatch quote_submit ONLY after server confirms persistent storage
        trackEvent({
          event_name: 'quote_submit',
          metadata: {
            service_id: values.serviceId,
            source_page: sourcePage,
            has_message: Boolean(values.message),
            whatsapp_opt_in: values.whatsappPreference,
          },
        });
      } else if (response.status === 429) {
        setIsRateLimited(true);
        setServerError(
          data.message ||
            'Too many requests received. Please wait a few minutes before trying again, or contact us directly.'
        );
      } else if (response.status === 400 && data.errors) {
        // Map backend field errors to frontend inputs
        const backendFieldErrors: Partial<Record<keyof FormValues, string>> = {};
        if (data.errors.name) backendFieldErrors.name = data.errors.name;
        if (data.errors.phone) backendFieldErrors.phone = data.errors.phone;
        if (data.errors.location) backendFieldErrors.location = data.errors.location;
        if (data.errors.serviceId) setServerError(data.errors.serviceId);
        setErrors((prev) => ({ ...prev, ...backendFieldErrors }));
        setServerError(data.message || 'Please correct the highlighted fields.');
      } else {
        setServerError(
          data.message ||
            'Unable to submit your request at this time. Please call or message our technicians directly.'
        );
      }
    } catch {
      setServerError(
        'Unable to connect to the server. Please check your internet connection or call us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setSubmittedId(null);
    setServerError(null);
    setIsRateLimited(false);
    setHasTrackedStart(false);
    setValues({
      name: '',
      phone: '',
      whatsappPreference: true,
      serviceId: services[0]?.id || 'ac-core-cutting',
      location: '',
      message: '',
    });
  };

  if (isSuccess) {
    return (
      <div
        className={clsx(
          'bg-white rounded-xl border border-emerald-200 p-8 shadow-sm text-center space-y-5',
          className
        )}
      >
        <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-brand-navy">Quote Request Received!</h3>
        <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
          Thank you, <strong className="text-brand-navy">{values.name}</strong>. We have logged your request for{' '}
          <strong className="text-brand-navy">{values.location}</strong>. Our core cutting technician will review the
          details and reach out to you shortly.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={handleReset}>
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
      className={clsx(
        'bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-9 shadow-xl space-y-5',
        className
      )}
    >
      <div className="border-b border-slate-100 pb-4">
        <span className="text-xs font-black uppercase tracking-wider text-brand-orange">
          {"// INSTANT ESTIMATE"}
        </span>
        <h3 className="text-2xl font-black text-brand-dark tracking-tight mt-1">
          Request A Free Quote
        </h3>
      </div>

      {/* Hidden Honeypot Field for anti-bot spam prevention */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_hp_field">Leave this field blank</label>
        <input
          id="website_hp_field"
          type="text"
          name="website_hp_field"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {serverError && (
        <div
          className={clsx(
            'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm p-4 rounded-xl border',
            isRateLimited
              ? 'text-amber-800 bg-amber-50 border-amber-200'
              : 'text-red-700 bg-red-50 border-red-200'
          )}
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start space-x-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{serverError}</span>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
            <a
              href={`tel:${defaultBusinessProfile.phone.replace(/[^\d+]/g, '')}`}
              className="inline-flex items-center space-x-1 text-xs font-bold text-brand-dark bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs hover:border-brand-orange"
            >
              <Phone className="h-3.5 w-3.5 text-brand-orange" />
              <span>Call Direct</span>
            </a>
            <a
              href={`https://wa.me/${(defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone).replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-full border border-emerald-200 shadow-xs hover:bg-emerald-50"
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
          Your Name <span className="text-brand-orange">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={values.name}
          onFocus={handleFieldInteraction}
          onChange={(e) => {
            handleFieldInteraction();
            setValues({ ...values, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          placeholder="Enter your name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          disabled={isSubmitting}
          className={clsx(
            'w-full px-4 py-3 text-sm rounded-xl border bg-slate-50/70 transition-all font-medium',
            'focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white focus:border-brand-orange disabled:opacity-60',
            {
              'border-red-400 bg-red-50/50': errors.name,
              'border-slate-200': !errors.name,
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
        <label htmlFor="phone" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
          Phone Number <span className="text-brand-orange">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={values.phone}
          onFocus={handleFieldInteraction}
          onChange={(e) => {
            handleFieldInteraction();
            setValues({ ...values, phone: e.target.value });
            if (errors.phone) setErrors({ ...errors, phone: undefined });
          }}
          placeholder="Enter your phone number"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          disabled={isSubmitting}
          className={clsx(
            'w-full px-4 py-3 text-sm rounded-xl border bg-slate-50/70 transition-all font-medium',
            'focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white focus:border-brand-orange disabled:opacity-60',
            {
              'border-red-400 bg-red-50/50': errors.phone,
              'border-slate-200': !errors.phone,
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
      <div className="flex items-center space-x-2 pt-0.5">
        <input
          id="whatsappPreference"
          type="checkbox"
          checked={values.whatsappPreference}
          onChange={(e) => {
            handleFieldInteraction();
            setValues({ ...values, whatsappPreference: e.target.checked });
          }}
          disabled={isSubmitting}
          className="h-4 w-4 rounded border-slate-300 text-brand-orange focus:ring-brand-orange disabled:opacity-60 accent-[#FA4A14]"
        />
        <label htmlFor="whatsappPreference" className="text-xs sm:text-sm font-semibold text-slate-700 select-none">
          I prefer updates on WhatsApp
        </label>
      </div>

      {/* Service Selection */}
      <div>
        <label htmlFor="serviceId" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
          Service Required <span className="text-brand-orange">*</span>
        </label>
        <select
          id="serviceId"
          value={values.serviceId}
          onFocus={handleFieldInteraction}
          onChange={(e) => {
            handleFieldInteraction();
            setValues({ ...values, serviceId: e.target.value });
          }}
          disabled={isSubmitting}
          className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white focus:border-brand-orange disabled:opacity-60"
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
        <label htmlFor="location" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
          Area / Location <span className="text-brand-orange">*</span>
        </label>
        <input
          id="location"
          type="text"
          value={values.location}
          onFocus={handleFieldInteraction}
          onChange={(e) => {
            handleFieldInteraction();
            setValues({ ...values, location: e.target.value });
            if (errors.location) setErrors({ ...errors, location: undefined });
          }}
          placeholder="Enter your area or city"
          aria-invalid={!!errors.location}
          aria-describedby={errors.location ? 'location-error' : undefined}
          disabled={isSubmitting}
          className={clsx(
            'w-full px-4 py-3 text-sm rounded-xl border bg-slate-50/70 transition-all font-medium',
            'focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white focus:border-brand-orange disabled:opacity-60',
            {
              'border-red-400 bg-red-50/50': errors.location,
              'border-slate-200': !errors.location,
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
        <label htmlFor="message" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
          Job Details / Requirements <span className="text-xs text-slate-400 font-normal lowercase">(optional)</span>
        </label>
        <textarea
          id="message"
          rows={3}
          value={values.message}
          onFocus={handleFieldInteraction}
          onChange={(e) => {
            handleFieldInteraction();
            setValues({ ...values, message: e.target.value });
          }}
          disabled={isSubmitting}
          placeholder="Enter job requirements (e.g. number of holes, floor, AC type)"
          className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white focus:border-brand-orange transition-all disabled:opacity-60"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        rightIcon={<Send className="h-4 w-4" aria-hidden="true" />}
        className="w-full py-4 text-base font-black shadow-lg shadow-brand-orange/30 hover:shadow-brand-orange/50"
      >
        Submit Quote Request
      </Button>
    </form>
  );
};
