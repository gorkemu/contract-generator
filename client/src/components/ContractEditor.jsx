import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ContractEditor.module.css';
import { generateContractPDF } from '../utils/pdfGenerator';
import { getContracts, updateContract } from '../utils/api';

export default function ContractEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [template, setTemplate] = useState(null);
    const [elements, setElements] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [tempValue, setTempValue] = useState('');
    const [hoverDividers, setHoverDividers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const editorRef = useRef(null);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                setLoading(true);
                const templates = await getContracts();
                const foundTemplate = templates.find(t => t._id === id);

                if (foundTemplate) {
                    setTemplate(foundTemplate);
                    setElements(foundTemplate.elements || []);
                    setHoverDividers(new Array((foundTemplate.elements?.length || 0) + 1).fill(false));
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

    // Sürükle-bırak fonksiyonları
    const handleDragStart = (e, index) => {
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedItem === null || draggedItem === dropIndex) return;

        const newElements = [...elements];
        const [movedItem] = newElements.splice(draggedItem, 1);
        newElements.splice(dropIndex, 0, movedItem);
        
        // Order değerlerini güncelle
        newElements.forEach((el, idx) => {
            el.order = idx;
        });

        setElements(newElements);
        setDraggedItem(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverIndex(null);
    };

    // Element düzenleme fonksiyonları
    const startEditElement = (index) => {
        setEditingIndex(index);
        setTempValue(elements[index].content);
    };

    const saveElementEdit = (index) => {
        const updatedElements = [...elements];
        updatedElements[index].content = tempValue;
        setElements(updatedElements);
        setEditingIndex(null);
    };

    const addNewElement = (index, type) => {
        const newElement = {
            type,
            content: '',
            order: elements.length > 0 ? Math.max(...elements.map(el => el.order)) + 1 : 0
        };

        const updatedElements = [...elements];
        updatedElements.splice(index + 1, 0, newElement);
        setElements(updatedElements);
        setEditingIndex(index + 1);
        setTempValue('');
        setHoverDividers(prev => [...prev, false]);
    };

    const deleteElement = (index) => {
        const updatedElements = [...elements];
        updatedElements.splice(index, 1);
        setElements(updatedElements);
        
        if (editingIndex === index) {
            setEditingIndex(null);
        } else if (editingIndex > index) {
            setEditingIndex(editingIndex - 1);
        }
        
        setHoverDividers(prev => {
            const updated = [...prev];
            updated.pop();
            return updated;
        });
    };

    // PDF oluşturma
    const handleExportPDF = async () => {
        try {
          setError(null);
      
          // elements dizisini sadece şablon başlığını hariç tutarak PDF oluşturacağız.
          const elementsWithoutTemplateTitle = elements.filter(el => el.type !== 'template-title');  // template-title'ı çıkar
      
          const pdfBytes = await generateContractPDF(elementsWithoutTemplateTitle);
      
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${template.title.replace(/\s+/g, '_')}.pdf`;
          link.click();
          
          // URL'i temizle
          setTimeout(() => URL.revokeObjectURL(url), 100);
        } catch (error) {
          console.error('PDF oluşturma hatası:', error);
          setError(`PDF oluşturulamadı: ${error.message}`);
        }
      };
          

    // Kaydetme fonksiyonu
    const handleSaveContract = async () => {
        try {
            setIsSaving(true);
            await updateContract(id, {
                title: template.title,
                elements
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Kaydetme hatası:', error);
            setError('Kaydetme başarısız oldu');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className={styles.loading}>Yükleniyor...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!template) return <div className={styles.error}>Şablon bulunamadı</div>;

    return (
        <div className={styles.container} ref={editorRef}>
            <div className={styles.contentPanel}>
                <h1>{template.title}</h1>
                <p className={styles.category}>{template.category}</p>

                <div className={styles.preview}>
                    {elements.length === 0 && (
                        <div className={styles.emptyState}>
                            <p>Henüz içerik eklenmedi</p>
                            <button 
                                onClick={() => addNewElement(-1, 'paragraph')}
                                className={styles.addFirstElement}
                            >
                                + Paragraf Ekle
                            </button>
                        </div>
                    )}

                    {elements.map((element, index) => (
                        <React.Fragment key={index}>
                            <div 
                                className={`${styles.elementDivider} ${hoverDividers[index] ? styles.dividerHover : ''}`}
                                onMouseEnter={() => setHoverDividers(prev => {
                                    const newHover = [...prev];
                                    newHover[index] = true;
                                    return newHover;
                                })}
                                onMouseLeave={() => setHoverDividers(prev => {
                                    const newHover = [...prev];
                                    newHover[index] = false;
                                    return newHover;
                                })}
                            >
                                {hoverDividers[index] && (
                                    <div className={styles.dividerButtons}>
                                        <button onClick={() => addNewElement(index - 1, 'title')}>+ Başlık</button>
                                        <button onClick={() => addNewElement(index - 1, 'paragraph')}>+ Paragraf</button>
                                    </div>
                                )}
                            </div>

                            <div
                                className={`${styles.elementContainer} ${
                                    draggedItem === index ? styles.dragging : ''
                                } ${
                                    dragOverIndex === index ? styles.dragOver : ''
                                }`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                            >
                                {editingIndex === index ? (
                                    <div className={styles.elementEdit}>
                                        <textarea
                                            value={tempValue}
                                            onChange={(e) => setTempValue(e.target.value)}
                                            autoFocus
                                            className={element.type === 'title' ? styles.titleInput : styles.paragraphInput}
                                        />
                                        <div className={styles.editButtons}>
                                            <button onClick={() => saveElementEdit(index)}>Kaydet</button>
                                            <button onClick={() => setEditingIndex(null)}>İptal</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div 
                                        className={element.type === 'title' ? styles.elementTitle : styles.elementParagraph}
                                        onDoubleClick={() => startEditElement(index)}
                                    >
                                        {element.content}
                                        <button 
                                            onClick={() => deleteElement(index)}
                                            className={styles.deleteButton}
                                        >
                                            Sil
                                        </button>
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    ))}

                    {elements.length > 0 && (
                        <div 
                            className={`${styles.elementDivider} ${hoverDividers[elements.length] ? styles.dividerHover : ''}`}
                            onMouseEnter={() => setHoverDividers(prev => {
                                const newHover = [...prev];
                                newHover[elements.length] = true;
                                return newHover;
                            })}
                            onMouseLeave={() => setHoverDividers(prev => {
                                const newHover = [...prev];
                                newHover[elements.length] = false;
                                return newHover;
                            })}
                        >
                            {hoverDividers[elements.length] && (
                                <div className={styles.dividerButtons}>
                                    <button onClick={() => addNewElement(elements.length - 1, 'title')}>+ Başlık</button>
                                    <button onClick={() => addNewElement(elements.length - 1, 'paragraph')}>+ Paragraf</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.actionButtons}>
                    <button
                        onClick={handleSaveContract}
                        disabled={isSaving}
                        className={`${styles.actionButton} ${saveSuccess ? styles.success : ''}`}
                    >
                        {isSaving ? 'Kaydediliyor...' : saveSuccess ? '✔ Kaydedildi' : 'Kaydet'}
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className={styles.actionButton}
                    >
                        PDF Oluştur
                    </button>
                </div>
            </div>
        </div>
    );
}