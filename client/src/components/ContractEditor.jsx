import React, { useEffect, useState, useRef } from 'react';
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
    const [editableContent, setEditableContent] = useState([]);
    const [currentEditIndex, setCurrentEditIndex] = useState(null);
    const [newParagraphIndex, setNewParagraphIndex] = useState(null);
    const [activeParagraphIndex, setActiveParagraphIndex] = useState(null);
    const [hoverDividers, setHoverDividers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);
    const editModeRef = useRef(false);
    const editorRef = useRef(null);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                setLoading(true);
                const templates = await getContracts();
                const foundTemplate = templates.find(t => t._id === id);

                if (foundTemplate) {
                    setTemplate(foundTemplate);
                    setVariables(foundTemplate.variables || {});
                    setEditableContent(foundTemplate.content.split('\n'));
                    setHoverDividers(new Array(foundTemplate.content.split('\n').length + 1).fill(false));
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
                editableContent.join('\n'),
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

    const startEditVariable = (key, value) => {
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

    const startEditParagraph = (index) => {
        setEditingMode('content');
        setCurrentEditIndex(index);
        setTempValue(editableContent[index]);
    };

    const saveParagraphEdit = (index) => {
        const updatedContent = [...editableContent];
        updatedContent[index] = tempValue;
        setEditableContent(updatedContent);
        setCurrentEditIndex(null);
        setNewParagraphIndex(null);
    };

    const addNewParagraph = (index) => {
        setNewParagraphIndex(index);
        setTempValue('');
    };

    const insertNewParagraph = (index) => {
        const updatedContent = [...editableContent];
        updatedContent.splice(index + 1, 0, tempValue);
        setEditableContent(updatedContent);
        setNewParagraphIndex(null);
        setHoverDividers(prev => [...prev, false]);
    };

    const deleteParagraph = (index) => {
        const updatedContent = [...editableContent];
        updatedContent.splice(index, 1);
        setEditableContent(updatedContent);
        if (currentEditIndex === index) {
            setCurrentEditIndex(null);
        } else if (currentEditIndex > index) {
            setCurrentEditIndex(currentEditIndex - 1);
        }
        if (activeParagraphIndex === index) {
            setActiveParagraphIndex(null);
        } else if (activeParagraphIndex > index) {
            setActiveParagraphIndex(activeParagraphIndex - 1);
        }
        setHoverDividers(prev => {
            const updated = [...prev];
            updated.pop();
            return updated;
        });
    };

    const handleLongPressStart = (key, value) => {
        if ('vibrate' in navigator) navigator.vibrate(50);
        setTimeout(() => startEditVariable(key, value), 1000);
    };

    const saveVariableEdit = () => {
        if (editingVar) {
            handleVariableChange(editingVar, tempValue);
        }
        cancelEdit();
    };

    const cancelEdit = () => {
        setEditingVar(null);
        setTempValue('');
        editModeRef.current = false;
        setCurrentEditIndex(null);
        setNewParagraphIndex(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            saveVariableEdit();
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    };

    const handleOutsideClick = (e) => {
        if (editingVar && !e.target.closest(`.${styles.variableInputEdit}`)) {
            saveVariableEdit();
        }
        if (newParagraphIndex !== null && !e.target.closest(`.${styles.paragraphEdit}`)) {
            setNewParagraphIndex(null);
        }
        if (currentEditIndex !== null && !e.target.closest(`.${styles.paragraphEdit}`)) {
            setCurrentEditIndex(null);
        }
        if (activeParagraphIndex !== null && !e.target.closest(`.${styles.paragraphContainer}`)) {
            setActiveParagraphIndex(null);
        }
    };

    const handleDividerMouseEnter = (index) => {
        if (editingMode === 'content') {
            const newHoverState = [...hoverDividers];
            newHoverState[index] = true;
            setHoverDividers(newHoverState);
        }
    };

    const handleDividerMouseLeave = (index) => {
        const newHoverState = [...hoverDividers];
        newHoverState[index] = false;
        setHoverDividers(newHoverState);
    };

    if (loading) return <div className={styles.loading}>Yükleniyor...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!template) return <div className={styles.error}>Şablon bulunamadı</div>;

    return (
        <div className={styles.container} onClick={handleOutsideClick} ref={editorRef}>
            <div className={styles.contentPanel}>
                <h1>{template.title}</h1>
                <p className={styles.category}>{template.category}</p>

                <div className={styles.editorControls}>
                    <div className={styles.modeSwitch}>
                        <button
                            onClick={() => setEditingMode('variables')}
                            className={editingMode === 'variables' ? styles.activeMode : ''}
                        >
                            Değişkenler
                        </button>
                        <button
                            onClick={() => setEditingMode('content')}
                            className={editingMode === 'content' ? styles.activeMode : ''}
                        >
                            İçerik
                        </button>
                    </div>
                </div>

                <div className={styles.preview}>
                    {editingMode === 'content' && editableContent.length > 0 && (
                        <div 
                            className={`${styles.paragraphDivider} ${hoverDividers[0] ? styles.dividerHover : ''}`}
                            onMouseEnter={() => handleDividerMouseEnter(0)}
                            onMouseLeave={() => handleDividerMouseLeave(0)}
                        >
                            {hoverDividers[0] && (
                                <button 
                                    onClick={() => addNewParagraph(-1)} 
                                    className={styles.dividerAddButton}
                                >
                                    +
                                </button>
                            )}
                        </div>
                    )}

                    {editableContent.map((paragraph, i) => (
                        <React.Fragment key={i}>
                            <div
                                className={`${styles.paragraphContainer} ${
                                    activeParagraphIndex === i ? styles.activeParagraph : ''
                                } ${
                                    editingMode === 'content' ? `${styles['editingMode-content']} ${styles['delete-indicator']}` : ''
                                }`}
                                onClick={() => editingMode === 'content' && setActiveParagraphIndex(i)}
                            >
                                {editingMode === 'content' && currentEditIndex === i ? (
                                    <div className={styles.paragraphEdit}>
                                        <textarea
                                            value={tempValue}
                                            onChange={(e) => setTempValue(e.target.value)}
                                            autoFocus
                                        />
                                        <div className={styles.editButtons}>
                                            <button onClick={() => saveParagraphEdit(i)} className={styles.saveButton}>Kaydet</button>
                                            <button onClick={() => setCurrentEditIndex(null)} className={styles.cancelButton}>İptal</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p
                                        className={`${styles.editableParagraph} ${editingMode === 'content' ? styles.contentEditMode : ''}`}
                                        onDoubleClick={() => editingMode === 'content' && startEditParagraph(i)}
                                        onClick={(e) => {
                                            if (e.target === e.currentTarget || e.target === e.currentTarget.querySelector(':after')) {
                                                editingMode === 'content' && startEditParagraph(i);
                                            }
                                        }}
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
                                                        onClick={(e) => {
                                                            if (e.target.classList.contains(styles.variableHighlight)) {
                                                                editingMode === 'variables' && startEditVariable(varKey, variables[varKey] || '');
                                                            }
                                                        }}
                                                        onTouchStart={() => editingMode === 'variables' && handleLongPressStart(varKey, variables[varKey] || '')}
                                                    >
                                                        {variables[varKey] || `[${varKey}]`}
                                                    </span>
                                                );
                                            }
                                            return part;
                                        })}
                                    </p>
                                )}
                                
                                {editingMode === 'content' && (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const container = e.currentTarget.closest(`.${styles.paragraphContainer}`);
                                            container.classList.add(styles.deleting);
                                            setTimeout(() => deleteParagraph(i), 300);
                                        }} 
                                        className={styles.deleteButton}
                                        aria-label="Delete paragraph"
                                    >
                                        -
                                    </button>
                                )}
                            </div>

                            {editingMode === 'content' && i < editableContent.length - 1 && (
                                <div 
                                    className={`${styles.paragraphDivider} ${hoverDividers[i+1] ? styles.dividerHover : ''}`}
                                    onMouseEnter={() => handleDividerMouseEnter(i+1)}
                                    onMouseLeave={() => handleDividerMouseLeave(i+1)}
                                >
                                    {hoverDividers[i+1] && (
                                        <button 
                                            onClick={() => addNewParagraph(i)} 
                                            className={styles.dividerAddButton}
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            )}

                            {editingMode === 'content' && newParagraphIndex === i && (
                                <div className={styles.paragraphEdit}>
                                    <textarea
                                        value={tempValue}
                                        onChange={(e) => setTempValue(e.target.value)}
                                        autoFocus
                                        placeholder="Yeni madde içeriği..."
                                    />
                                    <div className={styles.editButtons}>
                                        <button onClick={() => insertNewParagraph(i)} className={styles.saveButton}>Kaydet</button>
                                        <button onClick={() => setNewParagraphIndex(null)} className={styles.cancelButton}>İptal</button>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}

                    {editingMode === 'content' && editableContent.length > 0 && (
                        <div 
                            className={`${styles.paragraphDivider} ${hoverDividers[editableContent.length] ? styles.dividerHover : ''}`}
                            onMouseEnter={() => handleDividerMouseEnter(editableContent.length)}
                            onMouseLeave={() => handleDividerMouseLeave(editableContent.length)}
                        >
                            {hoverDividers[editableContent.length] && (
                                <button 
                                    onClick={() => addNewParagraph(editableContent.length - 1)} 
                                    className={styles.dividerAddButton}
                                >
                                    +
                                </button>
                            )}
                        </div>
                    )}

                    {editingMode === 'content' && newParagraphIndex === editableContent.length && (
                        <div className={styles.paragraphEdit}>
                            <textarea
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                autoFocus
                                placeholder="Yeni madde içeriği..."
                            />
                            <div className={styles.editButtons}>
                                <button onClick={() => insertNewParagraph(editableContent.length)} className={styles.saveButton}>Kaydet</button>
                                <button onClick={() => setNewParagraphIndex(null)} className={styles.cancelButton}>İptal</button>
                            </div>
                        </div>
                    )}
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