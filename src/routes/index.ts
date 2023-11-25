import express, { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";
import bodyParser from "body-parser";
import sharp from "sharp";
import imagesList from "../modules/imageListGenerator";
import processImage from "../modules/processImage";
import { ThumbnailMetadata } from "../interfaces/ThumbnailMetadata";

const router: Router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/", (req: Request, res: Response) => {
    res.redirect("/api/image-select");
});

router.get("/api/image-select", async (req: Request, res: Response) => {
    const directoryPath = path.join(__dirname, "..", "..", "/assets/full");

    const images: string[] = await imagesList(directoryPath);

    res.render("index", {
        images,
    });
});

router.post("/api/image-select", (req: Request, res: Response) => {
    res.redirect(`/api/images?filename=${req.body.selectedImage}&width=${req.body.width}&height=${req.body.height}`);
});

router.get("/api/images", async (req: Request, res: Response) => {
    const filename: string = req.query.filename as string;
    const newThumbnailMetadata: ThumbnailMetadata = {
        width: Number(req.query.width),
        height: Number(req.query.height),
    };

    const directoryPath: string = path.join(__dirname, "..", "..", "/assets/full");
    const thumbnailPath: string = path.join(__dirname, "..", "..", "/assets/thumb");

    const images: string[] = await imagesList(directoryPath);

    const thumbnailExists: boolean = fs.existsSync(`${thumbnailPath}/${filename}`);

    const oldThumbnailMetadata: sharp.Metadata | null = thumbnailExists
        ? await sharp(`${thumbnailPath}/${filename}`).metadata()
        : null;

    await processImage(
        images,
        filename,
        directoryPath,
        thumbnailPath,
        thumbnailExists,
        oldThumbnailMetadata,
        newThumbnailMetadata,
    );

    res.sendFile(`${thumbnailPath}/${filename}`);
});

// page not found
router.get("*", (req: Request, res: Response) => {
    res.render("404");
});

export default router;
