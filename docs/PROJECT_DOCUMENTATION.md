## Proje Adı: Contract-Generator
## Amaç
Kullanıcıların şablon sözleşmeleri düzenleyip Türkçe karakter desteğiyle PDF olarak indirebileceği stabil bir web uygulaması.

## 🔧 Teknik Detaylar
- Frontend: React (JavaScript) + Vite
- PDF Kütüphanesi: pdf-lib + fontkit (Türkçe karakter desteğiyle)
- Routing: react-router-dom v7
- Styling: CSS Modules
- Mobil Duyarlılık: Evet (Temel responsive desteği)

## ✅ Son Yapılan Değişiklikler

1. PDF Generator Yenilendi
- @react-pdf/renderer kaldırıldı
- Yeni implementasyon: pdf-lib + fontkit
- Türkçe karakter sorunu tamamen çözüldü (ğ, ş, ı, İ vb.)
- Font: Noto Sans (public/fonts altında)

2. Dosya Yapısı
src/
├── components/
│   └── ContractEditor.jsx (ana component)
├── utils/
│   └── pdfGenerator.js (yeni PDF motoru)
└── data/
    └── templates.json (mock data)

3. Performans İyileştirmeleri: 
- Doğrudan blob tabanlı PDF oluşturma
- Font embedding ile stabil çıktı

## 📝 İstenen Sonraki Adımlar
1. Dinamik Alan Desteği:

- [ŞİRKET_ADI] gibi placeholder'ları otomatik algılayan form
- Kullanıcıya bu alanları doldurması için inputlar gösterme

2. Backend Entegrasyonu:
```
mermaid
graph LR
A[Frontend] -->|Axios| B[Node.js/Express]
B --> C[MongoDB]
```
3. Yeni Özellikler:

- PDF imza alanı ekleme
- Şablon kategorizasyonu
- Kullanıcı özel şablon kaydetme

## 📂 Örnek Mock Data Yapısı
[
  {
    "id": 1,
    "title": "İş Sözleşmesi",
    "category": "İş Hukuku",
    "content": "Bu sözleşme [ŞİRKET_ADI] ile [ÇALIŞAN_ADI] arasında [TARİH] tarihinde imzalanmıştır..."
  }
]

