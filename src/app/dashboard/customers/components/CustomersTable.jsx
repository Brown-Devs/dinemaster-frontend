"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Skeleton,
  TablePagination,
  Chip,
  Avatar,
} from "@mui/material";
import { User, Phone, ShoppingBag, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function CustomersTable({
  customers = [],
  loading = false,
  total = 0,
  page,
  limit,
  onPageChange,
  setLimit,
  onDelete, // Optional, if you want to support deletion
}) {
  if (loading) {
    return (
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid var(--border)", background: "transparent", borderRadius: 3 }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "var(--cardsBG)" }}>
            <TableRow>
              <TableCell><Skeleton width={40} /></TableCell>
              <TableCell><Skeleton width={150} /></TableCell>
              <TableCell><Skeleton width={120} /></TableCell>
              <TableCell><Skeleton width={100} /></TableCell>
              <TableCell><Skeleton width={150} /></TableCell>
              <TableCell align="right"><Skeleton width={60} /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(limit || 5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton width={30} /></TableCell>
                <TableCell><Skeleton width="80%" /></TableCell>
                <TableCell><Skeleton width="70%" /></TableCell>
                <TableCell><Skeleton width={40} /></TableCell>
                <TableCell><Skeleton width={100} /></TableCell>
                <TableCell align="right"><Skeleton width={40} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 border border-border rounded-2xl bg-card">
        <User size={60} className="text-muted opacity-20 mb-4" />
        <p className="text-xl font-extrabold text-foreground tracking-tighter">No Customers Found</p>
        <p className="text-sm text-muted font-medium">Try adjusting your search criteria or wait for new registrations.</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card transition-all">
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "var(--card2)" }}>
            <TableRow>
              <TableCell sx={{ color: "var(--muted)", fontWeight: "bold", fontSize: '0.75rem', width: 60, textAlign: "center", textTransform: 'uppercase' }}>Sr</TableCell>
              <TableCell sx={{ color: "var(--muted)", fontWeight: "bold", fontSize: '0.75rem', textTransform: 'uppercase' }}>Customer Details</TableCell>
              <TableCell sx={{ color: "var(--muted)", fontWeight: "bold", fontSize: '0.75rem', textTransform: 'uppercase' }}>Contact</TableCell>
              <TableCell sx={{ color: "var(--muted)", fontWeight: "bold", fontSize: '0.75rem', textAlign: "center", textTransform: 'uppercase' }}>Orders</TableCell>
              <TableCell sx={{ color: "var(--muted)", fontWeight: "bold", fontSize: '0.75rem', textTransform: 'uppercase' }}>Joined On</TableCell>
              {/* <TableCell align="right" sx={{ color: "var(--muted)", fontWeight: "bold", fontSize: '0.75rem', width: 80, textTransform: 'uppercase' }}>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={customer._id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 }, transition: 'background 0.2s' }}>
                <TableCell sx={{ textAlign: "center" }}>
                  <span className="text-xs font-bold text-muted">
                    {(page - 1) * limit + index + 1}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar sx={{ bgcolor: 'var(--card2)', color: 'var(--fg)', border: '1px solid var(--border)', width: 36, height: 36, fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {customer.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-foreground tracking-tight">{customer.name}</span>
                      <span className="text-[10px] text-muted font-bold tracking-tighter">ID: {customer._id.slice(-6).toUpperCase()}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted">
                    <Phone size={14} className="opacity-50" />
                    {customer.mobileNo}
                  </div>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Chip
                    label={customer.orders?.length || 0}
                    size="small"
                    icon={<ShoppingBag size={12} />}
                    sx={{
                      height: 24,
                      fontSize: '11px',
                      fontWeight: 'bold',
                      bgcolor: 'var(--card2)',
                      border: '1px solid var(--border)',
                      '& .MuiChip-icon': { color: 'inherit' }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted">
                    <Calendar size={14} className="opacity-50" />
                    {customer.createdAt ? format(new Date(customer.createdAt), "dd MMM yyyy") : "N/A"}
                  </div>
                </TableCell>
                {/* <TableCell align="right">
                  <Tooltip title="Delete (Restricted)">
                    <IconButton size="small" disabled sx={{ opacity: 0.3 }}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Tooltip>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={(e, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={limit}
        onRowsPerPageChange={(e) => setLimit(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[10, 25, 50]}
        sx={{
          color: "var(--fg)",
          borderTop: "1px solid var(--border)",
          backgroundImage: 'linear-gradient(to right, transparent, var(--card2))',
          ".MuiTablePagination-selectIcon": { color: "var(--fg)" },
          ".MuiTablePagination-actions": { color: "var(--fg)" },
          "& .MuiTablePagination-toolbar": { minHeight: 48 }
        }}
      />
    </div>
  );
}
