import {Complex} from "../../model/complex";

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

