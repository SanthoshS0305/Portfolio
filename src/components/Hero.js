import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-header">
        <h1>Hi, I'm <span className="highlight">Santhosh Senthil</span></h1>
        <p>Computer Science Student Specializing in Data Science and Machine Learning</p>
      </div>
      <div className="hero-content">
        <div className="hero-image">
          <img src="/profile.jpg" alt="Santhosh Senthil" className="hero-profile-image" />
        </div>
        <div className="hero-about">
          <p>A passionate Computer Science Student double-majoring in Applied Math and Statistics and Minoring in Writing and Rhetoric at Stony Brook University in New York.</p>
          <br />
          <p>I am passionate about computers and people. That is why I am Vice President of the Game Development and Design Club at Stony Brook University and the Public Relations Officer of the Stony Brook Computing Society.</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
