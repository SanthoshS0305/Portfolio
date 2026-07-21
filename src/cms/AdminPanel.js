import React, { useState } from 'react';
import HeroEditor from './editors/HeroEditor';
import CarouselEditor from './editors/CarouselEditor';
import ProjectsEditor from './editors/ProjectsEditor';
import SkillsEditor from './editors/SkillsEditor';
import SocialEditor from './editors/SocialEditor';
import ContentEditor from './editors/ContentEditor';
import WritingEditor from './editors/WritingEditor';
import SettingsEditor from './editors/SettingsEditor';
import CertificationsEditor from './editors/CertificationsEditor';

const TABS = [
  { id: 'hero', label: 'Hero' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'social', label: 'Social Links' },
  { id: 'content', label: 'Content' },
  { id: 'writing', label: 'Writing' },
  { id: 'settings', label: 'Settings' },
];

const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('hero');
  const [feedback, setFeedback] = useState(null); // { message, type }

  const onFeedback = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const s = {
    shell: {
      minHeight: '100vh',
      background: '#141414',
      color: '#F7F7F7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: 'flex',
      flexDirection: 'column',
    },
    topbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 28px',
      background: 'rgba(30,30,30,0.95)',
      borderBottom: '1px solid rgba(247,247,247,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    logo: { fontSize: '18px', fontWeight: 700, color: '#FFD873', letterSpacing: '-0.3px' },
    logoutBtn: {
      padding: '7px 18px',
      background: 'transparent',
      border: '1px solid rgba(247,247,247,0.3)',
      color: '#F7F7F7',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
    },
    tabBar: {
      display: 'flex',
      gap: '2px',
      padding: '12px 28px',
      background: 'rgba(20,20,20,0.8)',
      borderBottom: '1px solid rgba(247,247,247,0.08)',
      flexWrap: 'wrap',
    },
    tab: (active) => ({
      padding: '7px 16px',
      border: 'none',
      background: active ? 'rgba(255,216,115,0.12)' : 'transparent',
      color: active ? '#FFD873' : '#aaa',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: active ? 600 : 400,
      transition: 'all 0.15s',
    }),
    content: {
      flex: 1,
      padding: '32px 28px',
      maxWidth: '840px',
    },
    toast: (type) => ({
      position: 'fixed',
      bottom: '28px',
      right: '28px',
      padding: '12px 20px',
      background: type === 'success' ? 'rgba(80,200,120,0.18)' : 'rgba(255,80,80,0.18)',
      border: `1px solid ${type === 'success' ? 'rgba(80,200,120,0.5)' : 'rgba(255,80,80,0.5)'}`,
      borderRadius: '8px',
      color: type === 'success' ? '#8af0a8' : '#ff9a9a',
      fontSize: '14px',
      zIndex: 2000,
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    }),
  };

  const renderEditor = () => {
    const props = { onFeedback };
    switch (activeTab) {
      case 'hero':     return <HeroEditor {...props} />;
      case 'carousel': return <CarouselEditor {...props} />;
      case 'certifications': return <CertificationsEditor {...props} />;
      case 'projects': return <ProjectsEditor {...props} />;
      case 'skills':   return <SkillsEditor {...props} />;
      case 'social':   return <SocialEditor {...props} />;
      case 'content':  return <ContentEditor {...props} />;
      case 'writing':  return <WritingEditor {...props} />;
      case 'settings': return <SettingsEditor {...props} />;
      default:         return null;
    }
  };

  return (
    <div style={s.shell}>
      <div style={s.topbar}>
        <span style={s.logo}>Portfolio CMS</span>
        <button style={s.logoutBtn} onClick={onLogout}>Logout</button>
      </div>

      <div style={s.tabBar}>
        {TABS.map((tab) => (
          <button key={tab.id} style={s.tab(activeTab === tab.id)} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={s.content}>
        {renderEditor()}
      </div>

      {feedback && (
        <div style={s.toast(feedback.type)}>{feedback.message}</div>
      )}
    </div>
  );
};

export default AdminPanel;
