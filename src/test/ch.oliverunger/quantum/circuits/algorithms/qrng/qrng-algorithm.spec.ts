import {bit} from "../../../../../../main/ch.oliverunger/math/truth-table";
import {qrngAlgorithm} from "../../../../../../main/ch.oliverunger/quantum/circuits/algorithms/qrng/qrng-algorithm";

describe('QRNG should generate 0s and 1s', () => {
    test('', () => {
        let hasZero = false;
        let hasOne = false;
        let counter = 0;
        while ((!hasZero || !hasOne) && counter < 100) {
            counter++;
            const rand: bit = qrngAlgorithm();
            if (rand === 0 && !hasZero) {
                hasZero = true;
            } else if (rand === 1 && !hasOne) {
                hasOne = true;
            }
        }
        expect(hasZero && hasOne).toBeTruthy();
    });
});