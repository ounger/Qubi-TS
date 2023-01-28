/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Bit} from "../../../lib/math/truth-table";
import {executeQRNGAlgorithm} from "../../../lib/quantum/algorithms/qrng-algorithm";

describe('QRNG should generate 0s and 1s', () => {
    test('', () => {
        let hasZero = false;
        let hasOne = false;
        let counter = 0;
        while ((!hasZero || !hasOne) && counter < 100) {
            counter++;
            const rand: Bit = executeQRNGAlgorithm();
            if (rand === 0 && !hasZero) {
                hasZero = true;
            } else if (rand === 1 && !hasOne) {
                hasOne = true;
            }
        }
        expect(hasZero && hasOne).toBeTruthy();
    });
});