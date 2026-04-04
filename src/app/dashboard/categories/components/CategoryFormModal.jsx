"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  IconButton,
  TextField,
  Switch,
  LinearProgress,
  Button,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/lib/validations";
import { useCategories } from "@/hooks/admin/useCategories";
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";

export default function CategoryFormModal({ open, onClose, category = null }) {
  const { user } = useAuthStore();
  const { createCategoryMutation, updateCategoryMutation } = useCategories();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      active: true,
      addOns: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addOns",
  });

  useEffect(() => {
    if (open) {
      if (category) {
        reset({
          name: category.name || "",
          imageUrl: category.imageUrl || "",
          active: category.active ?? true,
          addOns: category.addOns?.length > 0
            ? category.addOns.map(v => ({ name: v.name, price: v.price }))
            : [],
        });
        setPreviewUrl(category.imageUrl || "");
      } else {
        reset({
          name: "",
          imageUrl: "",
          active: true,
          addOns: [],
        });
        setPreviewUrl("");
      }
      setSelectedFile(null);
      setUploadProgress(0);
      setIsUploading(false);
    }
  }, [category, open, reset]);

  const applyFile = (file) => {
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
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => applyFile(e.target.files?.[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    applyFile(e.dataTransfer.files?.[0]);
  };

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("companyId", user?.company || "unknown");
    fd.append("folder", "categories");
    setIsUploading(true);
    setUploadProgress(20);

    try {
      const res = await fetch("/api/r2-presign-put", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      setUploadProgress(90);
      const data = await res.json();
      setUploadProgress(100);
      return data.publicUrl;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    let finalImageUrl = data.imageUrl || "";

    try {
      if (selectedFile) {
        const tid = toast.loading("Uploading image…");
        try {
          finalImageUrl = await uploadImage(selectedFile);
          toast.dismiss(tid);
        } catch {
          toast.error("Image upload failed", { id: tid });
          return;
        }
      }

      const payload = {
        ...data,
        imageUrl: finalImageUrl,
      };

      if (category?._id) {
        await updateCategoryMutation.mutateAsync({ id: category._id, data: payload });
      } else {
        await createCategoryMutation.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const isSubmitting = createCategoryMutation.isPending || updateCategoryMutation.isPending || isUploading;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: "var(--card)",
          backgroundImage: "none",
        },
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <p className="font-bold text-lg" style={{ color: "var(--fg)" }}>
            {category ? "Edit Category" : "Add New Category"}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {category ? "Update category details" : "Create a new category for your menu"}
          </p>
        </div>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      {/* ── Body ── */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="p-5 space-y-6">
          {/* Top Section: Image + Name */}
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Image Uploader */}
            <div className="sm:w-32 shrink-0">
              <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                Image
              </p>
              <div
                className={`relative group w-full sm:w-32 h-32 rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden cursor-pointer flex flex-col items-center justify-center
                  ${isDragOver ? "border-blue-400 bg-blue-50/10" : "border-border hover:border-border2"}`}
                style={{ background: "var(--cardsBG)" }}
                onClick={() => document.getElementById("category-img-input").click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                      <CloudUploadIcon sx={{ color: "white", fontSize: 24 }} />
                      <span className="text-white text-[10px] font-semibold">Change</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 p-4 text-center">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--border)" }}>
                      <ImageIcon sx={{ fontSize: 18, color: "var(--muted)" }} />
                    </div>
                    <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                      Max 500KB
                    </span>
                  </div>
                )}
              </div>

              {isUploading && (
                <div className="mt-2 space-y-1">
                  <LinearProgress variant="determinate" value={uploadProgress} sx={{ borderRadius: 4, height: 4 }} />
                </div>
              )}

              <input id="category-img-input" type="file" hidden accept="image/*" onChange={handleFileChange} />
            </div>

            {/* Name + Status */}
            <div className="flex-1 flex flex-col gap-4 pt-6">
              <div>
                <TextField
                  fullWidth
                  label="Category Name"
                  placeholder="e.g. Pizza"
                  {...register("name")}
                  error={!!errors.name}
                  size="small"
                  variant="outlined"
                />
                {errors.name && <p className="text-[11px] text-red-500 mt-0.5">{errors.name.message}</p>}
              </div>

              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all self-start ${watch("active") ? "border-green-500/40 bg-green-500/5" : "border-border bg-cardsBG"}`}
              >
                <Switch
                  size="small"
                  checked={watch("active")}
                  onChange={(e) => setValue("active", e.target.checked)}
                  color="success"
                />
                <span className="text-sm font-medium" style={{ color: "var(--fg)" }}>
                  {watch("active") ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Add-Ons */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--fg)" }}>Add-ons (Optional)</p>
                <p className="text-[11px]" style={{ color: "var(--muted)" }}>Extra items available for this category</p>
              </div>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => append({ name: "", price: 0 })}
                variant="outlined"
                sx={{ textTransform: "none", borderRadius: 2, fontSize: 12 }}
              >
                Add Add-on
              </Button>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-border p-3 flex flex-col sm:grid sm:grid-cols-[2fr_1fr_36px] gap-2 items-start sm:items-center"
                  style={{ background: "var(--cardsBG)" }}
                >
                  <div className="w-full">
                    <TextField
                      fullWidth
                      size="small"
                      label="Add-on Name"
                      placeholder="e.g. Extra Cheese"
                      {...register(`addOns.${index}.name`)}
                      error={!!errors.addOns?.[index]?.name}
                    />
                  </div>
                  <div className="w-full">
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Price ₹"
                      {...register(`addOns.${index}.price`)}
                      error={!!errors.addOns?.[index]?.price}
                      inputProps={{ min: 0, step: 0.5 }}
                    />
                  </div>
                  <Tooltip title="Remove">
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => remove(index)}
                        sx={{ p: 0.75 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </div>
              ))}
              {fields.length === 0 && (
                <div className="text-center py-4 rounded-xl border border-dashed border-border text-sm" style={{ color: "var(--muted)" }}>
                  No add-ons defined for this category.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border">
          <Button
            type="button"
            variant="outlined"
            color="inherit"
            onClick={onClose}
            disabled={isSubmitting}
            sx={{ borderRadius: 2, textTransform: "none", borderColor: "var(--border)", color: "var(--fg)" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            loading={isSubmitting}
            loadingPosition="start"
            startIcon={<span />}
            sx={{ borderRadius: 2, textTransform: "none", minWidth: 140, fontWeight: 600 }}
          >
            {isUploading ? "Uploading…" : category ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
