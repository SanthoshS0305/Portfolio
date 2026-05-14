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
  const [ignoredRepos, setIgnoredRepos] = useState([]);

  useEffect(() => {
    readClient.fetch(queries.siteSettings).then((res) => {
      if (res) {
        setDocId(res._id);
        if (res.contactEmail) setEmail(res.contactEmail);
        setIgnoredRepos(res.githubIgnoredRepos || []);
      }
    });
  }, []);

  const removeIgnoredRepo = async (repo) => {
    const newList = ignoredRepos.filter((r) => r !== repo);
    try {
      await writeClient.createIfNotExists({ _type: 'siteSettings', _id: 'singleton-settings' });
      await writeClient.patch('singleton-settings').set({ githubIgnoredRepos: newList }).commit();
      setIgnoredRepos(newList);
      onFeedback(`"${repo}" removed from ignore list.`, 'success');
    } catch {
      onFeedback('Failed to update ignore list.', 'error');
    }
  };

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={labelStyle}>GitHub Repos Excluded from Auto-import</label>
        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
          These repos won't be re-imported by the daily sync. Remove a repo to make it eligible again.
        </p>
        {ignoredRepos.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>No repos are currently ignored.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {ignoredRepos.map((repo) => (
              <span key={repo} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px', background: 'rgba(255,107,107,0.1)',
                border: '1px solid rgba(255,107,107,0.3)', borderRadius: '20px',
                fontSize: '13px', color: '#F7F7F7',
              }}>
                {repo}
                <button
                  type="button"
                  onClick={() => removeIgnoredRepo(repo)}
                  style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '15px', padding: 0, lineHeight: 1 }}
                  aria-label={`Remove ${repo} from ignore list`}
                >×</button>
              </span>
            ))}
          </div>
        )}
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
