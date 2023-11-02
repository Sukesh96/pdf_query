import { TextEmbedding } from "../types/file";
import { chunkText } from "./chunkText";
import { embedding } from "./openai";


const MAX_CHAR_LENGTH = 250 * 4;

export async function getEmbeddingsForText({
  text,
  maxCharLength = MAX_CHAR_LENGTH,
  batchSize = 20,
}: {
  text: string;
  maxCharLength?: number;
  batchSize?: number;
}): Promise<TextEmbedding[]> {
  const textChunks = chunkText({ text, maxCharLength });

  const batches = [];
  for (let i = 0; i < textChunks.length; i += batchSize) {
    batches.push(textChunks.slice(i, i + batchSize));
  }

  try {
    const batchPromises = batches.map((batch) => embedding({ input: batch }));

    const embeddings = (await Promise.all(batchPromises)).flat();

    const textEmbeddings = embeddings.map((embedding, index) => ({
      embedding,
      text: textChunks[index],
    }));

    return textEmbeddings;
  } catch (error: any) {
    console.log("Error: ", error);
    return [];
  }
}
