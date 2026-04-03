const StatCard = ({ title, value, subtitle, Icon, bg, loading = false }) => {
    return (
        <div className={`bg-gradient-to-br ${bg} rounded-2xl p-6 text-white transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    {loading ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                                <p className="text-sm text-white/70">Loading</p>
                            </div>
                            <div className="h-6 bg-white/20 rounded animate-pulse w-24"></div>
                        </div>
                    ) : (
                        <>
                            <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
                            <h3 className="text-3xl font-bold mb-2">{value ?? "—"}</h3>
                            <div className="flex items-center justify-between">
                                <p className="text-white/60 text-xs">{subtitle}</p>

                            </div>
                        </>
                    )}
                </div>
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    {Icon && <Icon className="text-white text-2xl" />}
                </div>
            </div>
        </div>
    );
};
export default StatCard;