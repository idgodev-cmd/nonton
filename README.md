# Cobanonton

Cobanonton adalah platform streaming drama pendek (vertical drama) modern yang menampilkan konten dari beberapa platform populer. Dibangun dengan teknologi web terkini untuk performa maksimal dan pengalaman pengguna yang premium.

## Fitur
- 🎬 Streaming dari 7 platform (DramaBox, ReelShort, ShortMax, NetShort, Melolo, FlickReels, FreeReels)
- 📱 Progressive Web App (PWA) — bisa diinstall di HP & desktop
- 🔍 Pencarian real-time per platform
- 🎥 Video player dengan HLS streaming
- 🌙 Dark mode premium

## Persyaratan Sistem
- [Node.js](https://nodejs.org/) (Versi 18 LTS atau 20 LTS)
- Git (Opsional)

## Panduan Instalasi

```bash
# Clone repository
git clone https://github.com/idgodev-cmd/nonton.git
cd nonton

# Install dependencies
npm install

# Konfigurasi environment
cp .env.example .env

# Jalankan development server
npm run dev
```

Buka browser dan kunjungi [http://localhost:3000](http://localhost:3000).

## Script Perintah
| Command | Fungsi |
|---------|--------|
| `npm run dev` | Menjalankan server development |
| `npm run build` | Membuat build production |
| `npm run start` | Menjalankan build production |
| `npm run lint` | Cek error coding style (Linting) |
