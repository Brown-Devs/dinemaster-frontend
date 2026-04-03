"use client";

import React from "react";
import Image from "next/image";

function TermsAndConditionsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-200">
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
                                className="h-20 rounded-md w-auto"
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
                        Terms and Conditions
                    </h1>
                    <p className="text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
                        Please read these terms carefully before using Trevion CRM.
                    </p>
                </div>
            </header>

            {/* Enhanced Main Content */}
            <main className="flex-1 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden">
                        {/* Sidebar Navigation */}
                        <div className="lg:flex">
                            <div className="lg:w-1/4 bg-gradient-to-b from-purple-50 to-indigo-50 p-8 border-r-2 border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-6 text-lg">Contents</h3>
                                <nav className="space-y-3">
                                    {[
                                        'Introduction',
                                        'Definitions',
                                        'Eligibility and Account',
                                        'Use of Service',
                                        'Subscription and Billing',
                                        'Data Ownership',
                                        'Service Availability',
                                        'Third Party Services',
                                        'Liability',
                                        'Term and Termination',
                                        'Governing Law',
                                        'Updates to Terms',
                                        'Contact Us'
                                    ].map((item, index) => (
                                        <a
                                            key={item}
                                            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="block text-sm text-gray-700 hover:text-purple-700 hover:bg-white/50 rounded-lg p-3 transition-all duration-200 hover:translate-x-2"
                                        >
                                            <span className="text-purple-600 font-medium mr-2">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            {item}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            {/* Content */}
                            <div className="lg:w-3/4 p-8 lg:p-12 space-y-12">
                                {/* 1. Introduction */}
                                <section id="introduction" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">👋</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            These Terms and Conditions apply to your use of Trevion CRM which is provided by <strong>Brown Devs</strong>.
                                            By creating an account or by using the CRM you agree to be bound by these terms.
                                        </p>
                                        <div className="bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-2 rounded">
                                            <p>
                                                If you are using the CRM on behalf of a company you confirm that you have the
                                                authority to accept these terms for that company.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* 2. Definitions */}
                                <section id="definitions" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">📚</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">2. Definitions</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {[
                                            {
                                                term: "We / us",
                                                definition: "means Brown Devs.",
                                                icon: "🏢"
                                            },
                                            {
                                                term: "Service / Trevion CRM",
                                                definition: "means the CRM platform and related features that we provide.",
                                                icon: "🛠️"
                                            },
                                            {
                                                term: "Company",
                                                definition: "means the business account that is created on Trevion CRM.",
                                                icon: "💼"
                                            },
                                            {
                                                term: "Users",
                                                definition: "means people who have login access to your company account such as company admins and managers and employees.",
                                                icon: "👥"
                                            }
                                        ].map((item, index) => (
                                            <div key={index} className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                                        <span className="text-xl">{item.icon}</span>
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900">{item.term}</h3>
                                                </div>
                                                <p className="text-gray-700 text-sm">{item.definition}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* 3. Eligibility and account */}
                                <section id="eligibility-and-account" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🔐</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">3. Eligibility and Account Responsibility</h2>
                                    </div>
                                    <div className="grid gap-4">
                                        {[
                                            "You must be at least 18 years old to use Trevion CRM.",
                                            "You must provide correct and complete information when creating a company account or user account.",
                                            "You are responsible for keeping login details and passwords safe.",
                                            "You are responsible for all activity that happens under your company account."
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-start gap-4 bg-white border-2 border-gray-200 rounded-xl p-4">
                                                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                                    {index + 1}
                                                </div>
                                                <span className="text-gray-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* 4. Use of the service */}
                                <section id="use-of-service" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">⚡</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">4. Use of Trevion CRM</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <p className="text-gray-700 leading-relaxed">
                                            Trevion CRM is provided for business use. Subject to these terms we grant your
                                            company a limited non transferable right to access and use the CRM for your internal business.
                                        </p>

                                        <div className="bg-red-50 border-l-4 border-red-400 pl-4 py-3 rounded">
                                            <h4 className="font-semibold text-gray-900 mb-2">You agree that you will not:</h4>
                                            <div className="grid gap-2">
                                                {[
                                                    "Use the CRM for any illegal activity or to store unlawful content.",
                                                    "Attempt to break security features or gain unauthorised access to other accounts.",
                                                    "Copy or reverse engineer any part of the service except where law allows.",
                                                    "Use the CRM to send spam or abusive messages to leads or customers."
                                                ].map((item, index) => (
                                                    <div key={index} className="flex items-start gap-2">
                                                        <span className="text-red-500 mt-1">•</span>
                                                        <span className="text-gray-700">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* 5. Subscription and billing */}
                                <section id="subscription-and-billing" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">💳</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">5. Subscription and Billing</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid gap-4">
                                            {[
                                                "Subscription is usually based on number of users and the per user price and user limit configured for your company.",
                                                "Billing period normally runs for 30 days from your onboarding date.",
                                                "If payment is not received within the grace period mentioned to you the company subscription may be marked as expired and access for users may be blocked until renewal.",
                                                "All fees are payable as per the plan and commercial terms shared with you separately."
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start gap-4 bg-white border-2 border-gray-200 rounded-xl p-4">
                                                    <div className="w-6 h-6 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-gray-700">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                                            <p className="text-gray-700">
                                                We may change pricing or plans in the future. If we do this for your active company
                                                we will inform the company admin or contact person before changes take effect.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* 6. Data ownership and confidentiality */}
                                <section id="data-ownership" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🔒</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">6. Data Ownership and Confidentiality</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid gap-4">
                                            {[
                                                "Your company owns the leads and contacts and notes and other business data you add to Trevion CRM.",
                                                "We use that data only to provide and improve the CRM and to support your account.",
                                                "We will not sell your CRM data to third parties.",
                                                "We may use aggregated or anonymised data for analytics and performance improvement where individual companies or people are not identified."
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start gap-4 bg-white border-2 border-gray-200 rounded-xl p-4">
                                                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        ✓
                                                    </div>
                                                    <span className="text-gray-700">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6">
                                            <p className="text-gray-700">
                                                You are responsible for having a lawful basis to store personal data of your leads and customers in the CRM.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Continue with remaining sections in similar fashion */}
                                {/* 7. Availability and changes */}
                                <section id="service-availability" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🔄</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">7. Service Availability and Changes</h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <div className="grid gap-3">
                                            {[
                                                "We aim to keep Trevion CRM available and stable but some downtime may happen due to maintenance or technical issues.",
                                                "We may change or improve features over time.",
                                                "We may remove features that are outdated or rarely used after giving reasonable notice where practical."
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mt-4">
                                            <p>
                                                We are not liable for losses that result from reasonable downtime or from changes to
                                                features as long as we act with reasonable care.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* 8. Third party services */}
                                <section id="third-party-services" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🔗</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">8. Third Party Services</h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            Trevion CRM may integrate with third party services such as email tools or payment
                                            gateways or communication platforms. Those services are governed by their own terms and policies.
                                        </p>
                                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                                            <p>
                                                We are not responsible for failures or actions of third party services that we do not control.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* 9. Limitation of liability */}
                                <section id="liability" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">⚖️</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">9. Limitation of Liability</h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            To the maximum extent allowed by law Brown Devs will not be responsible for any
                                            indirect or special or consequential loss or loss of profits that arises from use of Trevion CRM.
                                        </p>
                                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                                            <p>
                                                In any case where liability cannot be excluded our total liability for all claims
                                                related to your use of the service will be limited to the subscription fees paid by
                                                your company for the three months just before the event that gave rise to the claim.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* 10. Term and termination */}
                                <section id="term-and-termination" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">⏰</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">10. Term and Termination</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid gap-3">
                                            {[
                                                "These terms stay in effect while your company account remains active.",
                                                "Your company can request account closure as per the process shared by our team.",
                                                "We may suspend or terminate access if there is non payment or misuse or breach of these terms."
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                                    <span className="text-gray-700">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
                                            <p className="text-gray-700">
                                                After termination we may keep some data for a limited time for backup legal or accounting reasons then delete or anonymise it.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* 11. Governing law */}
                                <section id="governing-law" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🌍</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">11. Governing Law</h2>
                                    </div>
                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                                        <p className="text-gray-700">
                                            These terms are governed by the laws of India. Any disputes will be handled by the competent courts in the region where Brown Devs is registered unless we agree on something else in writing.
                                        </p>
                                    </div>
                                </section>

                                {/* 12. Updates to these terms */}
                                <section id="updates-to-terms" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">📢</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">12. Changes to These Terms</h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            We may update these Terms and Conditions from time to time. The updated version
                                            will be posted on this page with a new Last updated date.
                                        </p>
                                        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6">
                                            <p>
                                                If a change is significant we may also inform the company admin or contact person by email or through the CRM.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* 13. Contact */}
                                <section id="contact-us" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">📞</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">13. Contact Us</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <p className="text-gray-700">
                                            If you have any questions about these Terms and Conditions or about Trevion CRM you can contact us here:
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-lg">📧</span>
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900">Email</h4>
                                                </div>
                                                <p className="text-purple-600 font-medium">contact@browndevs.com</p>
                                            </div>

                                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
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
                        <span className="text-2xl">🤝</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Building Trevion CRM with Trust
                    </h2>
                    <p className="text-lg text-purple-100 mb-6">
                        By Brown Devs
                    </p>
                    <p className="text-sm text-purple-200">
                        Copyright Brown Devs {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default TermsAndConditionsPage;