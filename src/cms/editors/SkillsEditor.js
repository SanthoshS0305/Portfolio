import React, { useEffect, useState } from 'react';
import { readClient, writeClient, queries } from '../sanityClient';

const MAX_CATEGORIES = 4;

const inputStyle = {
  padding: '7px 10px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(247,247,247,0.2)',
  color: '#F7F7F7',
  borderRadius: '6px',
  fontSize: '13px',
};
const btn = (color, bg = 'transparent') => ({
  padding: '6px 14px',
  border: `1px solid ${color}`,
  background: bg,
  color,
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
});
const SkillsEditor = ({ onFeedback }) => {
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newSkills, setNewSkills] = useState({}); // catIndex -> string

  const load = () =>
    readClient.fetch(queries.skillCategories).then((cats) => {
      setCategories(cats || []);
    });

  useEffect(() => { load(); }, []);

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    if (categories.length >= MAX_CATEGORIES) {
      onFeedback(`Maximum ${MAX_CATEGORIES} categories allowed.`, 'error');
      return;
    }
    setSaving(true);
    try {
      await writeClient.create({
        _type: 'skillCategory',
        title: newCatName.trim(),
        skills: [],
        order: categories.length,
      });
      setNewCatName('');
      await load();
      onFeedback('Category added!', 'success');
    } catch (err) {
      onFeedback('Failed to add category.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category and all its skills?')) return;
    try {
      await writeClient.delete(id);
      await load();
      onFeedback('Category deleted.', 'success');
    } catch (err) {
      onFeedback('Delete failed.', 'error');
    }
  };

  const addSkill = async (cat, idx) => {
    const skill = (newSkills[idx] || '').trim();
    if (!skill) return;
    const updated = [...cat.skills, skill];
    setSaving(true);
    try {
      await writeClient.patch(cat._id).set({ skills: updated }).commit();
      setNewSkills({ ...newSkills, [idx]: '' });
      await load();
    } catch (err) {
      onFeedback('Failed to add skill.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const removeSkill = async (cat, skillIdx) => {
    const updated = cat.skills.filter((_, i) => i !== skillIdx);
    try {
      await writeClient.patch(cat._id).set({ skills: updated }).commit();
      await load();
    } catch (err) {
      onFeedback('Failed to remove skill.', 'error');
    }
  };

  const renameCategory = async (cat, newTitle) => {
    try {
      await writeClient.patch(cat._id).set({ title: newTitle }).commit();
      await load();
    } catch (err) {
      onFeedback('Rename failed.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {categories.map((cat, catIdx) => (
        <div key={cat._id} style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(247,247,247,0.12)',
          borderRadius: '10px',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              style={{ ...inputStyle, flex: 1, fontWeight: 600, fontSize: '15px' }}
              defaultValue={cat.title}
              onBlur={(e) => { if (e.target.value !== cat.title) renameCategory(cat, e.target.value); }}
            />
            <button style={btn('#e8a838')} onClick={async () => {
              if (!window.confirm('Clear all skills in this category?')) return;
              try {
                await writeClient.patch(cat._id).set({ skills: [] }).commit();
                await load();
                onFeedback('Skills cleared.', 'success');
              } catch {
                onFeedback('Clear failed.', 'error');
              }
            }}>Clear Skills</button>
            <button style={btn('#ff6b6b')} onClick={() => deleteCategory(cat._id)}>Delete Category</button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {cat.skills.map((skill, si) => (
              <span key={si} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px',
                background: 'rgba(255,216,115,0.1)',
                border: '1px solid rgba(255,216,115,0.3)',
                borderRadius: '20px',
                fontSize: '13px',
                color: '#F7F7F7',
              }}>
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(cat, si)}
                  style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: 0 }}
                >×</button>
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              placeholder="Add a skill…"
              value={newSkills[catIdx] || ''}
              onChange={(e) => setNewSkills({ ...newSkills, [catIdx]: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter') addSkill(cat, catIdx); }}
            />
            <button style={btn('#FFD873', 'rgba(255,216,115,0.1)')} onClick={() => addSkill(cat, catIdx)} disabled={saving}>
              Add
            </button>
          </div>
        </div>
      ))}

      {categories.length < MAX_CATEGORIES && (
        <div style={{
          display: 'flex', gap: '8px', alignItems: 'center',
          padding: '14px', borderRadius: '10px',
          border: '1px dashed rgba(247,247,247,0.2)',
        }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="New category name…"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addCategory(); }}
          />
          <button style={btn('#FFD873', 'rgba(255,216,115,0.1)')} onClick={addCategory} disabled={saving}>
            + Add Category
          </button>
        </div>
      )}

      {categories.length >= MAX_CATEGORIES && (
        <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
          Maximum of {MAX_CATEGORIES} categories reached.
        </p>
      )}
    </div>
  );
};

export default SkillsEditor;
