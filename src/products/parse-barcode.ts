export type BarcodeKind = 'EAN_8' | 'EAN_13' | 'UPC' | 'ASIN' | 'wtf';

export interface IBarcode {
    code: string;
    type: BarcodeKind;
}

function checkBarcode(code, weightArray) {
    let sum = 0;
    for (let i = 0; i < code.length - 1; i++) {
        let char = code[i];
        let int = parseInt(char);
        sum += int * weightArray[i];
    }
    let roof = Math.floor(sum / 10) * 10 + 10;
    let difference = (roof - sum) % 10;

    return difference.toString() === code[code.length - 1];
}

export function parseBarcode(code): IBarcode {
    if (code == null) {
        return {
            code,
            type: 'wtf',
        };
    }
    let check = false;
    let codeType: BarcodeKind = 'wtf';

    if (code.length === 13) {
        check = checkBarcode(code, [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3]);
        codeType = 'EAN_13';
    } else if (code.length === 8) {
        check = checkBarcode(code, [3, 1, 3, 1, 3, 1, 3]);
        codeType = 'EAN_8';
    } else if (code.length === 12) {
        check = checkBarcode(code, [3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3]);
        codeType = 'UPC';
    }

    if (check) return { code, type: codeType };
    else return { code, type: 'wtf' };
}
