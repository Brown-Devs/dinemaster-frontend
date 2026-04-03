"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Typography,
  Divider,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useBrandProducts } from "@/hooks/admin/useBrandProducts";

export default function ProductFormModal({ open, onClose, product = null }) {
  const { companyCategoriesQuery, createProductMutation, updateProductMutation } = useBrandProducts();
  const { data: catData } = companyCategoriesQuery();
  const categories = catData?.data?.data || [];

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    imageURL: "",
    active: true,
    inStock: true,
    variants: [{ name: "Standard", actualPrice: 0, discountedPrice: 0 }],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category?._id || product.category || "",
        description: product.description || "",
        imageURL: product.imageURL || "",
        active: product.active ?? true,
        inStock: product.inStock ?? true,
        variants: product.variants?.length > 0 
          ? product.variants.map(v => ({ ...v })) 
          : [{ name: "Standard", actualPrice: 0, discountedPrice: 0 }],
      });
    } else {
      setFormData({
        name: "",
        category: "",
        description: "",
        imageURL: "",
        active: true,
        inStock: true,
        variants: [{ name: "Standard", actualPrice: 0, discountedPrice: 0 }],
      });
    }
  }, [product, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = field.includes("Price") ? parseFloat(value) || 0 : value;
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", actualPrice: 0, discountedPrice: 0 }],
    }));
  };

  const removeVariant = (index) => {
    if (formData.variants.length <= 1) return;
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
    };

    try {
      if (product?._id) {
        await updateProductMutation.mutateAsync({ id: product._id, data: payload });
      } else {
        await createProductMutation.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  const isSubmitting = createProductMutation.isLoading || updateProductMutation.isLoading;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div className="flex justify-between items-center">
          <Typography variant="h6" component="span" fontWeight="bold">
            {product ? "Edit Product" : "Add New Product"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 0 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              variant="outlined"
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
              {categories.length === 0 && (
                <MenuItem disabled>No categories found</MenuItem>
              )}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="imageURL"
              value={formData.imageURL}
              onChange={handleChange}
              variant="outlined"
              placeholder="https://example.com/image.jpg"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ flex: 1, display: "flex", gap: 4 }}>
                <FormControlLabel
                control={<Switch checked={formData.active} onChange={handleToggle} name="active" color="success" />}
                label="Active"
                />
                <FormControlLabel
                control={<Switch checked={formData.inStock} onChange={handleToggle} name="inStock" color="info" />}
                label="In Stock"
                />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
              Pricing & Variants
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {formData.variants.map((variant, index) => (
              <Box key={index} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
                <TextField
                  size="small"
                  label="Variant Name"
                  placeholder="e.g. Regular, Large"
                  value={variant.name}
                  onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                  sx={{ flex: 2 }}
                />
                <TextField
                  size="small"
                  type="number"
                  label="Actual Price"
                  value={variant.actualPrice}
                  onChange={(e) => handleVariantChange(index, "actualPrice", e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  size="small"
                  type="number"
                  label="Discounted Price"
                  value={variant.discountedPrice}
                  onChange={(e) => handleVariantChange(index, "discountedPrice", e.target.value)}
                  sx={{ flex: 1 }}
                />
                <IconButton 
                    color="error" 
                    onClick={() => removeVariant(index)}
                    disabled={formData.variants.length === 1}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              size="small"
              onClick={addVariant}
              sx={{ mt: 1 }}
            >
              Add Variant
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name || isSubmitting}
        >
          {isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
