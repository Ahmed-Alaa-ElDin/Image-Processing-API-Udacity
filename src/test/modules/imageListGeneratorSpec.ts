import path from "path";
import imagesList from "../../modules/imageListGenerator";

describe("Images List Module Test", () => {
    it("should list images in a directory", async () => {
        const directoryPath = path.join(__dirname, "..", "..", "..", "/assets/full");
        const result = await imagesList(directoryPath);

        expect(result).toEqual([
            "encenadaport.jpg",
            "fjord.jpg",
            "icelandwaterfall.jpg",
            "palmtunnel.jpg",
            "santamonica.jpg",
        ]);
    });
});
