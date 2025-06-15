import DocumentLoader from './loader';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from '@langchain/core/documents';

export default class DocumentIngestor {
    private loader: DocumentLoader;
    private textSplitter: RecursiveCharacterTextSplitter;

    constructor(url: string, options: object) {
        this.loader = new DocumentLoader(url, options);
        this.textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 2000,
            chunkOverlap: 200
        });
    }

    async ingestAndSplitDocuments():Promise<Document[]> {
        const rawDocument = await this.loader.loadDocument();
        const splitDocuments = await this.textSplitter.splitDocuments(rawDocument);
        return splitDocuments;
    }
}