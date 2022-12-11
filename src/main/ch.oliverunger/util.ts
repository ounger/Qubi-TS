import {bit} from "./math/truth-table";

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

export function xor(ba0: bit[], ba1: bit[]): bit[] {
    if (ba0.length != ba1.length) {
        throw new Error(`Bitarrays of different lengths given! First: ${ba0.length} Second: ${ba1.length}`);
    }
    const result = new Array<bit>(ba0.length);
    for (let i = 0; i < ba0.length; i++) {
        result[i] = (ba0[i] ^ ba1[i]) as bit;
    }
    return result;
}

export function getNumberAsBitArray(n: number, length: number): bit[] {
    return [...Array(length)].map((_, i) => n >> i & 1).reverse() as bit[];
}

export function getBitArrayAsNumber(ba: bit[]): number {
    let sum = 0;
    for (let i = 0; i < ba.length; i++) {
        sum += Math.pow(2, ba.length - 1 - i) * ba[i];
    }
    return sum;
}