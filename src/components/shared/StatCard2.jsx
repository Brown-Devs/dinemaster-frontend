import React from 'react'

const StatCard2 = ({ title, value, Icon, bg = "from-gray-700 to-gray-800", loading = false }) => (
    <div className={`bg-gradient-to-br ${bg} rounded-xl p-3 sm:p-4 md:p-5 text-white transition-all duration-300 hover:-translate-y-0.5 `}>
        <div className="flex justify-between items-center">
            <div className="flex-1">
                {loading ? (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span className="text-xs text-white/70">Loading</span>
                    </div>
                ) : (
                    <>
                        <p className="text-[11px] sm:text-xs text-white/80 font-medium leading-tight">
                            {title}
                        </p>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug">
                            {value ?? "—"}
                        </h3>
                    </>
                )}
            </div>

            {Icon && (
                <div
                    className="
                        bg-white/20
                        p-2 sm:p-2.5
                        rounded-lg
                        backdrop-blur-sm
                        flex items-center justify-center
                    "
                >
                    <Icon className="text-lg sm:text-xl md:text-2xl" />
                </div>
            )}
        </div>
    </div>
);

export default StatCard2;