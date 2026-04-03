export const formatFileSize = (bytes) => {
        if (!bytes) return "-";
        const kb = bytes / 1024;
        const mb = kb / 1024;
        return mb >= 1
            ? `${mb.toFixed(2)} MB`
            : `${kb.toFixed(2)} KB`;
    };