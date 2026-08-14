import React, { useState } from "react";
import { getImageUrl } from "../../data/civicImages";

export interface CivicImgProps {
  emoji?: string;
  src?: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  rounded?: string;
  fit?: "cover" | "contain" | "fill";
  fallbackEmoji?: boolean;
}

export const CivicImg: React.FC<CivicImgProps> = ({
  emoji,
  src,
  alt = "",
  className = "",
  width,
  height,
  rounded = "rounded-xl",
  fit = "cover",
  fallbackEmoji = true,
}) => {
  const [failed, setFailed] = useState(false);
  const seedKey = emoji ?? src ?? "civic";
  const finalSrc = failed
    ? `https://picsum.photos/seed/${encodeURIComponent(seedKey)}/${width ?? 600}/${height ?? 400}.jpg`
    : src ?? (emoji ? getImageUrl(emoji, width ?? 600, height ?? 400) : undefined);
  const finalClass = `${rounded} object-${fit} ${className}`;

  if (!finalSrc) {
    return fallbackEmoji && emoji ? (
      <span className={`${rounded} inline-flex items-center justify-center ${className}`} style={{ fontSize: width ? `${width * 0.4}px` : "2rem" }}>{emoji}</span>
    ) : null;
  }

  return <img src={finalSrc} alt={alt} className={finalClass} loading="lazy" onError={() => setFailed(true)} />;
};

export const CivicAvatar: React.FC<{
  name?: string;
  seed?: string;
  size?: number;
  className?: string;
  alt?: string;
}> = ({ name, seed, size = 48, className = "", alt }) => {
  const src = name
    ? `https://picsum.photos/seed/avatar-${encodeURIComponent(name)}/${size}/${size}.jpg`
    : seed
      ? `https://picsum.photos/seed/avatar-${encodeURIComponent(seed)}/${size}/${size}.jpg`
      : undefined;
  return <img src={src} alt={alt ?? name ?? "avatar"} className={`rounded-full object-cover ${className}`} loading="lazy" />;
};

export const CitizenAvatar: React.FC<{
  seed: string;
  size?: number;
  className?: string;
  alt?: string;
}> = ({ seed, size = 48, className = "", alt }) => {
  const src = `https://picsum.photos/seed/citizen-${encodeURIComponent(seed)}/${size}/${size}.jpg`;
  return <img src={src} alt={alt ?? "citizen"} className={`rounded-full object-cover ${className}`} loading="lazy" />;
};
