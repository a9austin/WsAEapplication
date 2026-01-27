import { useState } from 'react';

export default function CandidateInfoForm({ onComplete }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.linkedin.trim()) {
      newErrors.linkedin = 'LinkedIn profile is required';
    } else if (!formData.linkedin.includes('linkedin.com/')) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }

    // Phone is optional, but validate format if provided
    if (formData.phone.trim() && !/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onComplete({
        name: formData.name.trim(),
        email: formData.email.trim(),
        linkedin: formData.linkedin.trim(),
        phone: formData.phone.trim() || null,
      });
    }, 300);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Great pitch!</h2>
        <p className="text-slate-600">Now tell us a bit about yourself.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Smith"
            className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
              errors.name
                ? 'border-red-300 bg-red-50 focus:border-red-500'
                : 'border-slate-200 focus:border-blue-500'
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
              errors.email
                ? 'border-red-300 bg-red-50 focus:border-red-500'
                : 'border-slate-200 focus:border-blue-500'
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* LinkedIn */}
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-slate-700 mb-1">
            LinkedIn Profile <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/johnsmith"
            className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
              errors.linkedin
                ? 'border-red-300 bg-red-50 focus:border-red-500'
                : 'border-slate-200 focus:border-blue-500'
            }`}
          />
          {errors.linkedin && <p className="mt-1 text-sm text-red-600">{errors.linkedin}</p>}
        </div>

        {/* Phone (Optional) */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
            Cell Phone <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
              errors.phone
                ? 'border-red-300 bg-red-50 focus:border-red-500'
                : 'border-slate-200 focus:border-blue-500'
            }`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        {/* Submit button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
