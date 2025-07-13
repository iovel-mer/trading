import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Cookie Policy
            </h1>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  1. What Are Cookies
                </h3>
                <p className="mb-4">
                  Cookies are small text files stored on your device when you
                  visit our website. They help us provide you with a better
                  experience.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  2. Types of Cookies We Use
                </h3>
                <p className="mb-4">
                  <strong>Essential Cookies:</strong> Required for the website
                  to function properly, including authentication and security
                  features.
                </p>
                <p className="mb-4">
                  <strong>Analytics Cookies:</strong> Help us understand how
                  visitors interact with our website by collecting anonymous
                  information.
                </p>
                <p className="mb-4">
                  <strong>Functional Cookies:</strong> Enable enhanced
                  functionality and personalization, such as remembering your
                  preferences.
                </p>
                <p className="mb-4">
                  <strong>Marketing Cookies:</strong> Used to track visitors
                  across websites to display relevant advertisements.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  3. Third-Party Cookies
                </h3>
                <p className="mb-4">
                  We may use third-party services that set cookies on your
                  device, including Google Analytics and advertising partners.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  4. Managing Cookies
                </h3>
                <p className="mb-4">
                  You can control cookies through your browser settings.
                  However, disabling certain cookies may affect website
                  functionality.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  5. Cookie Consent
                </h3>
                <p className="mb-4">
                  By continuing to use our website, you consent to our use of
                  cookies as described in this policy.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  6. Updates to This Policy
                </h3>
                <p className="mb-4">
                  We may update this Cookie Policy from time to time. Changes
                  will be posted on this page with an updated revision date.
                </p>
              </div>

              <p className="text-sm text-gray-400 mt-8">
                Last updated: January 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
