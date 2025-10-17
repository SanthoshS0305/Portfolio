import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-header">
        <h1>Hi, I'm <span className="highlight">Santhosh Senthil</span></h1>
        <p>Computer Science Student, Professional Content Creator, and Writer</p>
      </div>
      <div className="hero-content">
        <div className="hero-image">
          <img src="/profile.jpg" alt="Santhosh Senthil" className="hero-profile-image" />
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
    </section>
  );
};

export default Hero;
