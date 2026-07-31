import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import os from 'os';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
const apiKey = process.env.CLOUDINARY_API_KEY || '';
const apiSecret = process.env.CLOUDINARY_API_SECRET || '';

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export function isCloudinaryConfigured(): boolean {
  if (!cloudName || !apiKey || !apiSecret) return false;
  const placeholders = ['tu_', 'your_', 'change_me', 'placeholder', 'example'];
  for (const p of placeholders) {
    if (
      cloudName.toLowerCase().includes(p) ||
      apiKey.toLowerCase().includes(p) ||
      apiSecret.toLowerCase().includes(p)
    ) {
      return false;
    }
  }
  return true;
}

function detectExtension(buf: Buffer): string {
  if (buf.length < 4) return 'bin';
  const head = buf.subarray(0, 12);
  if (head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47) return 'png';
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return 'jpg';
  if (head[0] === 0x47 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x38) return 'gif';
  if (head[0] === 0x52 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x46) return 'webp';
  if (head[0] === 0x52 && head[1] === 0x4d) return 'bmp';
  const headStr = head.toString('utf-8').toLowerCase();
  if (headStr.includes('<?xml') || headStr.includes('<svg')) return 'svg';
  return 'bin';
}

// Para Vercel (servidor sin persistencia de disco), guardamos en directorio temporal.
export const UPLOADS_DIR = path.join(os.tmpdir(), 'uploads');

export const uploadImage = async (
  fileBuffer: Buffer,
  folder: string = 'service-merchandise'
): Promise<string> => {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd && !isCloudinaryConfigured()) {
    throw new Error(
      'CLOUDINARY_* environment variables are required in production. Local fallback is disabled.'
    );
  }

  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder, resource_type: 'auto' }, (error, result) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        })
        .end(fileBuffer);
    });
  }

  // Fallback SOLO en desarrollo: disco local (os.tmpdir()).
  const safeFolder = folder.replace(/[^a-zA-Z0-9_\-/]/g, '_').replace(/\.\./g, '');
  const ext = detectExtension(fileBuffer);
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
  const targetDir = path.join(UPLOADS_DIR, safeFolder);
  fs.mkdirSync(targetDir, { recursive: true });
  const targetPath = path.join(targetDir, filename);
  fs.writeFileSync(targetPath, fileBuffer);

  return `/uploads/${safeFolder}/${filename}`;
};

export const deleteImage = async (urlOrPath: string): Promise<void> => {
  if (!urlOrPath) return;

  if (urlOrPath.startsWith('http') && urlOrPath.includes('cloudinary.com')) {
    try {
      const parts = urlOrPath.split('/');
      const filename = parts[parts.length - 1];
      const publicId = filename.replace(/\.[^.]+$/, '');
      await cloudinary.uploader.destroy(publicId);
    } catch {
      // ignorar
    }
    return;
  }

  if (urlOrPath.includes('/uploads/')) {
    try {
      const rel = urlOrPath.split('/uploads/').pop() || '';
      const abs = path.join(UPLOADS_DIR, rel);
      if (fs.existsSync(abs)) fs.unlinkSync(abs);
    } catch {
      // ignorar
    }
  }
};

export default cloudinary;
