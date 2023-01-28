/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Complex} from '../../lib/math/complex';

const a = new Complex(5, 6);
const b = new Complex(-3, 4);

describe('toString', () => {
  test('Test 1', () => {
    expect(a.toString()).toEqual('5 + 6i');
  });
});

describe('Re(a)', () => {
  test('Test 1', () => {
    expect(a.re).toEqual(5);
  });
});

describe('Im(a)', () => {
  test('Test 1', () => {
    expect(a.im).toEqual(6);
  });
});

describe('Add', () => {

  test(' a + b', () => {
    expect(a.add(b)).toEqual(new Complex(2, 10));
  });

  test('b + a', () => {
    expect(b.add(a)).toEqual(new Complex(2, 10));
  });

});

describe('Sub', () => {

  test('a - b', () => {
    expect(a.sub(b)).toEqual(new Complex(8, 2));
  });

  test('b - a', () => {
    expect(b.sub(a)).toEqual(new Complex(-8, -2));
  });

});

describe('a * 5', () => {
  test('', () => {
    expect(a.scale(5)).toEqual(new Complex(25, 30));
  });
});

describe('Multiply', () => {

  test('a * b', () => {
    expect(a.mul(b)).toEqual(new Complex(-39, 2));
  });

  test('b * a', () => {
    expect(b.mul(a)).toEqual(new Complex(-39, 2));
  });

});

describe('Conjugate', () => {

  test('conj(a)', () => {
    expect(a.conjugate()).toEqual(new Complex(5, -6));
  });

  test('conj(b)', () => {
    expect(b.conjugate()).toEqual(new Complex(-3, -4));
  });

});

describe('Absolute', () => {

  test('abs(a)', () => {
    expect(a.abs()).toEqual(7.810249675906654);
  });

  test('abs(b)', () => {
    expect(b.abs()).toEqual(5);
  });

});

describe('Divide', () => {

  test('a / b', () => {
    expect(a.div(b)).toEqual(new Complex(0.3599999999999999, -1.52));
  });

  test('a / 0', () => {
    expect(() => a.div(new Complex(0, 0))).toThrow();
  });

});

describe('modulus', () => {
  test('', () => {
    expect(new Complex(2, 3).modulus()).toEqual(Math.sqrt(13));
  });
});

describe('sqrt', () => {

  test('(5 + 12i)^2', () => {
    expect(new Complex(5, 12).sqrt()).toEqual([new Complex(3, 2), new Complex(-3, -2)]);
  });

  test('(7 - 24i)^2', () => {
    expect(new Complex(7, -24).sqrt()).toEqual([new Complex(4, -3), new Complex(-4, 3)]);
  });

});
