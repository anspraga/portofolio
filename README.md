# 🚀 Modern AI-Powered Portfolio (Frontend)

Halo! Ini adalah bagian frontend dari portofolio pribadi saya. Dibangun dengan fokus pada kecepatan, desain minimalis, dan integrasi kecerdasan buatan.

**🌐 Lihat Live Website:** [portofolio-gozali.vercel.app](https://portofolio-gozali.vercel.app/)

---

## 🛠️ Tech Stack

*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + PostCSS
*   **Animations:** Framer Motion (`motion/react`)
*   **AI Engine:** Google Generative AI & Groq SDK (Llama 3.3 70B)
*   **Icons:** Lucide React & Simple Icons
*   **Maps:** React Leaflet
*   **Theming:** Next Themes (Dark/Light Mode)

## ✨ Fitur Unggulan

*   **🤖 G-Assistant:** Chatbot AI terintegrasi yang bisa menjawab pertanyaan seputar keahlian dan proyek secara real-time.
*   **🌍 Multi-language:** Dukungan penuh Bahasa Indonesia dan English menggunakan React Context.
*   **🌓 Dark Mode:** Transisi tema yang mulus dengan `next-themes`.
*   **📊 Real-time Status:** Status bar dinamis yang menunjukkan lokasi dan waktu (WIB).
*   **📱 Responsive Design:** Optimal di semua ukuran layar, dari mobile hingga desktop ultra-wide.

## 🚀 Menjalankan Secara Lokal

1.  **Clone repositori:**
    ```bash
    git clone https://github.com/anspraga/portfolio.git
    cd portofolio
    ```

2.  **Instalasi dependensi:**
    ```bash
    npm install
    ```

3.  **Pengaturan Environment Variables:**
    Buat file `.env.local` dan tambahkan API Key yang diperlukan (Groq, Google AI, dll).

4.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 🛠️ Scripts Terseedia

*   `npm run dev`: Menjalankan Next.js dalam mode development.
*   `npm run build`: Membuat build produksi yang dioptimalkan.
*   `npm run start`: Menjalankan server Next.js hasil build.
*   `npm run lint`: Menjalankan pengecekan ESLint.
*   `npm run clean`: Membersihkan cache build Next.js.
