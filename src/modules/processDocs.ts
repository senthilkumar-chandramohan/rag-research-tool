import DocumentIngestor from "./ingest";
import { VectorStoreOperations } from "./vectorStore"; 

export async function ingestAndProcessDocuments(url:string) {
    const ingestor = new DocumentIngestor(url, {selector: "p"});
    
    try {
        const splitDocuments = await ingestor.ingestAndSplitDocuments();
        const vectorStoreOperations: VectorStoreOperations = new VectorStoreOperations();
        vectorStoreOperations.addDocuments(splitDocuments);
        return splitDocuments;
    } catch (err) {
        console.log(err);
    }
}