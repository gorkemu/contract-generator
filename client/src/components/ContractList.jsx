import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ContractList.module.css';
import { getContracts } from '../utils/api';

export default function ContractList() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const data = await getContracts();
        setTemplates(data);
      } catch (err) {
        console.error('Template yükleme hatası:', err);
        setError('Şablonlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const getPreviewContent = (elements) => {
    if (!elements || elements.length === 0) return 'Henüz içerik eklenmemiş';
    
    const firstParagraph = elements.find(el => el.type === 'paragraph');
    if (firstParagraph) {
      return firstParagraph.content.substring(0, 100) + (firstParagraph.content.length > 100 ? '...' : '');
    }
    
    return elements[0].content.substring(0, 100) + '...';
  };

  if (loading) return <div className={styles.loading}>Yükleniyor...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (templates.length === 0) return <div className={styles.empty}>Henüz şablon eklenmemiş</div>;

  return (
    <div className={styles.container}>
      <h1>Sözleşme Şablonları</h1>
      <div className={styles.templateGrid}>
        {templates.map(template => (
          <div key={template._id} className={styles.templateCard}>
            <h3>{template.title}</h3>
            <p className={styles.category}>{template.category}</p>
            <p className={styles.preview}>
              {getPreviewContent(template.elements)}
            </p>
            <Link to={`/edit/${template._id}`} className={styles.editLink}>
              Düzenle
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}