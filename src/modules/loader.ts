import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

class URLDocumentLoader {
    private loader: CheerioWebBaseLoader;

    constructor(url: string, options: object) {
        this.loader = new CheerioWebBaseLoader(url, options);
    }

    async loadDocument() {
        try {
            const docs = await this.loader.load();
            return docs;
        } catch (error) {
            console.error('Error loading documents:', error);
            throw error;
        }
    }
}

export default URLDocumentLoader;
