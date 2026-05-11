import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { Readable } from "stream";
import { ObjectStorageService, ObjectNotFoundError, objectStorageClient } from "../lib/objectStorage";
import { randomUUID } from "crypto";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

router.use("/storage/objects", async (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "GET") { next(); return; }

  // Only serve explicitly uploaded files (uploads/ prefix) — no arbitrary private object access.
  if (!req.path.startsWith("/uploads/")) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const objectPath = "/objects" + req.path;
  try {
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
    const webResponse = await objectStorageService.downloadObject(objectFile);

    const headers = Object.fromEntries(webResponse.headers.entries());
    for (const [key, value] of Object.entries(headers)) {
      res.setHeader(key, value);
    }

    if (webResponse.body) {
      const nodeStream = Readable.from(webResponse.body as AsyncIterable<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    if (err instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Object not found" });
    } else {
      console.error("Error serving object:", err);
      res.status(500).json({ error: "Failed to serve object" });
    }
  }
});

export async function uploadBufferToStorage(buffer: Buffer, contentType: string): Promise<string> {
  const privateDir = process.env.PRIVATE_OBJECT_DIR;
  if (!privateDir) throw new Error("PRIVATE_OBJECT_DIR not set");

  const objectId = randomUUID();
  const fullPath = `${privateDir}/uploads/${objectId}`;

  const parts = fullPath.startsWith("/") ? fullPath.slice(1).split("/") : fullPath.split("/");
  const bucketName = parts[0];
  const objectName = parts.slice(1).join("/");

  const bucket = objectStorageClient.bucket(bucketName);
  const file = bucket.file(objectName);
  await file.save(buffer, { contentType });

  return `/objects/uploads/${objectId}`;
}

export default router;
