import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ContractEditor.module.css';
import { generateContractPDF } from '../utils/pdfGenerator';

export default function ContractEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [variables, setVariables] = useState({});
  const [editingVar, setEditingVar] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const inputRef = useRef(null);
  const pressTimer = useRef(null);
  const editModeRef = useRef(false);

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
    if (validationErrors[key]) {
      setValidationErrors(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleExportPDF = async () => {
    // Check for required fields
    const errors = {};
    Object.keys(template.variables || {}).forEach(key => {
      if (!variables[key]?.trim()) {
        errors[key] = true;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      let filledContent = template.content;
      Object.keys(variables).forEach(key => {
        filledContent = filledContent.replace(
          new RegExp(`{{${key}}}`, 'g'),
          variables[key]
        );
      });

      const pdfBytes = await generateContractPDF(template.title, filledContent);
      
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

  const startEdit = (key, value) => {
    if (editModeRef.current) return;
    editModeRef.current = true;
    setEditingVar(key);
    setTempValue(value);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleLongPressStart = (key, value) => {
    if ('vibrate' in navigator) navigator.vibrate(50);
    pressTimer.current = setTimeout(() => startEdit(key, value), 1000);
  };

  const handleLongPressEnd = () => {
    clearTimeout(pressTimer.current);
  };

  const saveEdit = () => {
    if (editingVar) {
      handleVariableChange(editingVar, tempValue);
    }
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingVar(null);
    setTempValue('');
    editModeRef.current = false;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.closest(`.${styles.variableInputEdit}`)) return;
    saveEdit();
  };

  if (!template) return <div className={styles.loading}>Yükleniyor...</div>;

  return (
    <div className={styles.container} onClick={handleOutsideClick}>
      <div className={styles.contentPanel}>
        <h1>{template.title}</h1>
        <p className={styles.category}>{template.category}</p>
        
        <div className={styles.preview}>
          {template.content.split('\n').map((paragraph, i) => (
            <p key={i}>
              {paragraph.split(/({{.*?}})/g).map((part, j) => {
                const variableMatch = part.match(/{{(.*?)}}/);
                if (variableMatch) {
                  const varKey = variableMatch[1];
                  const isEditing = editingVar === varKey;
                  const isEmpty = !variables[varKey]?.trim();
                  
                  return isEditing ? (
                    <span key={j} className={styles.variableInputEdit}>
                      <input
                        ref={inputRef}
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={validationErrors[varKey] ? styles.errorInput : ''}
                        placeholder={`${varKey.replace(/_/g, ' ')} girin`}
                      />
                      {validationErrors[varKey] && (
                        <span className={styles.errorTooltip}>Bu alan zorunludur</span>
                      )}
                    </span>
                  ) : (
                    <span
                      key={j}
                      className={`${styles.variableHighlight} ${isEmpty ? styles.emptyVariable : ''}`}
                      onDoubleClick={() => startEdit(varKey, variables[varKey] || '')}
                      onTouchStart={() => handleLongPressStart(varKey, variables[varKey] || '')}
                      onTouchEnd={handleLongPressEnd}
                      onTouchMove={handleLongPressEnd}
                    >
                      {variables[varKey] || `[${varKey}]`}
                    </span>
                  );
                }
                return part;
              })}
            </p>
          ))}
        </div>

        <button 
          onClick={handleExportPDF} 
          className={styles.exportButton}
          data-has-errors={Object.keys(validationErrors).length > 0}
        >
          {Object.keys(validationErrors).length > 0 ? '⚠️ PDF Oluştur' : 'PDF Oluştur'}
        </button>
      </div>
    </div>
  );
}