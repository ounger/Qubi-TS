/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Complex} from './complex';

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
    return expOfITimesAngleRadians(degsToRads(angleDegrees));
}

export function expOfITimesAngleRadians(angleRadians: number): Complex {
    return new Complex(Math.cos(angleRadians), Math.sin(angleRadians));
}

