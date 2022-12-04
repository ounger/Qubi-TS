export class Step {

    private gates: (() => void)[];

    // TODO Darf in einem Step auf jedes Qubit nur eine Operation angewandt werden?
    // Wie ist es bei Qiskit etc. implementiert.
    // Und wie sollte man das verhinden?

    constructor(...gates: (() => void)[]) {
        this.gates = gates;
    }

    execute() {
        this.gates.forEach(gate => gate());
    }

}