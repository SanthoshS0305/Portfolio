import React, { useEffect, useRef, useState } from 'react';
import carouselData from '../data/carouselData.json';

const VerticalCarousel = () => {
  const trackRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const posRef = useRef(0);
  const rafRef = useRef(null);
  const popupRef = useRef(null);

  const doubled = [...carouselData, ...carouselData];
  const shouldAnimate = !isPaused && hoveredItem === null;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = 0.35;

    const animate = () => {
      if (shouldAnimate) {
        posRef.current += speed;
        const half = track.scrollHeight / 2;
        if (posRef.current >= half) {
          posRef.current = 0;
        }
        track.style.transform = `translateY(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [shouldAnimate]);

  const handleMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div
        className="carousel-viewport"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => { setIsPaused(false); setHoveredItem(null); }}
        onMouseMove={handleMouseMove}
      >
        <div className="carousel-track" ref={trackRef}>
          {doubled.map((img, i) => (
            <div
              className="carousel-item"
              key={i}
              onMouseEnter={() => setHoveredItem(img)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <img src={img.src} alt={img.alt} />
            </div>
          ))}
        </div>
      </div>

      {hoveredItem && (() => {
        const POPUP_WIDTH = 420;
        const OFFSET = 16;
        const MARGIN = 8;
        const popupHeight = popupRef.current ? popupRef.current.offsetHeight : 400;
        const left = Math.min(cursorPos.x + OFFSET, window.innerWidth - POPUP_WIDTH - MARGIN);
        const top = Math.min(cursorPos.y + OFFSET, window.innerHeight - popupHeight - MARGIN);
        return (
        <div
          ref={popupRef}
          className="carousel-popup"
          style={{
            position: 'fixed',
            top,
            left,
            pointerEvents: 'none',
          }}
        >
          <div className="carousel-popup-thumbnail">
            <img src={hoveredItem.src} alt={hoveredItem.alt} />
          </div>
          <div className="carousel-popup-header">
            <h3 className="carousel-popup-title">{hoveredItem.title}</h3>
          </div>
          <div className="carousel-popup-body">
            <p className="carousel-popup-description">{hoveredItem.description}</p>
          </div>
        </div>
        );
      })()}
    </>
  );
};

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-image">
          <img src="/profile.jpg" alt="Santhosh Senthil" className="hero-profile-image" />
        </div>
        <div className="hero-header">
          <h1>Hi, I'm <span className="highlight">Santhosh Senthil</span></h1>
          <p>Computer Science Student, Professional Content Creator, and Writer</p>
        </div>
        <div className="hero-about">
          <p>
            I'm a Computer Science Student Minoring in Writing and Rhetoric at Stony Brook University in New York. I'm also a professional content creator and writer.
          </p>
          <p>
            I am passionate about computers and people. That is why I am Vice President of the Stony Brook University Game Development and Design Club and the Public Relations Officer of the Stony Brook Computing Society.
          </p>
          <p>
            As an avid artist, I love creating social media content for various organizations. I am also an avid writer, and you can check out my writing portfolio. You can also check out my projects if you're interested in my work.
          </p>
        </div>
      </div>
      <div className="hero-right">
        <VerticalCarousel />
      </div>
    </section>
  );
};

export default Hero;
