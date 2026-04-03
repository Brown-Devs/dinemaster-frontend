"use client";

import React from "react";
import Image from "next/image";

function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
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
                        Trevion CRM - Built for modern sales teams
                    </p>
                </div>

                <div className="max-w-6xl mx-auto px-4 pb-16 text-center relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                        About Trevion CRM
                    </h1>
                    <p className="text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
                        A focused CRM built by Brown Devs to help teams manage leads and close deals with clarity.
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
                                <h3 className="font-semibold text-gray-900 mb-6 text-lg">About Trevion CRM</h3>
                                <nav className="space-y-3">
                                    {[
                                        'Who We Are',
                                        'What We Do',
                                        'Why We Built It',
                                        'How We Work',
                                        'Who It Is For',
                                        'Our Promise',
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

                                {/* Stats Box */}
                                <div className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-4">
                                    <h4 className="font-semibold text-gray-900 text-sm mb-3">Built with Purpose</h4>
                                    <div className="space-y-2 text-xs text-gray-700">
                                        <div className="flex justify-between">
                                            <span>Focus on:</span>
                                            <span className="font-semibold">Sales Teams</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Goal:</span>
                                            <span className="font-semibold">Clarity & Efficiency</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Approach:</span>
                                            <span className="font-semibold">Simple & Powerful</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="lg:w-3/4 p-8 lg:p-12 space-y-12">
                                {/* Who we are */}
                                <section id="who-we-are" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">👥</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Who We Are</h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            <strong>Trevion CRM</strong> is a product by <strong>Brown Devs</strong>. We are a service based tech team that works on web apps, mobile apps and automation for growing businesses.
                                        </p>
                                        <div className="bg-blue-50 border-l-4 border-blue-400 pl-4 py-2 rounded">
                                            <p>
                                                After building custom tools for different clients we saw one common gap - teams were using scattered sheets, WhatsApp chats and random tools for leads. Trevion CRM is our answer to that problem.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* What Trevion CRM does */}
                                <section id="what-we-do" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🚀</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">What Trevion CRM Does</h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            Trevion CRM is built to give a clean view of your sales in one place. It focuses on what teams actually use every day, not on hundred confusing buttons.
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {[
                                                {
                                                    icon: "🎯",
                                                    title: "Lead Management",
                                                    description: "Capture and manage leads in a simple, powerful pipeline"
                                                },
                                                {
                                                    icon: "📅",
                                                    title: "Activity Tracking",
                                                    description: "Track tasks, followups and meetings so no lead is missed"
                                                },
                                                {
                                                    icon: "🛍️",
                                                    title: "Service Management",
                                                    description: "Manage services that you sell and link them with leads"
                                                },
                                                {
                                                    icon: "👔",
                                                    title: "Team Structure",
                                                    description: "Give structure to sales managers and executives with clear roles"
                                                },
                                                {
                                                    icon: "💰",
                                                    title: "Billing Control",
                                                    description: "See billing and subscription details at admin level with full control"
                                                }
                                            ].map((feature, index) => (
                                                <div key={index} className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                                            <span className="text-lg">{feature.icon}</span>
                                                        </div>
                                                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                                                    </div>
                                                    <p className="text-sm text-gray-700">{feature.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* Why we built it */}
                                <section id="why-we-built-it" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">💡</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Why We Built Trevion CRM</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <p className="text-gray-700 leading-relaxed">
                                            Many small and mid size teams either use heavy tools that feel overkill or they manage work in sheets and chats. Both options create chaos over time.
                                        </p>

                                        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
                                            <h4 className="font-semibold text-gray-900 mb-4">We wanted a CRM that:</h4>
                                            <div className="grid gap-3">
                                                {[
                                                    "Is easy enough for new sales executives",
                                                    "Gives control to company owners and managers",
                                                    "Handles billing logic clearly so there is no confusion on plans",
                                                    "Is ready for automation like WhatsApp flows and cloud calling"
                                                ].map((item, index) => (
                                                    <div key={index} className="flex items-center gap-3">
                                                        <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                            {index + 1}
                                                        </div>
                                                        <span className="text-gray-700">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* How we work */}
                                <section id="how-we-work" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">⚙️</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">How We Work</h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            Brown Devs designs Trevion CRM with real sales teams in mind. We listen to feedback from clients, test flows in real projects and then push updates.
                                        </p>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            {[
                                                {
                                                    icon: "⚡",
                                                    title: "Speed & UX",
                                                    description: "Focus on speed and simple UX for quick adoption"
                                                },
                                                {
                                                    icon: "🔧",
                                                    title: "Modern Tech",
                                                    description: "Keep tech stack modern for easy automation features"
                                                },
                                                {
                                                    icon: "💳",
                                                    title: "Clear Billing",
                                                    description: "Straightforward monthly plans per user"
                                                }
                                            ].map((principle, index) => (
                                                <div key={index} className="bg-white border-2 border-gray-200 rounded-2xl p-4 text-center">
                                                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                                        <span className="text-xl">{principle.icon}</span>
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900 mb-2">{principle.title}</h4>
                                                    <p className="text-sm text-gray-700">{principle.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* Who Trevion CRM is for */}
                                <section id="who-it-is-for" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🎯</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Who Trevion CRM Is For</h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            Trevion CRM is a good fit for teams that:
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {[
                                                "Handle daily inbound or outbound leads",
                                                "Have sales managers and executives who need structure",
                                                "Want visibility into meetings, followups and conversions",
                                                "Want a CRM that can later connect with ads, WhatsApp and cloud calling"
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start gap-3 bg-white border-2 border-gray-200 rounded-xl p-4">
                                                    <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                                        ✓
                                                    </div>
                                                    <span className="text-gray-700">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* Our promise */}
                                <section id="our-promise" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🤝</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Our Promise</h2>
                                    </div>
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            We want Trevion CRM to feel like a tool that supports your team instead of getting in the way.
                                        </p>
                                        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                                            <div className="grid gap-4">
                                                {[
                                                    "Clear plans and pricing with no hidden conditions",
                                                    "Focus on stability, data safety and uptime",
                                                    "Features that solve real day to day problems for sales teams"
                                                ].map((promise, index) => (
                                                    <div key={index} className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            🛡️
                                                        </div>
                                                        <span className="text-gray-700">{promise}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Contact / CTA */}
                                <section id="contact-us" className="scroll-mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">📞</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Talk to Brown Devs</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <p className="text-gray-700 leading-relaxed">
                                            If you want a demo, feature help or custom changes on top of Trevion CRM you can reach out to us directly.
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-lg">📧</span>
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900">Email Us</h4>
                                                </div>
                                                <p className="text-purple-600 font-medium">contact@browndevs.com</p>
                                                <p className="text-sm text-gray-600 mt-2">For demos and feature inquiries</p>
                                            </div>

                                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-lg">📱</span>
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900">Call Us</h4>
                                                </div>
                                                <p className="text-green-600 font-medium">+91 7011388583</p>
                                                <p className="text-sm text-gray-600 mt-2">Available for business discussions</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
                                            <p className="text-sm text-gray-600 text-center">
                                                We also work on custom web and app development if you need deeper integration around Trevion CRM.
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
                        <span className="text-2xl">🚀</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Growing Trevion CRM With You
                    </h2>
                    <p className="text-lg text-purple-100 mb-6">
                        Built and maintained by Brown Devs
                    </p>
                    <p className="text-sm text-purple-200">
                        Copyright Brown Devs {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default AboutPage;