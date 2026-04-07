import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: {
    paddingTop: 3.7,
    paddingHorizontal: 0.5,
    paddingBottom: 20, // Reduced as we use an anchor divider at the end
    fontSize: 8.5,
    fontFamily: "Helvetica",
    color: "#000",
    lineHeight: 1.2,
  },

  // Header Branding
  branding: {
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },

  logo: {
    width: 65, // Increased from 12
    // height: 25, // Increased from 30
    objectFit: "object-fit",
    marginBottom: 2,
    filter: "grayscale(100%)",
  },

  companyName: {
    fontSize: 10, // Increased from 10
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    width: "100%",
  },

  // Bill Number Section
  billHeader: {
    marginVertical: 4,
    alignItems: "center",
  },

  billTitle: {
    lineHeight: 2,
    fontSize: 9,
    fontWeight: "bold",
  },

  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
    borderBottomStyle: "dashed",
    marginVertical: 3,
  },

  // Meta Details 
  metaContainer: {
    marginBottom: 2,
  },

  metaRow: {
    flexDirection: "row",
    marginBottom: 0.5,
  },

  metaLabel: {
    width: 45,
  },

  metaValue: {
    flex: 1,
  },

  // Table Section
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
    borderBottomStyle: "dashed",
    paddingBottom: 1.5,
    marginBottom: 2.5,
    fontWeight: "bold",
    fontSize: 8,
  },

  tableRow: {
    flexDirection: "row",
    marginBottom: 4,
  },

  colItem: { flex: 2.7 },
  colQty: { flex: 0.4, textAlign: "center" },
  colRate: { flex: 0.8, textAlign: "right" },
  colTotal: { flex: 0.8, textAlign: "right" },

  // Financial Summary
  summarySection: {
    marginTop: 2,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },

  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
    paddingTop: 3,
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderTopStyle: "dashed",
    marginBottom: 5,
  },

  grandTotalLabel: {
    fontSize: 11,
    fontWeight: "bold",
  },

  grandTotalValue: {
    fontSize: 11,
    fontWeight: "bold",
  },

  // Footer
  footer: {
    textAlign: "center",
    marginTop: 5,
  },

  footerText: {
    fontSize: 8,
    marginBottom: 0.5,
  },

  dineMasterBranding: {
    marginTop: 5,
    alignItems: "center",
  },

  dmLogo: {
    width: 65, // Increased from 12
    height: 15, // Increased from 12
    objectFit: "object-fit",
    marginBottom: 1,
    filter: "grayscale(100%)",
  },

  dmText: {
    marginBottom: 10,
    fontSize: 7, // Increased from 6
    fontWeight: "bold", // Increased weight
  },

  // FINAL ANCHOR to prevent tear-off clipping
  anchorSpace: {
    height: 20,
  },

  paymentQrContainer: {
    marginTop: 10,
    alignItems: "center",
    width: "100%",
  },

  paymentQr: {
    width: 100,
    height: 100,
    objectFit: "contain",
    marginBottom: 5,
  },

  invoiceTerms: {
    marginTop: 5,
    fontSize: 7,
    fontStyle: "italic",
    textAlign: "center",
    color: "#000",
  }
});

export const OrderReceiptPDF = ({ order, companyLogo, brandingLogo, paymentQr }) => {
  if (!order) return null;

  const {
    orderId,
    createdAt,
    customer,
    items = [],
    subTotal,
    additionalDiscount,
    totalAmount,
    orderType,
    table,
    address: orderAddress,
    company: populatedCompany,
  } = order;

  const companyName = populatedCompany?.name || "RESTAURANT";
  const customerName = typeof customer === "object" ? customer?.name : null;
  const customerMobile = typeof customer === "object" ? (customer?.mobileNo || customer?.mobile) : null;
  const displayAddress = orderAddress || (typeof customer === "object" ? (customer?.address || customer?.location) : null);
  const tableNo = order.table || (typeof table === "object" ? table?.name : table) || null;

  const formatOrderType = (type) => {
    switch (type) {
      case 'dinein': return "DINE IN";
      case 'delivery': return "DELIVERY";
      case 'packing': return "PACKING";
      default: return type?.toUpperCase();
    }
  };

  return (
    <Document>
      <Page size={[136, 841.9]} style={styles.page}>

        {/* TOP BRANDING: Back to Company Logo */}
        <View style={styles.branding}>
          {(companyLogo) && <Image src={companyLogo} style={styles.logo} />}
          <Text style={styles.companyName}>{companyName}</Text>
        </View>

        {/* BILL NUMBER */}
        <View style={styles.billHeader}>
          <Text style={styles.billTitle}>Order NO - {orderId}</Text>
        </View>

        <View style={styles.divider} />

        {/* META DETAILS */}
        <View style={styles.metaContainer}>
          {customerName && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Customer:</Text>
              <Text style={styles.metaValue}>{customerName}</Text>
            </View>
          )}
          {customerMobile && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Phone:</Text>
              <Text style={styles.metaValue}>{customerMobile}</Text>
            </View>
          )}
          {tableNo && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Table:</Text>
              <Text style={styles.metaValue}>{tableNo}</Text>
            </View>
          )}
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Date:</Text>
            <Text style={styles.metaValue}>{format(new Date(createdAt), "dd/MM/yy hh:mm")}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Type:</Text>
            <Text style={styles.metaValue}>{formatOrderType(orderType)}</Text>
          </View>
          {/* {displayAddress && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Address:</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.metaValue}>{displayAddress}</Text>
              </View>
            </View>
          )} */}
        </View>

        <View style={styles.divider} />

        {/* ITEMS TABLE: NO DECIMALS FOR QUANTITY/RATE */}
        <View style={styles.tableHeader}>
          <Text style={styles.colItem}>Item</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colRate}>Rate</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>

        {items.map((item, index) => {
          const rate = item.variant?.price + (item.addOns?.reduce((s, a) => s + a.price, 0) || 0);
          const total = rate * item.quantity;

          return (
            <View key={index} style={styles.tableRow} wrap={false}>
              <View style={styles.colItem}>
                <Text>{item.name}</Text>
                {item.variant?.name && (
                  <Text style={{ fontSize: 7, fontWeight: "bold" }}>
                    - {item.variant.name}
                  </Text>
                )}
                {item.addOns?.map((addon, aIndex) => (
                  <Text key={aIndex} style={{ fontSize: 7, marginLeft: 4, fontWeight: "bold" }}>
                    + {addon.name}
                  </Text>
                ))}
              </View>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colRate}>{rate.toFixed(0)}</Text>
              <Text style={styles.colTotal}>{total.toFixed(0)}</Text>
            </View>
          );
        })}

        <View style={styles.divider} />

        {/* FINANCIAL SUMMARY: NO DECIMALS FOR SUBTOTAL/DISCOUNT */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text>Total Amount:</Text>
            <Text>{subTotal?.toFixed(0)}</Text>
          </View>

          {additionalDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text>Discount:</Text>
              <Text>-{additionalDiscount?.toFixed(0)}</Text>
            </View>
          )}
        </View>

        {/* GRAND TOTAL: KEEP DECIMALS */}
        <View style={styles.grandTotalRow}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotalValue}>Rs.{totalAmount?.toFixed(2)}</Text>
        </View>

        {/* POST-TOTAL DETAILS (Phase 1) */}
        <View style={{ marginBottom: 5 }}>
          {displayAddress && (
            <View style={{ marginBottom: 2 }}>
              <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Delivery Address:</Text>
              <Text style={{ fontSize: 7, marginLeft: 2 }}>{displayAddress}</Text>
            </View>
          )}

          {order.notes && (
            <View style={{ marginBottom: 2 }}>
              <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Notes:</Text>
              <Text style={{ fontSize: 7, marginLeft: 2 }}>{order.notes}</Text>
            </View>
          )}

          <View style={{ marginTop: 2, borderTopWidth: 0.5, borderTopColor: '#000', borderTopStyle: 'dashed', paddingTop: 2 }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', textAlign: 'center' }}>
              {order.payments?.cashAmount > 0 ? "CASH" : "ONLINE"} PAID
            </Text>
          </View>
        </View>

        {/* <View style={styles.anchorSpace} /> */}

        {/* PAYMENT QR (Phase 2) */}
        {paymentQr && (
          <View style={styles.paymentQrContainer} wrap={false}>
            <Image src={paymentQr} style={styles.paymentQr} />
            <Text style={{ fontSize: 7, fontWeight: "bold" }}>SCAN TO PAY</Text>
          </View>
        )}

        {/* INVOICE TERMS (Phase 2) */}
        {populatedCompany?.invoiceTerms && (
          <Text style={styles.invoiceTerms}>{populatedCompany.invoiceTerms}</Text>
        )}

        <View style={styles.anchorSpace} />

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for your visit</Text>
          <Text style={styles.footerText}>Have a nice day</Text>
        </View>


        {/* DINE MASTER BRANDING: LARGER LOGO AND TEXT */}
        <View style={styles.dineMasterBranding}>
          {brandingLogo && <Image src={brandingLogo} style={styles.dmLogo} />}
          <Text style={styles.dmText}>Dine Smart with Dine Master</Text>
        </View>

        {/* FINAL ANCHOR: Ensuring printer keeps rolling past the text */}
        <View style={styles.anchorSpace} />
        <View style={styles.divider} />

      </Page>
    </Document>
  );
};
