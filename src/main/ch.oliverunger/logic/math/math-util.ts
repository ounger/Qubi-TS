import {Complex} from "../../model/math/complex";
import {bit} from "./truth-table";

export function round(num: number, fractionDigits: number): number {
    return Number(num.toFixed(fractionDigits));
}

export function radsToDegs(rads: number): number {
    return rads * 180 / Math.PI;
}

export function degsToRads(degs: number): number {
    return (degs * Math.PI) / 180;
}

export function expOfiTimesAngleDegrees(angleDegrees: number): Complex {
    const phi = degsToRads(angleDegrees);
    return new Complex(Math.cos(phi), Math.sin(phi));
}

export function getNumberAsBitArray(n: number, length: number): bit[] {
    return [...Array(length)].map((_, i) => n >> i & 1).reverse() as bit[];
}

