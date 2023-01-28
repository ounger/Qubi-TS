/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {round} from './math-util';

export class Complex {

    static ofRe(re: number) {
        return new Complex(re, 0);
    }

    static ofIm(im: number) {
        return new Complex(0, im);
    }

    constructor(private readonly real: number, private readonly imaginary: number) {
    }

    get re(): number {
        return this.real;
    }

    get im(): number {
        return this.imaginary;
    }

    add(that: Complex): Complex {
        return new Complex(this.re + that.re, this.im + that.im);
    }

    sub(that: Complex): Complex {
        return new Complex(this.re - that.re, this.im - that.im);
    }

    scale(scalar: number): Complex {
        return new Complex(scalar * this.re, scalar * this.im);
    }

    mul(that: Complex): Complex {
        return new Complex(this.re * that.re - this.im * that.im, this.re * that.im + this.im * that.re);
    }

    abs(): number {
        return Math.sqrt(this.re * this.re + this.im * this.im);
    }

    conjugate(): Complex {
        return new Complex(this.re, -this.im);
    }

    div(that: Complex): Complex {
        if (that.real === 0 && that.imaginary === 0) {
            throw new Error('Division by 0 not possible!');
        }
        return that.conjugate().mul(this.scale(1 / (that.abs() * that.abs())));
    }

    sqrt(): [plusSolution: Complex, minusSolution: Complex] {
        let modulus = this.modulus();
        let re = Math.sqrt((modulus + this.re) / 2);
        let im = (this.im / Math.abs(this.im)) * Math.sqrt((modulus - this.re) / 2);
        let plusSolution = new Complex(re, im);
        return [plusSolution, MINUS_1.mul(plusSolution)];
    }

    /**
     * |z|^2
     */
    modulusSquared(): number {
        return this.re * this.re + this.im * this.im;
    }

    /**
     * |z| is called the modulus of z
     */
    modulus(): number {
        return Math.sqrt(this.re * this.re + this.im * this.im);
    }

    square(): Complex {
        return this.mul(this);
    }

    equals(that: Complex): boolean {
        return this.re === that.re && this.im === that.im;
    }

    equalsClose(that: Complex): boolean {
        return round(Math.abs(this.re - that.re), 5) === 0
            && round(Math.abs(this.im - that.im), 5) === 0;
    }

    toString(): string {
        return round(this.re, 5) + ' + ' + round(this.im, 5) + 'i';
    }

}

export const MINUS_1 = new Complex(-1, 0);
export const _0 = new Complex(0, 0);
export const _1 = new Complex(1, 0);
export const _2 = new Complex(2, 0);
export const _3 = new Complex(3, 0);
export const _4 = new Complex(4, 0);
export const _5 = new Complex(5, 0);
export const _6 = new Complex(6, 0);
export const _7 = new Complex(7, 0);
export const _8 = new Complex(8, 0);
export const _9 = new Complex(9, 0);
export const _10 = new Complex(10, 0);
export const _11 = new Complex(11, 0);
export const _12 = new Complex(12, 0);
export const _13 = new Complex(13, 0);
export const _14 = new Complex(14, 0);
export const _15 = new Complex(15, 0);
export const _16 = new Complex(16, 0);
export const _17 = new Complex(17, 0);
export const _18 = new Complex(18, 0);
export const _19 = new Complex(19, 0);
export const _20 = new Complex(20, 0);
export const _21 = new Complex(21, 0);
export const _22 = new Complex(22, 0);
export const _23 = new Complex(23, 0);
export const _24 = new Complex(24, 0);
export const _25 = new Complex(25, 0);
export const _26 = new Complex(26, 0);
export const _27 = new Complex(27, 0);
export const _28 = new Complex(28, 0);
export const _29 = new Complex(29, 0);
export const _30 = new Complex(30, 0);
export const _31 = new Complex(31, 0);

export const i = new Complex(0, 1);
export const MINUS_i = new Complex(0, -1);

export const SQRT_TWO = new Complex(Math.sqrt(2), 0); // ~   1.4142136 + 0i
export const ONE_OF_SQRT_TWO = _1.div(SQRT_TWO); // ~   0.7071068 + 0i
export const MINUS_ONE_OF_SQRT_TWO = new Complex(-1, 0).mul(ONE_OF_SQRT_TWO); // ~ - 0.7071068 + 0i
export const i_OF_SQRT_TWO = new Complex(0, 1).mul(ONE_OF_SQRT_TWO);
export const MINUS_i_OF_SQRT_TWO = new Complex(0, -1).mul(ONE_OF_SQRT_TWO);
export const SQRT_TWO_i_SQRT_TWO = new Complex(Math.sqrt(2), Math.sqrt(2));
export const HALF_SQRT_TWO_HALF_i_SQRT_TWO = new Complex(0.5 * Math.sqrt(2), 0.5 * Math.sqrt(2))
