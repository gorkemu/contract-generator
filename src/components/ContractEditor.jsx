import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ContractEditor.module.css';

export default function ContractEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    // Mock data yükleme
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
    // Burada ileride API çağrısı yapılacak
    alert('Sözleşme kaydedildi! (Şimdilik mock)');
  };

  const handleExportPDF = () => {
    // PDF oluşturma işlevi buraya eklenecek
    alert('PDF oluşturuldu! (Şimdilik mock)');
  };

  if (!template) return <div>Yükleniyor...</div>;

  return (
    <div className={styles.container}>
      <h1>{template.title} - Düzenleme</h1>
      <p className={styles.category}>{template.category}</p>
      
      <textarea
        className={styles.editor}
        value={content}
        onChange={handleContentChange}
        rows={20}
      />
      
      <div className={styles.buttonGroup}>
        <button onClick={handleSave} className={styles.saveButton}>
          Kaydet
        </button>
        <button onClick={handleExportPDF} className={styles.exportButton}>
          PDF Olarak İndir
        </button>
      </div>
    </div>
  );
}