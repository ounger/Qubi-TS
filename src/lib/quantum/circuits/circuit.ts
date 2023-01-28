/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

export class Circuit {

    private gates: (() => void)[];

    constructor(...gates: (() => void)[]) {
        this.gates = gates;
    }

    addGate(gate: () => void) {
        this.gates.push(gate);
    }

    appendCircuitToStart(circuit: Circuit) {
        this.gates.unshift(...circuit.gates);
    }

    appendCircuitToEnd(circuit: Circuit) {
        this.gates.push(...circuit.gates);
    }

    execute() {
        this.gates.forEach(gate => gate());
    }

}