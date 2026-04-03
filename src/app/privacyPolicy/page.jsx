"use client";

import React from "react";
import Image from "next/image";

function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 to-blue-100">
            {/* Enhanced Top Banner */}
            <header className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>

                <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
                            <Image
                                src="/logo2L.png"
                                alt="Brown Devs logo"
                                width={140}
                                height={40}
                                className="h-20 w-auto rounded-md"
                            />
                        </div>
                    </div>
                    <p className="text-xs sm:text-sm text-purple-100 hidden sm:block bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                        Trevion CRM - Smart lead management and sales tracking
                    </p>
                </div>

                <div className="max-w-6xl mx-auto px-4 pb-16 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-sm text-purple-100">Last updated: 16 November 2025</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
                        Learn how we collect, use, and protect your data when you use Trevion CRM.
                    </p>
                </div>
            </header>

            {/* Enhanced Main Content */}
            <main className="flex-1 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-white rounded-3xl border-2 border-gray-300 overflow-hidden">
                        {/* Sidebar Navigation */}
                        <div className="lg:flex">
                            <div className="lg:w-1/4 bg-gradient-to-b from-purple-50 to-indigo-50 p-8 border-r border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-6 text-lg">Contents</h3>
                                <nav className="space-y-3">
                                    {['Introduction', 'Information We Collect', 'How We Use Information', 'Your Rights', 'Policy Updates', 'Contact Us'].map((item, index) => (
                                        <a
                                            key={item}
                                            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="block text-sm text-gray-700 hover:text-purple-700 hover:bg-white/50 rounded-lg p-3 transition-all duration-200 hover:translate-x-2"
                                        >
                                            <span className="text-purple-600 font-medium mr-2">{String(index + 1).padStart(2, '0')}</span>
                                            {item}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            {/* Content */}
                            <div className="lg:w-3/4 p-8 lg:p-12 space-y-12">
                                {/* Introduction */}
                                <section id="introduction" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">📝</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            <strong>Brown Devs</strong> respects your privacy. This Privacy Policy explains what data we
                                            collect when you use Trevion CRM, how we use it, and what choices you have.
                                        </p>
                                        <p className="bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-2 rounded">
                                            By using Trevion CRM, you agree to this Privacy Policy. If you do not agree,
                                            you should stop using the service.
                                        </p>
                                    </div>
                                </section>

                                {/* Information We Collect */}
                                <section id="information-we-collect" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🔍</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
                                    </div>

                                    <p className="text-gray-700 mb-6">
                                        We collect information in different ways depending on how you use the CRM.
                                    </p>

                                    <div className="space-y-8">
                                        {[
                                            {
                                                title: "Account and company details",
                                                icon: "🏢",
                                                items: [
                                                    "Company name and business profile",
                                                    "Company contact details like email and phone number and office address",
                                                    "GST or tax information that you share for billing",
                                                    "Admin and user details like name email and phone number"
                                                ]
                                            },
                                            {
                                                title: "CRM data you add",
                                                icon: "💼",
                                                items: [
                                                    "Leads and contacts created by your team",
                                                    "Services that you configure for your company",
                                                    "Tasks meetings notes and activity history"
                                                ]
                                            },
                                            {
                                                title: "Usage and technical data",
                                                icon: "📊",
                                                items: [
                                                    "Log information such as IP address browser type and device type",
                                                    "Login time and session identifiers",
                                                    "Basic feature usage patterns for stability and improvement"
                                                ]
                                            },
                                            {
                                                title: "Billing and subscription details",
                                                icon: "💳",
                                                items: [
                                                    "Plan type per user price and user limit",
                                                    "Payment status and billing history",
                                                    "Reference notes when you pay manually such as amount date and internal note"
                                                ]
                                            }
                                        ].map((category, index) => (
                                            <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                        <span className="text-xl">{category.icon}</span>
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 text-lg">{category.title}</h3>
                                                </div>
                                                <ul className="space-y-2">
                                                    {category.items.map((item, itemIndex) => (
                                                        <li key={itemIndex} className="flex items-start gap-3 text-gray-700">
                                                            <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* How We Use Information */}
                                <section id="how-we-use-information" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🛠️</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
                                    </div>
                                    <p className="text-gray-700 mb-6">We use your information to:</p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {[
                                            "Provide and maintain Trevion CRM for your company",
                                            "Set up and manage company accounts and user access",
                                            "Handle lead management tasks meetings and service tracking",
                                            "Generate invoices and track subscription status",
                                            "Monitor performance fix issues and improve the product",
                                            "Communicate with you for support alerts and important updates",
                                            "Comply with legal and regulatory requirements where needed"
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                    {index + 1}
                                                </div>
                                                <span className="text-gray-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Your Rights */}
                                <section id="your-rights" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">📜</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <p className="text-gray-700">
                                            Depending on your location, you may have rights over your personal data.
                                            These can include the right to:
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {[
                                                "Access the personal data stored about you",
                                                "Ask us to correct inaccurate or incomplete information",
                                                "Request deletion of certain data subject to legal limits",
                                                "Object to or limit some types of processing",
                                                "Request a copy of data in a portable format where it is possible"
                                            ].map((right, index) => (
                                                <div key={index} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4">
                                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        ✓
                                                    </div>
                                                    <span className="text-gray-700">{right}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                                            <p className="text-gray-700">
                                                To use these rights, you can contact us using the details in the{" "}
                                                <a href="#contact-us" className="text-purple-600 font-semibold hover:text-purple-700 underline">
                                                    Contact Us
                                                </a>{" "}
                                                section.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Policy Updates */}
                                <section id="policy-updates" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🔄</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Policy Updates</h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            We may update this Privacy Policy when our practices or legal requirements
                                            change. Updated versions will appear on this page with a new Last updated
                                            date.
                                        </p>
                                        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                                            <p className="text-gray-700">
                                                When there is a major change, we may also show a notice inside the CRM or
                                                send a message to your admin contact.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Contact Us */}
                                <section id="contact-us" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">📞</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <p className="text-gray-700">
                                            If you have any questions about this Privacy Policy or how Trevion CRM
                                            handles data, you can reach us here:
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-lg">📧</span>
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900">Email</h4>
                                                </div>
                                                <p className="text-purple-600 font-medium">contact@browndevs.com</p>
                                            </div>

                                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-lg">📱</span>
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900">Phone</h4>
                                                </div>
                                                <p className="text-green-600 font-medium">+91 7011388583</p>
                                            </div>
                                        </div>

                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Enhanced Footer Banner */}
            <footer className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white mt-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
                <div className="max-w-6xl mx-auto px-4 py-16 text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
                        <span className="text-2xl">🛡️</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Your Privacy, Our Commitment
                    </h2>
                    <p className="text-lg text-purple-100 mb-6">
                        Trevion CRM by Brown Devs
                    </p>
                    <p className="text-sm text-purple-200">
                        Copyright Brown Devs {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default PrivacyPolicyPage;