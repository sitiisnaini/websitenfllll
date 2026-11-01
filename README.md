# Nusantara Future Leaders 2026 — Website

Website statis berbasis HTML, CSS, dan JavaScript. Tidak memerlukan framework, server backend, ataupun proses build. Folder ini dapat langsung diunggah ke GitHub Pages, Hostinger, atau hosting statis lain.

## Struktur file

```text
nfl-website/
├── index.html              # Struktur dan konten utama website
├── styles.css              # Seluruh tampilan, responsif, dan animasi
├── script.js               # Interaksi: menu, carousel, FAQ, reveal animation
├── site-data.js            # Pusat pengaturan konten dan tautan
└── assets/
    ├── logo-ugm.png
    ├── logo-sema.png
    ├── logo-hubla.png
    ├── logo-nfl.png
    ├── header-logos-original.png
    ├── batik-pattern.svg
    └── photo-placeholder.svg
```

## Bagian yang paling mudah diedit

Buka `site-data.js` untuk mengganti hal-hal berikut:

- `registerUrl`: tautan formulir. Tautan ini digunakan pada tombol Daftar di header, bagian ajakan pendaftaran, dan footer.
- `websiteUrl`, `instagramUrl`, `email`, `phoneDisplay`, `phoneWhatsApp`: informasi kontak.
- `gallery`: lima gambar dokumentasi, teks alternatif, dan caption carousel.
- `testimonials`: foto, nama, kutipan, dan keterangan peserta.
- `faqs`: daftar pertanyaan serta jawaban.

Foto carousel dan profil testimoni saat ini adalah placeholder/gambar contoh, bukan dokumentasi maupun testimoni resmi NFL. Ganti URL gambar pada `site-data.js` dengan foto yang telah disiapkan panitia. Jika URL foto tidak dapat dimuat, carousel memakai `assets/photo-placeholder.svg` sebagai cadangan.

Untuk mengubah narasi, tanggal, judul, atau susunan section yang tertulis langsung di halaman, edit `index.html`. Untuk mengubah warna, font, jarak, bentuk kartu, dan animasi, edit `styles.css`.

## Menjalankan di komputer

1. Ekstrak folder ZIP.
2. Buka `index.html` menggunakan browser.
3. Untuk pengalaman yang menyerupai hosting, jalankan local server dari folder ini, misalnya dengan ekstensi Live Server pada Visual Studio Code.

## Mengunggah ke GitHub Pages

1. Buat repository GitHub baru.
2. Unggah seluruh isi folder ini (pastikan `index.html` berada di root repository, bukan di dalam folder bertingkat).
3. Buka **Settings → Pages**.
4. Pada bagian **Build and deployment**, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu simpan.
5. Tunggu proses deployment GitHub selesai, kemudian buka alamat Pages yang ditampilkan.

## Mengunggah ke Hostinger

Unggah seluruh isi folder ini ke folder web root domain, umumnya `public_html`. Pastikan `index.html`, `styles.css`, `script.js`, `site-data.js`, dan folder `assets` berada pada tingkat folder yang sama.

## Catatan

- Website menggunakan Google Fonts dan gambar contoh eksternal jika URL-nya tersedia, sehingga tampilan terbaik memerlukan koneksi internet.
- Tidak ada framework atau dependency build yang wajib dipasang.
- Gunakan dokumentasi dan testimoni resmi yang sudah memperoleh izin sebelum website dipublikasikan.
