import {useEffect, useRef, useState} from "react";
import Navigation from "../components/Navigation";
import Uploader from "../components/Uploader";
import Switch from "../components/Switch";

const ImgColorChange = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isCancelledRef = useRef(false);
    const [imgUrl, setImgUrl] = useState("");
    const [mainColors, setMainColors] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<{original: string, new: string}[]>([]);
    const [resultImageUrl, setResultImageUrl] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [hueMode, setHueMode] = useState(true);
    const [isCancelled, setIsCancelled] = useState(false);
    const [hasModified, setHasModified] = useState(false);


    // 提取主要颜色
    const extractMainColors = (imageData: ImageData): string[] => {
        const colorMap: { [key: string]: number } = {};
        const data = imageData.data;
        
        // 每隔一定像素采样，提高性能但保持足够的采样量
        const sampleStep = Math.max(1, Math.floor(data.length / 4 / 50000));
        
        for (let i = 0; i < data.length; i += 4 * sampleStep) {
            // 将RGB值量化到更小的区间，提高颜色区分度
            const r = Math.floor(data[i] / 16) * 16;  // 改为16个区间
            const g = Math.floor(data[i + 1] / 16) * 16;
            const b = Math.floor(data[i + 2] / 16) * 16;
            const a = data[i + 3];
            
            // 忽略透明像素和接近白色的像素
            if (a < 128 || (r > 240 && g > 240 && b > 240)) continue;
            
            const colorKey = `${r},${g},${b}`;
            colorMap[colorKey] = (colorMap[colorKey] || 0) + 1;
        }
        
        // 合并相似颜色
        const mergedColors: { [key: string]: number } = {};
        Object.entries(colorMap).forEach(([color1, count1]) => {
            const [r1, g1, b1] = color1.split(',').map(Number);
            
            // 检查是否已经有相似的颜色
            let found = false;
            for (const [color2, count2] of Object.entries(mergedColors)) {
                const [r2, g2, b2] = color2.split(',').map(Number);
                
                // 计算颜色距离
                const distance = Math.sqrt(
                    Math.pow(r1 - r2, 2) +
                    Math.pow(g1 - g2, 2) +
                    Math.pow(b1 - b2, 2)
                );
                
                // 如果颜色相似，合并到已有颜色中
                if (distance < 30) {
                    mergedColors[color2] = count1 + count2;
                    found = true;
                    break;
                }
            }
            
            // 如果没有相似颜色，添加新颜色
            if (!found) {
                mergedColors[color1] = count1;
            }
        });
        
        // 获取出现频率最高的三种颜色
        return Object.entries(mergedColors)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([color]) => {
                const [r, g, b] = color.split(',').map(Number);
                return `rgb(${r}, ${g}, ${b})`;
            });
    };

    // 处理图片加载
    useEffect(() => {
        if (!imgUrl || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = "anonymous"; // 添加跨域支持
        img.src = imgUrl;
        
        img.onload = () => {
            // 设置canvas尺寸
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 绘制图片
            ctx.drawImage(img, 0, 0);
            
            // 获取像素数据
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // 提取主要颜色
            const colors = extractMainColors(imageData);
            console.log('Extracted colors:', colors);
            
            setMainColors(colors);
            setSelectedColors(colors.map(c => ({ original: c, new: '#'+c.replace(/[rgb()]/g, '').split(',').map(n => 
                parseInt(n.trim()).toString(16).padStart(2, '0')
            ).join('') })));
        };
        img.onerror = (error) => {
            console.error('Error loading image:', error);
        };
    }, [imgUrl]);

    // 处理颜色选择
    const handleColorSelect = (originalColor: string, newColor: string) => {
        setSelectedColors(prev => {
            const existing = prev.findIndex(c => c.original === originalColor);
            if (existing !== -1) {
                const newColors = [...prev];
                newColors[existing] = { original: originalColor, new: newColor };
                return newColors;
            }
            return [...prev, { original: originalColor, new: newColor }];
        });
    };

    // 十六进制颜色转RGB
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    // RGB转HSL
    const rgbToHsl = (r: number, g: number, b: number) => {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h * 360, s * 100, l * 100];
    };

    // HSL转RGB
    const hslToRgb = (h: number, s: number, l: number) => {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };

    // 处理图片合成
    const handleGenerate = () => {
        if (!canvasRef.current || selectedColors.length === 0) return;
        
        // 如果已经修改过，先重置
        if (hasModified) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const img = new Image();
            img.src = imgUrl;
            img.onload = () => {
                // 重置画布
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                // 开始新的颜色替换
                startColorReplacement(canvas, ctx);
            };
        } else {
            // 直接开始颜色替换
            startColorReplacement(canvasRef.current, canvasRef.current.getContext('2d'));
        }
    };

    // 颜色替换的主要逻辑
    const startColorReplacement = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D | null) => {
        if (!ctx) return;
        
        setLoading(true);
        setIsCancelled(false);
        isCancelledRef.current = false;
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // 使用 requestAnimationFrame 进行分批处理
        let currentIndex = 0;
        const batchSize = 10000; // 每批处理的像素数
        let animationId: number | null = null;

        const processNextBatch = () => {
            // 立即检查取消状态
            if (isCancelledRef.current) {
                setLoading(false);
                setIsCancelled(true);
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
                return;
            }

            const endIndex = Math.min(currentIndex + batchSize, data.length);
            
            // 处理当前批次的像素，在循环中也检查取消状态
            for (let i = currentIndex; i < endIndex; i += 4) {
                // 在像素处理循环中检查取消状态
                if (isCancelledRef.current) {
                    setLoading(false);
                    setIsCancelled(true);
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                    }
                    return;
                }

                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
        
                // 查找是否需要替换当前颜色
                const colorToReplace = selectedColors.find(c => {
                    const [origR, origG, origB] = c.original.match(/\d+/g)!.map(Number);
                    
                    if (hueMode) {
                        const [origH] = rgbToHsl(origR, origG, origB);
                        const [currentH] = rgbToHsl(r, g, b);
                        return Math.abs(currentH - origH) < 10;
                    } else {
                        const tolerance = 30;
                        return Math.abs(r - origR) <= tolerance && 
                               Math.abs(g - origG) <= tolerance && 
                               Math.abs(b - origB) <= tolerance;
                    }
                });
        
                if (colorToReplace) {
                    const newColor = hexToRgb(colorToReplace.new);
                    if (newColor) {
                        if (hueMode) {
                            const [, origS, origL] = rgbToHsl(r, g, b);
                            const [newH] = rgbToHsl(newColor.r, newColor.g, newColor.b);
                            const [newR, newG, newB] = hslToRgb(newH, origS, origL);
                            data[i] = newR;
                            data[i + 1] = newG;
                            data[i + 2] = newB;
                        } else {
                            data[i] = newColor.r;
                            data[i + 1] = newColor.g;
                            data[i + 2] = newColor.b;
                        }
                    }
                }
            }

            currentIndex = endIndex;

            // 更新画布显示进度
            ctx.putImageData(imageData, 0, 0);
            setResultImageUrl(canvas.toDataURL());

            // 如果还有未处理的像素且未被取消，继续下一批
            if (currentIndex < data.length && !isCancelledRef.current) {
                animationId = requestAnimationFrame(processNextBatch);
            } else {
                setLoading(false);
                setHasModified(true); // 标记已经修改过
                animationId = null;
            }
        };

        // 开始处理第一批
        animationId = requestAnimationFrame(processNextBatch);
    };

    // 取消合成
    const handleCancel = () => {
        isCancelledRef.current = true;
        setIsCancelled(true);
        setLoading(false);
    };
    // 重置合成
    const handleReset = () => {
        // 重新绘制原图
        if (!canvasRef.current || !imgUrl) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.src = imgUrl;
        img.onload = () => {
            // 设置canvas尺寸
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 绘制原图
            ctx.drawImage(img, 0, 0);
            
            // 更新结果图片
            setResultImageUrl(canvas.toDataURL());
            
            // 重置颜色选择器
            setSelectedColors(mainColors.map(c => ({ 
                original: c, 
                new: '#'+c.replace(/[rgb()]/g, '').split(',').map(n => 
                    parseInt(n.trim()).toString(16).padStart(2, '0')
                ).join('') 
            })));
        };
    };
    useEffect(() => {
        return () => {
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        };
    }, []);
    return (
        <div className={'width-100 height-100 overflow-auto flex column'}>
            <Navigation title="图片换色" />
            <div className={'flex-1 height-1 flex column gap-24 px-24 py-32 width-100 height-100 mx-auto border-box'}
                 style={{maxWidth: '848px', boxSizing: 'border-box'}}>
                    <Uploader onUpload={(url, _file) => {
                        setImgUrl(url as string);
                    }} style={{ height: '240px' }}
                    fileType="image/*"
                    desc="图片大小不超过500KB"
                    >
                        {imgUrl && <img src={imgUrl} alt="" width={'100%'} height={'100%'} className={'object-contain'}/>}
                    </Uploader>

                {/* 颜色选择区域 */}
                {mainColors.length > 0 && (
                    <div className="flex column gap-24">
                        <div className="flex justify-center gap-24 items-center">
                            {selectedColors.map((item, index) => (
                                <div key={index} className="flex column gap-8 items-center">
                                    <div 
                                        className="border radius-4"
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            backgroundColor: item.original,
                                        }}/>
                                    <input
                                        type="color"
                                        value={item.new}
                                        onChange={(e) => handleColorSelect(mainColors[index], e.target.value)}
                                        style={{width: '32px', height: '24px'}}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 生成按钮 */}
                {selectedColors.length > 0 && (
                    <div className="flex items-center gap-12 mx-auto">
                        <Switch disabled={loading||!imgUrl} checked={hueMode} label="色相替换模式" checkedLabel="颜色替换模式" onChange={() => setHueMode(!hueMode)} />
                        <button 
                            type="button"
                            className="primary"
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            {loading ? '处理中...' : '生成新图片'}
                        </button>
                        <button 
                            type="button"
                            className="primary"
                            onClick={loading ? handleCancel : handleReset}
                            disabled={loading && isCancelled}
                        >
                            {loading ? '取消' : '恢复原图'}
                        </button>
                    </div>
                )}

                {/* 结果展示区域 */}
                <div className={'flex-1 flex gap-12 height-1'}>
                    <div className={'flex-1 relative border'}>
                        <canvas ref={canvasRef} style={{display: 'none'}}/>
                        {resultImageUrl ? (
                            <img 
                                src={resultImageUrl} 
                                alt="结果图片" 
                                width={'100%'} 
                                height={'100%'} 
                                className={'object-contain'}
                            />
                        ) : loading ? (
                            <div className="flex items-center justify-center height-100">
                                <div className="w-16 h-16 border-t-primary-6 border-r-primary-6 border-b-primary-6 border-l-primary-6 border-t-4 border-r-4 border-b-4 border-l-4 radius-50% animate-spin" />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImgColorChange;