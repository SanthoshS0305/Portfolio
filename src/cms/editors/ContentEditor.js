import React, { useEffect, useState } from 'react';
import { readClient, writeClient, queries } from '../sanityClient';

const inputStyle = {
  width: '100%', padding: '8px 12px',
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(247,247,247,0.2)',
  color: '#F7F7F7', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box',
};
const textareaStyle = { ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 };
const labelStyle = { fontSize: '13px', color: '#aaa', marginBottom: '4px', display: 'block' };
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '4px' };
const btn = (color, bg = 'transparent') => ({
  padding: '7px 14px', border: `1px solid ${color}`,
  background: bg, color, borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
});
const badge = (color, bg) => ({
  fontSize: '10px', padding: '2px 7px',
  background: bg, border: `1px solid ${color}`,
  borderRadius: '10px', color, flexShrink: 0,
});

const EMPTY = {
  type: 'instagram', url: '', title: '', description: '',
  platform: 'Instagram', category: '', tags: [], dateAdded: '',
  likes: '', comments: '', views: '',
};

const ContentEditor = ({ onFeedback }) => {
  const [items, setItems] = useState([]);
  const [hiddenUrls, setHiddenUrls] = useState([]);
  const [settingsId, setSettingsId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const load = () => readClient.fetch(queries.contentItems).then((res) => setItems(res || []));
  const loadSettings = () =>
    readClient.fetch(queries.siteSettings).then((s) => {
      if (s) { setSettingsId(s._id); setHiddenUrls(s.hiddenContentUrls || []); }
    }).catch(() => {});

  useEffect(() => { load(); loadSettings(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startEdit = (item) => {
    setEditing({ ...item, tags: [...(item.tags || [])], likes: item.likes ?? '', comments: item.comments ?? '', views: item.views ?? '' });
    setIsNew(false);
  };
  const startNew = () => { setEditing({ ...EMPTY, dateAdded: new Date().toISOString().slice(0, 10) }); setIsNew(true); };

  const saveItem = async () => {
    if (!editing.url.trim()) { onFeedback('URL is required.', 'error'); return; }
    setSaving(true);
    try {
      const doc = {
        _type: 'contentItem',
        type: editing.type,
        url: editing.url,
        title: editing.title,
        description: editing.description,
        platform: editing.platform,
        category: editing.category,
        tags: editing.tags,
        dateAdded: editing.dateAdded,
        likes: editing.likes !== '' ? Number(editing.likes) : null,
        comments: editing.comments !== '' ? Number(editing.comments) : null,
        views: editing.views !== '' ? Number(editing.views) : null,
      };
      if (isNew) await writeClient.create(doc);
      else await writeClient.patch(editing._id).set(doc).commit();
      await load();
      setEditing(null);
      onFeedback('Content item saved!', 'success');
    } catch (err) {
      console.error(err);
      onFeedback('Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this content item? Auto-synced posts will return on the next weekly run.')) return;
    try { await writeClient.delete(id); await load(); onFeedback('Deleted.', 'success'); }
    catch { onFeedback('Delete failed.', 'error'); }
  };

  const deleteAll = async () => {
    if (!window.confirm('Delete ALL content entries? Auto-synced posts will return on the next weekly run.')) return;
    try {
      await writeClient.delete({ query: '*[_type == "contentItem"]' });
      await load();
      onFeedback('All entries deleted.', 'success');
    } catch { onFeedback('Delete failed.', 'error'); }
  };

  const persistHiddenUrls = async (newList) => {
    try {
      await writeClient.createIfNotExists({ _type: 'siteSettings', _id: 'singleton-settings' });
      await writeClient.patch('singleton-settings').set({ hiddenContentUrls: newList }).commit();
      setHiddenUrls(newList);
      if (!settingsId) setSettingsId('singleton-settings');
    } catch { onFeedback('Failed to update visibility.', 'error'); }
  };

  const hideItem = (url) => persistHiddenUrls([...new Set([...hiddenUrls, url])]);
  const unhideItem = (url) => persistHiddenUrls(hiddenUrls.filter((u) => u !== url));

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || editing.tags.includes(t)) return;
    setEditing({ ...editing, tags: [...editing.tags, t] });
    setTagInput('');
  };
  const removeTag = (i) => setEditing({ ...editing, tags: editing.tags.filter((_, idx) => idx !== i) });

  const hiddenSet = new Set(hiddenUrls);
  const visibleItems = items.filter((i) => !hiddenSet.has(i.url));
  const hiddenItems = items.filter((i) => hiddenSet.has(i.url));

  const rowStyle = {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(247,247,247,0.1)', borderRadius: '8px',
  };

  const itemBadge = (item) => item._id?.startsWith('instagram-')
    ? badge('rgba(255,160,50,0.8)', 'rgba(255,160,50,0.12)')
    : badge('rgba(100,160,255,0.8)', 'rgba(100,160,255,0.12)');
  const itemBadgeLabel = (item) => item._id?.startsWith('instagram-') ? 'Synced' : 'Manual';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#FFD873' }}>
            Content Items ({visibleItems.length} visible{hiddenItems.length > 0 ? `, ${hiddenItems.length} hidden` : ''})
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {items.length > 0 && (
              <button style={btn('#ff6b6b')} onClick={deleteAll}>Delete All</button>
            )}
            <button style={btn('#FFD873', 'rgba(255,216,115,0.1)')} onClick={startNew}>+ Add Entry</button>
          </div>
        </div>
        <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
          "Synced" posts are auto-imported weekly from Apify. Edits persist until the next sync overwrites them. "Hide" removes from the public site without deleting.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {visibleItems.map((item) => (
            <div key={item._id} style={rowStyle}>
              <span style={itemBadge(item)}>{itemBadgeLabel(item)}</span>
              <span style={{ flex: 1, fontSize: '14px', color: '#F7F7F7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                [{item.platform}] {item.title || item.url}
              </span>
              <button style={btn('#FFD873')} onClick={() => startEdit(item)}>Edit</button>
              <button style={btn('#aaa')} onClick={() => hideItem(item.url)}>Hide</button>
              <button style={btn('#ff6b6b')} onClick={() => deleteItem(item._id)}>Delete</button>
            </div>
          ))}
          {hiddenItems.map((item) => (
            <div key={item._id} style={{ ...rowStyle, opacity: 0.55, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(247,247,247,0.06)' }}>
              <span style={badge('rgba(150,150,150,0.6)', 'rgba(100,100,100,0.15)')}>Hidden</span>
              <span style={{ flex: 1, fontSize: '14px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                [{item.platform}] {item.title || item.url}
              </span>
              <button style={btn('#aaa')} onClick={() => unhideItem(item.url)}>Unhide</button>
              <button style={btn('#ff6b6b')} onClick={() => deleteItem(item._id)}>Delete</button>
            </div>
          ))}
          {items.length === 0 && <p style={{ color: '#666', fontSize: '13px' }}>No content entries yet. Run the Instagram sync workflow to populate.</p>}
        </div>
      </div>

      {editing && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
          onClick={() => setEditing(null)}
        >
          <div
            style={{
              background: '#1e1e1e', border: '1px solid rgba(247,247,247,0.15)',
              borderRadius: '12px', padding: '28px', width: '560px', maxHeight: '85vh',
              overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, color: '#FFD873' }}>{isNew ? 'Add Content Entry' : 'Edit Content Entry'}</h3>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ ...fieldStyle, flex: 1 }}>
                <label style={labelStyle}>Platform</label>
                <select style={inputStyle} value={editing.platform} onChange={(e) => setEditing({ ...editing, platform: e.target.value, type: e.target.value === 'TikTok' ? 'tiktok' : 'instagram' })}>
                  <option>Instagram</option><option>TikTok</option>
                </select>
              </div>
              <div style={{ ...fieldStyle, flex: 1 }}>
                <label style={labelStyle}>Date Added</label>
                <input style={inputStyle} type="date" value={editing.dateAdded} onChange={(e) => setEditing({ ...editing, dateAdded: e.target.value })} />
              </div>
            </div>

            <div style={fieldStyle}><label style={labelStyle}>Post URL *</label>
              <input style={inputStyle} type="url" value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} placeholder="https://www.instagram.com/p/..." /></div>

            <div style={fieldStyle}><label style={labelStyle}>Title</label>
              <input style={inputStyle} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>

            <div style={fieldStyle}><label style={labelStyle}>Description / Caption</label>
              <textarea style={textareaStyle} rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>

            <div style={fieldStyle}><label style={labelStyle}>Category</label>
              <input style={inputStyle} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="e.g. SBCS" /></div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Tags</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                {editing.tags.map((t, i) => (
                  <span key={i} style={{ padding: '3px 10px', background: 'rgba(255,216,115,0.1)', border: '1px solid rgba(255,216,115,0.3)', borderRadius: '20px', fontSize: '12px', color: '#F7F7F7', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {t}<button type="button" onClick={() => removeTag(i)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '14px', padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Add tag…" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
                <button type="button" style={btn('#FFD873')} onClick={addTag}>Add</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {[['Likes', 'likes'], ['Comments', 'comments'], ['Views', 'views']].map(([lbl, key]) => (
                <div key={key} style={{ ...fieldStyle, flex: 1 }}>
                  <label style={labelStyle}>{lbl}</label>
                  <input style={inputStyle} type="number" value={editing[key]} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button style={btn('#aaa')} onClick={() => setEditing(null)}>Cancel</button>
              <button style={btn('#1a1a1a', '#FFD873')} onClick={saveItem} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
