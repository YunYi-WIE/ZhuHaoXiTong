/**
 * 将图片压成 JPEG DataURL，减小 JSON 提交体积，避免网关/后端直接 RST
 * @param {File} file
 * @param {{ maxEdge?: number, quality?: number, maxDataUrlLength?: number }} [opts]
 * @returns {Promise<string>}
 */
export function compressImageToDataUrl(file, opts = {}) {
  const maxEdge = opts.maxEdge ?? 1280;
  const maxDataUrlLength = opts.maxDataUrlLength ?? 900_000;
  let quality = opts.quality ?? 0.72;

  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith?.('image/')) {
      reject(new Error('not-image'));
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(blobUrl);
      try {
        let { width, height } = img;
        if (!width || !height) {
          reject(new Error('bad-dim'));
          return;
        }
        const scale = Math.min(1, maxEdge / Math.max(width, height));
        let w = Math.max(1, Math.round(width * scale));
        let h = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('no-canvas'));
          return;
        }

        const drawAndEncode = () => {
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(img, 0, 0, w, h);
          return canvas.toDataURL('image/jpeg', quality);
        };

        let dataUrl = drawAndEncode();
        while (dataUrl.length > maxDataUrlLength && quality > 0.38) {
          quality -= 0.07;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        while (dataUrl.length > maxDataUrlLength && Math.max(w, h) > 640) {
          w = Math.max(320, Math.round(w * 0.88));
          h = Math.max(320, Math.round(h * 0.88));
          dataUrl = drawAndEncode();
        }
        resolve(dataUrl);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error('load-fail'));
    };
    img.src = blobUrl;
  });
}

/**
 * 供上传 OSS：将 JPEG/PNG 等 dataURL 转 Blob
 * @param {string} dataUrl
 * @returns {Blob}
 */
export function dataUrlToBlob(dataUrl) {
  if (typeof dataUrl !== 'string' || !dataUrl.includes(',')) {
    throw new Error('invalid-data-url');
  }
  const [header, b64] = dataUrl.split(',');
  const mimeMatch = /data:([^;]+);/.exec(header);
  const mime = mimeMatch?.[1] || 'image/jpeg';
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}
