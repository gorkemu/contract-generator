# Contract-Generator Proje Geliştirme Promptu
## Sürüm Takibi
### Mevcut Versiyon: 1.3.0  
## Son Güncelleme: 2025-4-5   

### 📌 Mevcut Durum
**Açıklama**:  
Kullanıcıların Türkçe karakter desteğiyle sözleşme şablonlarını düzenleyip PDF olarak indirebildiği bir web uygulaması. Çift modlu editör ve temel PDF oluşturma özellikleri implemente edildi.

**Teknik Yapı**:
```mermaid
graph TD
    A[React Frontend] --> B[PDF Generation]
    B --> C[fontkit]
    A --> D[API Layer]
    D -.-> E[(Future MongoDB)]
```

### ✅ Son Tamamlananlar
1. **Çift Modlu Editör**
- Değişken/İçerik mod geçişi
- Madde ekleme/silme butonları
- Dokunmatik destek (long-press)

2. **PDF Optimizasyonları**
- Türkçe karakter render fix
- Dinamik içerik ön işleme
- Akıllı sayfa sonları

3. **UI Yenilikleri**
- Mod geçiş butonları
- İmleç odak yönetimi
- Validasyon görsel iyileştirmeleri    

### 🐛 Aktif Sorunlar

| No | Sorun | Öncelik | Çözüm Önerisi |
|----|-------|---------|---------------|
| 1  | Madde silme işlemi kalıcı olmuyor | High | MongoDB entegrasyonu |
| 2  | Editör fare tıklamalarında kapanıyor | High | Click-outside algılama fix |
| 3  | İptal butonu önceki state'i restore etmiyor | Medium | State snapshot mekanizması |

### 📝 İstenen Geliştirmeler

```mermaid
graph TB
    A[Backend Entegrasyonu] --> B[Node.js API]
    A --> C[MongoDB Schema]
    D[Editör İyileştirmeleri] --> E[Undo/Redo]
    D --> F[Click Handling Fix]
    G[Yeni Özellikler] --> H[Şablon Paylaşım]
```

### 🔄 Değişiklik Talepleri

**1. src/utils/db.js (Yeni):**
```javascript
const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  content: { type: String, required: true },
  variables: { type: Map, of: String },
  version: { type: Number, default: 1 }
});
```
**2. src/components/ContractEditor.jsx:**
```diff
- const handleOutsideClick = (e) => { ... }
+ const handleOutsideClick = useCallback((e) => {
+   if (!e.target.closest('.editor-area')) saveEdit();
+ }, []);
```

### 📜 Dokümantasyon Güncellemeleri
- `README.md`
- `prompts\_archive\contract_generator_prompt_template.md`
- `prompts\contract_generator_prompt_v1.3.0.md`

### 💡 Özel Notlar
- Öncelik sırası:
  1. MongoDB bağlantısı
  2. Editör davranış fixleri
  3. Undo/redo implementasyonu
- Test ederken Türkçe karakterler özellikle kontrol edilmeli (ğ, ş, ı, İ)