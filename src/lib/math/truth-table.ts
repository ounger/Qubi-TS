/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {getNumberAsBitArrayZeroPadded} from '../util';

export type Bit = 0 | 1;

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
export function getAllRowsWith1InCol(numCols: number, col: number): number[] {
    const numRows = countRows(numCols);
    let result = new Array<number>(numRows / 2);
    let counter = 0;
    for(let row = 0; row < numRows; row++) {
        if (getTTBitAt(numCols, row, col) === 1) {
            result[counter] = row;
            counter++;
        }
    }
    return result;
}

export function getTTCol(numCols: number, col: number): Bit[] {
    return [...Array(Math.pow(2, numCols)).keys()].map(index => getTTBitAt(numCols, index, col));
}

export function getTTBitAt(numCols: number, row: number, col: number): Bit {
    return (row & (1 << numCols - 1 - col)) != 0 ? 1 : 0;
}

export function getTT(numCols: number): Bit[][] {
    const numRows = countRows(numCols);
    let tt: Bit[][] = new Array<Bit[]>(numRows).fill([]).map(_ => new Array<Bit>().fill(0));
    for (let row = 0; row < numRows; row++) {
        let rowAsBitArray = getNumberAsBitArrayZeroPadded(row, numCols);
        for (let col = 0; col < numCols; col++) {
            tt[row][col] = rowAsBitArray[col];
        }
    }
    return tt;
}

export function countRows(numCols: number): number {
    return Math.pow(2, numCols);
}
