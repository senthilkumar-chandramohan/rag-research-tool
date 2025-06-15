import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ingestAndProcessDocuments } from './modules/processDocs';
import { QueryEngine } from './modules/llm';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173','https://rag-research-tool.vercel.app'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware for parsing JSON bodies
app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the RAG Research Tool API' });
});

app.post('/ingest', async (req: Request, res: Response) => {
  const { url } = req.body;
  const ingestedDoc = await ingestAndProcessDocuments(url);
  if(ingestedDoc && ingestedDoc.length) {
    res.send(ingestedDoc[0].pageContent.toString());
  } else {
    res.send("No document ingested");
  }
});

app.post('/ask', async (req: Request, res: Response) => {
  const { query } = req.body;
  // const queriedDocuments = await queryStore(query);
  const queryEngine: QueryEngine = new QueryEngine();
  const response:string = await queryEngine.query(query);
  res.send(response);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app; // For testing purposes