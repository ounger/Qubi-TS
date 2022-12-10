import {getBitArrayAsNumber, getNumberAsBitArray, randomIntFromInterval, xor} from "../../main/ch.oliverunger/util";
import {bit} from "../../main/ch.oliverunger/logic/math/truth-table";

describe('Get a random', () => {
    test('', () => {
        const rnd = randomIntFromInterval(0, Math.pow(2, 4));
        const rndIntAsBitarray = getNumberAsBitArray(rnd, 4);
        console.log(rnd);
        console.log(rndIntAsBitarray.length);
        console.log(rndIntAsBitarray);
    });
});

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


