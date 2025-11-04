import express from "express";
import path, { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const app = express();
const port = 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static("frontend"));

app.get("/", (req, res) => {
    res.sendFile(resolve(__dirname, "frontend", "index.html"));
});
app.listen(port, () => console.log(`Servidor rodando em localhost:${port}`));

export default app;