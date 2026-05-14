import React, { useEffect, useState } from 'react';
import { readClient, writeClient, queries } from '../sanityClient';

const inputStyle = {
  width: '100%', padding: '9px 12px',
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(247,247,247,0.2)',
  color: '#F7F7F7', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box',
};
const labelStyle = { display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '4px' };

const SettingsEditor = ({ onFeedback }) => {
  const [email, setEmail] = useState('santhoshs0305@gmail.com');
  const [docId, setDocId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    readClient.fetch(queries.siteSettings).then((res) => {
      if (res) {
        setDocId(res._id);
        if (res.contactEmail) setEmail(res.contactEmail);
      }
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      if (docId) {
        await writeClient.patch(docId).set({ contactEmail: email }).commit();
      } else {
        const doc = await writeClient.create({ _type: 'siteSettings', _id: 'singleton-settings', contactEmail: email });
        setDocId(doc._id);
      }
      onFeedback('Settings saved!', 'success');
    } catch (err) {
      console.error(err);
      onFeedback('Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '480px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={labelStyle}>Contact Email (shown in Skills & Contact section)</label>
        <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <button
        onClick={save}
        disabled={saving}
        style={{
          padding: '10px 24px', background: '#FFD873', border: 'none',
          color: '#1a1a1a', borderRadius: '6px', cursor: 'pointer',
          fontWeight: 600, fontSize: '14px', alignSelf: 'flex-start',
        }}
      >
        {saving ? 'Saving…' : 'Save Settings'}
      </button>
    </div>
  );
};

export default SettingsEditor;
