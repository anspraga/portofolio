// 📁 FILE INI DI: lib/data/projects.ts

export const projects = [
  {
    id: 1,
    title: {
      id: 'SkyCast — Website Cuaca Cerdas',
      en: 'SkyCast — Smart Weather Website',
    },
    description: {
      id: 'Website cuaca real-time berbasis Next.js dengan deteksi lokasi GPS otomatis, prakiraan 7 hari ke depan, UV index, kualitas udara, dan fitur AI Personal Advice yang memberikan saran aktivitas harian berdasarkan kondisi cuaca terkini. Dioptimalkan untuk desktop dan mobile.',
      en: 'A real-time weather website built with Next.js featuring automatic GPS location detection, 7-day forecast, UV index, air quality monitoring, and an AI Personal Advice feature that provides daily activity recommendations based on current weather conditions. Optimized for desktop and mobile.',
    },
    image: '/images/projects/skycast.jpg',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'WeatherAPI'],
    liveUrl: 'https://smart-weather-goz.vercel.app/',
    githubUrl: 'https://github.com/Annas Anuraga-Gozali/smart-weather',
    status: 'live',
    featured: true,
  },
  {
    id: 2,
    title: {
      id: 'WebWatch — Dashboard Monitoring Website',
      en: 'WebWatch — Website Monitoring Dashboard',
    },
    description: {
      id: 'Dashboard monitoring website real-time dengan pemantauan uptime, response time, dan status SSL. Dilengkapi fitur AI Insights berbasis Llama-3 untuk analisis performa otomatis dan notifikasi cerdas.',
      en: 'A real-time website monitoring dashboard with uptime tracking, response time analysis, and SSL status checks. Features AI Insights powered by Llama-3 for automated performance analysis and smart notifications.',
    },
    image: '/images/projects/webwatch.jpg',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Supabase'],
    liveUrl: 'https://webwatch-id.vercel.app/',
    githubUrl: 'https://github.com/Annas Anuraga-Gozali/webwatch',
    status: 'live',
    featured: true,
  },
  {
    id: 3,
    title: {
      id: 'SDN Pulo 01 Pagi — Sistem Informasi Sekolah',
      en: 'SDN Pulo 01 Pagi — School Information System',
    },
    description: {
      id: 'Website resmi SDN Pulo 01 Pagi Jakarta Selatan yang menampilkan profil sekolah, berita & kabar terkini, galeri kegiatan, serta sistem pendaftaran SPMB online. Dibangun dengan Next.js dan Supabase, responsif untuk semua perangkat.',
      en: 'Official website for SDN Pulo 01 Pagi South Jakarta, featuring school profile, latest news, activity gallery, and an online SPMB enrollment system. Built with Next.js and Supabase, fully responsive across all devices.',
    },
    image: '/images/projects/sdn-pulo.jpg',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Supabase'],
    liveUrl: 'https://sdn-pulo-01-pagi.vercel.app/',
    githubUrl: 'https://github.com/Annas Anuraga-Gozali/SDN-PULO-01-PAGI',
    status: 'live',
    featured: true,
  },
];