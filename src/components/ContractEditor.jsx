import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ContractEditor.module.css';
import { generateContractPDF } from '../utils/pdfGenerator';

export default function ContractEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [variables, setVariables] = useState({});

  useEffect(() => {
    import('../data/templates.json')
      .then(data => {
        const foundTemplate = data.default.find(t => t.id === parseInt(id));
        if (foundTemplate) {
          setTemplate(foundTemplate);
          setVariables(foundTemplate.variables || {});
        } else {
          navigate('/');
        }
      });
  }, [id, navigate]);

  const handleVariableChange = (key, value) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  const handleExportPDF = async () => {
    try {
      // Değişkenleri içeriğe yerleştir
      let filledContent = template.content;
      Object.keys(variables).forEach(key => {
        filledContent = filledContent.replace(
          new RegExp(`{{${key}}}`, 'g'),
          variables[key]
        );
      });

      const pdfBytes = await generateContractPDF(template.title, filledContent);
      
      // PDF indirme işlemi (mevcut kodun aynısı)
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.title.replace(/\s+/g, '_')}.pdf`;
      link.click();
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      alert('PDF oluşturulamadı!');
    }
  };

  if (!template) return <div className={styles.loading}>Yükleniyor...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.variablesPanel}>
        <h3>Sözleşme Alanları</h3>
        {Object.keys(template.variables || {}).map(key => (
          <div key={key} className={styles.variableInput}>
            <label>{key.replace(/_/g, ' ').toUpperCase()}</label>
            <input
              type="text"
              value={variables[key] || ''}
              onChange={(e) => handleVariableChange(key, e.target.value)}
              placeholder={`${key.replace(/_/g, ' ')} girin`}
            />
          </div>
        ))}
      </div>

      <div className={styles.contentPanel}>
        <h1>{template.title}</h1>
        <p className={styles.category}>{template.category}</p>
        
        <div className={styles.preview}>
          {template.content.split('\n').map((paragraph, i) => (
            <p key={i}>
              {paragraph.split(/({{.*?}})/g).map((part, j) => {
                const variableMatch = part.match(/{{(.*?)}}/);
                return variableMatch ? (
                  <span key={j} className={styles.variableHighlight}>
                    {variables[variableMatch[1]] || `[${variableMatch[1]}]`}
                  </span>
                ) : (
                  part
                );
              })}
            </p>
          ))}
        </div>

        <button onClick={handleExportPDF} className={styles.exportButton}>
          PDF Oluştur
        </button>
      </div>
    </div>
  );
}