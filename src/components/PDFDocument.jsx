import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Times-Roman', fontSize: 12 },
  title: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  content: { lineHeight: 1.5 }
});

const PdfDocument = ({ title, content }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content || '[İçerik yok]'}</Text>
    </Page>
  </Document>
);

export default PdfDocument;