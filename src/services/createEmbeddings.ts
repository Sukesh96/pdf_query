import { TextEmbedding } from "../types/file";
import { getEmbeddingsForText } from "./getEmbeddingsForText";

export type Embeddings = {
  meanEmbedding: number[];
  chunks: TextEmbedding[];
};

export async function createEmbeddings({
  text,
  maxCharLength,
}: {
  text: string;
  maxCharLength?: number;
}): Promise<Embeddings> {
  try {
    const textEmbeddings = await getEmbeddingsForText({
      text,
      maxCharLength,
    });

    
    if (textEmbeddings.length <= 1) {
      return {
        meanEmbedding: textEmbeddings[0]?.embedding ?? [],
        chunks: textEmbeddings,
      };
    }

    
    const embeddingLength = textEmbeddings[0].embedding.length;
    const meanEmbedding = [];
    for (let i = 0; i < embeddingLength; i++) {
      
      let sum = 0;
      for (const textEmbedding of textEmbeddings) {
        sum += textEmbedding.embedding[i];
      }
      
      meanEmbedding.push(sum / textEmbeddings.length);
    }

    return {
      meanEmbedding,
      chunks: textEmbeddings,
    };
  } catch (error: any) {
    console.log("Error: ", error);
    return {
      meanEmbedding: [],
      chunks: [],
    };
  }
}
