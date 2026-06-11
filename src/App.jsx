import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const RED = "#D93B1B";
const BLACK = "#0A0A0A";
const CREAM = "#FAF7F2";
const WHITE = "#FFFFFF";
const GOLD = "#C9973A";

const WA_LINK = "https://wa.me/243838108007?text=Bonjour%20Karoo%20Travel%20Agency%2C%20je%20voudrais%20des%20informations.";

const SERVICES = [
  { title: "Billets d'Avion", imgPos: "center center", img: "https://i.imgur.com/5raP93S.png", desc: "Vols nationaux et internationaux aux meilleurs tarifs. Nous comparons toutes les compagnies pour vous trouver la meilleure offre." },
  { title: "Visas", imgPos: "center center", img: "https://i.imgur.com/McjYVtV.png", desc: "Visa tourisme, affaires, étudiant ou médical. Nous constituons votre dossier et suivons votre demande jusqu'à l'approbation." },
  { title: "Passeports", imgPos: "center center", img: "https://i.imgur.com/AJnzp3l.jpeg", desc: "Accompagnement complet pour l'obtention ou le renouvellement de votre passeport congolais, rapidement et sans tracas." },
  { title: "Vacances & Séjours", imgPos: "center center", img: "https://i.imgur.com/d3uswd5.png", desc: "Packages vacances tout inclus — vol, hôtel, transferts et activités. Dubaï, Turquie, Inde, Europe et bien plus." },
  { title: "Safaris & Aventures", imgPos: "center center", img: "https://i.imgur.com/DbWjljB.png", desc: "Des safaris inoubliables au Kenya, en Tanzanie et en Afrique du Sud. Rencontres avec la faune sauvage garanties." },
  { title: "Immigration & Expatriés", imgPos: "center center", img: "https://i.imgur.com/yGczzxj.png", desc: "Relocation, permis de résidence, regroupement familial. Karoo vous guide à chaque étape de votre projet d'expatriation." },
  { title: "Location de Véhicules", imgPos: "center center", img: "https://i.imgur.com/gAlkJPN.png", desc: "Location de voitures avec ou sans chauffeur à Kolwezi et dans les grandes villes. Flotte moderne et tarifs compétitifs." },
  { title: "Visa Médical Inde", imgPos: "center center", img: "https://i.imgur.com/L8SR61b.png", desc: "Visa médical Inde obtenu en 24h. Partenariat direct avec les meilleurs hôpitaux indiens. Prise en charge complète." },
];

const DESTINATIONS = [
  { name: "Inde", flag: "🇮🇳", tag: "Visa 24h", img: "https://i.imgur.com/hGFrJh7.png", desc: "Visa médical, étudiant ou tourisme en 24h. Partenariat direct avec hôpitaux et universités indiennes de renom." },
  { name: "Afrique du Sud", flag: "🇿🇦", tag: "Populaire", img: "https://i.imgur.com/I0EqW1K.png", desc: "Cape Town, Johannesburg, safaris dans le Kruger. La destination africaine par excellence pour tous les budgets." },
  { name: "Dubaï", flag: "🇦🇪", tag: "Luxe", img: "https://i.imgur.com/5lIuMe8.png", desc: "Séjours luxueux, shopping, Burj Khalifa et désert. Packages vol + hôtel à des prix que vous n'imaginez pas." },
  { name: "Europe", flag: "🇪🇺", tag: "Schengen", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=700&q=80", desc: "Visa Schengen pour la France, Belgique, Allemagne et plus. Accompagnement complet du dossier jusqu'à l'ambassade." },
  { name: "Kenya", flag: "🇰🇪", tag: "Safari", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=700&q=80", desc: "Le Masai Mara, Nairobi et les plages de Mombasa. Safaris photos inoubliables avec guides certifiés." },
  { name: "Turquie", flag: "🇹🇷", tag: "Culture", img: "https://i.imgur.com/vlk5izH.png", desc: "Istanbul, Cappadoce, côtes turquoises. Un carrefour de cultures à un prix accessible depuis Kolwezi." },
];

const TESTIMONIALS = [
  { name: "Alain M.", city: "Lubumbashi", text: "Karoo m'a obtenu mon visa Inde en moins de 24h ! Je n'y croyais pas mais Judith a tout géré. Service impeccable, je recommande à 100%.", stars: 5, trip: "Visa Inde" },
  { name: "Grace K.", city: "Kolwezi", text: "Voyage à Dubaï organisé de A à Z. Billets, hôtel, visa — tout était parfait. L'équipe est professionnelle et très réactive sur WhatsApp.", stars: 5, trip: "Dubaï" },
  { name: "Patrick N.", city: "Kinshasa", text: "Safari au Kenya magnifique ! Karoo s'est occupé de tout et à un prix très raisonnable. Je repars avec eux en décembre pour l'Afrique du Sud.", stars: 5, trip: "Safari Kenya" },
  { name: "Marie-Claire B.", city: "Kolwezi", text: "Mon visa médical pour l'Inde a été approuvé en 20h ! L'hôpital partenaire était excellent. Merci infiniment à Judith et toute l'équipe Karoo.", stars: 5, trip: "Visa Médical Inde" },
  { name: "Joseph T.", city: "Kasumbalesa", text: "Très bonne agence. J'ai eu mon passeport et mon billet rapidement. Processus simple, pas de stress. Karoo mérite sa réputation.", stars: 5, trip: "Passeport + Vol" },
];

// ─── HOOKS ───────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, vis];
}

function useCounter(target, vis, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!vis) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [vis, target, duration]);
  return count;
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const fadeUp = (vis, delay = 0) => ({
  opacity: vis ? 1 : 0,
  transform: vis ? "translateY(0)" : "translateY(48px)",
  transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
});
const fadeLeft = (vis, delay = 0) => ({
  opacity: vis ? 1 : 0,
  transform: vis ? "translateX(0)" : "translateX(-48px)",
  transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
});
const fadeRight = (vis, delay = 0) => ({
  opacity: vis ? 1 : 0,
  transform: vis ? "translateX(0)" : "translateX(48px)",
  transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
});

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = ["Accueil", "Services", "Destinations", "Voyages", "Témoignages", "À Propos", "Contact"];
  const go = (l) => { setPage(l); setTimeout(() => setMobileOpen(false), 50); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        ::selection { background: ${RED}; color: white; }
        .nav-link:hover { color: ${RED} !important; }
        .btn-red { transition: transform 0.2s, box-shadow 0.2s !important; }
        .btn-red:hover { transform: translateY(-3px) !important; box-shadow: 0 12px 32px rgba(217,59,27,0.45) !important; }
        .card-hover { transition: transform 0.35s ease, box-shadow 0.35s ease !important; }
        .card-hover:hover { transform: translateY(-8px) !important; box-shadow: 0 24px 60px rgba(0,0,0,0.15) !important; }
        .dest-card { overflow: hidden; position: relative; }
        .dest-card img { transition: transform 0.6s ease !important; }
        .dest-card:hover img { transform: scale(1.08) !important; }
        .wa-float { animation: pulse-wa 2.5s infinite; }
        @keyframes pulse-wa {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.5); }
          50% { box-shadow: 0 0 0 14px rgba(37,211,102,0); }
        }
        .star { color: #F5A623; font-size: 16px; }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
          .hero-title { font-size: clamp(56px, 16vw, 90px) !important; }
          .stats-bar { flex-direction: column; gap: 0 !important; }
          .stats-item { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08) !important; padding: 14px 20px !important; }
          .two-col { grid-template-columns: 1fr !important; gap: 40px !important; }
          .three-col { grid-template-columns: 1fr 1fr !important; }
          .service-grid { grid-template-columns: 1fr !important; }
          .dest-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .footer-inner { flex-direction: column !important; text-align: center !important; gap: 24px !important; }
          .section-pad { padding: 64px 5vw !important; }
          .hero-cta { flex-direction: column !important; align-items: stretch !important; }
          .hero-cta a, .hero-cta button { text-align: center !important; justify-content: center !important; }
          .testi-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) { .mobile-only { display: none !important; } }
      `}</style>

      {/* Floating WhatsApp */}
      <a href={WA_LINK} target="_blank" rel="noreferrer" className="wa-float" style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 999,
        width: 60, height: 60, borderRadius: "50%", background: "#25D366",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, textDecoration: "none",
      }}>💬</a>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
        padding: scrolled ? "12px 5vw" : "20px 5vw",
        background: scrolled ? "rgba(10,10,10,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `2px solid ${RED}` : "none",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.4s ease",
      }}>
        <div onClick={() => go("Accueil")} style={{ cursor: "pointer" }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, letterSpacing: 4, color: WHITE, lineHeight: 1 }}>
            KAR<span style={{ color: RED }}>OO</span>
          </div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 8, letterSpacing: 5, color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>TRAVEL AGENCY</div>
        </div>

        {/* Desktop */}
        <div className="desktop-only" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {links.map(l => (
            <button key={l} onClick={() => go(l)} className="nav-link" style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 700,
              letterSpacing: 0.5, color: page === l ? RED : "rgba(255,255,255,0.8)",
              borderBottom: page === l ? `2px solid ${RED}` : "2px solid transparent",
              paddingBottom: 2, transition: "color 0.2s",
            }}>{l}</button>
          ))}
          <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn-red" style={{
            background: RED, color: WHITE, fontFamily: "'Nunito', sans-serif",
            fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: "uppercase",
            padding: "10px 22px", borderRadius: 3, textDecoration: "none",
            display: "flex", alignItems: "center", gap: 8,
          }}>💬 WhatsApp</a>
        </div>

        {/* Mobile hamburger */}
        <button className="mobile-only" onClick={() => setMobileOpen(!mobileOpen)} style={{
          background: "none", border: "none", cursor: "pointer",
          color: WHITE, fontSize: 26, display: "flex", alignItems: "center",
        }}>{mobileOpen ? "✕" : "☰"}</button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 499, background: "rgba(10,10,10,0.98)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24,
        }}>
          {links.map(l => (
            <button key={l} onClick={() => go(l)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Bebas Neue', cursive", fontSize: 38, letterSpacing: 4,
              color: page === l ? RED : WHITE,
            }}>{l}</button>
          ))}
          <a href={WA_LINK} target="_blank" rel="noreferrer" style={{ background: RED, color: WHITE, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 1, padding: "14px 36px", borderRadius: 3, textDecoration: "none", marginTop: 12 }}>💬 WhatsApp</a>
        </div>
      )}
    </>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero({ setPage }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    { bg: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1800&q=80", sub: "Vols vers le monde entier" },
    { bg: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1800&q=80", sub: "Visa Inde en 24 heures" },
    { bg: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1800&q=80", sub: "Safaris & Aventures Africaines" },
    { bg: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1800&q=80", sub: "Dubaï, Turquie, Europe & Plus" },
  ];

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh", minHeight: 640, overflow: "hidden" }}>
      {slides.map((s, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${s.bg})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: i === slide ? 1 : 0,
          transition: "opacity 1.5s ease",
        }} />
      ))}
      {/* Multi-layer overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.5) 50%, rgba(217,59,27,0.15) 100%)" }} />
      {/* Diagonal red accent */}
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 0 220px 480px", borderColor: `transparent transparent ${RED} transparent`, opacity: 0.12 }} />

      {/* Content */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 6vw", maxWidth: 900 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(217,59,27,0.9)", color: WHITE, fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "7px 18px", borderRadius: 2, marginBottom: 24, width: "fit-content" }}>
          <span>📍</span> Kolwezi, RDC
        </div>
        <h1 className="hero-title" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(72px, 12vw, 130px)", color: WHITE, lineHeight: 0.92, letterSpacing: 4, marginBottom: 12 }}>
          DREAM.<br />
          <span style={{ color: RED, textShadow: `0 0 60px rgba(217,59,27,0.6)` }}>LIVE.</span><br />
          FLY.
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255,255,255,0.78)", maxWidth: 500, lineHeight: 1.75, margin: "24px 0 40px" }}>
          Votre agence de voyage à Kolwezi — visas, vols, safaris et bien plus. Nous nous occupons de tout pendant que vous rêvez.
        </p>
        <div className="hero-cta" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button onClick={() => setPage("Réservation")} className="btn-red" style={{ background: RED, border: "none", color: WHITE, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 1, textTransform: "uppercase", padding: "16px 36px", borderRadius: 3, cursor: "pointer" }}>
            ✈️ Faire une Réservation
          </button>
          <a href={WA_LINK} target="_blank" rel="noreferrer" style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.4)", color: WHITE, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14, padding: "16px 36px", borderRadius: 3, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            💬 WhatsApp
          </a>
        </div>

        {/* Animated subtitle */}
        <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 2, background: RED }} />
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: 2, textTransform: "uppercase", transition: "all 0.5s" }}>{slides[slide].sub}</span>
        </div>
      </div>

      {/* Slide dots */}
      <div style={{ position: "absolute", right: "5vw", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 10 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} style={{ width: 10, height: i === slide ? 40 : 10, borderRadius: 5, background: i === slide ? RED : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", transition: "all 0.4s" }} />
        ))}
      </div>

      {/* Stats bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(10,10,10,0.97)", borderTop: `3px solid ${RED}`, display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[["✈️", "100+", "Destinations"], ["⚡", "24H", "Visa Inde"], ["🤝", "500+", "Clients satisfaits"], ["📞", "24/7", "Support WhatsApp"]].map(([ico, n, l], i) => (
          <div key={i} style={{ padding: "14px 8px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none", textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(18px, 3vw, 28px)", color: RED, letterSpacing: 1 }}>{ico} {n}</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: "clamp(9px, 1.5vw, 11px)", color: "rgba(255,255,255,0.45)", letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SERVICES ────────────────────────────────────────────────────────────────
function Services() {
  const [ref, vis] = useReveal();
  return (
    <section ref={ref} className="section-pad" style={{ background: CREAM, padding: "96px 6vw" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 64, flexWrap: "wrap", ...fadeUp(vis) }}>
          <div>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, letterSpacing: 4, color: RED, textTransform: "uppercase", fontWeight: 800 }}>Ce que nous faisons</span>
            <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(42px, 6vw, 72px)", color: BLACK, letterSpacing: 3, marginTop: 6 }}>NOS SERVICES</h2>
          </div>
          <div style={{ flex: 1, height: 3, background: `linear-gradient(to right, ${RED}, transparent)`, minWidth: 60 }} />
        </div>

        <div className="service-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {SERVICES.map((s, i) => (
            <div key={s.title} className="card-hover" style={{
              background: WHITE, borderRadius: 6, overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.06)",
              ...fadeUp(vis, i * 0.08),
            }}>
              <div style={{ height: 220, overflow: "hidden", position: "relative", background: "#eee" }}>
                <img src={s.img} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block", transition: "transform 0.6s" }} />
                
              </div>
              <div style={{ padding: "22px 22px 26px", borderLeft: `4px solid ${RED}` }}>
                <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, color: BLACK, letterSpacing: 2, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#666", lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* India CTA */}
        <div style={{ marginTop: 48, background: BLACK, borderRadius: 6, overflow: "hidden", borderLeft: `6px solid ${RED}`, ...fadeUp(vis, 0.6) }}>
          <div style={{ padding: "36px 44px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 28, justifyContent: "space-between" }}>
            <div style={{ flex: "1 1 280px" }}>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: RED, letterSpacing: 3, textTransform: "uppercase", fontWeight: 800, marginBottom: 8 }}>⚡ Spécialité Karoo</div>
              <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(26px, 4vw, 36px)", color: WHITE, letterSpacing: 3, marginBottom: 10 }}>VISA INDE EN 24 HEURES 🇮🇳</h3>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", maxWidth: 560, lineHeight: 1.75 }}>
                Visa d'étude, médical ou tourisme — obtenus en <strong style={{ color: RED }}>24h seulement</strong>. Inscription université, hébergement et billet inclus. Partenariat direct avec des hôpitaux indiens.
              </p>
            </div>
            <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn-red" style={{ flexShrink: 0, display: "inline-block", background: RED, color: WHITE, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", padding: "14px 28px", borderRadius: 3, textDecoration: "none", textAlign: "center" }}>
              Commencer maintenant →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── DESTINATIONS ────────────────────────────────────────────────────────────
function Destinations({ setPage }) {
  const [ref, vis] = useReveal();
  return (
    <section ref={ref} className="section-pad" style={{ background: BLACK, padding: "96px 6vw" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64, ...fadeUp(vis) }}>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, letterSpacing: 4, color: RED, textTransform: "uppercase", fontWeight: 800 }}>Où nous vous emmenons</span>
          <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(42px, 6vw, 72px)", color: WHITE, letterSpacing: 3, marginTop: 6 }}>DESTINATIONS</h2>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.5)", marginTop: 12 }}>Du Congo vers le monde entier — avec Karoo, tout est possible.</p>
        </div>

        <div className="dest-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {DESTINATIONS.map((d, i) => (
            <div key={d.name} className="card-hover dest-card" style={{
              borderRadius: 6, overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "#111",
              ...fadeUp(vis, i * 0.1),
            }}>
              <div style={{ position: "relative", height: 220 }}>
                <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", top: 14, left: 14, background: RED, color: WHITE, fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", padding: "5px 12px", borderRadius: 2 }}>{d.tag}</div>
                <div style={{ position: "absolute", bottom: 14, left: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 24 }}>{d.flag}</span>
                  <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 26, color: WHITE, letterSpacing: 2 }}>{d.name}</span>
                </div>
              </div>
              <div style={{ padding: "20px 22px 24px" }}>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, marginBottom: 18 }}>{d.desc}</p>
                <button onClick={() => setPage("Réservation")} style={{ background: "transparent", border: `1px solid ${RED}`, color: RED, fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", padding: "9px 20px", borderRadius: 2, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.background = RED; e.target.style.color = WHITE; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = RED; }}
                >Réserver →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── STATS ───────────────────────────────────────────────────────────────────
function Stats() {
  const [ref, vis] = useReveal(0.3);
  const c1 = useCounter(500, vis);
  const c2 = useCounter(24, vis);
  const c3 = useCounter(100, vis);
  const c4 = useCounter(8, vis);

  return (
    <section ref={ref} style={{ background: RED, padding: "64px 6vw" }}>
      <div className="three-col" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, textAlign: "center" }}>
        {[[c1, "+", "Clients Heureux"], [c2, "H", "Visa Inde"], [c3, "+", "Destinations"], [c4, " Ans", "d'Expérience"]].map(([n, suffix, label], i) => (
          <div key={label} style={{ padding: "20px 16px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.2)" : "none" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(48px, 6vw, 72px)", color: WHITE, lineHeight: 1, letterSpacing: 2 }}>{n}{suffix}</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 6 }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
const DEFAULT_TESTIMONIALS = [
  { id: 1, name: "Alain M.", city: "Lubumbashi", text: "Karoo m'a obtenu mon visa Inde en moins de 24h ! Je n'y croyais pas mais Judith a tout géré. Service impeccable, je recommande à 100%.", stars: 5, trip: "Visa Inde", approved: true },
  { id: 2, name: "Grace K.", city: "Kolwezi", text: "Voyage à Dubaï organisé de A à Z. Billets, hôtel, visa — tout était parfait. L'équipe est professionnelle et très réactive sur WhatsApp.", stars: 5, trip: "Dubaï", approved: true },
  { id: 3, name: "Patrick N.", city: "Kinshasa", text: "Safari au Kenya magnifique ! Karoo s'est occupé de tout et à un prix très raisonnable. Je repars avec eux en décembre pour l'Afrique du Sud.", stars: 5, trip: "Safari Kenya", approved: true },
  { id: 4, name: "Marie-Claire B.", city: "Kolwezi", text: "Mon visa médical pour l'Inde a été approuvé en 20h ! L'hôpital partenaire était excellent. Merci infiniment à Judith et toute l'équipe Karoo.", stars: 5, trip: "Visa Médical Inde", approved: true },
  { id: 5, name: "Joseph T.", city: "Kasumbalesa", text: "Très bonne agence. J'ai eu mon passeport et mon billet rapidement. Processus simple, pas de stress. Karoo mérite sa réputation.", stars: 5, trip: "Passeport + Vol", approved: true },
];

function useTestimonials() {
  const [testimonials] = useState(DEFAULT_TESTIMONIALS);
  return { testimonials };
}



function Testimonials() {
  const [ref, vis] = useReveal();
  const [active, setActive] = useState(0);
  const { testimonials } = useTestimonials();
  const approved = testimonials.filter(t => t.approved);

  useEffect(() => {
    if (!approved.length) return;
    const t = setInterval(() => setActive(a => (a + 1) % approved.length), 4500);
    return () => clearInterval(t);
  }, [approved.length]);

  const cur = approved[active % approved.length] || approved[0];

  return (
    <section ref={ref} className="section-pad" style={{ background: CREAM, padding: "96px 6vw", overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 56, ...fadeUp(vis) }}>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, letterSpacing: 4, color: RED, textTransform: "uppercase", fontWeight: 800 }}>Ce qu'ils disent</span>
          <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(42px, 6vw, 72px)", color: BLACK, letterSpacing: 3, marginTop: 6 }}>TÉMOIGNAGES</h2>
        </div>

        {cur && (
          <div style={{ background: BLACK, borderRadius: 8, padding: "clamp(28px,5vw,48px) clamp(24px,5vw,56px)", marginBottom: 32, position: "relative", overflow: "hidden", ...fadeUp(vis, 0.2) }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: 6, height: "100%", background: RED }} />
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 100, color: RED, opacity: 0.12, position: "absolute", top: -10, right: 40, lineHeight: 1 }}>"</div>
            <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
              {[...Array(cur.stars)].map((_, i) => <span key={i} className="star">★</span>)}
            </div>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "clamp(15px,2vw,20px)", color: WHITE, lineHeight: 1.8, marginBottom: 28, fontStyle: "italic", maxWidth: 700 }}>"{cur.text}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', cursive", fontSize: 20, color: WHITE, flexShrink: 0 }}>
                {cur.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 20, color: WHITE, letterSpacing: 1 }}>{cur.name}</div>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: RED, fontWeight: 700 }}>{cur.city}{cur.trip ? ` · ${cur.trip}` : ""}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
              {approved.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} style={{ width: i === active % approved.length ? 28 : 10, height: 10, borderRadius: 5, background: i === active % approved.length ? RED : "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", transition: "all 0.3s" }} />
              ))}
            </div>
          </div>
        )}

        <div className="testi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {approved.slice(0, 3).map((t, i) => (
            <div key={t.id} className="card-hover" style={{ background: WHITE, borderRadius: 6, padding: "24px", border: "1px solid rgba(0,0,0,0.07)", borderTop: `3px solid ${RED}`, cursor: "pointer", ...fadeUp(vis, 0.3 + i * 0.1) }} onClick={() => setActive(approved.indexOf(t))}>
              <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                {[...Array(t.stars)].map((_, j) => <span key={j} className="star">★</span>)}
              </div>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#555", lineHeight: 1.7, marginBottom: 14 }}>"{t.text.substring(0, 90)}..."</p>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 800, color: BLACK }}>{t.name}{t.city && <span style={{ color: RED, fontWeight: 600 }}> — {t.city}</span>}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────
function About() {
  const [ref, vis] = useReveal();
  return (
    <section ref={ref} className="section-pad" style={{ background: WHITE, padding: "96px 6vw" }}>
      <div className="two-col" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div style={{ position: "relative", ...fadeLeft(vis) }}>
          <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=700&q=80" alt="Travel" style={{ width: "100%", height: 500, objectFit: "cover", borderRadius: 6, display: "block" }} />
          <div style={{ position: "absolute", bottom: -24, right: -24, background: RED, padding: "26px 32px", borderRadius: 6, textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 52, color: WHITE, lineHeight: 1, letterSpacing: 2 }}>24H</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.85)", letterSpacing: 3, textTransform: "uppercase", marginTop: 4 }}>Visa Inde</div>
          </div>
          <div style={{ position: "absolute", top: -16, left: -16, background: BLACK, padding: "16px 24px", borderRadius: 4 }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 36, color: WHITE, letterSpacing: 2 }}>500+</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, color: RED, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>Clients</div>
          </div>
        </div>

        <div style={{ ...fadeRight(vis, 0.2) }}>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, letterSpacing: 4, color: RED, textTransform: "uppercase", fontWeight: 800 }}>Notre Histoire</span>
          <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(38px, 5vw, 58px)", color: BLACK, letterSpacing: 3, margin: "12px 0 20px", lineHeight: 1 }}>
            BASÉE À KOLWEZI,<br /><span style={{ color: RED }}>AU SERVICE DU MONDE</span>
          </h2>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: "#555", lineHeight: 1.85, marginBottom: 18 }}>
            Karoo Travel Agency est une agence de voyage basée à <strong>Kolwezi, RDC</strong>, fondée par <strong>Judith T.</strong> Notre mission : vous épargner le stress de toutes vos démarches de voyage et d'immigration.
          </p>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: "#555", lineHeight: 1.85, marginBottom: 32 }}>
            Des billets d'avion aux visas, des safaris aux relocations pour expatriés — Karoo s'occupe de tout avec rapidité et professionnalisme. Épargnez-vous du stress, nous nous occupons de votre problème.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            {[["🌍", "Couverture mondiale"], ["⚡", "Visa Inde en 24h"], ["🤝", "Partenaires hospitaliers"], ["💼", "Service A à Z"]].map(([ico, t]) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 700, color: BLACK }}>
                <span style={{ fontSize: 20 }}>{ico}</span> {t}
              </div>
            ))}
          </div>
          <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn-red" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: RED, color: WHITE, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", padding: "14px 30px", borderRadius: 3, textDecoration: "none" }}>
            💬 Contactez-nous
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── RESERVATION ─────────────────────────────────────────────────────────────
function Reservation() {
  const [ref, vis] = useReveal();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ nom: "", email: "", phone: "", service: "", destination: "", date: "", passengers: "1", message: "" });
  const [sent, setSent] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid1 = form.nom && form.email && form.phone;
  const valid2 = form.service && form.destination && form.date;

  const inp = (style = {}) => ({
    width: "100%", background: WHITE, border: "1.5px solid #E0DBD4",
    borderRadius: 4, padding: "14px 16px", color: BLACK,
    fontFamily: "'Nunito', sans-serif", fontSize: 14, outline: "none",
    transition: "border-color 0.2s", boxSizing: "border-box", ...style,
  });

  const handleSubmit = () => {
    if (valid1 && valid2) setSent(true);
  };

  return (
    <section ref={ref} className="section-pad" style={{ background: CREAM, padding: "96px 6vw" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48, ...fadeUp(vis) }}>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, letterSpacing: 4, color: RED, textTransform: "uppercase", fontWeight: 800 }}>Planifiez votre voyage</span>
          <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(42px, 6vw, 68px)", color: BLACK, letterSpacing: 3, marginTop: 6 }}>FAIRE UNE RÉSERVATION</h2>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: "#777", marginTop: 10 }}>Remplissez le formulaire et nous vous contacterons sous 24h avec votre devis personnalisé.</p>
        </div>

        {sent ? (
          <div style={{ background: WHITE, borderRadius: 8, padding: "64px 40px", textAlign: "center", boxShadow: "0 12px 48px rgba(0,0,0,0.08)", ...fadeUp(vis, 0.1) }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>✈️</div>
            <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 42, color: RED, letterSpacing: 3, marginBottom: 12 }}>RÉSERVATION ENVOYÉE!</h3>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, color: "#666", marginBottom: 12 }}>Merci <strong>{form.nom}</strong>! Nous allons vous contacter très bientôt.</p>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "#999", marginBottom: 32 }}>Vous pouvez aussi nous écrire directement sur WhatsApp pour aller plus vite.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={WA_LINK} target="_blank" rel="noreferrer" style={{ background: "#25D366", color: WHITE, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, padding: "12px 28px", borderRadius: 3, textDecoration: "none" }}>💬 WhatsApp</a>
              <button onClick={() => { setSent(false); setStep(1); setForm({ nom: "", email: "", phone: "", service: "", destination: "", date: "", passengers: "1", message: "" }); }} style={{ background: RED, border: "none", color: WHITE, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, padding: "12px 28px", borderRadius: 3, cursor: "pointer" }}>Nouvelle réservation</button>
            </div>
          </div>
        ) : (
          <div style={{ background: WHITE, borderRadius: 8, overflow: "hidden", boxShadow: "0 12px 48px rgba(0,0,0,0.08)", ...fadeUp(vis, 0.1) }}>
            {/* Step indicator */}
            <div style={{ background: BLACK, padding: "24px 40px", display: "flex", alignItems: "center", gap: 0 }}>
              {[1, 2, 3].map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: step >= s ? RED : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', cursive", fontSize: 18, color: WHITE, letterSpacing: 1, flexShrink: 0, transition: "background 0.3s" }}>{s}</div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: step >= s ? RED : "rgba(255,255,255,0.3)", marginLeft: 8, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, flexShrink: 0 }}>
                    {s === 1 ? "Vous" : s === 2 ? "Voyage" : "Confirmer"}
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 2, background: step > s ? RED : "rgba(255,255,255,0.1)", margin: "0 16px", transition: "background 0.3s" }} />}
                </div>
              ))}
            </div>

            <div style={{ padding: "40px" }}>
              {step === 1 && (
                <div style={{ display: "grid", gap: 20 }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 26, color: BLACK, letterSpacing: 2, marginBottom: 4 }}>VOS INFORMATIONS</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: 2, color: "#999", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Nom complet *</label>
                      <input value={form.nom} onChange={e => set("nom", e.target.value)} placeholder="Votre nom" style={inp()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = "#E0DBD4"} />
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: 2, color: "#999", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Email *</label>
                      <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="email@exemple.com" style={inp()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = "#E0DBD4"} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: 2, color: "#999", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Téléphone / WhatsApp *</label>
                    <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+243 ..." style={inp()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = "#E0DBD4"} />
                  </div>
                  <button onClick={() => valid1 && setStep(2)} style={{ background: valid1 ? RED : "#ccc", border: "none", color: WHITE, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 1, textTransform: "uppercase", padding: "16px", borderRadius: 4, cursor: valid1 ? "pointer" : "not-allowed", marginTop: 8, transition: "background 0.2s" }}>
                    Continuer →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: "grid", gap: 20 }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 26, color: BLACK, letterSpacing: 2, marginBottom: 4 }}>DÉTAILS DU VOYAGE</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: 2, color: "#999", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Service *</label>
                      <select value={form.service} onChange={e => set("service", e.target.value)} style={inp({ cursor: "pointer" })} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = "#E0DBD4"}>
                        <option value="">Choisir un service</option>
                        {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: 2, color: "#999", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Destination *</label>
                      <select value={form.destination} onChange={e => set("destination", e.target.value)} style={inp({ cursor: "pointer" })} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = "#E0DBD4"}>
                        <option value="">Choisir une destination</option>
                        {DESTINATIONS.map(d => <option key={d.name} value={d.name}>{d.flag} {d.name}</option>)}
                        <option value="Autre">Autre destination</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: 2, color: "#999", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Date souhaitée *</label>
                      <input type="date" value={form.date} onChange={e => set("date", e.target.value)} style={inp()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = "#E0DBD4"} />
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: 2, color: "#999", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Nombre de voyageurs</label>
                      <select value={form.passengers} onChange={e => set("passengers", e.target.value)} style={inp({ cursor: "pointer" })} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = "#E0DBD4"}>
                        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} personne{n > 1 ? "s" : ""}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: 2, color: "#999", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Message / Précisions</label>
                    <textarea value={form.message} onChange={e => set("message", e.target.value)} rows={4} placeholder="Dites-nous en plus sur votre voyage..." style={inp({ resize: "vertical" })} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = "#E0DBD4"} />
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={() => setStep(1)} style={{ background: "transparent", border: `2px solid ${BLACK}`, color: BLACK, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, padding: "14px 24px", borderRadius: 4, cursor: "pointer" }}>← Retour</button>
                    <button onClick={() => valid2 && setStep(3)} style={{ flex: 1, background: valid2 ? RED : "#ccc", border: "none", color: WHITE, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 1, textTransform: "uppercase", padding: "14px", borderRadius: 4, cursor: valid2 ? "pointer" : "not-allowed" }}>
                      Continuer →
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 26, color: BLACK, letterSpacing: 2, marginBottom: 20 }}>CONFIRMER VOTRE DEMANDE</h3>
                  <div style={{ background: CREAM, borderRadius: 6, padding: "28px", marginBottom: 24, borderLeft: `4px solid ${RED}` }}>
                    {[["Nom", form.nom], ["Email", form.email], ["Téléphone", form.phone], ["Service", form.service], ["Destination", form.destination], ["Date", form.date], ["Voyageurs", form.passengers + " personne(s)"]].map(([l, v]) => (
                      <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "'Nunito', sans-serif", fontSize: 14 }}>
                        <span style={{ color: "#999", fontWeight: 700 }}>{l}</span>
                        <span style={{ color: BLACK, fontWeight: 800 }}>{v}</span>
                      </div>
                    ))}
                    {form.message && <div style={{ marginTop: 12, fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#666", fontStyle: "italic" }}>"{form.message}"</div>}
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={() => setStep(2)} style={{ background: "transparent", border: `2px solid ${BLACK}`, color: BLACK, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, padding: "14px 24px", borderRadius: 4, cursor: "pointer" }}>← Retour</button>
                    <button onClick={handleSubmit} className="btn-red" style={{ flex: 1, background: RED, border: "none", color: WHITE, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 1, textTransform: "uppercase", padding: "14px", borderRadius: 4, cursor: "pointer" }}>
                      ✈️ Envoyer ma Réservation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const [ref, vis] = useReveal();
  return (
    <section ref={ref} className="section-pad" style={{ background: BLACK, padding: "96px 6vw" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64, ...fadeUp(vis) }}>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, letterSpacing: 4, color: RED, textTransform: "uppercase", fontWeight: 800 }}>Nous joindre</span>
          <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(42px, 6vw, 72px)", color: WHITE, letterSpacing: 3, marginTop: 6 }}>CONTACT</h2>
        </div>

        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
          <div style={{ ...fadeLeft(vis, 0.2) }}>
            <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, color: WHITE, letterSpacing: 2, marginBottom: 32 }}>JUDITH T. — KAROO TRAVEL</h3>
            {[["📍", "Adresse", "81 Avenue Kasenga, C/Manika,\nQ/Mutoshi – Kolwezi, RDC"],
              ["📞", "Téléphones", "+27 78 734 2606\n+243 810 147 467"],
              ["✉️", "Email", "info@karooafrica.com"],
              ["🌐", "Site Web", "www.karooafrica.com"]
            ].map(([ico, lbl, val]) => (
              <div key={lbl} style={{ display: "flex", gap: 18, marginBottom: 28 }}>
                <span style={{ fontSize: 22, marginTop: 2 }}>{ico}</span>
                <div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: RED, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 6 }}>{lbl}</div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, whiteSpace: "pre-line" }}>{val}</div>
                </div>
              </div>
            ))}
            <a href={WA_LINK} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#25D366", color: WHITE, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 1, textTransform: "uppercase", padding: "14px 30px", borderRadius: 3, textDecoration: "none", marginTop: 8 }}>
              <span style={{ fontSize: 20 }}>💬</span> Écrire sur WhatsApp
            </a>
          </div>

          <div style={{ ...fadeRight(vis, 0.2), background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "40px", borderTop: `4px solid ${RED}` }}>
            <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 26, color: WHITE, letterSpacing: 2, marginBottom: 24 }}>ENVOYER UN MESSAGE</h3>
            <div style={{ display: "grid", gap: 16 }}>
              {[["Votre nom", "text"], ["Email", "email"], ["Message"]].map((f, i) => (
                i < 2
                  ? <input key={f[0]} type={f[1]} placeholder={f[0]} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "13px 16px", color: WHITE, fontFamily: "'Nunito', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                  : <textarea key="msg" placeholder="Votre message..." rows={5} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "13px 16px", color: WHITE, fontFamily: "'Nunito', sans-serif", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              ))}
              <button className="btn-red" style={{ background: RED, border: "none", color: WHITE, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", padding: "15px", borderRadius: 4, cursor: "pointer" }}>
                Envoyer le message ✈️
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── VOYAGES ORGANISÉS ───────────────────────────────────────────────────────
const TRIPS = [
  {
    id: 1,
    name: "Kyubo",
    subtitle: "Chutes & Rivière",
    dates: "21–22 Décembre",
    duration: "2 Jours – 1 Nuit",
    priceSingle: 149,
    priceCouple: 249,
    status: "upcoming",
    img: "https://i.imgur.com/GvKaYRL.png",
    description: "Un weekend inoubliable aux chutes de Kyubo — hébergement au bord de la rivière, activités sportives et nature sauvage au rendez-vous.",
    included: ["Transport aller-retour", "Hébergement au bord de la rivière", "Petit-déjeuner + Déjeuner", "Randonnée & Volley-ball", "Football & Jeux de société", "Guide touristique professionnel"],
    color: "#4A7C59",
  },
  {
    id: 2,
    name: "Safari Congo",
    subtitle: "Forêt & Faune",
    dates: "À venir",
    duration: "3 Jours – 2 Nuits",
    priceSingle: 299,
    priceCouple: 499,
    status: "soon",
    img: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80",
    description: "Plongez au cœur de la forêt congolaise. Observation de la faune, nuits sous les étoiles et rencontres avec les communautés locales.",
    included: ["Transport 4x4", "Campement en forêt", "Tous les repas", "Guide naturaliste", "Observation faune & flore", "Photos souvenirs"],
    color: "#2C5F3F",
  },
];

// ─── VOYAGES PAGE (Full dedicated page with filters, calendar, gallery) ───────
const GALLERY_PHOTOS = [
  "https://images.unsplash.com/photo-1455218873509-8097305ee378?w=600&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80",
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80",
  "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=600&q=80",
];

function TripCard({ trip, setPage, vis, delay }) {
  return (
    <div className="card-hover" style={{
      background: WHITE, borderRadius: 8, overflow: "hidden",
      border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      ...fadeUp(vis, delay),
    }}>
      <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
        <img src={trip.img} alt={trip.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.05) 60%)" }} />
        <div style={{ position: "absolute", top: 14, left: 14, background: trip.status === "upcoming" ? RED : trip.status === "past" ? "rgba(0,0,0,0.7)" : "rgba(30,100,60,0.85)", backdropFilter: "blur(6px)", color: WHITE, fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", padding: "5px 12px", borderRadius: 20 }}>
          {trip.status === "upcoming" ? "🔥 À venir" : trip.status === "past" ? "✅ Passé" : "📅 Bientôt"}
        </div>
        <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)", color: WHITE, fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 20 }}>
          📅 {trip.dates}
        </div>
        <div style={{ position: "absolute", bottom: 14, left: 18 }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 30, color: WHITE, letterSpacing: 2, lineHeight: 1 }}>{trip.name}</div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{trip.subtitle} · {trip.duration}</div>
        </div>
      </div>
      <div style={{ padding: "20px 22px 24px" }}>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#666", lineHeight: 1.75, marginBottom: 16 }}>{trip.description}</p>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: 2, color: RED, textTransform: "uppercase", marginBottom: 10 }}>✅ Inclus</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 10px" }}>
            {trip.included.map(item => (
              <div key={item} style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#555", display: "flex", alignItems: "flex-start", gap: 5 }}>
                <span style={{ color: trip.color, fontWeight: 900, flexShrink: 0 }}>›</span> {item}
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: CREAM, borderRadius: 6, padding: "14px 18px", marginBottom: 16, display: "flex", justifyContent: "space-around", borderTop: `3px solid ${trip.color}` }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, color: trip.color, letterSpacing: 1, lineHeight: 1 }}>${trip.priceSingle}</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, color: "#999", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Singleton</div>
          </div>
          <div style={{ width: 1, background: "rgba(0,0,0,0.1)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, color: trip.color, letterSpacing: 1, lineHeight: 1 }}>${trip.priceCouple}</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, color: "#999", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Couple</div>
          </div>
        </div>
        {trip.status !== "past" ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setPage("Réservation")} style={{ flex: 1, background: RED, border: "none", color: WHITE, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", padding: "12px", borderRadius: 4, cursor: "pointer" }}>Réserver ✈️</button>
            <a href={WA_LINK} target="_blank" rel="noreferrer" style={{ background: "#25D366", color: WHITE, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, padding: "12px 14px", borderRadius: 4, textDecoration: "none", display: "flex", alignItems: "center" }}>💬</a>
          </div>
        ) : (
          <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 4, padding: "12px", textAlign: "center", fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "#999", fontWeight: 700 }}>
            ✅ Voyage terminé — Galerie disponible ci-dessous
          </div>
        )}
      </div>
    </div>
  );
}

function VoyagesPage({ setPage }) {
  const [ref, vis] = useReveal();
  const [filter, setFilter] = useState("tous");
  const [lightbox, setLightbox] = useState(null);

  const allTrips = [
    ...TRIPS,

    { id: 5, name: "Kolwezi City Tour", subtitle: "Culture Locale", dates: "Août 2025", duration: "1 Jour", priceSingle: 49, priceCouple: 79, status: "past", img: "https://i.imgur.com/mFdPulO.png", description: "Découverte de Kolwezi et de ses environs avec un guide local passionné.", included: ["Transport", "Déjeuner inclus", "Guide local", "Visite mines", "Marché local", "Photos"], color: "#7D3C98" },
  ];

  const filtered = filter === "tous" ? allTrips : allTrips.filter(t => t.status === filter);

  // Build calendar — group upcoming trips by month
  const upcomingTrips = allTrips.filter(t => t.status === "upcoming" || t.status === "soon");
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const calendarEvents = { 11: [{ name: "Kyubo", color: "#4A7C59" }] }; // Dec = index 11

  return (
    <div style={{ background: WHITE, minHeight: "100vh" }}>
      {/* Hero banner */}
      <div style={{ position: "relative", height: 340, overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80" alt="Voyages" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,10,10,0.85), rgba(217,59,27,0.3))" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 6vw" }}>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, letterSpacing: 4, color: RED, textTransform: "uppercase", fontWeight: 800, marginBottom: 10 }}>Karoo Organise</span>
          <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(48px, 8vw, 90px)", color: WHITE, letterSpacing: 4, lineHeight: 0.95, marginBottom: 16 }}>VOYAGES<br /><span style={{ color: RED }}>ORGANISÉS</span></h1>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.75)", maxWidth: 480 }}>Des excursions tout inclus depuis Kolwezi — zéro stress, 100% aventure.</p>
        </div>
      </div>

      <div ref={ref} className="section-pad" style={{ padding: "72px 6vw" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* ── Filter bar ── */}
          <div style={{ display: "flex", gap: 10, marginBottom: 48, flexWrap: "wrap", ...fadeUp(vis) }}>
            {[["tous", "🗂 Tous"], ["upcoming", "🔥 À venir"], ["soon", "📅 Bientôt"], ["past", "✅ Passés"]].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)} style={{
                background: filter === val ? RED : "transparent",
                border: `2px solid ${filter === val ? RED : "rgba(0,0,0,0.15)"}`,
                color: filter === val ? WHITE : "#555",
                fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13,
                letterSpacing: 1, padding: "10px 22px", borderRadius: 24, cursor: "pointer",
                transition: "all 0.2s",
              }}>{label}</button>
            ))}
            <div style={{ marginLeft: "auto", fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#999", display: "flex", alignItems: "center" }}>
              {filtered.length} voyage{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* ── Trip cards grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 28, marginBottom: 80 }}>
            {filtered.map((trip, i) => <TripCard key={trip.id} trip={trip} setPage={setPage} vis={vis} delay={i * 0.1} />)}
          </div>

          {/* ── Calendar ── */}
          <div style={{ marginBottom: 80, ...fadeUp(vis, 0.2) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <div style={{ width: 5, height: 36, background: RED, borderRadius: 3 }} />
              <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(28px, 4vw, 44px)", color: BLACK, letterSpacing: 3 }}>CALENDRIER 2025–2026</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 10 }}>
              {months.map((m, idx) => {
                const events = calendarEvents[idx] || [];
                const hasEvent = events.length > 0;
                return (
                  <div key={m} style={{
                    background: hasEvent ? BLACK : CREAM,
                    border: `2px solid ${hasEvent ? RED : "rgba(0,0,0,0.08)"}`,
                    borderRadius: 8, padding: "14px 10px", textAlign: "center",
                    transition: "all 0.2s", cursor: hasEvent ? "pointer" : "default",
                  }}>
                    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 20, color: hasEvent ? RED : "#aaa", letterSpacing: 1 }}>{m}</div>
                    {hasEvent ? events.map(e => (
                      <div key={e.name} style={{ marginTop: 6, background: e.color, borderRadius: 4, padding: "4px 6px" }}>
                        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, color: WHITE, fontWeight: 800, letterSpacing: 0.5 }}>{e.name}</div>
                      </div>
                    )) : (
                      <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, color: "#ccc", marginTop: 6 }}>—</div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 16, fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#999" }}>
              * Le calendrier se met à jour automatiquement selon les voyages planifiés. Contactez-nous pour inscrire votre groupe sur une date spécifique.
            </div>
          </div>

          {/* ── Photo Gallery ── */}
          <div style={{ ...fadeUp(vis, 0.3) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <div style={{ width: 5, height: 36, background: RED, borderRadius: 3 }} />
              <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(28px, 4vw, 44px)", color: BLACK, letterSpacing: 3 }}>GALERIE PHOTOS</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {GALLERY_PHOTOS.map((src, i) => (
                <div key={i} onClick={() => setLightbox(i)} style={{ position: "relative", paddingBottom: i % 3 === 0 ? "75%" : "60%", overflow: "hidden", borderRadius: 6, cursor: "pointer", border: "2px solid transparent", transition: "border-color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = RED; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; }}
                >
                  <img src={src} alt={`Galerie ${i + 1}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.07)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.3s", display: "flex", alignItems: "center", justifyContent: "center" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(217,59,27,0.25)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0)"; }}
                  >
                    <span style={{ fontSize: 28, opacity: 0, transition: "opacity 0.3s" }}>🔍</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group CTA */}
          <div style={{ marginTop: 64, background: BLACK, borderRadius: 8, padding: "36px 44px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24, borderLeft: `6px solid ${RED}`, ...fadeUp(vis, 0.5) }}>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, color: WHITE, letterSpacing: 3, marginBottom: 6 }}>VOUS AVEZ UN GROUPE ? 👥</div>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", maxWidth: 480, lineHeight: 1.7 }}>Entreprises, familles, amis — Karoo organise des excursions privées sur mesure. Contactez-nous pour un devis gratuit.</p>
            </div>
            <a href={WA_LINK} target="_blank" rel="noreferrer" style={{ background: RED, color: WHITE, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", padding: "14px 28px", borderRadius: 3, textDecoration: "none", whiteSpace: "nowrap" }}>
              Demander un devis →
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <button onClick={() => setLightbox(l => (l - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length)} style={{ position: "absolute", left: 20, background: "rgba(255,255,255,0.1)", border: "none", color: WHITE, fontSize: 28, width: 50, height: 50, borderRadius: "50%", cursor: "pointer" }} onClick={e => { e.stopPropagation(); setLightbox(l => (l - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length); }}>‹</button>
          <img src={GALLERY_PHOTOS[lightbox]} alt="Photo" style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 6 }} onClick={e => e.stopPropagation()} />
          <button style={{ position: "absolute", right: 20, background: "rgba(255,255,255,0.1)", border: "none", color: WHITE, fontSize: 28, width: 50, height: 50, borderRadius: "50%", cursor: "pointer" }} onClick={e => { e.stopPropagation(); setLightbox(l => (l + 1) % GALLERY_PHOTOS.length); }}>›</button>
          <button style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.1)", border: "none", color: WHITE, fontSize: 20, width: 44, height: 44, borderRadius: "50%", cursor: "pointer" }} onClick={() => setLightbox(null)}>✕</button>
        </div>
      )}
    </div>
  );
}

// Keep old VoyagesOrganises for homepage preview (shows first 3 cards only)
function VoyagesOrganises({ setPage }) {
  const [ref, vis] = useReveal();
  return (
    <section ref={ref} className="section-pad" style={{ background: CREAM, padding: "96px 6vw" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 48, flexWrap: "wrap", ...fadeUp(vis) }}>
          <div>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, letterSpacing: 4, color: RED, textTransform: "uppercase", fontWeight: 800 }}>Partez avec nous</span>
            <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(42px, 6vw, 72px)", color: BLACK, letterSpacing: 3, marginTop: 6 }}>VOYAGES ORGANISÉS</h2>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: "#777", marginTop: 8, maxWidth: 520 }}>Des excursions tout inclus depuis Kolwezi — zéro stress, 100% aventure.</p>
          </div>
          <div style={{ flex: 1, height: 3, background: `linear-gradient(to right, ${RED}, transparent)`, minWidth: 60 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 28, marginBottom: 40 }}>
          {TRIPS.map((trip, i) => <TripCard key={trip.id} trip={trip} setPage={setPage} vis={vis} delay={i * 0.12} />)}
        </div>
        <div style={{ textAlign: "center", ...fadeUp(vis, 0.4) }}>
          <button onClick={() => setPage("Voyages")} style={{ background: "transparent", border: `2px solid ${RED}`, color: RED, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 1, textTransform: "uppercase", padding: "14px 40px", borderRadius: 4, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = RED; e.currentTarget.style.color = WHITE; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = RED; }}
          >Voir tous les voyages + Galerie →</button>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  const links = ["Accueil", "Services", "Destinations", "Voyages", "Témoignages", "À Propos", "Contact", "Réservation"];
  return (
    <footer style={{ background: "#050505", borderTop: `3px solid ${RED}`, padding: "40px 6vw" }}>
      <div className="footer-inner" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, letterSpacing: 4, color: WHITE }}>KAR<span style={{ color: RED }}>OO</span></div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 9, letterSpacing: 4, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>TRAVEL AGENCY — KOLWEZI, RDC</div>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          {links.map(l => (
            <button key={l} onClick={() => setPage(l)} style={{ background: "none", border: "none", fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = RED}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}
            >{l}</button>
          ))}
        </div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "right" }}>
          © 2026 Karoo Travel Agency<br />Dream. Live. Fly. ✈️
        </div>
      </div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("Accueil");
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  return (
    <div style={{ background: WHITE, minHeight: "100vh" }}>
      <Nav page={page} setPage={setPage} />
      <main>
        {page === "Accueil" && <>
          <Hero setPage={setPage} />
          <Services />
          <Stats />
          <Destinations setPage={setPage} />
          <VoyagesOrganises setPage={setPage} />
          <Testimonials />
          <About />
        </>}
        {page === "Services" && <><div style={{ height: 80 }} /><Services /></>}
        {page === "Destinations" && <><div style={{ height: 80 }} /><Destinations setPage={setPage} /></>}
        {page === "Voyages" && <><div style={{ height: 80 }} /><VoyagesPage setPage={setPage} /></>}
        {page === "Témoignages" && <><div style={{ height: 80 }} /><Testimonials /></>}
        {page === "À Propos" && <><div style={{ height: 80 }} /><About /></>}
        {page === "Réservation" && <><div style={{ height: 80 }} /><Reservation /></>}
        {page === "Contact" && <><div style={{ height: 80 }} /><Contact /></>}
      </main>
      <Contact />
      <Footer setPage={setPage} />
    </div>
  );
}
