import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

const uploadsRoot = path.join(__dirname, '..', 'uploads');
const csvDir = path.join(uploadsRoot, 'csv');
const pdfDir = path.join(uploadsRoot, 'pdf');

for (const dir of [csvDir, pdfDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

const app = express();
app.use(cors());
app.use(express.json());

function timestampedName(originalName: string): string {
  const safe = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${Date.now()}-${safe}`;
}

const csvStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, csvDir),
  filename: (_req, file, cb) => cb(null, timestampedName(file.originalname)),
});

const pdfStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, pdfDir),
  filename: (_req, file, cb) => cb(null, timestampedName(file.originalname)),
});

const uploadCsv = multer({
  storage: csvStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.csv' && file.mimetype !== 'text/csv' && file.mimetype !== 'application/vnd.ms-excel') {
      cb(new Error('Only CSV files are allowed'));
      return;
    }
    cb(null, true);
  },
});

const uploadPdf = multer({
  storage: pdfStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf' && file.mimetype !== 'application/pdf') {
      cb(new Error('Only PDF files are allowed'));
      return;
    }
    cb(null, true);
  },
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/uploads/csv', uploadCsv.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const uploadId = randomUUID();
  const metadata = req.body as Record<string, string>;

  console.log('[csv upload]', { uploadId, metadata, file: req.file.filename });

  res.json({
    uploadId,
    fileNames: [req.file.originalname],
    storedPath: req.file.path,
  });
});

app.post('/api/uploads/pdf', uploadPdf.array('files', 20), (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files?.length) {
    res.status(400).json({ error: 'No files uploaded' });
    return;
  }

  const uploadId = randomUUID();
  const metadata = req.body as Record<string, string>;

  console.log('[pdf upload]', {
    uploadId,
    metadata,
    files: files.map((f) => f.filename),
  });

  res.json({
    uploadId,
    fileNames: files.map((f) => f.originalname),
    storedPaths: files.map((f) => f.path),
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(400).json({ error: err.message || 'Upload failed' });
});

app.listen(PORT, () => {
  console.log(`Upload API listening on http://localhost:${PORT}`);
});
