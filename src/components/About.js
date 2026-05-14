import React, { useEffect, useState } from 'react';
import { readClient, queries } from '../cms/sanityClient';
import { renderSocialIcon } from '../cms/components/IconPicker';

const DEFAULT_SKILLS = [
  { _id: 'def-1', title: 'Programming Languages', skills: ['Java', 'Python', 'JavaScript', 'React JS', 'C'] },
  { _id: 'def-2', title: 'Development', skills: ['Game Development', 'Web Development', 'Machine Learning (Spacy)', 'NLP (Sentence Transformers)', 'Full Stack Development'] },
  { _id: 'def-3', title: 'Tools & Technologies', skills: ['Git and GitHub', 'Discord API', 'Web Audio API', 'Unity and Godot Engine'] },
];

const DEFAULT_SOCIAL = [
  { _id: 's1', label: 'GitHub', url: 'https://github.com/SanthoshS0305', icon: 'github' },
  { _id: 's2', label: 'LinkedIn', url: 'https://www.linkedin.com/in/santhosh-senthil-589164249/', icon: 'linkedin' },
  { _id: 's3', label: 'Instagram', url: 'https://www.instagram.com/s.senthil05/', icon: 'instagram' },
  { _id: 's4', label: 'Substack', url: 'https://dashesnothyphens.substack.com', icon: 'substack' },
];

const DEFAULT_EMAIL = 'santhoshs0305@gmail.com';

const About = () => {
  const [skills, setSkills] = useState(DEFAULT_SKILLS);
  const [social, setSocial] = useState(DEFAULT_SOCIAL);
  const [email, setEmail] = useState(DEFAULT_EMAIL);

  useEffect(() => {
    readClient.fetch(queries.skillCategories)
      .then((res) => { if (res?.length) setSkills(res); })
      .catch(() => {});

    readClient.fetch(queries.socialLinks)
      .then((res) => { if (res?.length) setSocial(res); })
      .catch(() => {});

    readClient.fetch(queries.siteSettings)
      .then((res) => { if (res?.contactEmail) setEmail(res.contactEmail); })
      .catch(() => {});
  }, []);

  const handleMouseMove = (e, element) => {
    const rect = element.getBoundingClientRect();
    element.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    element.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const colCount = skills.length <= 2 ? 1 : 2;

  return (
    <section className="about">
      <div className="about-header">
        <h1>Skills and Contact</h1>
      </div>
      <div className="about-content">
        <div className="skills-section">
          <h2>Skills</h2>
          <div
            className="skills-grid"
            style={{ '--skill-cols': colCount }}
          >
            {skills.map((cat) => (
              <div
                key={cat._id}
                className="skill-category"
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
              >
                <h3>{cat.title}</h3>
                <ul>
                  {(cat.skills || []).map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          className="contact-section"
          onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
        >
          <h2>My Other Platforms</h2>
          <p>
            Contact me via Email at{' '}
            <a href={`mailto:${email}`}>{email}</a>
          </p>
          <div className="social-links">
            {social.map((link) => (
              <a
                key={link._id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {renderSocialIcon(link.icon)}
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
