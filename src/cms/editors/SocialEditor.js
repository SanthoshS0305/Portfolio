import React, { useEffect, useState } from 'react';
import { readClient, writeClient, queries } from '../sanityClient';
import IconPicker from '../components/IconPicker';
import SortableList from '../components/SortableList';

const MAX_LINKS = 6;
const EMPTY = { label: '', url: '', icon: 'globe' };

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
  padding: '8px 18px', border: `1px solid ${color}`,
  background: bg, color, borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
});

const SocialEditor = ({ onFeedback }) => {
  const [links, setLinks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const load = () => readClient.fetch(queries.socialLinks).then((res) => setLinks(res || []));
  useEffect(() => { load(); }, []);

  const startEdit = (item) => { setEditing({ ...item }); setIsNew(false); };
  const startNew = () => {
    if (links.length >= MAX_LINKS) { onFeedback(`Maximum ${MAX_LINKS} social links allowed.`, 'error'); return; }
    setEditing({ ...EMPTY, order: links.length });
    setIsNew(true);
  };

  const saveLink = async () => {
    if (!editing.label.trim() || !editing.url.trim()) {
      onFeedback('Label and URL are required.', 'error');
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await writeClient.create({ _type: 'socialLink', ...editing });
      } else {
        await writeClient.patch(editing._id).set({
          label: editing.label,
          url: editing.url,
          icon: editing.icon,
          order: editing.order,
        }).commit();
      }
      await load();
      setEditing(null);
      onFeedback('Social link saved!', 'success');
    } catch (err) {
      console.error(err);
      onFeedback('Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteLink = async (id) => {
    if (!window.confirm('Delete this social link?')) return;
    try {
      await writeClient.delete(id);
      await load();
      onFeedback('Deleted.', 'success');
    } catch (err) {
      onFeedback('Delete failed.', 'error');
    }
  };

  const move = async (idx, dir) => {
    const reordered = [...links];
    const swap = idx + dir;
    [reordered[idx], reordered[swap]] = [reordered[swap], reordered[idx]];
    await Promise.all(reordered.map((item, i) =>
      writeClient.patch(item._id).set({ order: i }).commit()
    ));
    await load();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#FFD873' }}>Social Links ({links.length} / {MAX_LINKS})</h3>
        <button style={btn('#FFD873', 'rgba(255,216,115,0.1)')} onClick={startNew}>+ Add Link</button>
      </div>

      <SortableList
        items={links}
        getId={(it) => it._id}
        getLabel={(it) => `${it.label} — ${it.url}`}
        onMoveUp={(idx) => move(idx, -1)}
        onMoveDown={(idx) => move(idx, 1)}
        onDelete={deleteLink}
        renderItem={(it) => (
          <button style={btn('#FFD873')} onClick={() => startEdit(it)}>Edit</button>
        )}
      />

      {editing && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#1e1e1e', border: '1px solid rgba(247,247,247,0.15)',
            borderRadius: '12px', padding: '28px', width: '520px', maxHeight: '85vh',
            overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px',
          }}>
            <h3 style={{ margin: 0, color: '#FFD873' }}>{isNew ? 'Add Social Link' : 'Edit Social Link'}</h3>

            <div style={fieldStyle}>
              <label style={labelStyle}>Label (displayed text) *</label>
              <input style={inputStyle} value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>URL *</label>
              <input style={inputStyle} type="url" value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} placeholder="https://" />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Icon</label>
              <IconPicker value={editing.icon} onChange={(key) => setEditing({ ...editing, icon: key })} />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button style={btn('#aaa')} onClick={() => setEditing(null)}>Cancel</button>
              <button style={btn('#1a1a1a', '#FFD873')} onClick={saveLink} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialEditor;
