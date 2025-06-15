import { VectorStoreOperations } from "./vectorStore";

async function queryStore(query: string):Promise<Document[]> {
    const vectorStoreOperations:VectorStoreOperations = new VectorStoreOperations();
    await vectorStoreOperations.loadVectorStore("vectorstore");

    const searchResult = await vectorStoreOperations.searchForSimilarDocuments(query);
    console.log(searchResult);
    return searchResult;
}

export {
    queryStore,
}