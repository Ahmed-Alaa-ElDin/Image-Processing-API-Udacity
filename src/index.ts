import express, { Application } from "express";
import path from "path";
import config from "./config";
import router from "./routes";

const app: Application = express();

const PORT = config.port;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.use(router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
