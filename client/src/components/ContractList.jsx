import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ContractList.module.css';

export default function ContractList() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    // Mock data yükleme
    import('../data/templates.json')
      .then(data => setTemplates(data.default))
      .catch(err => console.error('Template yükleme hatası:', err));
  }, []);

  return (
    <div className={styles.container}>
      <h1>Sözleşme Şablonları</h1>
      <div className={styles.templateGrid}>
        {templates.map(template => (
          <div key={template.id} className={styles.templateCard}>
            <h3>{template.title}</h3>
            <p className={styles.category}>{template.category}</p>
            <p className={styles.preview}>
              {template.content.substring(0, 100)}...
            </p>
            <Link to={`/edit/${template.id}`} className={styles.editLink}>
              Düzenle
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}