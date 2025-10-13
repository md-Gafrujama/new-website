"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminAPI from '../lib/adminApi';

const OTPVerificationForm = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();
  const { login } = useAdminAuth();

  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem('adminEmail');
    if (!storedEmail) {
      router.push('/admin/login');
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  useEffect(() => {
    // Timer countdown
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit) && newOtp.join('').length === 6) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (otpValue = null) => {
    const otpCode = otpValue || otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const result = await login(email, otpCode);
      
      if (result.success) {
        setMessage('Login successful! Welcome Admin!');
        
        // Clear session storage
        sessionStorage.removeItem('adminEmail');
        
        // Redirect to dashboard after showing success message
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      } else {
        setError(result.error || 'Invalid OTP. Please try again.');
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await adminAPI.resendOTP(email);
      
      if (result.success) {
        setMessage('New OTP sent successfully!');
        setTimeLeft(300); // Reset timer
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(result.error || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [local, domain] = email.split('@');
    return `${local.slice(0, 2)}***@${domain}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Back Button */}
          <button
            onClick={() => router.push('/admin/login')}
            className="mb-6 inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
            disabled={loading}
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Verify OTP
            </h2>
            <p className="text-gray-600 mb-2">
              Enter the 6-digit code sent to
            </p>
            <p className="text-emerald-600 font-medium">
              {maskEmail(email)}
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm font-medium">{message}</p>
            </div>
          )}

          {/* OTP Input */}
          <div className="mb-6">
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
              <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {timeLeft > 0 ? (
                <span className="text-gray-700">
                  Code expires in <span className="font-medium text-emerald-600">{formatTime(timeLeft)}</span>
                </span>
              ) : (
                <span className="text-red-500 font-medium">
                  OTP has expired
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => handleSubmit()}
            disabled={loading || otp.join('').length !== 6}
            className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 ${
              loading || otp.join('').length !== 6
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify OTP'
            )}
          </button>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            {canResend ? (
              <button
                onClick={handleResendOTP}
                disabled={loading}
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Didn't receive the code? You can resend in {formatTime(timeLeft)}
              </p>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Check your email's inbox and spam folder for the verification code
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationForm;
