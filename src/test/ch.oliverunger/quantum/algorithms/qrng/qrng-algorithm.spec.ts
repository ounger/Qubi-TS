import {Bit} from "../../../../../main/ch.oliverunger/math/truth-table";
import {executeQRNGAlgorithm} from "../../../../../main/ch.oliverunger/quantum/algorithms/qrng/qrng-algorithm";

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