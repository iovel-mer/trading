import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  1. Information We Collect
                </h3>
                <p className="mb-4">
                  We collect information you provide directly to us, such as
                  when you create an account, make trades, or contact us for
                  support.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  2. How We Use Your Information
                </h3>
                <p className="mb-4">
                  We use your information to provide, maintain, and improve our
                  services, process transactions, and communicate with you.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  3. Information Sharing
                </h3>
                <p className="mb-4">
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties without your consent, except as
                  described in this policy.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  4. Data Security
                </h3>
                <p className="mb-4">
                  We implement appropriate security measures to protect your
                  personal information against unauthorized access, alteration,
                  disclosure, or destruction.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  5. Cookies and Tracking
                </h3>
                <p className="mb-4">
                  We use cookies and similar technologies to enhance your
                  experience, analyze usage patterns, and personalize content.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  6. Data Retention
                </h3>
                <p className="mb-4">
                  We retain your information for as long as necessary to provide
                  services and comply with legal obligations.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  7. Your Rights
                </h3>
                <p className="mb-4">
                  You have the right to access, update, or delete your personal
                  information. Contact us to exercise these rights.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  8. International Transfers
                </h3>
                <p className="mb-4">
                  Your information may be transferred to and processed in
                  countries other than your own, subject to appropriate
                  safeguards.
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
