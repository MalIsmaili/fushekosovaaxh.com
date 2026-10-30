import Image from "next/image";

// The crest is always at the top of the page, so load it eagerly rather than lazily.
// It sits next to the "FushëkosovaBB" wordmark, so the alt text is left empty.
export function Logo() {
  return <Image src="/logo.png" alt="" width={36} height={49} loading="eager" className="object-contain" />;
}
