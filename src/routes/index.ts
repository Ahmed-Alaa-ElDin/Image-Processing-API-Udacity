import express, { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";
import bodyParser from "body-parser";
import sharp from "sharp";

const router: Router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/", (req: Request, res: Response) => {
    res.redirect("/api/image-select");
});

router.get("/api/image-select", (req: Request, res: Response) => {
    const directoryPath = path.join(__dirname, "..", "..", "/assets/full");

    const images: string[] = [];

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return console.log("Unable to scan directory: " + err);
        }
        files.forEach((file) => {
            images.push(file);
        });

        res.render("index", {
            images,
        });
    });
});

router.post("/api/image-select", (req: Request, res: Response) => {
    // redirect to /api/images?filename=selectedImage&width=width&height=height
    res.redirect(`/api/images?filename=${req.body.selectedImage}&width=${req.body.width}&height=${req.body.height}`);
});

router.get("/api/images", async (req: Request, res: Response) => {
    const filename: string = req.query.filename as string;
    const width: number = Number(req.query.width);
    const height: number = Number(req.query.height);

    const directoryPath: string = path.join(__dirname, "..", "..", "/assets/full");
    const thumbnailPath: string = path.join(__dirname, "..", "..", "/assets/thumb");

    const images: string[] = [];

    const files = await fs.promises.readdir(directoryPath);

    files.forEach((file) => {
        images.push(file);
    });

    const thumbnailExists: boolean = fs.existsSync(`${thumbnailPath}/${filename}`);

    const thumbnailMetadata: sharp.Metadata | null = thumbnailExists
        ? await sharp(`${thumbnailPath}/${filename}`).metadata()
        : null;

    if (images.includes(filename)) {
        if (thumbnailExists && thumbnailMetadata?.width === width && thumbnailMetadata?.height === height) {
            // return the resized image
            res.sendFile(`${thumbnailPath}/${filename}`);
        } else {
            // create the resized image
            await sharp(`${directoryPath}/${filename}`).resize(width, height).toFile(`${thumbnailPath}/${filename}`);
            // return the resized image
            res.sendFile(`${thumbnailPath}/${filename}`);
        }
    }
});

// page not found
router.get("*", (req: Request, res: Response) => {
    res.render("404");
});

export default router;
