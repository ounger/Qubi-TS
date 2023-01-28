/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Bit} from '../lib/math/truth-table';
import {getBitArrayAsNumber, getNumberAsBitArray, range, xor} from '../lib/util';

describe('xor', () => {

    test('Invalid input', () => {
        const ba0: Bit[] = [0, 1, 1];
        const ba1: Bit[] = [0, 1];
        expect(() => xor(ba0, ba1)).toThrowError();
    });

    test('Valid input', () => {
        const ba0: Bit[] = [0, 1, 0, 1];
        const ba1: Bit[] = [0, 0, 1, 1];
        expect(xor(ba0, ba1)).toEqual([0, 1, 1, 0]);
    });

});

describe('getBitArrayAsNumber', () => {

    test('', () => {
        expect(getBitArrayAsNumber([0])).toEqual(0);
        expect(getBitArrayAsNumber([1])).toEqual(1);
        expect(getBitArrayAsNumber([0, 0])).toEqual(0);
        expect(getBitArrayAsNumber([0, 1])).toEqual(1);
        expect(getBitArrayAsNumber([1, 0])).toEqual(2);
        expect(getBitArrayAsNumber([1, 1])).toEqual(3);
        expect(getBitArrayAsNumber([0, 1, 1])).toEqual(3);
        expect(getBitArrayAsNumber([1, 0, 0])).toEqual(4);
    });

});

describe('range', () => {

    test("0 to 5", () => {
        expect(range(0, 6)).toEqual([0, 1, 2, 3, 4, 5]);
    });

    test("1 to 5", () => {
        expect(range(1, 6)).toEqual([1, 2, 3, 4, 5]);
    });

    test("-1 to 5", () => {
        expect(range(-1, 6)).toEqual([-1, 0, 1, 2, 3, 4, 5]);
    });

});

describe('getNumberAsBitArray', () => {

    test('Test cases', () => {
        expect(getNumberAsBitArray(0)).toEqual([0]);
        expect(getNumberAsBitArray(1)).toEqual([1]);
        expect(getNumberAsBitArray(2)).toEqual([1, 0]);
        expect(getNumberAsBitArray(3)).toEqual([1, 1]);
        expect(getNumberAsBitArray(4)).toEqual([1, 0, 0]);
        expect(getNumberAsBitArray(5)).toEqual([1, 0, 1]);
        expect(getNumberAsBitArray(6)).toEqual([1, 1, 0]);
        expect(getNumberAsBitArray(7)).toEqual([1, 1, 1]);
        expect(getNumberAsBitArray(8)).toEqual([1, 0, 0, 0]);
        expect(getNumberAsBitArray(9)).toEqual([1, 0, 0, 1]);
        expect(getNumberAsBitArray(10)).toEqual([1, 0, 1, 0]);
        expect(getNumberAsBitArray(11)).toEqual([1, 0, 1, 1]);
        expect(getNumberAsBitArray(12)).toEqual([1, 1, 0, 0]);
        expect(getNumberAsBitArray(13)).toEqual([1, 1, 0, 1]);
        expect(getNumberAsBitArray(14)).toEqual([1, 1, 1, 0]);
        expect(getNumberAsBitArray(15)).toEqual([1, 1, 1, 1]);
        expect(getNumberAsBitArray(16)).toEqual([1, 0, 0, 0, 0]);
    });

});

