/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {QubitRegister} from "../../../../lib/quantum/multi-qubit/qubit-register";
import {
    createBalancedDeutschJozsaOracle,
    createConstantDeutschJozsaOracle
} from "../../../../lib/quantum/algorithms/deutsch-jozsa/deutsch-jozsa-oracles";

describe('Create Deutsch-Jozsa Oracles', () => {

    function applyTest(djCase: "constant" | "balanced") {
        let hasZero = false;
        let hasOne = false;
        let counter = 0;
        while ((!hasZero || !hasOne) && counter < 100) {
            const reg = new QubitRegister(4);
            const djOracle = djCase === "constant"
                ? createConstantDeutschJozsaOracle(reg)
                : createBalancedDeutschJozsaOracle(reg);
            djOracle.execute();
            const output = reg.measure();
            if (output === 0) {
                hasZero = true;
            } else if (output === 1) {
                hasOne = true;
            } else {
                fail("The measured state '" + output + "' is not valid.");
            }
            counter++;
        }
        expect(hasZero && hasOne).toBeTruthy();
    }

    test('Create a constant oracle', () => {
        applyTest("constant");
    });

    test('Create a balanced oracle', () => {
        applyTest("balanced");
    });

});