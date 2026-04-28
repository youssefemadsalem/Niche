import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Navbar from "@/components/layout/Navbar";
import FeaturedProductCard from "@/components/FeaturedProductCard";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const session = await auth();
  await connectDB();
  const products = await Product.find({ isFeatured: true }).limit(8).lean();
  const serialized = JSON.parse(JSON.stringify(products));

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-main)" }}>
      <style>{`
        :root {
          --bg-main: #F7F3EC;
          --gold: #C5A059;
          --dark: #1A1A1A;
        }
        .grain::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 200px 200px;
        }
        .hero-glow { background: radial-gradient(ellipse 80% 60% at 50% 110%, rgba(197,160,89,0.18) 0%, transparent 70%); }
        .orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .featured-section {
          background: linear-gradient(180deg, #F7F3EC 0%, #EDE4D3 30%, #F2EAD8 70%, #F7F3EC 100%);
          position: relative; overflow: hidden;
        }
        .featured-section::before {
          content: ''; position: absolute; top: -200px; left: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(197,160,89,0.10) 0%, transparent 70%);
          pointer-events: none;
        }
        .featured-section::after {
          content: ''; position: absolute; bottom: -150px; right: -150px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(197,160,89,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-text-shadow { text-shadow: 0 2px 40px rgba(0,0,0,0.4); }
        .values-card {
          background: rgba(255,255,255,0.6); backdrop-filter: blur(12px);
          border: 1px solid rgba(197,160,89,0.2); transition: all 0.3s ease;
        }
        .values-card:hover {
          background: rgba(255,255,255,0.85); transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(197,160,89,0.12);
        }
        .marquee-track {
          display: flex; gap: 3rem;
          animation: marquee 22s linear infinite; white-space: nowrap;
        }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .hero-badge {
          background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
        }
      `}</style>

      <div className="grain">
        <Navbar session={session} />

        {/* ── Hero ───────────────────────────────────── */}
        <section className="relative h-[92vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1592947906741-c05764a4da5b?q=80&w=2400"
              alt="Hero Background" fill className="object-cover" priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />
            <div className="hero-glow absolute inset-0" />
          </div>

          <div className="orb" style={{ top:"15%", left:"8%", width:300, height:300, background:"radial-gradient(circle, rgba(197,160,89,0.15) 0%, transparent 70%)" }} />
          <div className="orb" style={{ bottom:"20%", right:"6%", width:250, height:250, background:"radial-gradient(circle, rgba(197,160,89,0.10) 0%, transparent 70%)" }} />

          <div className="relative z-20 text-center text-white px-6 max-w-4xl mx-auto">
            <div className="hero-badge inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
              <p className="text-[11px] uppercase tracking-[0.35em] font-bold">New Collection 2026</p>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-[0.95] hero-text-shadow" style={{ fontFamily:"var(--font-headline)" }}>
              The Scent<br /><span style={{ color:"#E5C580" }}>of Excellence</span>
            </h1>

            <p className="text-white/70 text-sm md:text-base mb-10 max-w-md mx-auto leading-relaxed font-light tracking-wide">
              Curated niche fragrances from master perfumers around the world.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/discover" className="inline-block bg-[#C5A059] text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-lg shadow-[#C5A059]/30">
                Explore Collection
              </Link>
              <Link href="/categories/floral" className="inline-block border border-white/40 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:border-white hover:bg-white/10 transition-all duration-300">
                Browse by Scent
              </Link>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-50">
            <span className="text-white text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
          </div>
        </section>

        {/* ── Marquee strip ──────────────────────────── */}
        <div className="bg-[#1A1A1A] py-4 overflow-hidden border-y border-[#C5A059]/20">
          <div className="marquee-track">
            {["Niche Reserve","Heritage Collection","Voyage Series","Aura Line","Woody Essences","Floral Bouquets","Oriental Classics","Fresh Aquatics",
              "Niche Reserve","Heritage Collection","Voyage Series","Aura Line","Woody Essences","Floral Bouquets","Oriental Classics","Fresh Aquatics"].map((label, i) => (
              <span key={i} className="flex items-center gap-3 text-[#C5A059] text-xs font-black uppercase tracking-[0.2em] shrink-0">
                <span className="text-[#C5A059]/40">✦</span>{label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Featured Products ──────────────────────── */}
        <section className="featured-section py-28 px-6">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#C5A059] mb-3">Curated Selections</p>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-tight" style={{ fontFamily:"var(--font-headline)" }}>
                  Featured<br />Scents
                </h2>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <p className="text-sm text-gray-500 max-w-xs md:text-right leading-relaxed">
                  Hand-picked premium selections from our master curators around the world.
                </p>
                <Link href="/discover" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] border-b-2 border-[#C5A059] pb-1 hover:text-[#C5A059] transition-colors">
                  View All Collection <span>→</span>
                </Link>
              </div>
            </div>

            {serialized.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {serialized.map((product: any, i: number) => (
                  <FeaturedProductCard key={product._id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { name:"Midnight Jasmine", brand:"NICHE RESERVE", notes:"NIGHT-BLOOMING JASMINE · BLACK TEA", price:145, img:"https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80" },
                  { name:"Velvet Rose",       brand:"NICHE RESERVE", notes:"DAMASK ROSE · OUD",                  price:195, img:"https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80" },
                  { name:"Vanilla Bourbon",   brand:"HERITAGE",      notes:"VANILLA BEAN · OAK BARREL",          price:155, img:"https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=600&q=80" },
                  { name:"Santal Dusk",       brand:"AURA",          notes:"SANDALWOOD · CARDAMOM",              price:130, img:"https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80" },
                  { name:"Azure Coast",       brand:"VOYAGE",        notes:"SEA SALT · BERGAMOT",                price:110, img:"https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80" },
                  { name:"Tobacco Leaf",      brand:"AURA",          notes:"TOBACCO LEAF · HONEY",               price:175, img:"https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80" },
                  { name:"Neroli Portofino",  brand:"VOYAGE",        notes:"ORANGE BLOSSOM · LAVENDER",          price:140, img:"https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600&q=80" },
                  { name:"Oud Imperial",      brand:"HERITAGE",      notes:"OUD · AMBER · ROSE",                 price:220, img:"https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80" },
                ].map((p, i) => (
                  <Link key={i} href="/discover" className="group block">
                    <div className="relative aspect-[3/4] mb-5 overflow-hidden bg-white rounded-2xl shadow-md border border-[#E5D5B0]/30 transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">{p.brand}</div>
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <span className="bg-white text-[#1A1A1A] px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">View Details</span>
                      </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C5A059] mb-1">{p.brand}</p>
                    <h3 className="text-base font-bold text-[#1A1A1A] mb-1 group-hover:text-[#C5A059] transition-colors">{p.name}</h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">{p.notes}</p>
                    <p className="text-sm font-bold text-[#1A1A1A]">${p.price}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Brand values ───────────────────────────── */}
        <section className="py-20 px-6" style={{ background:"linear-gradient(135deg,#F0E8D8 0%,#EDE0C8 50%,#F5EEE0 100%)" }}>
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059] mb-12">The NICHE Promise</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon:"◈", title:"Curated Exclusivity", desc:"Every fragrance passes through our expert panel. Only the top 3% make it into the collection." },
                { icon:"◎", title:"Master Perfumers",    desc:"We partner directly with artisan perfumers from Grasse, Tokyo, and New York." },
                { icon:"◇", title:"Luxury Delivery",     desc:"Hand-packed in signature NICHE boxes with complimentary samples on every order." },
              ].map((v) => (
                <div key={v.title} className="values-card rounded-2xl p-8 text-center">
                  <div className="text-4xl text-[#C5A059] mb-5 font-thin">{v.icon}</div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A] mb-3">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ─────────────────────────────── */}
        <section className="relative overflow-hidden py-32 px-6">
          <div className="absolute inset-0 z-0">
            <Image src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2000" alt="CTA Background" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 via-[#1A1A1A]/70 to-[#1A1A1A]/50" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059] mb-4">Limited Edition</p>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily:"var(--font-headline)" }}>
              Discover Your<br />Signature Scent
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-sm">
              Let our curators match you with the perfect scent from over 200 exclusive offerings.
            </p>
            <Link href="/discover" className="inline-block bg-[#C5A059] text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
              Start Exploring
            </Link>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────── */}
        <footer className="bg-[#1A1A1A] text-white py-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily:"var(--font-headline)" }}>NICHE</h3>
              <div className="w-8 h-0.5 bg-[#C5A059] mb-5" />
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                Redefining luxury through curated scents. We bring the world's most unique fragrances to your doorstep.
              </p>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.22em] font-black mb-6 text-[#C5A059]">Shop</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link href="/discover" className="hover:text-white transition-colors">All Perfumes</Link></li>
                <li><Link href="/categories/woody" className="hover:text-white transition-colors">Woody Collection</Link></li>
                <li><Link href="/categories/floral" className="hover:text-white transition-colors">Floral Collection</Link></li>
                <li><Link href="/categories/oriental" className="hover:text-white transition-colors">Oriental Collection</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.22em] font-black mb-6 text-[#C5A059]">Support</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link href="/orders" className="hover:text-white transition-colors">Track Your Order</Link></li>
                <li><Link href="/orders" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                <li><Link href="/auth/register" className="hover:text-white transition-colors">Create an Account</Link></li>
              </ul>
            </div>
          </div>
          <p className="text-center text-xs text-gray-600 mt-12">© 2026 NICHE Premium Marketplace. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
