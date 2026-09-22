import { api } from './api';

// Photos are resized and compressed in the browser before upload, so a 5 MB
// phone photo becomes ~300 KB and storage lasts for years.
const FULL = 1600;
const THUMB = 640;

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('This file could not be opened as a photo.'));
    };
    img.src = url;
  });

const render = (img, max, quality) => {
  const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; // transparent PNG posters get a white background
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return new Promise((resolve) => canvas.toBlob((blob) => resolve({ blob, w, h }), 'image/jpeg', quality));
};

export const compressImage = async (file) => {
  if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not a photo.`);
  const { img, url } = await loadImage(file);
  try {
    const full = await render(img, FULL, 0.84);
    const thumb = await render(img, THUMB, 0.8);
    return { full: full.blob, thumb: thumb.blob, w: full.w, h: full.h };
  } finally {
    URL.revokeObjectURL(url);
  }
};

// Compress + upload one photo; resolves to the stored image object.
export const uploadImage = async (file) => {
  const { full, thumb, w, h } = await compressImage(file);
  const form = new FormData();
  form.append('file', full, 'photo.jpg');
  form.append('thumb', thumb, 'thumb.jpg');
  form.append('w', String(w));
  form.append('h', String(h));
  return api('/api/admin/upload', { method: 'POST', form });
};
