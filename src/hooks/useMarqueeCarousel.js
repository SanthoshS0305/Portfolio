import { useCallback, useEffect, useRef, useState } from 'react';

const SPEED = 0.5;

const applyTransform = (track, axis, pos) => {
  track.style.transform = axis === 'x' ? `translateX(-${pos}px)` : `translateY(-${pos}px)`;
};

export const useMarqueeCarousel = ({ axis, items, autoplay = true }) => {
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const rafRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const doubled = [...items, ...items];
  const shouldAnimate = autoplay && !isPaused;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const animate = () => {
      if (shouldAnimate) {
        posRef.current += SPEED;
        const extent = axis === 'x' ? track.scrollWidth : track.scrollHeight;
        const half = extent / 2;
        if (posRef.current >= half) posRef.current = 0;
        applyTransform(track, axis, posRef.current);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [shouldAnimate, axis]);

  const nudge = useCallback((direction) => {
    const track = trackRef.current;
    if (!track || !track.children.length) return;
    const firstChild = track.children[0];
    const itemSize = axis === 'x' ? firstChild.offsetWidth : firstChild.offsetHeight;
    const gapProp = axis === 'x' ? 'columnGap' : 'rowGap';
    const gap = parseFloat(getComputedStyle(track)[gapProp]) || 0;
    const step = itemSize + gap;
    const extent = axis === 'x' ? track.scrollWidth : track.scrollHeight;
    const half = extent / 2;
    const delta = direction === 'next' ? step : -step;
    posRef.current = ((posRef.current + delta) % half + half) % half;
    applyTransform(track, axis, posRef.current);
  }, [axis]);

  const containerHandlers = {
    onMouseEnter: () => setIsPaused(true),
    onMouseLeave: () => setIsPaused(false),
  };

  return { trackRef, doubled, containerHandlers, nudge };
};
