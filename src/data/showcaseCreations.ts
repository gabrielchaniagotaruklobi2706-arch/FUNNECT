import robotCarImg from '../assets/images/robot_car_craft_1789458134194.jpg';
import windmillImg from '../assets/images/windmill_craft_1789458157800.jpg';
import plantWatererImg from '../assets/images/plant_waterer_1789458175653.jpg';
import barrierGateImg from '../assets/images/barrier_gate_1789458206586.jpg';
import sunflowerImg from '../assets/images/sunflower_craft_1789458221336.jpg';

export interface KidCreation {
  id: string;
  projectId: string;
  title: string;
  subtitle: string;
  category: string;
  badgeEmoji: string;
  creatorName: string;
  schoolGrade: string;
  achievementBadge: string;
  imageUrl: string;
  description: string;
  highlightPunch: string;
  craftMaterials: string[];
  modulesUsed: { name: string; icon: string; color: string }[];
  difficulty: 'Sangat Mudah' | 'Mudah' | 'Tantangan Seru';
  buildMinutes: number;
  studentQuote: string;
  badgeBg: string;
  themeGradient: string;
  accentBorder: string;
  cardBg: string;
  funFact: string;
}

export const KID_CREATIONS: KidCreation[] = [
  {
    id: 'creation-robot-car',
    projectId: 'proj-robot-car',
    title: 'Mobil Robot Cerdas Anti-Tabrak',
    subtitle: 'Robot beroda yang bisa melihat dan belok mandiri',
    category: 'Robot & Mobil',
    badgeEmoji: '🚗',
    creatorName: 'Rafa (9 thn) & Naura (10 thn)',
    schoolGrade: 'Kelas 4 SD Mentari Ceria',
    achievementBadge: '🏆 Juara 1 Robotika Kreatif Cilik 2025',
    imageUrl: robotCarImg,
    description: 'Rafa dan Naura membuat mobil robot mandiri dari 18 batang stik es krim bekas dan konektor FUNNECT. Dilengkapi dua mata ultrasonik, robot ini akan mundur dan berbelok otomatis bila ada dinding di depannya!',
    highlightPunch: 'Mata ultrasonik mendeteksi halangan hingga jarak 2 meter!',
    craftMaterials: ['18 Stik Es Krim', '8 Snap Connector FUNNECT', '2 Roda Karet', '1 Roda Luncur Depan'],
    modulesUsed: [
      { name: 'Core Device', icon: '🧠', color: 'bg-blue-100 text-blue-800' },
      { name: 'Sensor Jarak (Ultrasonik)', icon: '👀', color: 'bg-indigo-100 text-indigo-800' },
      { name: '2x Motor DC Geared', icon: '⚙️', color: 'bg-amber-100 text-amber-800' }
    ],
    difficulty: 'Mudah',
    buildMinutes: 45,
    studentQuote: '"Waktu pertama kali mobilnya belok sendiri pas ketemu kotak pensil, sekelas langsung heboh dan tepuk tangan!" — Naura',
    badgeBg: 'bg-blue-500 text-white',
    themeGradient: 'from-blue-500 via-cyan-400 to-indigo-500',
    accentBorder: 'hover:border-blue-400 border-blue-200',
    cardBg: 'bg-gradient-to-br from-blue-50/70 via-white to-cyan-50/50',
    funFact: 'Sensor ultrasonik bekerja seperti kelelawar, memancarkan gelombang suara yang tak terdengar telinga kita!'
  },
  {
    id: 'creation-windmill',
    projectId: 'proj-windmill',
    title: 'Kincir Angin Tenaga Surya Pintar',
    subtitle: 'Baling-baling berputar otomatis mengikuti cahaya',
    category: 'Sains & Energi',
    badgeEmoji: '🌬️',
    creatorName: 'Bima & Tim Bintang Sains',
    schoolGrade: 'Kelas 5 SD Harapan Mulia',
    achievementBadge: '🌟 Inovasi Energi Terbarukan Cilik',
    imageUrl: windmillImg,
    description: 'Menara kincir angin setinggi 20 cm yang dirangkai dengan stik kayu dan bilah kardus berwarna-warni. Sensor cahaya mendeteksi sinar senter atau matahari untuk menggerakkan baling-baling semakin cepat!',
    highlightPunch: 'Semakin terang sinar lampu, putaran kincir semakin kencang!',
    craftMaterials: ['16 Stik Es Krim', '4 Bilah Kertas Karton', '10 Snap Joint', 'Bambu Poros'],
    modulesUsed: [
      { name: 'Core Device', icon: '🧠', color: 'bg-blue-100 text-blue-800' },
      { name: 'Sensor Cahaya (LDR)', icon: '☀️', color: 'bg-amber-100 text-amber-800' },
      { name: 'Motor DC Super Lembut', icon: '🌀', color: 'bg-emerald-100 text-emerald-800' }
    ],
    difficulty: 'Sangat Mudah',
    buildMinutes: 40,
    studentQuote: '"Asik banget pas coba senter HP didekatkan, baling-balingnya langsung berputar kencang kayak helikopter!" — Bima',
    badgeBg: 'bg-amber-500 text-white',
    themeGradient: 'from-amber-400 via-orange-400 to-yellow-500',
    accentBorder: 'hover:border-amber-400 border-amber-200',
    cardBg: 'bg-gradient-to-br from-amber-50/70 via-white to-yellow-50/50',
    funFact: 'Energi angin di dunia nyata mampu menyalakan jutaan lampu tanpa menimbulkan polusi!'
  },
  {
    id: 'creation-plant-waterer',
    projectId: 'proj-smart-irrigation',
    title: 'Alat Siram Tanaman Otomatis Cilik',
    subtitle: 'Menyiram pot bunga saat tanah mulai kering',
    category: 'Tanaman & Alam',
    badgeEmoji: '🌱',
    creatorName: 'Alya & Keisha',
    schoolGrade: 'Kelas 3 SD Cita Cerdas',
    achievementBadge: '💚 Pahlawan Lingkungan Hijau',
    imageUrl: plantWatererImg,
    description: 'Dirancang agar tanaman sukulen kesayangan di kelas tidak layu saat libur akhir pekan! Sensor kelembaban memeriksa tanah, dan bila tanah kering, lengan motor servo otomatis menuang air dari cangkir kertas.',
    highlightPunch: 'Lampu LED berubah hijau saat tanah segar dan merah saat haus!',
    craftMaterials: ['14 Stik Kayu', '8 Konektor', 'Cangkir Kertas Mini', 'Pot Bunga'],
    modulesUsed: [
      { name: 'Core Device', icon: '🧠', color: 'bg-blue-100 text-blue-800' },
      { name: 'Sensor Kelembaban Tanah', icon: '💧', color: 'bg-cyan-100 text-cyan-800' },
      { name: 'Motor Servo Presisi', icon: '🦾', color: 'bg-emerald-100 text-emerald-800' },
      { name: 'Lampu LED RGB', icon: '💡', color: 'bg-pink-100 text-pink-800' }
    ],
    difficulty: 'Mudah',
    buildMinutes: 50,
    studentQuote: '"Tanaman sukulen kelas kami sekarang tetap segar walau ditinggal libur 3 hari karena disiram robot!" — Alya',
    badgeBg: 'bg-emerald-600 text-white',
    themeGradient: 'from-emerald-500 via-teal-400 to-green-500',
    accentBorder: 'hover:border-emerald-400 border-emerald-200',
    cardBg: 'bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50',
    funFact: 'Tanaman juga bisa berkomunikasi loh, saat kekurangan air sinyal listrik di daunnya berubah!'
  },
  {
    id: 'creation-barrier-gate',
    projectId: 'proj-automatic-barrier',
    title: 'Palang Pintu Otomatis Stasiun Kereta',
    subtitle: 'Palang terangkat dan lampu menyala saat kendaraan lewat',
    category: 'Otomasi Seru',
    badgeEmoji: '🚧',
    creatorName: 'Tim Robotika Merpati',
    schoolGrade: 'Kelas 5 SD Nusantara',
    achievementBadge: '🚦 Smart City Junior Winner',
    imageUrl: barrierGateImg,
    description: 'Miniatur pintu perlintasan kereta dan tol jalan raya lengkap dengan garis belang merah-putih. Menggunakan sensor ultrasonik untuk mendeteksi mobil mainan lalu membuka palang dan membunyikan sirine ceria!',
    highlightPunch: 'Palang menutup kembali secara halus setelah mobil selesai melintas!',
    craftMaterials: ['16 Stik Es Krim', 'Pita Belang Merah Putih', '8 Konektor', 'Poros Bambu'],
    modulesUsed: [
      { name: 'Core Device', icon: '🧠', color: 'bg-blue-100 text-blue-800' },
      { name: 'Sensor Jarak', icon: '👀', color: 'bg-indigo-100 text-indigo-800' },
      { name: 'Motor Servo Palang', icon: '🚧', color: 'bg-purple-100 text-purple-800' },
      { name: 'Buzzer Musik & LED', icon: '🔔', color: 'bg-rose-100 text-rose-800' }
    ],
    difficulty: 'Tantangan Seru',
    buildMinutes: 40,
    studentQuote: '"Rasanya seru banget kayak jadi masinis dan operator jalan tol sungguhan!" — Dimas',
    badgeBg: 'bg-purple-600 text-white',
    themeGradient: 'from-purple-500 via-pink-500 to-rose-400',
    accentBorder: 'hover:border-purple-400 border-purple-200',
    cardBg: 'bg-gradient-to-br from-purple-50/70 via-white to-pink-50/50',
    funFact: 'Palang tol otomatis di jalan raya nyata menggunakan sensor induksi magnetik di bawah aspal!'
  },
  {
    id: 'creation-sunflower',
    projectId: 'proj-solar-tracker',
    title: 'Bunga Matahari Pelacak Cahaya Pintar',
    subtitle: 'Kelopak robotik yang bergerak mencari sinar matahari',
    category: 'Sains & Energi',
    badgeEmoji: '🌻',
    creatorName: 'Kirana & Zahra',
    schoolGrade: 'Kelas 4 SD Bintang Bangsa',
    achievementBadge: '✨ Desain Sains Paling Kreatif',
    imageUrl: sunflowerImg,
    description: 'Kreasi menakjubkan yang meniru sifat alami bunga matahari (heliotropisme). Kelopak bunga kuning yang dibuat dari karton akan berputar anggun menatap arah senter atau cahaya ruangan.',
    highlightPunch: 'Gerakan leher bunga berbelok halus hingga 180 derajat!',
    craftMaterials: ['14 Stik Kayu', 'Kelopak Bunga Karton Kuning', '8 Konektor', 'Poros Bambu'],
    modulesUsed: [
      { name: 'Core Device', icon: '🧠', color: 'bg-blue-100 text-blue-800' },
      { name: 'Sensor Cahaya Presisi', icon: '☀️', color: 'bg-amber-100 text-amber-800' },
      { name: 'Micro Servo 180°', icon: '🌻', color: 'bg-yellow-100 text-yellow-800' },
      { name: 'Lampu LED Pusat Bunga', icon: '✨', color: 'bg-orange-100 text-orange-800' }
    ],
    difficulty: 'Mudah',
    buildMinutes: 45,
    studentQuote: '"Waktu bunga ini berputar pelan-pelan mengikuti senterku, rasanya kayak memelihara tanaman robot hidup!" — Kirana',
    badgeBg: 'bg-yellow-500 text-slate-900',
    themeGradient: 'from-yellow-400 via-amber-400 to-orange-500',
    accentBorder: 'hover:border-yellow-400 border-yellow-200',
    cardBg: 'bg-gradient-to-br from-yellow-50/70 via-white to-amber-50/50',
    funFact: 'Bunga matahari asli di alam selalu menghadap timur di pagi hari dan berputar ke barat saat senja!'
  }
];
