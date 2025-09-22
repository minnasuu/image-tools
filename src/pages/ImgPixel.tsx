//@ts-nocheck
import {useEffect, useMemo, useRef, useState} from "react";
import Navigation from "../components/Navigation";
import Uploader from "../components/Uploader";
import RangeSlider from "../components/RangeSlider";
import { message } from "../utils/MessagePlugin.ts";
type Props = {
    defaultUrl?:string
}
const ImgPixel:React.FC<Props> = ({
    defaultUrl
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pixelatedCanvasRef = useRef<HTMLCanvasElement>(null);
    const [imgUrl, setImgUrl] = useState("");
    const [pixelatedImageSrc, setPixelatedImageSrc] = useState<string | null>(null);
    const [finished, setFinished] = useState<boolean>(false);
    const [imgSize, setImgSize] = useState<{w:number,h:number}>({w:100,h:100});
    const [pixelSize, setPixelSize] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [imgData,setImgData] = useState<Uint8ClampedArray | null>(null);
    
    useEffect(() => {
        defaultUrl && setImgUrl(defaultUrl);
    },[defaultUrl])
    /*平均化*/
    const canvasRef2 = useRef<HTMLCanvasElement>(null);
    const pixelatedCanvasRef2 = useRef<HTMLCanvasElement>(null);
    const [pixelatedImageSrc2, setPixelatedImageSrc2] = useState<string | null>(null);
    
    // 处理图片上传
    const handleImageUpload = (url: any, file?: any) => {
        // 检查文件大小是否超过500KB
        if (file && file.size > 500 * 1024) {
            message.error("图片过大，请上传小于500KB的图片");
            return;
        }
        
        setImgUrl(url);
    };
    
    useEffect(() => {
        if(!canvasRef.current || !canvasRef2.current) return;
        imgUrl && setFinished(false)
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const canvas2 = canvasRef2.current;
        const ctx2 = canvas2.getContext('2d');
        if(!ctx || !ctx2) return;
        const img = new Image();
        img.src = imgUrl;
        img.onload = () => {
            setImgSize({w:img.width, h:img.height});
            setPixelSize(Math.round(Math.min(img.width, img.height)/50));
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.clearRect(0, 0, img.width, img.height);
            ctx.drawImage(img, 0, 0, img.width, img.height);

            canvas2.width = img.width;
            canvas2.height = img.height;
            ctx2.clearRect(0, 0, img.width, img.height);
            ctx2.drawImage(img, 0, 0, img.width, img.height);

            // 获取图片像素数据
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            setImgData(imageData.data);
        }
    },[imgUrl])

    // 获取出现次数最多的颜色
    const getMostFrequentColor = (colors: string[]): string => {
        const colorCounts: { [key: string]: number } = {};
        let maxCount = 0;
        let mostFrequentColor = colors[0]; // 默认取第一个颜色

        // 统计每个颜色的出现次数
        colors.forEach((color) => {
            colorCounts[color] = (colorCounts[color] || 0) + 1;
            if (colorCounts[color] > maxCount) {
                maxCount = colorCounts[color];
                mostFrequentColor = color;
            }
        });

        return mostFrequentColor;
    };

    const pixelateImage = () => {
        setLoading(true);
        if (!imgUrl || !canvasRef.current || !pixelatedCanvasRef.current ||!imgData) return;

        const pixelatedCanvas = pixelatedCanvasRef.current;
        const pixelatedCtx = pixelatedCanvas.getContext('2d');

        if (!pixelatedCtx) return;

        // 设置 canvas 尺寸为图片尺寸
        pixelatedCanvas.width = imgSize.w;
        pixelatedCanvas.height = imgSize.h;
        pixelatedCtx.clearRect(0, 0, imgSize.w, imgSize.h);

        // 像素化处理
        for (let y = 0; y < imgSize.h; y += pixelSize) {
            for (let x = 0; x < imgSize.w; x += pixelSize) {
                const colors: string[] = [];

                // 遍历当前小块的像素
                for (let dy = 0; dy < pixelSize; dy++) {
                    for (let dx = 0; dx < pixelSize; dx++) {
                        const px = ((y + dy) * imgSize.w + (x + dx)) * 4;
                        const r = imgData[px];
                        const g = imgData[px + 1];
                        const b = imgData[px + 2];
                        const a = imgData[px + 3];
                        colors.push(`rgba(${r}, ${g}, ${b}, ${a / 255})`);
                    }
                }

                // 获取出现次数最多的颜色
                const mostFrequentColor = getMostFrequentColor(colors);

                // 将出现次数最多的颜色填充到当前小块
                pixelatedCtx.fillStyle = mostFrequentColor;
                pixelatedCtx.fillRect(x, y, pixelSize, pixelSize);
            }
        }

        // 将像素化后的图片转换为 URL
        setPixelatedImageSrc(pixelatedCanvas.toDataURL());
        setLoading(false);
    };

    const pixelateImage2 = () => {
        setLoading(true);
        if (!imgUrl || !canvasRef2.current || !pixelatedCanvasRef2.current ||!imgData) return;

        const pixelatedCanvas = pixelatedCanvasRef2.current;
        const pixelatedCtx = pixelatedCanvas.getContext('2d');

        if (!pixelatedCtx) return;

        // 设置 canvas 尺寸为图片尺寸
        pixelatedCanvas.width = imgSize.w;
        pixelatedCanvas.height = imgSize.h;
        pixelatedCtx.clearRect(0, 0, imgSize.w, imgSize.h);

        // 像素化处理
        for (let y = 0; y < imgSize.h; y += pixelSize) {
            for (let x = 0; x < imgSize.w; x += pixelSize) {
                // 计算当前小块的像素平均值
                let r = 0, g = 0, b = 0,  a = 0, count = 0;

                for (let dy = 0; dy < pixelSize; dy++) {
                    for (let dx = 0; dx < pixelSize; dx++) {
                        const px = ((y + dy) * imgSize.w + (x + dx)) * 4;
                        r += imgData[px];
                        g += imgData[px + 1];
                        b += imgData[px + 2];
                        a += imgData[px + 3]; // Alpha 通道
                        count++;
                    }
                }

                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);
                a = Math.floor(a / count); // 计算平均透明度

                // 将平均值填充到当前小块
                pixelatedCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
                pixelatedCtx.fillRect(x, y, pixelSize, pixelSize);
            }
        }

        // 将像素化后的图片转换为 URL
        setPixelatedImageSrc2(pixelatedCanvas.toDataURL());
        setLoading(false);
    };
    const pixelMax = useMemo(() => Math.round(Math.min(imgSize.w, imgSize.h)/20), [imgSize.w, imgSize.h]);
    return (
        <div className={'width-100 height-100 overflow-auto flex column'}>
            <Navigation title="图片像素化" />
            <div className={'flex column gap-24 px-24 pt-32 width-100 height-100 mx-auto'}
                 style={{maxWidth: '848px', boxSizing: 'border-box'}}>
                <Uploader 
                onUpload={handleImageUpload} 
                style={{ height: '240px' }} 
                fileType="image/*"
                desc="图片大小不超过500KB"
                >
                    {imgUrl && <img src={imgUrl} alt="" width={'100%'} height={'100%'} className={'object-contain'} />}
                </Uploader>
            <div className={'flex gap-12 items-center'}>
                <div className={'flex-1'}>
                    <RangeSlider
                        label="程度"
                        value={pixelSize}
                        min={1}
                        max={pixelMax}
                        step={1}
                        onChange={(val) => {
                            if(val > pixelMax) return;
                            pixelateImage(val);
                            pixelateImage2(val);
                            setPixelSize(val);
                        }}
                        disabled={loading || !imgUrl}
                    />
                </div>
                <button type="button" className={'primary mx-auto'}
                            onClick={() => {
                                setFinished(true);
                                pixelateImage?.();
                                pixelateImage2?.()
                            }}
                            disabled={loading || !imgUrl || finished} pop={!imgUrl ? '请先上传图片':''}>{loading ?
                    '处理中...' : '确定'}</button>
            </div>
            <div className={'flex-1 flex gap-12 height-1 pb-24'}>
                <div className={'flex-1 relative border'}>
                    <canvas ref={canvasRef} style={{display: 'none'}}/>
                    <canvas ref={pixelatedCanvasRef} style={{display: 'none'}}/>
                    {pixelatedImageSrc &&
                        <img src={pixelatedImageSrc} width={'100%'} height={'100%'} className={'object-contain'}/>}
                    <div
                        className={`absolute top-0 left-0 width-100 height-100 flex both-center transition ${loading ? '' : 'opacity-0 events-none'}`}
                        style={{zIndex: 1}}>
                        <div className="w-16 h-16 border-t-primary-6 border-r-primary-6 border-b-primary-6 border-l-primary-6 border-t-4 border-r-4 border-b-4 border-l-4 radius-50% animate-spin" /></div>
                </div>
                <div className={'flex-1 relative border'}>
                    <canvas ref={canvasRef2} style={{display: 'none'}}/>
                    <canvas ref={pixelatedCanvasRef2} style={{display: 'none'}}/>
                    {pixelatedImageSrc2 &&
                        <img src={pixelatedImageSrc2} width={'100%'} height={'100%'} className={'object-contain'}/>}
                    <div
                        className={`absolute top-0 left-0 width-100 height-100 flex both-center transition ${loading ? '' : 'opacity-0 events-none'}`}
                        style={{zIndex: 1}}>
                        <div className="w-16 h-16 border-t-primary-6 border-r-primary-6 border-b-primary-6 border-l-primary-6 border-t-4 border-r-4 border-b-4 border-l-4 radius-50% animate-spin" /></div>
                </div>
            </div>
            </div>
        </div>
    );
}
export default ImgPixel