import fs from "fs";

const imagesList = async function (directoryPath: string): Promise<string[]> {
    const images: string[] = [];

    const files: string[] = await fs.promises.readdir(directoryPath);

    files.forEach((file) => {
        images.push(file);
    });

    return images;
};

export default imagesList;
