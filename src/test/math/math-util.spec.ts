/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {degsToRads, radsToDegs, round} from '../../lib/math/math-util';
import {getNumberAsBitArrayZeroPadded} from '../../lib/util';

describe('Rounding', () => {
    test('', () => {
        expect(round(0.99, 2)).toEqual(0.99);
        expect(round(0.999, 2)).toEqual(1);
        expect(round(0.01, 2)).toEqual(0.01);
        expect(round(0.001, 2)).toEqual(0.00);
    });
});

describe('Radians to degrees', () => {
    test('', () => {
        expect(radsToDegs(2 * Math.PI)).toEqual(360);
        expect(radsToDegs(Math.PI)).toEqual(180);
        expect(radsToDegs(Math.PI / 2)).toEqual(90);
        expect(radsToDegs(Math.PI / 4)).toEqual(45);
        expect(radsToDegs(Math.PI / 8)).toEqual(22.5);
        expect(radsToDegs(0)).toEqual(0);
    });
});

describe('Degrees to radians', () => {
    test('', () => {
        expect(degsToRads(360)).toEqual(2 * Math.PI);
        expect(degsToRads(180)).toEqual(Math.PI);
        expect(degsToRads(90)).toEqual(Math.PI / 2);
        expect(degsToRads(45)).toEqual(Math.PI / 4);
        expect(degsToRads(22.5)).toEqual(Math.PI / 8);
        expect(degsToRads(0)).toEqual(0);
    });
});

describe('GetNumber as bit array', () => {

    test('number: O, length: 1', () => {
        expect(getNumberAsBitArrayZeroPadded(0, 1)).toEqual([0]);
    });

    test('number: O, length: 2', () => {
        expect(getNumberAsBitArrayZeroPadded(0, 2)).toEqual([0, 0]);
    });

    test('number: 1, length: 1', () => {
        expect(getNumberAsBitArrayZeroPadded(1, 1)).toEqual([1]);
    });

    test('number: 1, length: 2', () => {
        expect(getNumberAsBitArrayZeroPadded(1, 2)).toEqual([0, 1]);
    });

    test('number: 2, length: 1', () => {
        expect(getNumberAsBitArrayZeroPadded(2, 1)).toEqual([0]);
    });

    test('number: 2, length: 2', () => {
        expect(getNumberAsBitArrayZeroPadded(2, 2)).toEqual([1, 0]);
    });

    test('number: 3, length: 2', () => {
        expect(getNumberAsBitArrayZeroPadded(3, 2)).toEqual([1, 1]);
    });

    test('number: 4, length: 3', () => {
        expect(getNumberAsBitArrayZeroPadded(4, 3)).toEqual([1, 0, 0]);
    });

});



