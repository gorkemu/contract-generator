// src/components/PdfDocument.jsx
import { Document, Page, Text, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts with Turkish character support
Font.register({
  family: 'DejaVuSans',
  src: 'https://fonts.gstatic.com/s/dejavusans/v14/6sY1aZ4syj7T4K4OZTgQ1xUaPZ2.ttf',
});

Font.register({
  family: 'DejaVuSerif',
  src: 'https://fonts.gstatic.com/s/dejavuserif/v13/tDbK2oqRg1oM3QBjjcaDkOr4nAfcGw.ttf',
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'DejaVuSerif', fontSize: 12 },
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