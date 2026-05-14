import React, { useEffect, useState } from 'react';
import { readClient, writeClient, queries } from '../sanityClient';
import ImageUpload from '../components/ImageUpload';

const SUBSTACK_RSS_URL = 'https://dashesnothyphens.substack.com/feed';
const SUBSTACK_API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(SUBSTACK_RSS_URL)}`;

const EMPTY = { title: '', description: '', link: '', thumbnailUrl: '', date: '', websiteType: '' };

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

const stripHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent || div.innerText || '').slice(0, 200);
};

const WritingEditor = ({ onFeedback }) => {
  const [sanityItems, setSanityItems] = useState([]);
  const [rssItems, setRssItems] = useState([]);
  const [hiddenUrls, setHiddenUrls] = useState([]);
  const [settingsId, setSettingsId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [rssLoading, setRssLoading] = useState(true);

  const loadSanity = () =>
    readClient.fetch(queries.writingItems).then((res) => setSanityItems(res || []));

  const loadSettings = () =>
    readClient.fetch(queries.siteSettings).then((s) => {
      if (s) {
        setSettingsId(s._id);
        setHiddenUrls(s.hiddenWritingUrls || []);
      }
    }).catch(() => {});

  useEffect(() => {
    loadSanity();
    loadSettings();
    fetch(SUBSTACK_API_URL)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === 'ok' && data.items?.length) {
          setRssItems(data.items.map((item) => ({
            link: item.link || '',
            title: item.title || '',
            description: item.description ? stripHtml(item.description) : '',
            date: item.pubDate?.slice(0, 10) || '',
            thumbnail: item.enclosure?.link || item.thumbnail || '',
          })));
        }
      })
      .catch(() => {})
      .finally(() => setRssLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startEdit = (item) => { setEditing({ ...item }); setIsNew(false); };
  const startNew = () => { setEditing({ ...EMPTY, date: new Date().toISOString().slice(0, 10) }); setIsNew(true); };
  const startEditFromRss = (rssItem) => {
    setEditing({
      ...EMPTY,
      title: rssItem.title,
      description: rssItem.description,
      link: rssItem.link,
      thumbnailUrl: rssItem.thumbnail,
      date: rssItem.date,
      websiteType: 'Substack',
    });
    setIsNew(true);
  };

  const saveItem = async () => {
    if (!editing.title.trim() || !editing.link.trim()) {
      onFeedback('Title and Link are required.', 'error');
      return;
    }
    setSaving(true);
    try {
      const doc = {
        _type: 'writingItem',
        title: editing.title,
        description: editing.description,
        link: editing.link,
        thumbnailExternalUrl: editing.thumbnailUrl,
        date: editing.date,
        websiteType: editing.websiteType,
      };
      if (isNew) await writeClient.create(doc);
      else await writeClient.patch(editing._id).set(doc).commit();
      await loadSanity();
      setEditing(null);
      onFeedback('Writing entry saved!', 'success');
    } catch (err) {
      console.error(err);
      onFeedback('Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this writing entry?')) return;
    try { await writeClient.delete(id); await loadSanity(); onFeedback('Deleted.', 'success'); }
    catch { onFeedback('Delete failed.', 'error'); }
  };

  const deleteAll = async () => {
    if (!window.confirm('Delete ALL manual writing entries? This cannot be undone.')) return;
    try {
      await writeClient.delete({ query: '*[_type == "writingItem"]' });
      await loadSanity();
      onFeedback('All entries deleted.', 'success');
    } catch { onFeedback('Delete failed.', 'error'); }
  };

  const persistHiddenUrls = async (newList) => {
    try {
      await writeClient.createIfNotExists({ _type: 'siteSettings', _id: 'singleton-settings' });
      await writeClient.patch('singleton-settings').set({ hiddenWritingUrls: newList }).commit();
      setHiddenUrls(newList);
      if (!settingsId) setSettingsId('singleton-settings');
    } catch { onFeedback('Failed to update visibility.', 'error'); }
  };

  const hideRssItem = (url) => persistHiddenUrls([...new Set([...hiddenUrls, url])]);
  const unhideRssItem = (url) => persistHiddenUrls(hiddenUrls.filter((u) => u !== url));

  const sanityLinks = new Set(sanityItems.map((i) => i.link));
  const hiddenSet = new Set(hiddenUrls);
  const visibleRss = rssItems.filter((i) => !sanityLinks.has(i.link) && !hiddenSet.has(i.link));
  const hiddenRss = rssItems.filter((i) => hiddenSet.has(i.link) && !sanityLinks.has(i.link));

  const rowStyle = {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(247,247,247,0.1)', borderRadius: '8px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Manual (Sanity) entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#FFD873' }}>Manual Entries ({sanityItems.length})</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {sanityItems.length > 0 && (
              <button style={btn('#ff6b6b')} onClick={deleteAll}>Delete All</button>
            )}
            <button style={btn('#FFD873', 'rgba(255,216,115,0.1)')} onClick={startNew}>+ Add Entry</button>
          </div>
        </div>
        <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
          Editing a Substack article creates a manual override here that takes priority on the site.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sanityItems.map((item) => (
            <div key={item._id} style={rowStyle}>
              <span style={badge('rgba(100,160,255,0.8)', 'rgba(100,160,255,0.12)')}>Manual</span>
              <span style={{ flex: 1, fontSize: '14px', color: '#F7F7F7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
              <span style={{ fontSize: '12px', color: '#888', flexShrink: 0 }}>{item.date}</span>
              <button style={btn('#FFD873')} onClick={() => startEdit(item)}>Edit</button>
              <button style={btn('#ff6b6b')} onClick={() => deleteItem(item._id)}>Delete</button>
            </div>
          ))}
          {sanityItems.length === 0 && <p style={{ color: '#666', fontSize: '13px' }}>No manual entries yet.</p>}
        </div>
      </div>

      {/* Auto RSS entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ margin: 0, color: '#FFD873' }}>
          Substack / RSS ({visibleRss.length} visible{hiddenRss.length > 0 ? `, ${hiddenRss.length} hidden` : ''})
        </h3>
        <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
          Auto-fetched from your Substack feed. "Edit" creates a manual override above. "Hide" removes from the site.
        </p>
        {rssLoading && <p style={{ color: '#666', fontSize: '13px' }}>Loading RSS feed…</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {visibleRss.map((item) => (
            <div key={item.link} style={rowStyle}>
              <span style={badge('rgba(255,160,50,0.8)', 'rgba(255,160,50,0.12)')}>RSS</span>
              <span style={{ flex: 1, fontSize: '14px', color: '#F7F7F7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
              <span style={{ fontSize: '12px', color: '#888', flexShrink: 0 }}>{item.date}</span>
              <button style={btn('#FFD873')} onClick={() => startEditFromRss(item)}>Edit</button>
              <button style={btn('#ff6b6b')} onClick={() => hideRssItem(item.link)}>Hide</button>
            </div>
          ))}
          {hiddenRss.map((item) => (
            <div key={item.link} style={{ ...rowStyle, opacity: 0.55, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(247,247,247,0.06)' }}>
              <span style={badge('rgba(150,150,150,0.6)', 'rgba(100,100,100,0.15)')}>Hidden</span>
              <span style={{ flex: 1, fontSize: '14px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
              <button style={btn('#aaa')} onClick={() => unhideRssItem(item.link)}>Unhide</button>
            </div>
          ))}
          {!rssLoading && visibleRss.length === 0 && hiddenRss.length === 0 && (
            <p style={{ color: '#666', fontSize: '13px' }}>No RSS articles loaded.</p>
          )}
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
              borderRadius: '12px', padding: '28px', width: '520px', maxHeight: '85vh',
              overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, color: '#FFD873' }}>{isNew ? 'Add Writing Entry' : 'Edit Writing Entry'}</h3>

            <div style={fieldStyle}><label style={labelStyle}>Title *</label>
              <input style={inputStyle} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>

            <div style={fieldStyle}><label style={labelStyle}>Link (URL to the article) *</label>
              <input style={inputStyle} type="url" value={editing.link} onChange={(e) => setEditing({ ...editing, link: e.target.value })} placeholder="https://" /></div>

            <div style={fieldStyle}><label style={labelStyle}>Date</label>
              <input style={inputStyle} type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></div>

            <div style={fieldStyle}><label style={labelStyle}>Website / Publication</label>
              <input
                style={inputStyle}
                value={editing.websiteType}
                onChange={(e) => setEditing({ ...editing, websiteType: e.target.value })}
                placeholder="e.g. Substack, Medium, Personal Blog"
              /></div>

            <div style={fieldStyle}><label style={labelStyle}>Description / Preview text</label>
              <textarea style={textareaStyle} rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>

            <ImageUpload label="Thumbnail image" currentUrl={editing.thumbnailUrl} onUpload={(url) => setEditing({ ...editing, thumbnailUrl: url })} />

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

export default WritingEditor;
