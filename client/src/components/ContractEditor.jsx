// client/src/components/ContractEditor.jsx
/**
 * Revize Özeti:
 * - API entegrasyonu eklendi
 * - Yükleme durumu ve hata yönetimi eklendi
 * - Veriler artık MongoDB'den çekiliyor
 */

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ContractEditor.module.css';
import { generateContractPDF } from '../utils/pdfGenerator';
import { getContracts } from '../utils/api';

export default function ContractEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [variables, setVariables] = useState({});
  const [editingVar, setEditingVar] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [editingMode, setEditingMode] = useState('variables');
  const [editableContent, setEditableContent] = useState('');
  const [currentEditParagraph, setCurrentEditParagraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const pressTimer = useRef(null);
  const editModeRef = useRef(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const templates = await getContracts();
        const foundTemplate = templates.find(t => t._id === id);
        
        if (foundTemplate) {
          setTemplate(foundTemplate);
          setVariables(foundTemplate.variables || {});
          setEditableContent(foundTemplate.content);
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Template yükleme hatası:', err);
        setError('Şablon yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id, navigate]);

  const handleVariableChange = (key, value) => {
    setVariables(prev => ({ ...prev, [key]: value }));
    if (validationErrors[key]) {
      setValidationErrors(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleExportPDF = async () => {
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
      const pdfBytes = await generateContractPDF(
        template.title, 
        editableContent, 
        variables
      );
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.title.replace(/\s+/g, '_')}.pdf`;
      link.click();
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      setError('PDF oluşturulamadı!');
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

  const startEditParagraph = (paragraphIndex) => {
    setEditingMode('content');
    setCurrentEditParagraph(paragraphIndex);
    setTempValue(editableContent.split('\n')[paragraphIndex]);
  };

  const saveParagraphEdit = () => {
    if (currentEditParagraph !== null) {
      const lines = editableContent.split('\n');
      lines[currentEditParagraph] = tempValue;
      setEditableContent(lines.join('\n'));
      setCurrentEditParagraph(null);
    }
  };

  const addNewParagraph = () => {
    const lines = editableContent.split('\n');
    lines.push('\n**YENİ MADDE**\nYeni madde içeriği buraya...');
    setEditableContent(lines.join('\n'));
  };

  const deleteParagraph = () => {
    if (currentEditParagraph !== null) {
      const lines = editableContent.split('\n');
      lines.splice(currentEditParagraph, 1);
      setEditableContent(lines.join('\n'));
      setCurrentEditParagraph(null);
    }
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
    if (editingMode === 'content' && currentEditParagraph !== null) {
      saveParagraphEdit();
    } else {
      saveEdit();
    }
  };

  if (!template) return <div className={styles.loading}>Yükleniyor...</div>;
  if (loading) return <div className={styles.loading}>Yükleniyor...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!template) return <div className={styles.error}>Şablon bulunamadı</div>;

  return (
    <div className={styles.container} onClick={handleOutsideClick}>
      <div className={styles.modeSwitch}>
        <button 
          onClick={() => setEditingMode('variables')}
          disabled={editingMode === 'variables'}
          className={editingMode === 'variables' ? styles.activeMode : ''}
        >
          Değişkenleri Düzenle
        </button>
        <button 
          onClick={() => setEditingMode('content')}
          disabled={editingMode === 'content'}
          className={editingMode === 'content' ? styles.activeMode : ''}
        >
          İçeriği Düzenle
        </button>
      </div>

      {editingMode === 'content' && (
        <div className={styles.contentActions}>
          <button onClick={addNewParagraph} className={styles.addButton}>
            + Madde Ekle
          </button>
          {currentEditParagraph !== null && (
            <button 
              onClick={deleteParagraph}
              className={styles.deleteButton}
            >
              Maddeyi Sil
            </button>
          )}
        </div>
      )}

      <div className={styles.contentPanel}>
        <h1>{template.title}</h1>
        <p className={styles.category}>{template.category}</p>
        
        <div className={styles.preview}>
          {editableContent.split('\n').map((paragraph, i) => {
            if (editingMode === 'content' && currentEditParagraph === i) {
              return (
                <div key={i} className={styles.paragraphEdit}>
                  <textarea
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={saveParagraphEdit}
                    onKeyDown={(e) => e.key === 'Enter' && saveParagraphEdit()}
                    autoFocus
                  />
                  <div className={styles.editButtons}>
                    <button onClick={saveParagraphEdit} className={styles.saveButton}>Kaydet</button>
                    <button onClick={() => setCurrentEditParagraph(null)} className={styles.cancelButton}>İptal</button>
                  </div>
                </div>
              );
            }
            
            return (
              <p 
                key={i} 
                className={`${styles.editableParagraph} ${editingMode === 'content' ? styles.contentEditMode : ''}`}
                onDoubleClick={() => editingMode === 'content' && startEditParagraph(i)}
              >
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
                        onDoubleClick={() => editingMode === 'variables' && startEdit(varKey, variables[varKey] || '')}
                        onTouchStart={() => editingMode === 'variables' && handleLongPressStart(varKey, variables[varKey] || '')}
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
            );
          })}
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