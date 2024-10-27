// ForgotPasswordModal.js
import React, { useState } from "react";
import { Loader2, MailIcon, KeyIcon, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";

export function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const api = process.env.REACT_APP_API_URL;
  const serviceId = process.env.REACT_APP_API_SERVICE_ID;
  const templateId = process.env.REACT_APP_API_TEMPLATE_ID;
  const publicId = process.env.REACT_APP_API_PUBLIC_KEY;

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${api}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate reset code");
      }

      // Send email after successful server response
      const emailTemplate = {
        to_email: email,
        reset_code: data.resetCode,
        expiry_time: data.expiresIn || "15 minutes",
        current_year: new Date().getFullYear().toString(),
      };

      const emailResponse = await emailjs.send(
        serviceId,
        templateId,
        emailTemplate,
        publicId
      );

      if (emailResponse.status === 200) {
        setSuccess("Reset code sent successfully! Please check your email.");
        setStep("code");
      } else {
        throw new Error("Failed to send email");
      }
    } catch (err) {
      console.error("Reset code error:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCodeAndReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${api}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          resetCode,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password reset successful!");
        setTimeout(() => {
          onClose();
          setStep("email"); // Reset the step for next time
          setEmail("");
          setResetCode("");
          setNewPassword("");
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-100"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Reset Password
        </h2>

        {error && (
          <div className="flex items-center gap-2 p-4 mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/50 dark:text-red-400 rounded-lg">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-4 mb-4 text-sm text-green-600 bg-green-50 dark:bg-green-900/50 dark:text-green-400 rounded-lg">
            <AlertCircle size={16} />
            {success}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleSendResetCode}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 p-2"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                "Send Reset Code"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCodeAndReset}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reset Code
              </label>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 p-2"
                placeholder="Enter reset code"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <KeyIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 p-2"
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        <button
          onClick={() => {
            onClose();
            setStep("email");
            setError("");
            setSuccess("");
          }}
          type="button"
          className="mt-4 w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
