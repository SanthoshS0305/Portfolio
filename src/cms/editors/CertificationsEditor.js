import React, { useEffect, useState } from 'react';
import { readClient, writeClient, queries } from '../sanityClient';
import SortableList from '../components/SortableList';

const EMPTY = { title: '', issuer: '', iframeUrl: '', order: 0 };

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(247,247,247,0.2)',
  color: '#F7F7F7',
  borderRadius: '6px',
  fontSize: '14px',
  boxSizing: 'border-box',
};
const labelStyle = { fontSize: '13px', color: '#aaa', marginBottom: '4px', display: 'block' };
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '4px' };
const btn = (color, bg = 'transparent') => ({
  padding: '8px 18px',
  border: `1px solid ${color}`,
  background: bg,
  color,
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 500,
});

const CertificationsEditor = ({ onFeedback }) => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  const load = () => readClient.fetch(queries.certifications).then(setItems);

  useEffect(() => {
    load();
    readClient.fetch(queries.siteSettings).then((res) => {
      if (res) setAutoplay(res.certCarouselAutoplay ?? true);
    });
  }, []);

  const toggleAutoplay = async () => {
    const next = !autoplay;
    setAutoplay(next);
    try {
      await writeClient.createIfNotExists({ _type: 'siteSettings', _id: 'singleton-settings' });
      await writeClient.patch('singleton-settings').set({ certCarouselAutoplay: next }).commit();
      onFeedback(`Autoplay ${next ? 'enabled' : 'disabled'}.`, 'success');
    } catch (err) {
      console.error(err);
      onFeedback('Failed to update autoplay.', 'error');
    }
  };

  const startEdit = (item) => { setEditing({ ...item }); setIsNew(false); };
  const startNew = () => { setEditing({ ...EMPTY, order: items.length }); setIsNew(true); };

  const saveItem = async () => {
    if (!editing.title.trim()) { onFeedback('Title is required.', 'error'); return; }
    setSaving(true);
    try {
      const doc = {
        title: editing.title,
        issuer: editing.issuer,
        iframeUrl: editing.iframeUrl,
        order: editing.order,
      };
      if (isNew) {
        await writeClient.create({ _type: 'certification', ...doc });
      } else {
        await writeClient.patch(editing._id).set(doc).commit();
      }
      await load();
      setEditing(null);
      onFeedback('Certification saved!', 'success');
    } catch (err) {
      console.error(err);
      onFeedback('Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      await writeClient.delete(id);
      await load();
      onFeedback('Deleted.', 'success');
    } catch {
      onFeedback('Delete failed.', 'error');
    }
  };

  const move = async (idx, dir) => {
    const reordered = [...items];
    const swap = idx + dir;
    [reordered[idx], reordered[swap]] = [reordered[swap], reordered[idx]];
    const patches = reordered.map((item, i) =>
      writeClient.patch(item._id).set({ order: i }).commit()
    );
    await Promise.all(patches);
    await load();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#FFD873' }}>Certifications ({items.length})</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={btn(autoplay ? '#8af0a8' : '#aaa')} onClick={toggleAutoplay}>
            Autoplay: {autoplay ? 'On' : 'Off'}
          </button>
          <button style={btn('#FFD873', 'rgba(255,216,115,0.1)')} onClick={startNew}>+ Add Item</button>
        </div>
      </div>

      <SortableList
        items={items}
        getId={(it) => it._id}
        getLabel={(it) => it.title}
        onMoveUp={(idx) => move(idx, -1)}
        onMoveDown={(idx) => move(idx, 1)}
        onDelete={deleteItem}
        renderItem={(it) => (
          <button style={btn('#FFD873')} onClick={() => startEdit(it)}>Edit</button>
        )}
      />

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
              borderRadius: '12px', padding: '28px', width: '500px', maxHeight: '85vh',
              overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, color: '#FFD873' }}>{isNew ? 'Add Certification' : 'Edit Certification'}</h3>

            <div style={fieldStyle}>
              <label style={labelStyle}>Title *</label>
              <input style={inputStyle} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Issuer</label>
              <input style={inputStyle} value={editing.issuer} onChange={(e) => setEditing({ ...editing, issuer: e.target.value })} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Embed Iframe URL</label>
              <input style={inputStyle} value={editing.iframeUrl} onChange={(e) => setEditing({ ...editing, iframeUrl: e.target.value })} />
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

export default CertificationsEditor;
