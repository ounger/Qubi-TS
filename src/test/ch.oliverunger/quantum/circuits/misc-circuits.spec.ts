import {QubitRegister} from "../../../../main/ch.oliverunger/quantum/multi-qubit/qubit-register";
import {createEncodeNumberCircuit} from "../../../../main/ch.oliverunger/quantum/circuits/misc-circuits";
import {getNumberAsBitArray} from "../../../../main/ch.oliverunger/util";

describe("createEncodeNumberCircuit", () => {

    test("Success", () => {
        const reg = new QubitRegister(3);
        const sixAsBitArray = getNumberAsBitArray(6);
        createEncodeNumberCircuit(reg, sixAsBitArray).execute();
        expect(reg.measure()).toEqual(6);
    });

    test("Success with offset", () => {
        const reg = new QubitRegister(3);
        const sixAsBitArray = getNumberAsBitArray(3);
        const offset = 1;
        createEncodeNumberCircuit(reg, sixAsBitArray, offset).execute();
        expect(reg.measure()).toEqual(3);
    });

    test("Fail - Register too small", () => {
        const reg = new QubitRegister(3);
        const eightAsBitArray = getNumberAsBitArray(8);
        expect(() => createEncodeNumberCircuit(reg, eightAsBitArray)).toThrowError();
    });

    test("Fail - Register too small because of offset", () => {
        const reg = new QubitRegister(3);
        const eightAsBitArray = getNumberAsBitArray(6);
        const offset = 1;
        expect(() => createEncodeNumberCircuit(reg, eightAsBitArray, offset)).toThrowError();
    });

});