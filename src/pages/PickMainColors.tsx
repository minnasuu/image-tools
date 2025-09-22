import { useState } from "react";
import rgbToHex from "../utils/rgbToHex.ts";
import tinycolor from 'tinycolor2';
import getPixelData from "../utils/getPixelData.ts";
import Navigation from "../components/Navigation";
import Uploader from "../components/Uploader";
import { message } from "../utils/MessagePlugin.ts";


const PickMainColors = () => {
  const [imgUrl, setImgUrl] = useState<string>("");
  const [colors, setColors] = useState<string[]>([]);
  const [colorCount, setColorCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<number>(0);
  const isGrayColor = (color: any) => {
    const hsv = tinycolor(`rgb(${color[0]},${color[1]},${color[2]})`).toHsv();
    if (hsv.s <= filter / 100 || hsv.v <= filter / 100) {
      return true;
    } else {
      return false;
    }
  };
  function areColorsSimilar(color1: any, color2: any, threshold = 32) {
    if (isGrayColor(color1)) {
      return true;
    }
    const rDiff = color1[0] - color2[0];
    const gDiff = color1[1] - color2[1];
    const bDiff = color1[2] - color2[2];
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff) < threshold;
  }

  const getTopColors = (img: HTMLImageElement) => {
    const pixelData: Uint8ClampedArray | undefined = getPixelData(img);
    if (!pixelData) return;
    const colorCountMap = new Map();
    for (let i = 0; i < pixelData?.length; i += 4) {
      const color = [pixelData[i], pixelData[i + 1], pixelData[i + 2]];
      const key = color.join(",");

      if (colorCountMap.has(key)) {
        colorCountMap.set(key, colorCountMap.get(key) + 1);
      } else {
        colorCountMap.set(key, 1);
      }
    }

    const sortedColors = Array.from(colorCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0].split(",").map((x: string) => parseInt(x)));
    const filteredColors: any[] = [];

    for (const color of sortedColors) {
      if (
        !filteredColors.some((filteredColor) =>
          areColorsSimilar(color, filteredColor, 32)
        ) &&
        !isGrayColor(color)
      ) {
        filteredColors.push(color);
      }
      if (filteredColors?.length >= colorCount) {
        break;
      }
    }

    return filteredColors;
  };
  const handleClick = () => {
    setLoading(true);
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      const mainColors = getTopColors(img)?.map(itm => {
        return `${rgbToHex(itm[0], itm[1], itm[2])}`
      }) ?? [];
      setColors(mainColors);
      setLoading(false);
    }

  }

  const handleColorClick = (color: string) => {
    navigator.clipboard.writeText(color);
    message.success(`复制成功: ${color}`);
  }
  return (
    <div className={'width-100 height-100 overflow-auto flex column'}>
      <Navigation title="提取图片主色" />
      <div className={'flex column gap-24 px-24 pt-32 width-100 height-100 mx-auto'} style={{ maxWidth: '848px', boxSizing: 'border-box' }}>
      <div className="flex items-center gap-12">
        <Uploader onUpload={(url, _file) => {
          setImgUrl(url as string);
          }}
            style={{height: '240px'}}
            fileType="image/*"
          >
            {imgUrl && <img src={imgUrl} alt="" width={'100%'} height={'100%'} className={'object-contain'}/>}
        </Uploader>
      </div>
      <div className={'flex gap-12 items-center'}>
        <div className={'flex-1 flex gap-8 items-center fs-12 color-gray-3 no-wrap'}>数量: <input type="number" value={colorCount}
          onChange={(e) => setColorCount(Number(e.target.value))}
          min={1} max={20} style={{width: '80px'}}/>
        </div>
        <div className={'flex-1 flex gap-8 items-center fs-12 color-gray-3 no-wrap'}>过滤中性色: <input type="number" value={filter}
          onChange={(e) => setFilter(Number(e.target.value))}
          min={0} max={50} step={5} style={{width: '80px'}}/>
        </div>
        <button type="button" className={'primary mx-auto'} onClick={handleClick} disabled={loading}>{loading ?
          '提取中...' : '提取主色'}</button>
      </div>
      <div className={'grid gap-32 justify-center mt-24 width-100'} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(24px, 36px))' }}>
        {colors?.map(item => <div key={item} className={'flex column gap-8'}>
          <div className={'width-100 radius-50 cursor-pointer'} style={{ backgroundColor: item, aspectRatio: '1' }} onClick={() => handleColorClick(item)}></div>
          <div className={'fs-12 color-gray-3'}>{item}</div>
        </div>)}
      </div>
      </div>
    </div>
  );
}
export default PickMainColors;