import DocumentIngestor from "./ingest";
import { VectorStoreOperations } from "./vectorStore"; 

export async function ingestAndProcessDocuments(url:string): Promise<ReturnType<DocumentIngestor['ingestAndSplitDocuments']> extends Promise<infer T> ? T : undefined> {
    // const url = "https://www.bitpanda.com/academy/en/lessons/the-bitcoin-whitepaper-simply-explained/";
    const ingestor = new DocumentIngestor(url, {selector: "p"});
    
    try {
        const splitDocuments = await ingestor.ingestAndSplitDocuments();
        console.log(splitDocuments);
        const vectorStoreOperations: VectorStoreOperations = new VectorStoreOperations();
        vectorStoreOperations.addDocuments(splitDocuments);
        return splitDocuments;
    } catch (err) {
        console.log(err);
    }
}