
export enum Shape {
    segment,
    circle
}

export interface SymbolPart {
    shape: Shape;
    code: number;
    x1: number;
    y1: number;
    x2?: number;
    y2?: number;
    r?:  number;
}
type SymbolPartList = SymbolPart[];

// Removes the reserved values
export const SYMBOL_CODE_MASK = 0xFFFF & ~0x0080 & ~0x0800;
export const SYMBOL_PARTS: SymbolPartList = [
    // Symbol upper part
    { shape: Shape.segment, x1: -1, y1:   5, x2: 10, y2:   0, code: 0x0001 },
    { shape: Shape.segment, x1: 10, y1:  10, x2: 10, y2:   0, code: 0x0002 },
    { shape: Shape.segment, x1: 10, y1:   0, x2: 21, y2:   5, code: 0x0004 },

    { shape: Shape.segment, x1:  0, y1: 5.4, x2:  0, y2:  15, code: 0x0008 },
    { shape: Shape.segment, x1: -1, y1:   5, x2: 10, y2:  10, code: 0x0010 },
    { shape: Shape.segment, x1: 10, y1:  15, x2: 10, y2:  10, code: 0x0020 },
    { shape: Shape.segment, x1: 10, y1:  10, x2: 21, y2:   5, code: 0x0040 },
//    { shape: Shape.segment, x1: 20, y1:   5, x2: 20, y2:  15, code: 0x0080 },

    // Horizontal separator: not modifiable
    { shape: Shape.segment, x1: -1, y1:  15, x2: 21, y2:  15, code: 0x0000 },

    // Symbol lower part
    { shape: Shape.segment, x1:  0, y1:  18, x2:  0, y2:24.6, code: 0x0100 },
    { shape: Shape.segment, x1: -1, y1:  25, x2: 10, y2:  20, code: 0x0200 },
    { shape: Shape.segment, x1: 10, y1:  20, x2: 21, y2:  25, code: 0x0400 },
//    { shape: Shape.segment, x1: 20, y1:  25, x2: 20, y2:  18, code: 0x0800 },

    { shape: Shape.segment, x1: -1, y1:  25, x2: 10, y2:  30, code: 0x1000 },
    { shape: Shape.segment, x1: 10, y1:  20, x2: 10, y2:  30, code: 0x2000 },
    { shape: Shape.segment, x1: 10, y1:  30, x2: 21, y2:  25, code: 0x4000 },

    // Bottom circle
    { shape: Shape.circle,  x1: 10, y1:31.5,  r: 1.5,         code: 0x8000 },
];

/** Return true if provided bit is set in value */
function isBitSet(value: number, bit: number): boolean {
    return (bit==0) || (value & bit) != 0;
}

function renderSegment(code: number, segment: SymbolPart, opacity: string, urls:boolean): string {
    return `<path d="M ${segment.x1},${segment.y1} ${segment.x2},${segment.y2}" style="stroke:rgb(0,0,0);opacity:${opacity}" />`;
}

function renderCircle(code: number, segment: SymbolPart, opacity: string, urls:boolean): string {
    return `<circle cx="${segment.x1}" cy="${segment.y1}" r="${segment.r}" style="fill:none;stroke:rgb(0,0,0);opacity:${opacity}" />`;
}

function renderHeader(code: number, meaning: string|undefined, urls:boolean): string {
    const _style = `
        display:inline-block;
        vertical-align:middle;
        height:calc(var(--icon-size,2rem)*1);
        stroke:var(--icon-color, currentcolor);
        stroke-width:2;
        stroke-linecap: round;
    `;
    const style = _style.replaceAll(/\n/g, "").replaceAll(/[ ]/g, "")
    let result = "";
    if (urls) {
        result += `<a href='/symbol/0x${code.toString(16).toUpperCase()}' >`;
    }
    if (meaning && meaning != "") {
        result += `<span style="color:var(--decoded-color, blue)">${meaning}`;
    }
    else {
        result += `<span><svg viewBox="-1 -4 22 44" style="${style}">
        <g>
    `;
    }
    return result;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function renderFooter(code: number, meaning: string|undefined, urls:boolean, spaces:string): string {
    let result = "";
    if (meaning && meaning != "") {
        result += `${spaces}</span>`;
    }
    else {
        result += `</g></svg>${spaces}</span>`;
    }
    if (urls) {
        result += "</a>"
    }
    return result;
}

/**
 * Generates the HTML string for a single Tunic symbol
 */
export function renderSymbol(code:number, meaning:string|undefined, spaces:number, urls?:boolean) {
    let svg = "";
    let wantUrls = urls === undefined ? true : urls;

    svg += renderHeader(code, meaning, wantUrls);
    for ( const part of SYMBOL_PARTS ) {
        if (part.shape==Shape.segment) {
            svg += renderSegment(code, part, isBitSet(code, part.code) ? "100%" : "0%", wantUrls);
        }
        if (part.shape==Shape.circle) {
            svg += renderCircle(code, part, isBitSet(code, part.code) ? "100%" : "0%", wantUrls);
        }
    }
    svg += renderFooter(code, meaning, wantUrls, "&nbsp;".repeat(spaces));

    return svg;
}
