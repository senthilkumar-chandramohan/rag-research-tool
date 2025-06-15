import { ChatOpenAI } from "@langchain/openai";
import { VectorStoreOperations } from "./vectorStore";
import { Document } from "@langchain/core/documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
} from "@langchain/core/prompts";

export class QueryEngine {
    private model: ChatOpenAI;
    private vectorStore: VectorStoreOperations;

    constructor() {
        this.model = new ChatOpenAI({
            modelName: "gpt-3.5-turbo",
            temperature: 0.2,
            openAIApiKey: process.env.OPENAI_API_KEY,
        });
        this.vectorStore = new VectorStoreOperations();
    }

    async query(question: string): Promise<string> {
        await this.vectorStore.loadVectorStore();
        
        // Fetch relevant documents from vector store
        const docs = await this.vectorStore.searchForSimilarDocuments(question, 3);

        // Create prompt template
        const prompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(
                "You are a helpful AI assistant. Answer the question based on the provided context.\nContext: {context}"
            ),
            HumanMessagePromptTemplate.fromTemplate("{question}"),
        ]);

        // Create processing chain
        const chain = RunnableSequence.from([
            {
                context: (input: { question: string; docs: Document[] }) =>
                    formatDocumentsAsString(input.docs),
                question: (input: { question: string }) => input.question,
            },
            prompt,
            this.model,
            new StringOutputParser(),
        ]);

        // Execute chain and return response
        const response = await chain.invoke({
            question,
            docs,
        });

        return response;
    }
}