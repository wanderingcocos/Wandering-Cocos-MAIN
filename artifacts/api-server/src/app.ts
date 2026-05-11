import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import router from "./routes";
import path from "path";
import { existsSync } from "fs";

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api", router);

if (process.env.NODE_ENV === "production") {
  const frontendDist = path.resolve(
    process.cwd(),
    "artifacts/wandering-cocos/dist/public",
  );
  if (existsSync(frontendDist)) {
    app.use(
      express.static(frontendDist, {
        setHeaders(res, filePath) {
          if (filePath.endsWith(".html")) {
            res.setHeader("X-Robots-Tag", "index, follow");
            res.setHeader("Cache-Control", "no-cache");
          } else {
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          }
        },
      }),
    );

    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith("/api")) {
        next();
        return;
      }
      res.setHeader("X-Robots-Tag", "index, follow");
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(path.join(frontendDist, "index.html"));
    });
  }
}

export default app;
