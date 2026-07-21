import React, { useEffect, useRef, useState } from 'react';
import { readClient, queries } from '../cms/sanityClient';
import carouselFallback from '../data/carouselData.json';
import { useMarqueeCarousel } from '../hooks/useMarqueeCarousel';

const DEFAULT_HERO = {
  name: 'Santhosh Senthil',
  tagline: 'Computer Science Student, Professional Content Creator, and Writer',
  bio: [
    "I'm a Computer Science Student Minoring in Writing and Rhetoric at Stony Brook University in New York. I'm also a professional content creator and writer. I am currently an **Assistant Digital Marketing Coordinator for Thump Local**, and a **research assistant for PoliTech, under Professor Robert Kelly**.",
    "I am passionate about computers and people. That is why I am a **Peer Mentor** for the **College of Engineering and Applied Sciences' Peer Mentoring Program**. I was also the **Vice President of the SBU Game Development and Design Club** and the **Public Relations Officer for the Stony Brook Computing Society**.",
    "As an avid artist, I love creating [social media content](scroll:content) for various organizations. I am also an avid writer, and you can check out my [writing portfolio](scroll:writing). You can also check out my [coding projects](scroll:projects) if you're interested in my work.",
  ],
  profileImageUrl: '/profile.jpg',
};

// Parse [text](scroll:section) tokens into React nodes
const parseBio = (text) => {
  const parts = [];
  const regex = /\[([^\]]+)\]\(scroll:([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    parts.push({ type: 'scrollLink', text: match[1], target: match[2] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push({ type: 'text', content: text.slice(lastIndex) });
  return parts;
};

const renderBioParagraph = (text) => {
  if (!text) return null;
  const parts = parseBio(text);
  return parts.map((part, i) => {
    if (part.type === 'scrollLink') {
      return (
        <button
          key={i}
          className="hero-scroll-link"
          onClick={() => document.getElementById(part.target)?.scrollIntoView({ behavior: 'smooth' })}
        >
          {part.text}
        </button>
      );
    }
    // Render **bold** inline
    const segments = part.content.split(/\*\*([^*]+)\*\*/g);
    return segments.map((seg, j) =>
      j % 2 === 1 ? <strong key={`${i}-${j}`}>{seg}</strong> : seg
    );
  });
};

const HorizontalScroll = ({ items }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);

  const { trackRef, doubled, containerHandlers, nudge } = useMarqueeCarousel({ axis: 'x', items });

  const handleMouseMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });

  return (
    <>
      <div
        className="carousel-viewport"
        onMouseEnter={containerHandlers.onMouseEnter}
        onMouseLeave={() => { containerHandlers.onMouseLeave(); setHoveredItem(null); }}
        onMouseMove={handleMouseMove}
      >
        <button type="button" className="carousel-arrow carousel-arrow-left" aria-label="Previous" onClick={() => nudge('prev')}>‹</button>
        <div className="carousel-track" ref={trackRef}>
          {doubled.map((img, i) => (
            <div
              className="carousel-item"
              key={i}
              onMouseEnter={() => setHoveredItem(img)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <img src={img.src || img.srcUrl} alt={img.alt || img.title} />
            </div>
          ))}
        </div>
        <button type="button" className="carousel-arrow carousel-arrow-right" aria-label="Next" onClick={() => nudge('next')}>›</button>
      </div>

      {hoveredItem && (() => {
        const POPUP_WIDTH = 420;
        const OFFSET = 16;
        const MARGIN = 8;
        const popupHeight = popupRef.current ? popupRef.current.offsetHeight : 400;
        const left = Math.min(cursorPos.x + OFFSET, window.innerWidth - POPUP_WIDTH - MARGIN);
        const top = Math.min(cursorPos.y + OFFSET, window.innerHeight - popupHeight - MARGIN);
        return (
          <div ref={popupRef} className="carousel-popup"
            style={{ position: 'fixed', top, left, pointerEvents: 'none' }}>
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

const Hero = ({ heroData }) => {
  const [carouselItems, setCarouselItems] = useState(carouselFallback);

  useEffect(() => {
    readClient.fetch(queries.carousel)
      .then((items) => { if (items?.length) setCarouselItems(items); })
      .catch(() => {});
  }, []);

  const hero = heroData || DEFAULT_HERO;
  const imageUrl = hero.profileImageUrl || '/profile.jpg';
  const bio = hero.bio?.length ? hero.bio : DEFAULT_HERO.bio;

  return (
    <section className="hero">
      <div className="hero-bio">
        <div className="hero-image">
          <img src={imageUrl} alt={hero.name} className="hero-profile-image" />
        </div>
        <div className="hero-bio-text">
          <div className="hero-header">
            <h1>Hi, I'm <span className="highlight">{hero.name}</span></h1>
            <p>{hero.tagline}</p>
          </div>
          <div className="hero-about">
            <p style={{ whiteSpace: 'pre-line' }}>
              {renderBioParagraph(bio.join('\n\n'))}
            </p>
          </div>
        </div>
      </div>
      <HorizontalScroll items={carouselItems} />
    </section>
  );
};

export default Hero;
