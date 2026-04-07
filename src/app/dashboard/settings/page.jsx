"use client";

import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  IconButton, 
  LinearProgress, 
  TextField, 
  Divider,
  Alert
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import QrCodeIcon from "@mui/icons-material/QrCode";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import { useCompany } from "@/hooks/admin/useCompany";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/constants";
import toast from "react-hot-toast";

const ImageUploader = ({ label, currentImage, onUpload, onRemove, folder = "misc", icon: Icon }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentImage || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuthStore();

  useEffect(() => {
    setPreviewUrl(currentImage || "");
  }, [currentImage]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 500 * 1024) {
      toast.error("Image must be under 500KB");
      return;
    }

    setSelectedFile(file);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    // Auto-upload
    const fd = new FormData();
    fd.append("file", file);
    fd.append("companyId", user?.company || "unknown");
    fd.append("folder", folder);

    setIsUploading(true);
    setUploadProgress(10);

    try {
      setUploadProgress(30);
      const res = await fetch("/api/r2-presign-put", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      
      setUploadProgress(80);
      const data = await res.json();
      setUploadProgress(100);
      
      onUpload(data.publicUrl, data.key);
      toast.success(`${label} uploaded successfully`);
    } catch (err) {
      toast.error(`Failed to upload ${label}`);
      setPreviewUrl(currentImage); // Reset on error
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: "var(--card)", height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
            {Icon ? <Icon /> : <ImageIcon />}
          </div>
          <div>
            <Typography variant="subtitle1" fontWeight="bold">{label}</Typography>
            <Typography variant="caption" sx={{ color: "var(--muted)" }}>JPG, PNG or WEBP • max 500KB</Typography>
          </div>
        </div>
        
        {previewUrl && (
          <IconButton 
            size="small" 
            color="error" 
            onClick={onRemove}
            sx={{ bgcolor: "rgba(244, 67, 54, 0.05)", "&:hover": { bgcolor: "rgba(244, 67, 54, 0.1)" } }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </div>

      <div 
        className="relative group rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden mb-4 h-[160px] w-full"
        onClick={() => document.getElementById(`upload-${label}`).click()}
      >
        {previewUrl ? (
          <img src={previewUrl} alt={label} className="w-full h-full object-contain p-2" />
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 text-center">
             <CloudUploadIcon sx={{ fontSize: 40, color: "var(--muted)", opacity: 0.5 }} />
             <Typography variant="body2" sx={{ color: "var(--muted)" }}>Click to upload {label}</Typography>
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-card/80 flex flex-col items-center justify-center p-4">
            <LinearProgress variant="determinate" value={uploadProgress} sx={{ width: '80%', height: 6, borderRadius: 3 }} />
            <Typography variant="caption" sx={{ mt: 1 }}>Uploading {uploadProgress}%</Typography>
          </div>
        )}
      </div>

      <input id={`upload-${label}`} type="file" hidden accept="image/*" onChange={handleFileChange} />
      <Button 
        variant="outlined" 
        size="small" 
        startIcon={<CloudUploadIcon />}
        onClick={() => document.getElementById(`upload-${label}`).click()}
        disabled={isUploading}
        sx={{ borderRadius: 2, textTransform: 'none' }}
      >
        Change Image
      </Button>
    </Paper>
  );
};

export default function SettingsPage() {
  const { checkPermission } = usePermissions();
  const { myCompanyQuery, updateMyCompanyMutation } = useCompany();
  const { data: companyData, isLoading } = myCompanyQuery();
  const company = companyData?.company;

  const [invoiceTerms, setInvoiceTerms] = useState("");

  useEffect(() => {
    if (company) {
      setInvoiceTerms(company.invoiceTerms || "");
    }
  }, [company]);

  const handleBrandingUpdate = (url, key, type) => {
    const payload = {};
    if (type === 'logo') {
      payload.logo = url;
      payload.logoKey = key;
    } else if (type === 'qr') {
      payload.paymentQr = url;
      payload.paymentQrKey = key;
    }
    updateMyCompanyMutation.mutate(payload);
  };

  const handleRemoveBranding = (type) => {
    const payload = {};
    if (type === 'logo') {
      payload.logo = null;
      payload.logoKey = null;
    } else if (type === 'qr') {
      payload.paymentQr = null;
      payload.paymentQrKey = null;
    }
    updateMyCompanyMutation.mutate(payload);
  };

  const handleSaveTerms = () => {
    updateMyCompanyMutation.mutate({ invoiceTerms });
  };

  if (isLoading) return <LinearProgress />;

  if (!checkPermission(PERMISSIONS.SETTINGS_VIEW)) {
    return (
      <InnerDashboardLayout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            Access Denied: You do not have permission to view or edit company settings.
          </Alert>
        </Box>
      </InnerDashboardLayout>
    );
  }

  return (
    <InnerDashboardLayout>
      <div className="flex justify-between items-center mb-6 mt-2 flex-wrap gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-foreground">
            Settings
          </h1>
          <p className="text-[13px] text-muted mt-0.5">
            Manage your company branding, invoice preferences and setup.
          </p>
        </div>
      </div>

      <Box sx={{ width: "100%" }}>
        <div className="bg-card p-4 sm:p-6 border border-border rounded-2xl shadow-sm">
          <Grid container spacing={3}>
            {/* Logo Section */}
            <Grid item xs={12} md={6}>
              <ImageUploader 
                label="Company Logo" 
                currentImage={company?.logo}
                icon={BrandingWatermarkIcon}
                folder="branding/logo"
                onUpload={(url, key) => handleBrandingUpdate(url, key, 'logo')}
                onRemove={() => handleRemoveBranding('logo')}
              />
            </Grid>

            {/* QR Section */}
            <Grid item xs={12} md={6}>
              <ImageUploader 
                label="Payment QR Code" 
                currentImage={company?.paymentQr}
                icon={QrCodeIcon}
                folder="branding/qr"
                onUpload={(url, key) => handleBrandingUpdate(url, key, 'qr')}
                onRemove={() => handleRemoveBranding('qr')}
              />
            </Grid>
          </Grid>
        </div>
      </Box>
    </InnerDashboardLayout>
  );
}
