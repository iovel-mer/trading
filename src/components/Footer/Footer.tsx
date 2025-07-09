"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  X,
  Twitter,
  MessageCircle,
  Send,
  Github,
} from "lucide-react";
import Image from "next/image";

const modalContent = {
  terms: {
    title: "Terms of Service",
    content: `
      <h3 class="text-xl font-semibold mb-4 text-white">1. Acceptance of Terms</h3>
      <p class="mb-4">By accessing and using SalesVault, you accept and agree to be bound by the terms and provision of this agreement.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">2. Trading Services</h3>
      <p class="mb-4">SalesVault provides cryptocurrency trading services. All trades are executed at your own risk.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">3. Account Security</h3>
      <p class="mb-4">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">4. Risk Disclosure</h3>
      <p class="mb-4">Cryptocurrency trading involves substantial risk of loss and is not suitable for all investors. Past performance is not indicative of future results.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">5. Fees and Charges</h3>
      <p class="mb-4">Trading fees apply to all transactions. Fee schedules are available on our website and may be updated from time to time.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">6. Prohibited Activities</h3>
      <p class="mb-4">Users may not engage in market manipulation, money laundering, or any other illegal activities on our platform.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">7. Limitation of Liability</h3>
      <p class="mb-4">SalesVault shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">8. Termination</h3>
      <p class="mb-4">We reserve the right to terminate or suspend your account at any time for violation of these terms.</p>
      <p class="text-sm text-gray-400 mt-6">Last updated: January 2024</p>
    `,
  },
  privacy: {
    title: "Privacy Policy",
    content: `
      <h3 class="text-xl font-semibold mb-4 text-white">1. Information We Collect</h3>
      <p class="mb-4">We collect information you provide directly to us, such as when you create an account, make trades, or contact us for support.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">2. How We Use Your Information</h3>
      <p class="mb-4">We use your information to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">3. Information Sharing</h3>
      <p class="mb-4">We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">4. Data Security</h3>
      <p class="mb-4">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">5. Cookies and Tracking</h3>
      <p class="mb-4">We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">6. Data Retention</h3>
      <p class="mb-4">We retain your information for as long as necessary to provide services and comply with legal obligations.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">7. Your Rights</h3>
      <p class="mb-4">You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">8. International Transfers</h3>
      <p class="mb-4">Your information may be transferred to and processed in countries other than your own, subject to appropriate safeguards.</p>
      <p class="text-sm text-gray-400 mt-6">Last updated: January 2024</p>
    `,
  },
  cookies: {
    title: "Cookie Policy",
    content: `
      <h3 class="text-xl font-semibold mb-4 text-white">1. What Are Cookies</h3>
      <p class="mb-4">Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">2. Types of Cookies We Use</h3>
      <p class="mb-4"><strong>Essential Cookies:</strong> Required for the website to function properly, including authentication and security features.</p>
      <p class="mb-4"><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting anonymous information.</p>
      <p class="mb-4"><strong>Functional Cookies:</strong> Enable enhanced functionality and personalization, such as remembering your preferences.</p>
      <p class="mb-4"><strong>Marketing Cookies:</strong> Used to track visitors across websites to display relevant advertisements.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">3. Third-Party Cookies</h3>
      <p class="mb-4">We may use third-party services that set cookies on your device, including Google Analytics and advertising partners.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">4. Managing Cookies</h3>
      <p class="mb-4">You can control cookies through your browser settings. However, disabling certain cookies may affect website functionality.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">5. Cookie Consent</h3>
      <p class="mb-4">By continuing to use our website, you consent to our use of cookies as described in this policy.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">6. Updates to This Policy</h3>
      <p class="mb-4">We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated revision date.</p>
      <p class="text-sm text-gray-400 mt-6">Last updated: January 2024</p>
    `,
  },
  // Product modals
  "Spot Trading": {
    title: "Spot Trading",
    content: `
      <h3 class="text-xl font-semibold mb-4 text-white">Spot Trading</h3>
      <p class="mb-4">Trade cryptocurrencies at current market prices with instant settlement. Buy and sell digital assets directly without leverage.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">Features</h3>
      <ul class="mb-4 list-disc list-inside space-y-2">
        <li>Real-time market prices</li>
        <li>Instant trade execution</li>
        <li>Low trading fees</li>
        <li>Wide range of trading pairs</li>
        <li>Advanced order types</li>
      </ul>
      <p class="text-sm text-gray-400 mt-6">Available 24/7</p>
    `,
  },
  "Futures Trading": {
    title: "Futures Trading",
    content: `
      <h3 class="text-xl font-semibold mb-4 text-white">Futures Trading</h3>
      <p class="mb-4">Trade cryptocurrency futures with leverage up to 125x. Speculate on price movements with advanced trading tools.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">Features</h3>
      <ul class="mb-4 list-disc list-inside space-y-2">
        <li>Up to 125x leverage</li>
        <li>Perpetual contracts</li>
        <li>Risk management tools</li>
        <li>Real-time P&L tracking</li>
        <li>Advanced charting</li>
      </ul>
      <p class="text-sm text-gray-400 mt-6">High risk - High reward</p>
    `,
  },
  "Options": {
    title: "Options Trading",
    content: `
      <h3 class="text-xl font-semibold mb-4 text-white">Options Trading</h3>
      <p class="mb-4">Trade cryptocurrency options with flexible strategies. Hedge your positions or speculate on volatility.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">Features</h3>
      <ul class="mb-4 list-disc list-inside space-y-2">
        <li>Call and Put options</li>
        <li>Multiple expiration dates</li>
        <li>Advanced strategies</li>
        <li>Risk management</li>
        <li>Professional tools</li>
      </ul>
      <p class="text-sm text-gray-400 mt-6">For experienced traders</p>
    `,
  },
  "Staking": {
    title: "Staking",
    content: `
      <h3 class="text-xl font-semibold mb-4 text-white">Staking</h3>
      <p class="mb-4">Earn passive income by staking your cryptocurrencies. Support blockchain networks while earning rewards.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">Features</h3>
      <ul class="mb-4 list-disc list-inside space-y-2">
        <li>Competitive APY rates</li>
        <li>Flexible staking periods</li>
        <li>Auto-compound rewards</li>
        <li>Multiple supported coins</li>
        <li>Easy withdrawal</li>
      </ul>
      <p class="text-sm text-gray-400 mt-6">Earn while you hold</p>
    `,
  },
  // Company modals
  "About Us": {
    title: "About Us",
    content: `
      <h3 class="text-xl font-semibold mb-4 text-white">About SalesVault</h3>
      <p class="mb-4">SalesVault is a leading cryptocurrency trading platform founded in 2020. We provide secure, reliable, and innovative trading solutions for users worldwide.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">Our Mission</h3>
      <p class="mb-4">To democratize access to cryptocurrency trading by providing a user-friendly platform with advanced tools and exceptional security.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">Key Facts</h3>
      <ul class="mb-4 list-disc list-inside space-y-2">
        <li>Founded in 2020</li>
        <li>Millions of users worldwide</li>
        <li>24/7 customer support</li>
        <li>Regulated and compliant</li>
        <li>Advanced security measures</li>
      </ul>
      <p class="text-sm text-gray-400 mt-6">Trusted by millions</p>
    `,
  },
  "Security": {
    title: "Security",
    content: `
      <h3 class="text-xl font-semibold mb-4 text-white">Security Measures</h3>
      <p class="mb-4">Your security is our top priority. We implement industry-leading security measures to protect your assets and personal information.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">Security Features</h3>
      <ul class="mb-4 list-disc list-inside space-y-2">
        <li>Cold storage for 95% of assets</li>
        <li>Multi-signature technology</li>
        <li>Two-factor authentication (2FA)</li>
        <li>Advanced encryption</li>
        <li>Regular security audits</li>
        <li>Insurance coverage</li>
      </ul>
      <h3 class="text-xl font-semibold mb-4 text-white">Best Practices</h3>
      <p class="mb-4">Enable 2FA, use strong passwords, and never share your credentials. We recommend using hardware wallets for large holdings.</p>
      <p class="text-sm text-gray-400 mt-6">Your assets are safe with us</p>
    `,
  },
  // Support modals
  "Help Center": {
    title: "Help Center",
    content: `
      <h3 class="text-xl font-semibold mb-4 text-white">Help Center</h3>
      <p class="mb-4">Find answers to common questions and learn how to use our platform effectively. Our comprehensive help center is available 24/7.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">Available Resources</h3>
      <ul class="mb-4 list-disc list-inside space-y-2">
        <li>Getting started guides</li>
        <li>Trading tutorials</li>
        <li>Security best practices</li>
        <li>FAQ section</li>
        <li>Video tutorials</li>
        <li>Community forum</li>
      </ul>
      <h3 class="text-xl font-semibold mb-4 text-white">Contact Options</h3>
      <p class="mb-4">Can't find what you're looking for? Contact our support team via live chat, email, or ticket system.</p>
      <p class="text-sm text-gray-400 mt-6">We're here to help 24/7</p>
    `,
  },
  "Contact Us": {
    title: "Contact Us",
    content: `
      <h3 class="text-xl font-semibold mb-4 text-white">Contact Us</h3>
      <p class="mb-4">Get in touch with our support team. We're here to help with any questions or issues you may have.</p>
      <h3 class="text-xl font-semibold mb-4 text-white">Contact Methods</h3>
      <ul class="mb-4 list-disc list-inside space-y-2">
        <li><strong>Live Chat:</strong> Available 24/7 on our platform</li>
        <li><strong>Email:</strong> support@salesvault.com</li>
        <li><strong>Support Tickets:</strong> Submit through your account</li>
        <li><strong>Response Time:</strong> Within 2 hours</li>
      </ul>
      <h3 class="text-xl font-semibold mb-4 text-white">Business Inquiries</h3>
      <p class="mb-4">For business partnerships, media inquiries, or other business-related questions, please email: business@salesvault.com</p>
      <p class="text-sm text-gray-400 mt-6">We respond within 2 hours</p>
    `,
  },
};

export default function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleOpenModal = (modalType: string) => {
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const socialIcons = {
    Twitter: Twitter,
    Discord: MessageCircle,
    Telegram: Send,
    GitHub: Github,
  };

  return (
    <div className="relative">
      {/* Footer */}
      <footer className="py-20 px-6 border-t border-gray-800 bg-black text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/Vector.png"
                  alt="SalesVault"
                  width={30}
                  height={30}
                />
                <span className="text-2xl font-bold">SalesVault</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                The most trusted cryptocurrency trading platform with advanced
                tools and security.
              </p>
              {/* <div className="flex space-x-4">
                {Object.entries(socialIcons).map(([social, Icon]) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div> */}
            </div>

            {[
              {
                title: "Products",
                links: [
                  "Spot Trading",
                  "Futures Trading",
                  "Options",
                  "Staking",
                ],
              },
              {
                title: "Company",
                links: ["About Us", "Security"],
              },
              {
                title: "Support",
                links: ["Help Center", "Contact Us"],
              },
            ].map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <button
                        type="button"
                        onClick={() => handleOpenModal(link)}
                        className="text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 text-left"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © 2024 SalesVault. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenModal("terms");
                  }}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-1 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  Terms of Service
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenModal("privacy");
                  }}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-1 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  Privacy Policy
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenModal("cookies");
                  }}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-1 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  Cookie Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Portal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ pointerEvents: "auto" }}
            onClick={handleCloseModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-gray-900 rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {
                    modalContent[activeModal as keyof typeof modalContent]
                      ?.title
                  }
                </h2>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <X className="w-6 h-6 text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div
                  className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                  style={{ lineHeight: "1.7" }}
                  dangerouslySetInnerHTML={{
                    __html:
                      modalContent[activeModal as keyof typeof modalContent]
                        ?.content || "",
                  }}
                />
              </div>

              {/* Footer */}
              <div className="flex justify-end p-2 border-t border-gray-800 bg-gray-900/50">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseModal}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
