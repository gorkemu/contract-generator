import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfDocument from './PdfDocument';
import styles from './ContractEditor.module.css';

export default function ContractEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [content, setContent] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    import('../data/templates.json')
      .then(data => {
        const foundTemplate = data.default.find(t => t.id === parseInt(id));
        if (foundTemplate) {
          setTemplate(foundTemplate);
          setContent(foundTemplate.content);
        } else {
          navigate('/');
        }
      })
      .catch(err => console.error('Template yükleme hatası:', err));
  }, [id, navigate]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    alert('Sözleşme kaydedildi! (Şimdilik mock)');
  };

  if (!template) return <div className={styles.loading}>Yükleniyor...</div>;

  return (
    <div className={styles.container}>
      <h1>{template.title} - Düzenleme</h1>
      <p className={styles.category}>{template.category}</p>
      
      {/* Basit ve Stabil Textarea */}
      <textarea
        ref={editorRef}
        className={styles.editor}
        value={content}
        onChange={handleContentChange}
        rows={20}
        placeholder="Metni serbestçe düzenleyin..."
      />
      
      <div className={styles.buttonGroup}>
        <button onClick={handleSave} className={styles.saveButton}>
          Kaydet
        </button>
        
        <div className={styles.exportButton}>
          <PDFDownloadLink
            document={<PdfDocument title={template.title} content={content} />}
            fileName={`${template.title.replace(/\s+/g, '_')}.pdf`}
            onClick={() => setIsGeneratingPDF(true)}
          >
            {({ loading }) => (
              loading || isGeneratingPDF ? 'PDF Hazırlanıyor...' : 'PDF Olarak İndir'
            )}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}