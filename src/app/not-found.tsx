import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-xs tracking-widest uppercase font-bold text-[#C5A059] mb-4">404</p>
      <h1 className="text-5xl font-bold text-[#1A1A1A] mb-4" style={{ fontFamily: "var(--font-headline)" }}>
        Page Not Found
      </h1>
      <p className="text-gray-400 text-sm mb-10 max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-[#1A1A1A] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/discover"
          className="border border-[#1A1A1A] text-[#1A1A1A] px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-colors"
        >
          Shop All
        </Link>
      </div>
    </div>
  );
}
