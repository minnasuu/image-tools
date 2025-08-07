const componentToHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
};

const rgbToHex = (r: number, g: number, b: number) => {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}
export default rgbToHex;