"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  IconButton,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  FormHelperText,
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
import { productSchema } from "@/lib/validations";
import { useBrandProducts } from "@/hooks/admin/useBrandProducts";
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";

export default function ProductFormModal({ open, onClose, product = null }) {
  const { user } = useAuthStore();
  const { companyCategoriesQuery, createProductMutation, updateProductMutation } = useBrandProducts();
  const { data: catData } = companyCategoriesQuery();
  const categories = catData?.data?.data || [];

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
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      imageUrl: "",
      active: true,
      inStock: true,
      variants: [{ name: "Standard", actualPrice: 0, discountedPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  useEffect(() => {
    if (open) {
      if (product) {
        reset({
          name: product.name || "",
          category: product.category?._id || product.category || "",
          description: product.description || "",
          imageUrl: product.imageUrl || product.imageURL || "",
          active: product.active ?? true,
          inStock: product.inStock ?? true,
          variants: product.variants?.length > 0
            ? product.variants.map(v => ({ name: v.name, actualPrice: v.actualPrice, discountedPrice: v.discountedPrice || 0 }))
            : [{ name: "Standard", actualPrice: 0, discountedPrice: 0 }],
        });
        setPreviewUrl(product.imageUrl || product.imageURL || "");
      } else {
        reset({ name: "", category: "", description: "", imageUrl: "", active: true, inStock: true, variants: [{ name: "Standard", actualPrice: 0, discountedPrice: 0 }] });
        setPreviewUrl("");
      }
      setSelectedFile(null);
      setUploadProgress(0);
      setIsUploading(false);
    }
  }, [product, open, reset]);

  const applyFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 500 * 1024) { toast.error("Image must be under 500KB"); return; }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => applyFile(e.target.files?.[0]);
  const handleDrop = (e) => { e.preventDefault(); setIsDragOver(false); applyFile(e.dataTransfer.files?.[0]); };

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("companyId", user?.company || "unknown");
    fd.append("folder", "products");
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
          toast.success("Image uploaded", { id: tid });
        } catch {
          toast.error("Image upload failed", { id: tid });
          return;
        }
      }
      const payload = { ...data, imageUrl: finalImageUrl };
      if (product?._id) {
        await updateProductMutation.mutateAsync({ id: product._id, data: payload });
        toast.success("Product updated");
      } else {
        await createProductMutation.mutateAsync(payload);
        toast.success("Product created");
      }
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const isSubmitting = createProductMutation.isPending || updateProductMutation.isPending || isUploading;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: "var(--card)",
          backgroundImage: "none",
          maxHeight: "90vh",
        },
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <p className="font-bold text-lg" style={{ color: "var(--fg)" }}>
            {product ? "Edit Product" : "Add New Product"}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {product ? "Update the details below" : "Fill in the details to add a product"}
          </p>
        </div>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      {/* ── Body ── */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 130px)" }}>
          <div className="p-5 space-y-6">

            {/* ── Top Section: Image + Core Info ── */}
            <div className="flex flex-col sm:flex-row gap-5">

              {/* Image Uploader */}
              <div className="sm:w-40 shrink-0">
                <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Product Image
                </p>
                <div
                  className={`relative group w-full sm:w-40 h-40 rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden cursor-pointer flex flex-col items-center justify-center
                    ${isDragOver ? "border-blue-400 bg-blue-50/10" : "border-border hover:border-border2"}`}
                  style={{ background: "var(--cardsBG)" }}
                  onClick={() => document.getElementById("product-img-input").click()}
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
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--border)" }}>
                        <ImageIcon sx={{ fontSize: 22, color: "var(--muted)" }} />
                      </div>
                      <span className="text-[11px]" style={{ color: "var(--muted)" }}>
                        Drop or click<br />
                        <span className="font-semibold">Max 500KB</span>
                      </span>
                    </div>
                  )}
                </div>

                {isUploading && (
                  <div className="mt-2 space-y-1">
                    <LinearProgress variant="determinate" value={uploadProgress} sx={{ borderRadius: 4, height: 4 }} />
                    <p className="text-[10px] text-center" style={{ color: "var(--muted)" }}>
                      Uploading… {uploadProgress}%
                    </p>
                  </div>
                )}

                <input id="product-img-input" type="file" hidden accept="image/*" onChange={handleFileChange} />
              </div>

              {/* Name + Category + Description */}
              <div className="flex-1 flex flex-col gap-3">
                {/* Name + Category row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <TextField
                      fullWidth
                      label="Product Name"
                      {...register("name")}
                      error={!!errors.name}
                      size="small"
                      variant="outlined"
                    />
                    {errors.name && <p className="text-[11px] text-red-500 mt-0.5">{errors.name.message}</p>}
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      select
                      label="Category"
                      {...register("category")}
                      value={watch("category") || ""}
                      error={!!errors.category}
                      size="small"
                      variant="outlined"
                    >
                      {categories.length === 0 ? (
                        <MenuItem disabled>No categories found</MenuItem>
                      ) : categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                      ))}
                    </TextField>
                    {errors.category && <p className="text-[11px] text-red-500 mt-0.5">{errors.category.message}</p>}
                  </div>
                </div>

                {/* Description */}
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  placeholder="Short product description…"
                  {...register("description")}
                  size="small"
                  variant="outlined"
                />

                {/* Toggles */}
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${watch("active") ? "border-green-500/40 bg-green-500/5" : "border-border bg-cardsBG"}`}
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
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${watch("inStock") ? "border-blue-500/40 bg-blue-500/5" : "border-border bg-cardsBG"}`}
                  >
                    <Switch
                      size="small"
                      checked={watch("inStock")}
                      onChange={(e) => setValue("inStock", e.target.checked)}
                      color="info"
                    />
                    <span className="text-sm font-medium" style={{ color: "var(--fg)" }}>
                      {watch("inStock") ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="border-t border-border" />

            {/* ── Variants Section ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--fg)" }}>Pricing & Variants</p>
                  <p className="text-[11px]" style={{ color: "var(--muted)" }}>Add one or more size/price variants</p>
                </div>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => append({ name: "", actualPrice: 0, discountedPrice: 0 })}
                  variant="outlined"
                  sx={{ textTransform: "none", borderRadius: 2, fontSize: 12 }}
                >
                  Add Variant
                </Button>
              </div>

              {/* Header row — only on sm+ */}
              <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_36px] gap-2 px-3 mb-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Name</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Actual Price</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Discounted</p>
                <span />
              </div>

              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-xl border border-border p-3 flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr_36px] gap-2 items-start sm:items-center"
                    style={{ background: "var(--cardsBG)" }}
                  >
                    <div className="w-full">
                      <TextField
                        fullWidth
                        size="small"
                        label="Variant Name"
                        placeholder="e.g. Regular, Large"
                        {...register(`variants.${index}.name`)}
                        error={!!errors.variants?.[index]?.name}
                      />
                      {errors.variants?.[index]?.name && (
                        <p className="text-[10px] text-red-500 mt-0.5">{errors.variants[index].name.message}</p>
                      )}
                    </div>
                    <div className="w-full">
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Actual ₹"
                        {...register(`variants.${index}.actualPrice`)}
                        error={!!errors.variants?.[index]?.actualPrice}
                        inputProps={{ min: 0, step: 0.5 }}
                      />
                    </div>
                    <div className="w-full">
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Discounted ₹"
                        {...register(`variants.${index}.discountedPrice`)}
                        error={!!errors.variants?.[index]?.discountedPrice}
                        inputProps={{ min: 0, step: 0.5 }}
                      />
                    </div>
                    <Tooltip title="Remove">
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          disabled={fields.length === 1}
                          onClick={() => remove(index)}
                          sx={{ p: 0.75 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </div>
                ))}
                {errors.variants?.message && (
                  <p className="text-[11px] text-red-500">{errors.variants.message}</p>
                )}
              </div>
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
            {isUploading
              ? "Uploading…"
              : product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
