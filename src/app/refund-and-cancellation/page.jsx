"use client";

import React from "react";
import Image from "next/image";

function RefundAndCancellationPage() {
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
                        Trevion CRM subscription and billing information
                    </p>
                </div>

                <div className="max-w-6xl mx-auto px-4 pb-16 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-sm text-purple-100">Last updated: 16 November 2025</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                        Refund and Cancellation Policy
                    </h1>
                    <p className="text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
                        Please read this policy carefully before starting your subscription.
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
                                <h3 className="font-semibold text-gray-900 mb-6 text-lg">Policy Sections</h3>
                                <nav className="space-y-3">
                                    {[
                                        'Scope of Policy',
                                        'Subscription Period',
                                        'Refund Policy',
                                        'Cancellation',
                                        'Plan Changes',
                                        'Exceptional Cases',
                                        'Contact for Billing'
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

                                {/* Important Notice Box */}
                                <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">⚠️</span>
                                        <h4 className="font-semibold text-gray-900 text-sm">Important</h4>
                                    </div>
                                    <p className="text-xs text-gray-700">
                                        Subscription fees are non-refundable after activation. Please review carefully.
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="lg:w-3/4 p-8 lg:p-12 space-y-12">
                                {/* 1. Scope */}
                                <section id="scope-of-policy" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">📋</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">1. Scope of this Policy</h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            This Refund and Cancellation Policy applies to subscription payments that you make for using Trevion CRM which is provided by <strong>Brown Devs</strong>.
                                        </p>
                                        <div className="bg-blue-50 border-l-4 border-blue-400 pl-4 py-2 rounded">
                                            <p>
                                                By starting a paid subscription you agree to the terms mentioned on this page.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* 2. Minimum subscription period */}
                                <section id="subscription-period" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">⏱️</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">2. Minimum Subscription Period</h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            Trevion CRM works on a subscription model. The minimum subscription period is
                                            <span className="font-semibold text-purple-600"> one month</span>.
                                        </p>
                                        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                                            <p>
                                                When your company activates a plan the subscription is created for at least one full billing cycle which is normally thirty days from the start date that is set for your company.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* 3. No refund after subscription start */}
                                <section id="refund-policy" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">💰</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">3. Refund Policy</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                                            <p className="font-semibold text-gray-900 mb-2">
                                                Once a subscription is started and your company has been given access to Trevion CRM the subscription fee is <span className="text-red-600">non refundable</span>.
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">This means that after activation we do not provide refunds for:</h4>
                                            <div className="grid gap-3">
                                                {[
                                                    "Partial use of the month",
                                                    "Unused days in the current billing cycle",
                                                    "Downgrades or reduction in user count within the active month"
                                                ].map((item, index) => (
                                                    <div key={index} className="flex items-start gap-4 bg-white border-2 border-gray-200 rounded-xl p-4">
                                                        <div className="w-6 h-6 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                                            {index + 1}
                                                        </div>
                                                        <span className="text-gray-700">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                                            <p className="text-gray-700">
                                                Please start a paid plan only after you are satisfied with what Trevion CRM offers to your company.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* 4. Cancellation and non renewal */}
                                <section id="cancellation" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🚫</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">4. Cancellation and Non Renewal</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <p className="text-gray-700 leading-relaxed">
                                            You have full control to continue or to stop using Trevion CRM after your current subscription period ends.
                                        </p>

                                        <div className="grid gap-4">
                                            {[
                                                "If you do not make the next payment after the current billing cycle and any grace period your subscription may be marked as expired and access to the CRM for your company users may be stopped.",
                                                "There is no pressure or automatic lock in that forces you to buy the subscription again after it ends. The decision to renew or to stop is completely your choice.",
                                                "If you decide not to renew you can simply skip the next payment. Your plan will expire as per the billing rules that are already explained to you."
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start gap-4 bg-white border-2 border-gray-200 rounded-xl p-4">
                                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        {index === 1 ? "🎯" : index === 2 ? "✅" : "📅"}
                                                    </div>
                                                    <span className="text-gray-700">{item}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                                            <p className="text-gray-700">
                                                Any renewal that you choose later will be treated as a new paid period as per the then applicable pricing and terms.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* 5. Changes to plan during active period */}
                                <section id="plan-changes" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🔄</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">5. Changes to Plan During an Active Month</h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            If you increase or decrease users or change plan configuration during an active subscription month billing will follow the rules agreed with you during onboarding or renewal.
                                        </p>
                                        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
                                            <p className="font-semibold">
                                                However the base rule of this policy remains the same that fees paid for an already started subscription month are not refundable.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* 6. Exceptional cases */}
                                <section id="exceptional-cases" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🔍</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">6. Exceptional Cases</h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            In rare cases where there is a clear billing error from our side we may review and adjust the invoice after mutual discussion.
                                        </p>
                                        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-6">
                                            <p>
                                                Such adjustments are handled case by case and do not change the general rule that regular subscription payments after activation are non refundable.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* 7. How to contact us */}
                                <section id="contact-for-billing" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">📞</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">7. Contact for Billing Questions</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <p className="text-gray-700">
                                            If you have any questions about your subscription billing or this policy you can contact our support team.
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-lg">📧</span>
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900">Email Support</h4>
                                                </div>
                                                <p className="text-purple-600 font-medium">support@browndevs.com</p>
                                                <p className="text-sm text-gray-600 mt-2">For billing inquiries and policy questions</p>
                                            </div>

                                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-lg">📱</span>
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900">Phone Support</h4>
                                                </div>
                                                <p className="text-green-600 font-medium">+91 00000 00000</p>
                                                <p className="text-sm text-gray-600 mt-2">Available during business hours</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
                                            <p className="text-sm text-gray-600 text-center">
                                                We typically respond to billing inquiries within 24 hours during business days.
                                            </p>
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
                        <span className="text-2xl">📄</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Clear and Simple Subscription Rules
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

export default RefundAndCancellationPage;