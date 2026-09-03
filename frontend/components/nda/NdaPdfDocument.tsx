"use client";

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { DocumentBlock, NdaDocument, TextRun } from "@/lib/nda/types";

const styles = StyleSheet.create({
  page: { paddingVertical: 48, paddingHorizontal: 56, fontSize: 10.5, fontFamily: "Helvetica", color: "#1a1a1a" },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 20 },
  heading: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginTop: 20,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: "1px solid #d4d4d4",
  },
  paragraph: { marginTop: 6, lineHeight: 1.5 },
  label: { fontFamily: "Helvetica-Bold" },
  bold: { fontFamily: "Helvetica-Bold" },
  table: { marginTop: 10, borderWidth: 1, borderColor: "#d4d4d4" },
  tableRow: { flexDirection: "row" },
  tableCellHeader: {
    flex: 1,
    padding: 6,
    fontFamily: "Helvetica-Bold",
    backgroundColor: "#f5f5f5",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#d4d4d4",
  },
  tableCell: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#d4d4d4",
  },
  footer: { marginTop: 24, paddingTop: 10, borderTop: "1px solid #d4d4d4", fontSize: 8, color: "#666666" },
});

function Runs({ runs }: { runs: TextRun[] }) {
  return (
    <Text>
      {runs.map((run, i) => (
        <Text key={i} style={run.bold ? styles.bold : undefined}>
          {run.text}
        </Text>
      ))}
    </Text>
  );
}

function Block({ block }: { block: DocumentBlock }) {
  if (block.kind === "table") {
    const [header, ...rows] = block.rows;
    return (
      <View style={styles.table}>
        <View style={styles.tableRow}>
          {header.map((cell, i) => (
            <Text key={i} style={styles.tableCellHeader}>
              {cell}
            </Text>
          ))}
        </View>
        {rows.map((row, ri) => (
          <View key={ri} style={styles.tableRow}>
            {row.map((cell, ci) => (
              <Text key={ci} style={styles.tableCell}>
                {cell || "—"}
              </Text>
            ))}
          </View>
        ))}
      </View>
    );
  }

  return (
    <Text style={styles.paragraph}>
      {block.label && <Text style={styles.label}>{block.label}: </Text>}
      <Runs runs={block.runs} />
    </Text>
  );
}

/** PDF counterpart of NdaDocumentView, rendered from the same NdaDocument model. */
export function NdaPdfDocument({ doc }: { doc: NdaDocument }) {
  return (
    <Document title={doc.title}>
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.title}>{doc.title}</Text>
        {doc.sections.map((section) => (
          <View key={section.heading}>
            <Text style={styles.heading}>{section.heading}</Text>
            {section.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </View>
        ))}
        <Text style={styles.footer}>{doc.footer}</Text>
      </Page>
    </Document>
  );
}
