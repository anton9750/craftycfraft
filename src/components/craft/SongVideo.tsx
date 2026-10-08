import { useEffect, useRef, useState } from "react";
import { VIDEO_FILE, VIDEO_OPACITY, VIDEO_REGION, VIDEO_TRACK } from "@/config/audio";
import { getPlayingTrack, subscribeMusic } from "@/lib/craft/music";

const url = (p: string) => `${import.meta.env.BASE_URL}${p}`.replace(/\/{2,}/g, "/");

/** Video that pops up over part of the starry sky, only while song-05 is playing. */
export function SongVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(getPlayingTrack() === VIDEO_TRACK);
  const [broken, setBroken] = useState(false);

  useEffect(() => subscribeMusic(() => setActive(getPlayingTrack() === VIDEO_TRACK)), []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);

  if (broken) return null;

  return (
    <video
      ref={ref}
      src={url(VIDEO_FILE)}
      muted
      loop
      playsInline
      preload="auto"
      onError={() => setBroken(true)}
      className="pointer-events-none absolute object-cover transition-all duration-700 ease-out"
      style={{
        ...VIDEO_REGION,
        opacity: active ? VIDEO_OPACITY : 0,
        transform: active ? "scale(1)" : "scale(0.85)", // pop-up effect
        WebkitMaskImage: "radial-gradient(ellipse at center, #000 55%, transparent 100%)",
        maskImage: "radial-gradient(ellipse at center, #000 55%, transparent 100%)",
      }}
    />
  );
}
