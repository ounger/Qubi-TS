export type bit = 0 | 1;

/**
 * This function returns an array of all row-indices of a truth table of n variables
 * where the given component by col is 1. <br>
 * Example: Given n = 2 and col = 0 returns (2, 3) <br>
 * | a | b | <br>
 * | 0 | 0 | <br>
 * | 0 | 1 | <br>
 * | 1 | 0 | -> a = 1 -> row = 2 <br>
 * | 1 | 1 | -> a = 1 -> row = 3 <br>
 */
export function getAllRowsWith1InCol(n: number, col: number): number[] {
    if (col >= n) {
        throw new Error(`Given col="${col}" is >= n="${n}"`);
    }
    // There are 2^n rows but only half of them have a 1
    let result = new Array<number>(Math.pow(2, n - 1));
    const blockSize = Math.pow(2, n - 1 - col);
    const blocks = Math.pow(2, n - 1) / blockSize;
    let counter = 0; // Number of found 1's rows
    for (let block = 0; block < blocks; block++) {
        const firstElemOfBlock = block * 2 * blockSize + blockSize;
        for (let blockElem = 0; blockElem < blockSize; blockElem++) {
            result[counter] = firstElemOfBlock + blockElem;
            counter++;
        }
    }
    return result;
}

export function getTruthtableValueAt(numCols: number, row: number, col: number): bit {
    if (col >= numCols) {
        throw new Error(`Given col="${col}" is >= n="${numCols}"`);
    }
    const rows = countRows(numCols);
    if (row >= rows) {
        throw new Error("Given row is greater or equal to 2^numCols");
    }
    // @ts-ignore
    return Math.floor(row / Math.pow(2, numCols - 1 - col)) % 2;
}

export function getTruthtableCol(numCols: number, col: number): bit[] {
    return [...Array(Math.pow(2, numCols)).keys()].map(index => getTruthtableValueAt(numCols, index, col));
}

export function getTruthtable1sCol(n: number): bit[] {
    return [...Array(Math.pow(2, n)).keys()].map(_ => 1);
}

export function countRows(n: number): number {
    return Math.pow(2, n);
}
