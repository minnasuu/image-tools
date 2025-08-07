const getPixelData = (img:HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0,img.width,img.height);
    return ctx?.getImageData(0, 0, img.width, img.height).data;
}
export default getPixelData;