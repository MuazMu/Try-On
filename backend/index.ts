import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { avatarController } from './controllers/avatarController';
import { clothingController } from './controllers/clothingController';
import { chatController } from './controllers/chatController';
import { sizeController } from './controllers/sizeController';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
  },
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
// Avatar routes
app.post('/api/avatar/generate', upload.single('photo'), avatarController.generateAvatar);
app.get('/api/avatar/:id', avatarController.getAvatar);

// Clothing routes
app.get('/api/clothing', clothingController.getAllClothing);
app.get('/api/clothing/category/:category', clothingController.getClothingByCategory);
app.get('/api/clothing/:id', clothingController.getClothingItem);
app.get('/api/clothing/search', clothingController.searchClothing);

// Size estimation routes
app.get('/api/size/recommendations/:avatarId', sizeController.getSizeRecommendations);

// Chatbot routes
app.post('/api/chat', chatController.sendMessage);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Default route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Virtual Tryon API' });
});

// For Vercel serverless deployment
if (process.env.NODE_ENV !== 'production') {
  // Only start the server in development
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for serverless deployment
export default app; 