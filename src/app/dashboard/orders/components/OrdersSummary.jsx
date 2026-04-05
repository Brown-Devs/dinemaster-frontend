"use client";
import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Collapse, 
  Skeleton,
  useMediaQuery,
  useTheme,
  Chip
} from '@mui/material';
import { 
  ShoppingBasket, 
  PlusCircle, 
  ChefHat, 
  Truck, 
  CheckCircle2, 
  BadgeCheck, 
  AlertCircle,
  UtensilsCrossed,
  Package
} from 'lucide-react';
import { useOrders } from '@/hooks/admin/useOrders';
import { usePermissions } from '@/hooks/usePermissions';
import { PERMISSIONS } from '@/lib/constants';

export default function OrdersSummary({ isExpanded }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { statsQuery } = useOrders();
  const { checkPermission } = usePermissions();
  const { data, isLoading } = statsQuery({
    enabled: isExpanded
  });

  const stats = data?.data || {};

  const SimpleStatCard = ({ title, value, Icon, bgGradient, children }) => (
    <div className={`relative overflow-hidden rounded-2xl ${bgGradient} p-4 transition-all duration-300 hover:-translate-y-1 group min-h-[120px] min-w-[130px] flex flex-col justify-between`}>
      {/* Subtle Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:24px_24px]" />
      
      <div className="relative z-10 flex flex-col h-full text-white">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <p className="text-[11px] font-bold text-white/80 uppercase tracking-wider mb-1">{title}</p>
            {isLoading ? (
              <Skeleton variant="text" width={40} height={32} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            ) : (
              <h3 className="text-2xl font-extrabold tracking-tighter">
                {value}
              </h3>
            )}
          </div>
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm ml-3">
            {Icon && <Icon className="text-white" size={18} />}
          </div>
        </div>
        
        {children && (
          <div className="mt-2 flex flex-wrap gap-1.5 border-t border-white/10 pt-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );

  const MiniChip = ({ label, value, icon: Icon }) => (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-white/90 border border-white/5 backdrop-blur-sm">
      {Icon && <Icon size={10} />}
      <span>{label}</span>
      <span className="text-white font-extrabold">{value}</span>
    </div>
  );

  return (
    <Box sx={{ mb: 1 }}>
      <Collapse in={isExpanded} timeout={400}>
        <Box sx={{ mb: 2 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            <h3 className="text-xl font-extrabold tracking-tighter text-foreground">Today's Summary</h3>
          </div>

          <Grid container spacing={2}>
            {/* 1. Total Orders */}
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <SimpleStatCard 
                title="Total Orders" 
                value={stats.todayTotal || 0} 
                Icon={ShoppingBasket}
                bgGradient="bg-linear-to-r from-[#0ea5e9] to-[#2563eb]"
              >
                <MiniChip label="Dine-in" value={stats.typeCounts?.dinein || 0} icon={UtensilsCrossed} />
                <MiniChip label="Packing" value={stats.typeCounts?.packing || 0} icon={Package} />
                <MiniChip label="Delivery" value={stats.typeCounts?.delivery || 0} icon={Truck} />
              </SimpleStatCard>
            </Grid>

            {/* 2. New Orders */}
            <Grid item xs={6} sm={6} md={3} lg={1.5}>
              <SimpleStatCard 
                title="New" 
                value={stats.statusCounts?.new || 0} 
                Icon={PlusCircle}
                bgGradient="bg-linear-to-r from-[#8b5cf6] to-[#7c3aed]"
              />
            </Grid>

            {/* 3. Prepared Orders */}
            <Grid item xs={6} sm={6} md={3} lg={1.5}>
              <SimpleStatCard 
                title="Prepared" 
                value={stats.statusCounts?.prepared || 0} 
                Icon={ChefHat}
                bgGradient="bg-linear-to-r from-[#f59e0b] to-[#d97706]"
              />
            </Grid>

            {/* 4. Out for delivery */}
            <Grid item xs={6} sm={6} md={3} lg={1.5}>
              <SimpleStatCard 
                title="Out for Delivery" 
                value={stats.statusCounts?.out_for_delivery || 0} 
                Icon={Truck}
                bgGradient="bg-linear-to-r from-[#6366f1] to-[#4f46e5]"
              />
            </Grid>

            {/* 5. Delivered */}
            <Grid item xs={6} sm={6} md={3} lg={1.5}>
              <SimpleStatCard 
                title="Delivered" 
                value={stats.statusCounts?.delivered || 0} 
                Icon={CheckCircle2}
                bgGradient="bg-linear-to-r from-[#10b981] to-[#059669]"
              />
            </Grid>

            {/* 6. Paid Orders */}
            <Grid item xs={6} sm={6} md={3} lg={1.5}>
              <SimpleStatCard 
                title="Paid Orders" 
                value={stats.paymentCounts?.paid || 0} 
                Icon={BadgeCheck}
                bgGradient="bg-linear-to-r from-[#14b8a6] to-[#0d9488]"
              />
            </Grid>

            {/* 7. Unpaid Orders */}
            <Grid item xs={6} sm={6} md={3} lg={1.5}>
              <SimpleStatCard 
                title="Unpaid Orders" 
                value={stats.paymentCounts?.unpaid || 0} 
                Icon={AlertCircle}
                bgGradient="bg-linear-to-r from-[#f43f5e] to-[#e11d48]"
              />
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
}
