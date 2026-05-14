import React, { useEffect, useState } from 'react';
import { readClient, writeClient, queries } from '../sanityClient';
import ImageUpload from '../components/ImageUpload';

const DEFAULT = {
  name: 'Santhosh Senthil',
  tagline: 'Computer Science Student, Professional Content Creator, and Writer',
  bio: [
    "I'm a Computer Science Student Minoring in Writing and Rhetoric at Stony Brook University in New York. I'm also a professional content creator and writer. I am currently an **Assistant Digital Marketing Coordinator for Thump Local**, and a **research assistant for PoliTech, under Professor Robert Kelly**.",
    "I am passionate about computers and people. That is why I am a **Peer Mentor** for the **College of Engineering and Applied Sciences' Peer Mentoring Program**. I was also the **Vice President of the SBU Game Development and Design Club** and the **Public Relations Officer for the Stony Brook Computing Society**.",
    "As an avid artist, I love creating [social media content](scroll:content) for various organizations. I am also an avid writer, and you can check out my [writing portfolio](scroll:writing). You can also check out my [coding projects](scroll:projects) if you're interested in my work.",
  ],
  profileImageUrl: '/profile.jpg',
};

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(247,247,247,0.2)',
  color: '#F7F7F7',
  borderRadius: '6px',
  fontSize: '14px',
  boxSizing: 'border-box',
};

const textareaStyle = { ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 };
const labelStyle = { display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '4px' };
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '4px' };
const saveBtn = {
  padding: '10px 24px',
  background: '#FFD873',
  border: 'none',
  color: '#1a1a1a',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '14px',
};

const HeroEditor = ({ onFeedback }) => {
  const [data, setData] = useState({
    ...DEFAULT,
    bioText: DEFAULT.bio.join('\n\n'),
  });
  const [docId, setDocId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    readClient.fetch(queries.hero).then((res) => {
      if (res) {
        setDocId(res._id);
        const bio = res.bio?.length ? res.bio : DEFAULT.bio;
        setData({
          name: res.name || DEFAULT.name,
          tagline: res.tagline || DEFAULT.tagline,
          bioText: bio.join('\n\n'),
          profileImageUrl: res.profileImageUrl || DEFAULT.profileImageUrl,
        });
      }
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const bio = data.bioText.split('\n\n').map((s) => s.trim()).filter(Boolean);
      const doc = {
        _type: 'hero',
        name: data.name,
        tagline: data.tagline,
        bio,
      };

      let savedDoc;
      if (docId) {
        savedDoc = await writeClient.patch(docId).set(doc).commit();
      } else {
        savedDoc = await writeClient.createIfNotExists({ ...doc, _id: 'singleton-hero' });
        await writeClient.patch('singleton-hero').set(doc).commit();
        setDocId('singleton-hero');
      }

      if (data.profileImageUrl && data.profileImageUrl.startsWith('https://cdn.sanity.io')) {
        const assetId = data.profileImageUrl.split('/').slice(-1)[0].split('.')[0];
        await writeClient.patch(savedDoc?._id || docId || 'singleton-hero').set({
          profileImage: { _type: 'image', asset: { _type: 'reference', _ref: `image-${assetId}` } }
        }).commit();
      }

      onFeedback('Hero saved!', 'success');
    } catch (err) {
      console.error(err);
      onFeedback('Save failed. Check console for details.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Name</label>
        <input style={inputStyle} value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Tagline (shown below name)</label>
        <input style={inputStyle} value={data.tagline} onChange={(e) => setData({ ...data, tagline: e.target.value })} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Bio</label>
        <textarea
          style={textareaStyle}
          rows={10}
          value={data.bioText}
          onChange={(e) => setData({ ...data, bioText: e.target.value })}
        />
        <small style={{ color: '#888', fontSize: '11px' }}>
          Use a blank line between paragraphs. Scroll links: <code style={{ color: '#FFD873' }}>[link text](scroll:content)</code> — sections: <code style={{ color: '#FFD873' }}>content</code>, <code style={{ color: '#FFD873' }}>writing</code>, <code style={{ color: '#FFD873' }}>projects</code>
        </small>
      </div>

      <ImageUpload
        label="Profile Image (updates hero, header, and favicon)"
        currentUrl={data.profileImageUrl}
        onUpload={(url) => setData({ ...data, profileImageUrl: url })}
      />

      <button style={saveBtn} onClick={save} disabled={saving}>
        {saving ? 'Saving…' : 'Save Hero'}
      </button>
    </div>
  );
};

export default HeroEditor;
