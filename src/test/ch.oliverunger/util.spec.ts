import {getBitArrayAsNumber, xor} from "../../main/ch.oliverunger/util";
import {bit} from "../../main/ch.oliverunger/math/truth-table";

describe('xor', () => {

    test('Invalid input', () => {
        const ba0: bit[] = [0, 1, 1];
        const ba1: bit[] = [0, 1];
        expect(() => xor(ba0, ba1)).toThrowError();
    });

    test('Valid input', () => {
        const ba0: bit[] = [0, 1, 0, 1];
        const ba1: bit[] = [0, 0, 1, 1];
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


