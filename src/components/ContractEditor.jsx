import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ContractEditor.module.css';
import { generateContractPDF } from '../utils/pdfGenerator';

export default function ContractEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [content, setContent] = useState('');
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

  const handleExportPDF = async () => {
    try {
      const pdfBytes = await generateContractPDF(template.title, content);
      
      // Create download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      alert('PDF oluşturulurken hata oluştu!');
    }
  };

  if (!template) return <div className={styles.loading}>Yükleniyor...</div>;

  return (
    <div className={styles.container}>
      <h1>{template.title} - Düzenleme</h1>
      <p className={styles.category}>{template.category}</p>
      
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
        
        <button 
          onClick={handleExportPDF} 
          className={styles.exportButton}
        >
          PDF Olarak İndir
        </button>
      </div>
    </div>
  );
}