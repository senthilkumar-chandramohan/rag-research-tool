import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from '@langchain/openai';

export class VectorStoreOperations {
    private vectorStore!: FaissStore;
    private embeddings: OpenAIEmbeddings;

    constructor() {
        this.embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPEN_API_KEY,
            model: "text-embedding-3-small"
        });
    }

    async addDocuments(documents: Document<Record<string, any>>[]): Promise<void> {
        if (!this.vectorStore) {
            this.vectorStore = await FaissStore.fromDocuments(
                documents,
                this.embeddings
            );
        } else {
            await this.vectorStore.addDocuments(documents);
        }
        await this.vectorStore.save("vectorstore");
    }

    async searchForSimilarDocuments(query: string, k: number = 3): Promise<Document<Record<string, any>>[]> {
        return await this.vectorStore.similaritySearch(query, k);
    }

    async loadVectorStore(directory: string = "vectorstore"): Promise<void> {
        try {
            this.vectorStore = await FaissStore.load(
                directory,
                this.embeddings
            );
        } catch (error) {
            console.error('Error loading vector store:', error);
            throw error;
        }
    }
}