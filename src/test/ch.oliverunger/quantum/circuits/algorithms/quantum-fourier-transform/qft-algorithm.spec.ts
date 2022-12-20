describe('', function () {
    test('', () => {
        expect(true).toBeTruthy();
    });
});

// describe('Create QFTs', () => {
//
//     test("1 qubit", () => {
//         const reg = new QubitRegister(1);
//         const qftCircuit = createQFTCircuit(reg, getNumberAsBitArray(0, 1));
//         qftCircuit.execute();
//
//         expStatesToBeCloseTo(reg.states, STATE_PLUS);
//     });
//
//     test('3 qubits', () => {
//         const reg = new QubitRegister(3);
//         const qftCircuit = createQFTCircuit(reg, getNumberAsBitArray(5, 3));
//         qftCircuit.execute();
//
//         const expQubit0 = Qubit.ofState(STATE_L);
//         expQubit0.rotZ(45);
//         const expQubit1 = Qubit.ofState(STATE_R);
//         const expQubit2 = Qubit.ofState(STATE_MINUS);
//         const expReg = QubitRegister.ofQubits(expQubit0, expQubit1, expQubit2);
//
//         console.log("Actual " + reg.states);
//         console.log("Exp " + expReg.states);
//         expStatesToBeCloseTo(reg.states, expReg.states);
//     });
//
//     test('Test', () => {
//         const qubit2 = Qubit.ofState(STATE_R);
//         qubit2.rotZ(90);
//         console.log(qubit2);
//         expStatesToBeCloseTo(qubit2.state(), STATE_PLUS);
//     });
//
// });