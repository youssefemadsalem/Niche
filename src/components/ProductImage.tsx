"use client";

import { useState } from "react";

const FALLBACK = "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80";

export default function ProductImage({ src, alt }: { src?: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState<string>(src || FALLBACK);

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(FALLBACK)}
      className="w-full h-full object-cover"
    />
  );
}
