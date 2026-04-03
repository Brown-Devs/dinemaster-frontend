"use client";
import React from "react";
import clsx from "clsx";

export default function CustomChip({
    label,
    icon = null,        // 👈 icon prop
    bgColor = "bg-gray-100",
    textColor = "text-gray-700",
    className = "",
}) {
    if (!label) return null;

    return (
        <div
            className={clsx(
                "px-2 py-1 w-full",
                "capitalize",
                "text-xs font-semibold",
                "rounded-md",
                "leading-snug",
                "break-words",
                "max-w-[140px]",
                "whitespace-normal",
                "flex items-center gap-1",   // 👈 icon + text layout
                bgColor,
                textColor,
                className
            )}
        >
            {icon && (
                <span className="flex-shrink-0">
                    {icon}
                </span>
            )}

            <span className="text-center w-full">
                {label}
            </span>
        </div>
    );
}
