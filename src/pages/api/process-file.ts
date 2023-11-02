import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files } from "formidable";

import { TextEmbedding } from "../../types/file";
import extractTextFromFile from "../../services/extractTextFromFile";
import { createEmbeddings } from "../../services/createEmbeddings";


export const config = { api: { bodyParser: false } };

type Data = {
  text?: string;
  meanEmbedding?: number[];
  chunks?: TextEmbedding[];
  error?: string;
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  
  const form = new formidable.IncomingForm();
  form.maxFileSize = 30 * 1024 * 1024;

  try {
    const { fields, files } = await new Promise<{
      fields: Fields;
      files: Files;
    }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files } as { fields: Fields; files: Files });
        }
      });
    });
    const file = files.file;
    if (!file || Array.isArray(file) || file.size === 0) {
      res.status(400).json({ error: "Invalid or missing file" });
      return;
    }

    const text = await extractTextFromFile({
      filepath: file.filepath,
      filetype: file.mimetype ?? "",
    });

    const { meanEmbedding, chunks } = await createEmbeddings({
      text,
    });

    res.status(200).json({ text, meanEmbedding, chunks });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    res.end();
  }
}
