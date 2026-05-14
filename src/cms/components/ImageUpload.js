import React, { useRef, useState } from 'react';
import { uploadImage } from '../sanityClient';

const ImageUpload = ({ currentUrl, onUpload, label = 'Image' }) => {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { url } = await uploadImage(file);
      onUpload(url);
    } catch (err) {
      setError('Upload failed. Check that REACT_APP_SANITY_TOKEN is set correctly.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onUpload(urlInput.trim());
      setUrlInput('');
    }
  };

  const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '10px' },
    tabs: { display: 'flex', gap: '6px' },
    tab: (active) => ({
      padding: '5px 14px',
      border: active ? '1px solid #FFD873' : '1px solid rgba(247,247,247,0.2)',
      background: active ? 'rgba(255,216,115,0.1)' : 'transparent',
      color: active ? '#FFD873' : '#aaa',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
    }),
    preview: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '6px',
      border: '1px solid rgba(247,247,247,0.15)',
    },
    fileBtn: {
      padding: '7px 14px',
      background: 'rgba(255,216,115,0.15)',
      border: '1px solid #FFD873',
      color: '#FFD873',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
    },
    urlRow: { display: 'flex', gap: '8px' },
    urlInput: {
      flex: 1,
      padding: '7px 10px',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(247,247,247,0.2)',
      color: '#F7F7F7',
      borderRadius: '6px',
      fontSize: '13px',
    },
    urlBtn: {
      padding: '7px 14px',
      background: 'rgba(255,216,115,0.15)',
      border: '1px solid #FFD873',
      color: '#FFD873',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
    },
    error: { color: '#ff6b6b', fontSize: '12px' },
    label: { fontSize: '13px', color: '#ccc', marginBottom: '2px' },
  };

  return (
    <div style={styles.container}>
      <span style={styles.label}>{label}</span>
      {currentUrl && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={currentUrl} alt="current" style={styles.preview} />
          <button
            type="button"
            onClick={() => onUpload('')}
            style={{ padding: '4px 10px', border: '1px solid #ff6b6b', background: 'transparent', color: '#ff6b6b', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
          >
            Remove
          </button>
        </div>
      )}
      <div style={styles.tabs}>
        <button type="button" style={styles.tab(mode === 'upload')} onClick={() => setMode('upload')}>
          Upload file
        </button>
        <button type="button" style={styles.tab(mode === 'url')} onClick={() => setMode('url')}>
          Use URL
        </button>
      </div>
      {mode === 'upload' ? (
        <>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          <button type="button" style={styles.fileBtn} onClick={() => fileRef.current.click()} disabled={uploading}>
            {uploading ? 'Uploading…' : 'Choose file'}
          </button>
        </>
      ) : (
        <div style={styles.urlRow}>
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            style={styles.urlInput}
          />
          <button type="button" style={styles.urlBtn} onClick={handleUrlSubmit}>
            Use
          </button>
        </div>
      )}
      {error && <span style={styles.error}>{error}</span>}
    </div>
  );
};

export default ImageUpload;
