import {randomIntFromInterval} from "../../main/ch.oliverunger/util";
import {getNumberAsBitArray} from "../../main/ch.oliverunger/logic/math/math-util";

describe('Get a random', () => {
    test('', () => {
        const rnd = randomIntFromInterval(0, Math.pow(2, 4));
        const rndIntAsBitarray = getNumberAsBitArray(rnd, 4);
        console.log(rnd);
        console.log(rndIntAsBitarray.length);
        console.log(rndIntAsBitarray);
    });
});

