/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Bit} from './math/truth-table';

export const rotateArray = (array: any[], n: number) => {
    let len = array.length;
    let res = new Array(array.length);
    if (n % len !== 0) {
        for (let i = 0; i < len; i++) {
            res[i] = array[(i + (len + n % len)) % len];
        }
        for (let i = 0; i < len; i++) {
            array[i] = res[i];
        }
    }
}

export function randomIntFromInterval(min: number, maxExclusive: number): number {
    return Math.floor(Math.random() * (maxExclusive - min) + min);
}

export function xor(ba0: Bit[], ba1: Bit[]): Bit[] {
    if (ba0.length !== ba1.length) {
        throw new Error(`Bitarrays of different lengths given! First: ${ba0.length} Second: ${ba1.length}`);
    }
    const result = new Array<Bit>(ba0.length);
    for (let i = 0; i < ba0.length; i++) {
        result[i] = (ba0[i] ^ ba1[i]) as Bit;
    }
    return result;
}

export function getNumberAsBitArray(n: number): Bit[] {
    const requiredBits = Math.floor(Math.max(0, Math.log2(n))) + 1;
    return getNumberAsBitArrayZeroPadded(n, requiredBits);
}

export function getNumberAsBitArrayZeroPadded(n: number, length: number): Bit[] {
    return [...Array(length)].map((_, i) => n >> i & 1).reverse() as Bit[];
}

export function getBitArrayAsNumber(ba: Bit[]): number {
    let sum = 0;
    for (let i = 0; i < ba.length; i++) {
        sum += Math.pow(2, ba.length - 1 - i) * ba[i];
    }
    return sum;
}

export const range = (start: number, endExclusive: number): number[] =>
    Array.from(Array(endExclusive - start).keys()).map(x => x + start);