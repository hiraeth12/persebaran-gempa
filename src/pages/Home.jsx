import { Link } from "react-router-dom";
import { MapPin, Clock, BookOpen, User } from "lucide-react";
import MapButton from "@/components/map_button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            </div>
          </div>
          <span className="font-bold text-xl text-foreground">SeismoTrack</span>
        </div>
        <nav>
          <ul className="flex gap-8">
            <li>
              <Link to="#" className="text-foreground hover:text-primary">
                Beranda
              </Link>
            </li>
            <li>
              <Link to="#fitur" className="text-foreground hover:text-primary">
                Fitur
              </Link>
            </li>
            <li>
              <Link
                to="#tentang"
                className="text-foreground hover:text-primary"
              >
                Tentang
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Real-time Earthquake Monitoring.
          </h1>
          <p className="text-slate-700 mb-8 max-w-lg font-poppins">
            Pantau aktivitas gempa secara langsung dan dapatkan insight dari
            data yang tervisualisasi dengan baik.
          </p>
          <Link to="/map">
            <MapButton/>
          </Link>
        </div>
        <div className="md:w-1/2">
          <div className="relative">
            <div className="w-full h-80 md:h-96 bg-secondary rounded-full opacity-50 absolute -z-10 transform translate-x-4 translate-y-4"></div>
            <img
              src="images/gambar-1.png"
              alt="Earthquake monitoring illustration"
              width={400}
              height={400}
              className="relative z-10"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="fitur"
        className="container mx-auto px-4 py-16 md:py-24 text-slate-700"
      >
        <h2 className="text-3xl font-bold text-center mb-16">
          Fitur SeismoTrack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Peta Interaktif</h3>
            <p className="text-slate-700 text-sm justify-center">
              Pantau aktivitas gempa secara visual dengan peta real-time yang
              menampilkan, kedatangan, dan magnitudo. Zoom in/out untuk analisis
              detail wilayah terdampak.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Info Gempa lengkap</h3>
            <p className="text-slate-700 text-sm">
              Dapatkan laporan komprehensif setiap kejadian gempa.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Pembaruan Data Real Time
            </h3>
            <p className="text-slate-700 text-sm justify-center">
              Notifikasi instan begitu gempa terjadi. Data diperbarui setiap 1
              menit langsung dari server BMKG untuk akurasi maksimal.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Sumber Resmi dari BMKG
            </h3>
            <p className="text-slate-700 text-sm">
              Semua data bersumber langsung dari Badan Meteorologi, Klimatologi,
              dan Geofisika (BMKG) Indonesia, terjamin keandalan dan
              kecepatannya.
            </p>
          </div>
        </div>
      </section>

      {/* Mitigation Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-background">
        <div className="flex flex-col md:flex-row justify-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-3xl text-center font-bold mb-4 text-slate-700">
              Mitigasi Bencana Lebih Cepat
            </h2>
            <p className="text-slate-700 mb-6 max-w-lg text-center mx-auto">
              Dengan teknologi canggih kami, Anda bisa melacak aktivitas gempa
              di seluruh Indonesia secara real-time, langsung dari sumber data
              BMKG.
            </p>
          </div>
        </div>
        <div className="mt-16 rounded-lg overflow-hidden border border-gray-200 shadow-lg">
          <img
            src="images/placeholder-3.jpg"
            alt="Indonesia earthquake map"
            width={800}
            height={400}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/3">
            <img
              src="images/gambar-3.png"
              alt="Team illustration"
              width={300}
              height={300}
              className="w-full h-auto"
            />
          </div>
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold mb-4">Tentang Kami</h2>
            <p className="text-slate-700 mb-6">
              SeismoTrack adalah platform pemantauan gempa bumi yang menyajikan
              data real-time dari BMKG. Dibuat untuk membantu masyarakat dan
              instansi mendapatkan informasi gempa secara cepat, akurat, dan
              mudah dimengerti.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="font-bold text-lg">SeismoTrack</span>
            </div>
            <div className="text-sm text-gray-300">
              © 2023 SeismoTrack. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
