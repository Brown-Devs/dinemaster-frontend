"use client";
import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Collapse, 
  Skeleton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  UtensilsCrossed, 
  Package, 
  Truck, 
  AlertCircle,
  ShoppingBasket,
  IndianRupee 
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

  const GradientStatCard = ({ title, value, Icon, bgGradient, children }) => (
    <div className={`relative overflow-hidden rounded-2xl ${bgGradient} ${isMobile ? 'p-4' : 'p-5'} transition-all duration-300 hover:-translate-y-1 group min-h-[140px] flex flex-col justify-between shadow-lg shadow-black/5`}>
      {/* Subtle Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.4)_1px,transparent_0)] bg-[length:24px_24px]" />

      <div className="relative z-10 flex flex-col h-full text-white">
        <div className="flex justify-between items-start">
          {/* Main Info */}
          <div className="flex-1">
            <p className="text-[12px] font-bold text-white/90 tracking-tight mb-2 uppercase opacity-80">{title}</p>
            {isLoading ? (
              <Skeleton variant="text" width="80%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            ) : (
              <h3 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-extrabold tracking-tighter mb-1`}>
                {value}
              </h3>
            )}
          </div>

          {/* Icon on the Right */}
          <div className={`${isMobile ? 'p-2' : 'p-2.5'} bg-white/20 rounded-xl backdrop-blur-sm ml-4`}>
            {Icon && <Icon className="text-white" size={isMobile ? 18 : 22} />}
          </div>
        </div>

        {/* Sub-stats / Extra Content */}
        <div className={`mt-1 flex flex-col gap-1 border-t border-white/10 ${isMobile ? 'pt-1.5' : 'pt-2'}`}>
          <div className={`flex flex-wrap ${isMobile ? 'gap-x-3 gap-y-1' : 'gap-x-5 gap-y-1.5'} mt-0.5`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  const SubMetric = ({ label, value }) => (
    <div className="flex items-center gap-1">
      <span className={`${isMobile ? 'text-[11px]' : 'text-[13px]'} capitalize font-semibold text-white/60`}>{label}:</span>
      <span className={`${isMobile ? 'text-[11px]' : 'text-[13px]'} font-bold text-white`}>{value || 0}</span>
    </div>
  );

  return (
    <Box sx={{ mb: 1 }}>
      <Collapse in={isExpanded} timeout={400}>
        <Box sx={{ mb: 2 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            <h3 className="text-xl font-extrabold tracking-tighter text-foreground">Today's Order Summary</h3>
          </div>

          <Grid container spacing={isMobile ? 1.5 : 2.5}>
            {/* Total Orders */}
            <Grid item xs={12} md={4}>
              <GradientStatCard 
                title="Total Orders" 
                value={stats.todayTotal} 
                Icon={ShoppingBasket} 
                bgGradient="bg-linear-to-r from-[#8b5cf6] to-[#7c3aed]"
              >
                <SubMetric label="Dine-in" value={stats.typeBreakdown?.dinein?.new + stats.typeBreakdown?.dinein?.prepared + stats.typeBreakdown?.dinein?.delivered} />
                <SubMetric label="Packing" value={stats.typeBreakdown?.packing?.new + stats.typeBreakdown?.packing?.prepared + stats.typeBreakdown?.packing?.delivered} />
                <SubMetric label="Delivery" value={stats.typeBreakdown?.delivery?.new + stats.typeBreakdown?.delivery?.prepared + stats.typeBreakdown?.delivery?.out_for_delivery + stats.typeBreakdown?.delivery?.delivered} />
              </GradientStatCard>
            </Grid>

            {/* Dine In Breakdown */}
            <Grid item xs={12} md={4}>
              <GradientStatCard 
                title="Dine In Status" 
                value={Object.values(stats.typeBreakdown?.dinein || {}).reduce((a, b) => a + b, 0)} 
                Icon={UtensilsCrossed} 
                bgGradient="bg-linear-to-r from-[#10b981] to-[#059669]"
              >
                <SubMetric label="New" value={stats.typeBreakdown?.dinein?.new} />
                <SubMetric label="Prepared" value={stats.typeBreakdown?.dinein?.prepared} />
                <SubMetric label="Out for Delivery" value={stats.typeBreakdown?.dinein?.out_for_delivery} />
                <SubMetric label="Delivered" value={stats.typeBreakdown?.dinein?.delivered} />
              </GradientStatCard>
            </Grid>

            {/* Packing Breakdown */}
            <Grid item xs={12} md={4}>
              <GradientStatCard 
                title="Packing Status" 
                value={Object.values(stats.typeBreakdown?.packing || {}).reduce((a, b) => a + b, 0)} 
                Icon={Package} 
                bgGradient="bg-linear-to-r from-[#0ea5e9] to-[#2563eb]"
              >
                <SubMetric label="New" value={stats.typeBreakdown?.packing?.new} />
                <SubMetric label="Prepared" value={stats.typeBreakdown?.packing?.prepared} />
                <SubMetric label="Out for Delivery" value={stats.typeBreakdown?.packing?.out_for_delivery} />
                <SubMetric label="Delivered" value={stats.typeBreakdown?.packing?.delivered} />
              </GradientStatCard>
            </Grid>

            {/* Home Delivery */}
            <Grid item xs={12} md={4}>
              <GradientStatCard 
                title="Home Delivery" 
                value={Object.values(stats.typeBreakdown?.delivery || {}).reduce((a, b) => a + b, 0)} 
                Icon={Truck} 
                bgGradient="bg-linear-to-r from-[#f59e0b] to-[#d97706]"
              >
                <SubMetric label="New" value={stats.typeBreakdown?.delivery?.new} />
                <SubMetric label="Prepared" value={stats.typeBreakdown?.delivery?.prepared} />
                <SubMetric label="Out for Delivery" value={stats.typeBreakdown?.delivery?.out_for_delivery} />
                <SubMetric label="Delivered" value={stats.typeBreakdown?.delivery?.delivered} />
              </GradientStatCard>
            </Grid>

            {/* Paid Revenue */}
            <Grid item xs={12} md={4}>
              <GradientStatCard 
                title="Paid Revenue" 
                value={checkPermission(PERMISSIONS.BILLING_VIEW) 
                  ? `₹${stats.paymentBreakdown?.paid?.totalAmount?.toLocaleString() || 0}`
                  : "₹ ****"
                } 
                Icon={IndianRupee} 
                bgGradient="bg-linear-to-r from-[#2563eb] to-[#1e40af]"
              >
                <SubMetric label="Cash" value={checkPermission(PERMISSIONS.BILLING_VIEW) 
                  ? `₹${stats.paymentBreakdown?.paid?.cashAmount?.toLocaleString() || 0}`
                  : "₹ ****"
                } />
                <SubMetric label="Online" value={checkPermission(PERMISSIONS.BILLING_VIEW) 
                  ? `₹${stats.paymentBreakdown?.paid?.onlineAmount?.toLocaleString() || 0}`
                  : "₹ ****"
                } />
              </GradientStatCard>
            </Grid>

            {/* Unpaid Revenue */}
            <Grid item xs={12} md={4}>
              <GradientStatCard 
                title="Unpaid Revenue" 
                value={checkPermission(PERMISSIONS.BILLING_VIEW) 
                  ? `₹${stats.paymentBreakdown?.unpaid?.totalAmount?.toLocaleString() || 0}`
                  : "₹ ****"
                } 
                Icon={AlertCircle} 
                bgGradient="bg-linear-to-r from-[#f43f5e] to-[#e11d48]"
              >
                <SubMetric label="Cash" value={checkPermission(PERMISSIONS.BILLING_VIEW) 
                  ? `₹${stats.paymentBreakdown?.unpaid?.cashAmount?.toLocaleString() || 0}`
                  : "₹ ****"
                } />
                <SubMetric label="Online" value={checkPermission(PERMISSIONS.BILLING_VIEW) 
                  ? `₹${stats.paymentBreakdown?.unpaid?.onlineAmount?.toLocaleString() || 0}`
                  : "₹ ****"
                } />
              </GradientStatCard>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
}
