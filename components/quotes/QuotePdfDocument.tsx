import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica" },
  title: { fontSize: 18, marginBottom: 12 },
  row: { flexDirection: "row", marginBottom: 4 },
  colName: { width: "45%" },
  colQty: { width: "15%", textAlign: "right" },
  colPrice: { width: "20%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },
  header: { fontWeight: 700, borderBottomWidth: 1, borderBottomColor: "#ccc", paddingBottom: 4 },
  totals: { marginTop: 12 },
  footer: { marginTop: 24, fontSize: 8, color: "#666" },
});

export function QuotePdfDocument(props: {
  businessName: string;
  businessPhone?: string | null;
  businessEmail?: string | null;
  licenseNumber?: string | null;
  quoteNumber: number;
  customerName: string;
  customerPhone?: string | null;
  customerEmail?: string | null;
  lines: { name: string; quantity: number; unit_price: number; total: number }[];
  subtotal: number;
  tax_amount: number;
  total: number;
  notes?: string | null;
  createdAt: string;
}) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>{props.businessName}</Text>
        <Text>
          {props.businessPhone ? `Phone: ${props.businessPhone}` : ""}
        </Text>
        <Text>
          {props.businessEmail ? `Email: ${props.businessEmail}` : ""}
        </Text>
        <Text style={{ marginTop: 12, marginBottom: 4 }}>
          Quote #{props.quoteNumber}
        </Text>
        <Text>Date: {props.createdAt}</Text>
        <Text style={{ marginTop: 8 }}>
          Customer: {props.customerName}
        </Text>
        {props.customerPhone ? (
          <Text>Phone: {props.customerPhone}</Text>
        ) : null}
        {props.customerEmail ? (
          <Text>Email: {props.customerEmail}</Text>
        ) : null}

        <View style={{ marginTop: 16 }}>
          <View style={[styles.row, styles.header]}>
            <Text style={styles.colName}>Item</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colPrice}>Price</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>
          {props.lines.map((l) => (
            <View key={l.name + l.unit_price} style={styles.row}>
              <Text style={styles.colName}>{l.name}</Text>
              <Text style={styles.colQty}>{l.quantity}</Text>
              <Text style={styles.colPrice}>${l.unit_price.toFixed(2)}</Text>
              <Text style={styles.colTotal}>${l.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <Text>Subtotal: ${props.subtotal.toFixed(2)}</Text>
          <Text>Tax: ${props.tax_amount.toFixed(2)}</Text>
          <Text style={{ fontWeight: 700, marginTop: 4 }}>
            Total: ${props.total.toFixed(2)}
          </Text>
        </View>

        {props.notes ? (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: 700 }}>Notes</Text>
            <Text>{props.notes}</Text>
          </View>
        ) : null}

        <Text style={styles.footer}>
          {props.licenseNumber
            ? `License: ${props.licenseNumber} · `
            : ""}
          Quote valid for 30 days.
        </Text>
      </Page>
    </Document>
  );
}
