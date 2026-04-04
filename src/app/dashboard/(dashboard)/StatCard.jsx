"use client";
import React from 'react';
import { Skeleton } from "@mui/material";

export default function StatCard({ title, value, subtitle, Icon, bgGradient, loading, extraContent }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${bgGradient} p-5 transition-all duration-300 hover:-translate-y-1 group min-h-[140px] flex flex-col justify-between`}>
      {/* Subtle Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:24px_24px]" />

      <div className="relative z-10 flex flex-col h-full text-white">
        <div className="flex justify-between items-start">
          {/* Main Info */}
          <div className="flex-1">
            <p className="text-[13px] font-bold text-white/90 tracking-tight mb-2">{title}</p>
            {loading ? (
              <Skeleton variant="text" width="80%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            ) : (
              <h3 className="text-3xl font-extrabold tracking-tighter mb-1">
                {value}
              </h3>
            )}
          </div>

          {/* Icon on the Right */}
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm ml-4">
            {Icon && <Icon className="text-white" size={22} />}
          </div>
        </div>

        {/* Sub-stats / Extra Content */}
        <div className="mt-1 flex flex-col gap-1 border-t border-white/10 pt-2">
          {extraContent ? (
            <div className="text-base flex flex-wrap gap-x-5 gap-y-1.5">
              {extraContent}
            </div>
          ) : (
            <p className="text-base text-white/80 font-medium tracking-tight">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
