import { showToast } from 'vant';
import { compressImageToDataUrl, dataUrlToBlob } from '@/utils/imageCompress';
import { uploadImageFile } from '@/api/upload';

const MAX_IMG_BYTES = 4 * 1024 * 1024;

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

/**
 * Vant van-uploader 的 afterRead：压缩后优先上传 OSS，失败则回退为 dataURL
 * @param {any} item 单文件或多文件
 */
export async function afterReadOssOrDataUrl(item) {
  const items = Array.isArray(item) ? item : [item];
  for (const f of items) {
    const raw = f.file;
    if (!raw) {
      f.status = 'done';
      continue;
    }
    if (raw.size > MAX_IMG_BYTES) {
      f.status = 'failed';
      f.message = '图片过大';
      showToast('单张原图请小于 4MB');
      continue;
    }
    f.status = 'uploading';
    f.message = '压缩中…';
    let dataUrl;
    try {
      try {
        dataUrl = await compressImageToDataUrl(raw, {
          maxEdge: 1280,
          quality: 0.72,
          maxDataUrlLength: 850_000,
        });
      } catch {
        dataUrl = await readFileAsDataURL(raw);
      }

      f.message = '上传中…';
      try {
        const blob = dataUrlToBlob(dataUrl);
        const mime = blob.type || 'image/jpeg';
        const fname =
          mime === 'image/png'
            ? 'shot.png'
            : mime === 'image/webp'
              ? 'shot.webp'
              : 'shot.jpg';
        const upFile = new File([blob], fname, { type: mime });
        const res = await uploadImageFile(upFile);
        const url = res && typeof res.url === 'string' ? res.url.trim() : '';
        if (url) {
          f.url = url;
          f.content = undefined;
          f.status = 'done';
          f.message = '';
          continue;
        }
      } catch (e) {
        console.warn('[upload] 云存储未就绪或上传失败，将使用压缩图:', e?.message || e);
      }

      f.content = dataUrl;
      f.status = 'done';
      f.message = '';
    } catch (e) {
      f.status = 'failed';
      f.message = '失败';
    }
  }
}
