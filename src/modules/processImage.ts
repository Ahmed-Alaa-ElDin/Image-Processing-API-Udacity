import sharp from "sharp";
import { ThumbnailMetadata } from "../interfaces/ThumbnailMetadata";

const processImage = async function (
    images: string[],
    filename: string,
    directoryPath: string,
    thumbnailPath: string,
    thumbnailExists: boolean,
    oldThumbnailMetadata: sharp.Metadata | null,
    newThumbnailMetadata: ThumbnailMetadata,
) {
    if (images.includes(filename)) {
        if (
            !thumbnailExists ||
            oldThumbnailMetadata?.width !== newThumbnailMetadata.width ||
            oldThumbnailMetadata?.height !== newThumbnailMetadata.height
        ) {
            await sharp(`${directoryPath}/${filename}`)
                .resize(newThumbnailMetadata.width, newThumbnailMetadata.height)
                .toFile(`${thumbnailPath}/${filename}`);
        }
    }
};

export default processImage;
