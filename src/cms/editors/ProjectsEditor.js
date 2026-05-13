import React, { useEffect, useState } from 'react';
import { readClient, writeClient, queries } from '../sanityClient';
import ImageUpload from '../components/ImageUpload';
import SortableList from '../components/SortableList';

const EMPTY_PROJECT = {
  title: '', description: '', shortDescription: '',
  techStack: [], image: '', features: [], links: [], order: 0,
};
const EMPTY_FEATURE = { label: '', text: '' };
const EMPTY_LINK = { url: '', text: '', icon: 'external' };

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

const ProjectsEditor = ({ onFeedback }) => {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [techInput, setTechInput] = useState('');

  const load = () => readClient.fetch(queries.projects).then((res) => setProjects(res || []));
  useEffect(() => { load(); }, []);

  const startEdit = (p) => { setEditing({ ...p, techStack: [...(p.techStack || [])], features: [...(p.features || [])], links: [...(p.links || [])] }); setIsNew(false); };
  const startNew = () => { setEditing({ ...EMPTY_PROJECT, id: projects.length, order: projects.length }); setIsNew(true); };

  const saveProject = async () => {
    if (!editing.title.trim()) { onFeedback('Title is required.', 'error'); return; }
    setSaving(true);
    try {
      const doc = {
        _type: 'project',
        id: editing.id ?? projects.length,
        title: editing.title,
        description: editing.description,
        shortDescription: editing.shortDescription,
        techStack: editing.techStack,
        features: editing.features,
        links: editing.links,
        order: editing.order,
        srcUrl: editing.image,
      };
      if (isNew) {
        await writeClient.create(doc);
      } else {
        await writeClient.patch(editing._id).set(doc).commit();
      }
      await load();
      setEditing(null);
      onFeedback('Project saved!', 'success');
    } catch (err) {
      console.error(err);
      onFeedback('Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await writeClient.delete(id); await load(); onFeedback('Deleted.', 'success'); }
    catch (err) { onFeedback('Delete failed.', 'error'); }
  };

  const move = async (idx, dir) => {
    const reordered = [...projects];
    const swap = idx + dir;
    [reordered[idx], reordered[swap]] = [reordered[swap], reordered[idx]];
    await Promise.all(reordered.map((p, i) => writeClient.patch(p._id).set({ order: i }).commit()));
    await load();
  };

  const addTech = () => {
    const val = techInput.trim();
    if (!val || editing.techStack.includes(val)) return;
    setEditing({ ...editing, techStack: [...editing.techStack, val] });
    setTechInput('');
  };
  const removeTech = (i) => setEditing({ ...editing, techStack: editing.techStack.filter((_, idx) => idx !== i) });

  const addFeature = () => setEditing({ ...editing, features: [...editing.features, { ...EMPTY_FEATURE }] });
  const updateFeature = (i, field, val) => {
    const features = [...editing.features];
    features[i] = { ...features[i], [field]: val };
    setEditing({ ...editing, features });
  };
  const removeFeature = (i) => setEditing({ ...editing, features: editing.features.filter((_, idx) => idx !== i) });

  const addLink = () => setEditing({ ...editing, links: [...editing.links, { ...EMPTY_LINK }] });
  const updateLink = (i, field, val) => {
    const links = [...editing.links];
    links[i] = { ...links[i], [field]: val };
    setEditing({ ...editing, links });
  };
  const removeLink = (i) => setEditing({ ...editing, links: editing.links.filter((_, idx) => idx !== i) });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#FFD873' }}>Projects ({projects.length})</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {projects.length > 0 && (
            <button style={btn('#ff6b6b')} onClick={async () => {
              if (!window.confirm('Delete ALL projects? This cannot be undone.')) return;
              try {
                await writeClient.delete({ query: '*[_type == "project"]' });
                await load();
                onFeedback('All projects deleted.', 'success');
              } catch { onFeedback('Delete failed.', 'error'); }
            }}>Delete All</button>
          )}
          <button style={btn('#FFD873', 'rgba(255,216,115,0.1)')} onClick={startNew}>+ Add Project</button>
        </div>
      </div>

      <SortableList
        items={projects}
        getId={(p) => p._id}
        getLabel={(p) => p.title}
        onMoveUp={(idx) => move(idx, -1)}
        onMoveDown={(idx) => move(idx, 1)}
        onDelete={deleteProject}
        renderItem={(p) => (
          <button style={btn('#FFD873')} onClick={() => startEdit(p)}>Edit</button>
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
              borderRadius: '12px', padding: '28px', width: '600px', maxHeight: '90vh',
              overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, color: '#FFD873' }}>{isNew ? 'Add Project' : 'Edit Project'}</h3>

            <div style={fieldStyle}><label style={labelStyle}>Title *</label>
              <input style={inputStyle} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>

            <div style={fieldStyle}><label style={labelStyle}>Short Description (shown on tile)</label>
              <input style={inputStyle} value={editing.shortDescription} onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })} /></div>

            <div style={fieldStyle}><label style={labelStyle}>Full Description</label>
              <textarea style={textareaStyle} rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Tech Stack</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                {editing.techStack.map((t, i) => (
                  <span key={i} style={{ padding: '3px 10px', background: 'rgba(255,216,115,0.15)', border: '1px solid rgba(255,216,115,0.3)', borderRadius: '20px', fontSize: '12px', color: '#F7F7F7', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {t}<button type="button" onClick={() => removeTech(i)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '14px', padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Add tech…" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }} />
                <button type="button" style={btn('#FFD873')} onClick={addTech}>Add</button>
              </div>
            </div>

            <ImageUpload label="Project Screenshot" currentUrl={editing.image} onUpload={(url) => setEditing({ ...editing, image: url })} />

            <div style={fieldStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Features</label>
                <button type="button" style={btn('#FFD873')} onClick={addFeature}>+ Add</button>
              </div>
              {editing.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                  <input style={{ ...inputStyle, width: '140px', flex: 'none' }} placeholder="Label" value={f.label} onChange={(e) => updateFeature(i, 'label', e.target.value)} />
                  <input style={inputStyle} placeholder="Description" value={f.text} onChange={(e) => updateFeature(i, 'text', e.target.value)} />
                  <button type="button" style={btn('#ff6b6b')} onClick={() => removeFeature(i)}>✕</button>
                </div>
              ))}
            </div>

            <div style={fieldStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Links</label>
                <button type="button" style={btn('#FFD873')} onClick={addLink}>+ Add</button>
              </div>
              {editing.links.map((l, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                  <input style={{ ...inputStyle, flex: 1 }} placeholder="URL" value={l.url} onChange={(e) => updateLink(i, 'url', e.target.value)} />
                  <input style={{ ...inputStyle, width: '100px', flex: 'none' }} placeholder="Text" value={l.text} onChange={(e) => updateLink(i, 'text', e.target.value)} />
                  <select style={{ ...inputStyle, width: '90px', flex: 'none' }} value={l.icon} onChange={(e) => updateLink(i, 'icon', e.target.value)}>
                    <option value="github">GitHub</option>
                    <option value="external">External</option>
                    <option value="demo">Demo</option>
                    <option value="itch">Itch.io</option>
                  </select>
                  <button type="button" style={btn('#ff6b6b')} onClick={() => removeLink(i)}>✕</button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button style={btn('#aaa')} onClick={() => setEditing(null)}>Cancel</button>
              <button style={btn('#1a1a1a', '#FFD873')} onClick={saveProject} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsEditor;
