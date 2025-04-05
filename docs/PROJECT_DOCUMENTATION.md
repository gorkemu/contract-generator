# Contract-Generator Proje Dokümantasyonu

## 📌 Proje Özeti
**Amaç**: Kullanıcıların Türkçe karakter desteğiyle sözleşme şablonlarını düzenleyip PDF olarak indirebileceği modern bir web uygulaması.

## 🏗️ Teknik Mimari
```mermaid
graph TD
    A[Frontend] -->|HTTP| B[API]
    B --> C[(Veritabanı)]
    D[PDF Generator] --> E[Font Engine]
    E --> F[NotoSans-TR]
Çekirdek Teknolojiler
Frontend:

Vite + React (ES6+)

State Management: Context API

Routing: react-router-dom v7

PDF İşlemleri:

pdf-lib + fontkit

Türkçe karakter render optimizasyonu

Stil Yönetimi:

CSS Modules

Responsive tasarım

Touch-friendly komponentler

✨ Son Güncellemeler
1. Akıllı Editör Sistemi
mermaid
Copy
stateDiagram-v2
    [*] --> Preview
    Preview --> EditVariable: Çift tık/uzun bas
    Preview --> EditContent: İçerik modu
    EditVariable --> Preview: Enter/Esc
    EditContent --> Preview: Kaydet/İptal
Yeni Özellikler:

Çift modlu düzenleme (Değişken/İçerik)

Gerçek zamanlı PDF önizleme

Dinamik madde yönetimi (+/- butonlar)

Mobil uyumlu dokunmatik kontrol

2. PDF Motoru Geliştirmeleri
Özellik	Eski	Yeni
Türkçe Karakter	❌ Bozuk	✅ Mükemmel
Font Yönetimi	Global	Component-based
Performans	2-3sn	<500ms
3. Arayüz İyileştirmeleri
Yeni Etkileşimler:

Değişken vurgulama (sarı/kırmızı)

Otomatik kaydırma (mobil klavye)

Dokunmatik geri bildirim (haptic)

Kaldırılanlar:

Sol panel (legacy)

Ayrı edit formu

Manuel sayfa sonları

🚀 Gelecek Geliştirmeler
Öncelikli Hedefler
Backend Entegrasyonu

javascript
Copy
// Örnek API Yapısı
{
  endpoints: {
    '/templates': ['GET', 'POST'],
    '/templates/:id': ['GET', 'PUT', 'DELETE'],
    '/pdf/generate': ['POST']
  },
  dbSchema: {
    templates: {
      title: String,
      content: String,
      variables: Map,
      version: Number
    }
  }
}
Editör Geliştirmeleri

Versiyon kontrolü (Git-benzeri)

İşbirliğine dayalı düzenleme

Advanced template locking

Yeni Özellikler

mermaid
Copy
graph LR
A[Şablon Market] --> B[Kullanıcı Şablonları]
A --> C[Resmi Şablonlar]
D[PDF Özellikleri] --> E[İmza Alanı]
D --> F[Dinamik Tablo]
📂 Şablon Yapısı ve Örnek
typescript
Copy
interface Template {
  id: string | number;
  title: string;
  category: string;
  content: string;
  variables: {
    [key: string]: {
      type: 'text' | 'number' | 'date';
      required?: boolean;
      default?: any;
    }
  };
  version: number;
}
Örnek Kullanım:

json
Copy
{
  "id": "kira-001",
  "title": "Kira Sözleşmesi",
  "content": "Kiracı: {{kiracı}}\nSüre: {{ay}} ay",
  "variables": {
    "kiracı": {
      "type": "text",
      "required": true
    },
    "ay": {
      "type": "number",
      "default": 12
    }
  }
}
🔍 Test Stratejisi
javascript
Copy
describe('Editor Fonksiyonları', () => {
  test('Değişken düzenleme modalı açılır', () => {
    // Test kodu...
  });
  
  test('PDF oluşturma Türkçe karakter destekler', () => {
    // Test kodu...
  });
});