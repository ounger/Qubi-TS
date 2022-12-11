import {Complex} from '../../../main/ch.oliverunger/math/complex';

const a = new Complex(5, 6);
const b = new Complex(-3, 4);

describe('toString', () => {
  it('', () => {
    expect(a.toString()).toEqual("5 + 6i");
  });
});

describe('Re(a)', () => {
  it('', () => {
    expect(a.re).toEqual(5);
  });
});

describe('Im(a)', () => {
  it('', () => {
    expect(a.im).toEqual(6);
  });
});

describe('a + b', () => {
  it('', () => {
    expect(a.add(b)).toEqual(new Complex(2, 10));
  });
});

describe('b + a', () => {
  it('', () => {
    expect(b.add(a)).toEqual(new Complex(2, 10));
  });
});

describe('a - b', () => {
  it('', () => {
    expect(a.sub(b)).toEqual(new Complex(8, 2));
  });
});

describe('b - a', () => {
  it('', () => {
    expect(b.sub(a)).toEqual(new Complex(-8, -2));
  });
});

describe('a * 5', () => {
  it('', () => {
    expect(a.scale(5)).toEqual(new Complex(25, 30));
  });
});

describe('a * b', () => {
  it('', () => {
    expect(a.mul(b)).toEqual(new Complex(-39, 2));
  });
});

describe('b * a', () => {
  it('', () => {
    expect(b.mul(a)).toEqual(new Complex(-39, 2));
  });
});

describe('conj(a)', () => {
  it('', () => {
    expect(a.conjugate()).toEqual(new Complex(5, -6));
  });
});

describe('conj(b)', () => {
  it('', () => {
    expect(b.conjugate()).toEqual(new Complex(-3, -4));
  });
});

describe('abs(a)', () => {
  it('', () => {
    expect(a.abs()).toEqual(7.810249675906654);
  });
});

describe('abs(b)', () => {
  it('', () => {
    expect(b.abs()).toEqual(5);
  });
});

describe('a / b', () => {
  it('', () => {
    expect(a.div(b)).toEqual(new Complex(0.3599999999999999, -1.52));
  });
});

describe('modulus', () => {
  it('', () => {
    expect(new Complex(2, 3).modulus()).toEqual(Math.sqrt(13));
  });
});

describe('sqrt', () => {
  it('', () => {
    expect(new Complex(5, 12).sqrt()).toEqual([new Complex(3, 2), new Complex(-3, -2)]);
    expect(new Complex(7, -24).sqrt()).toEqual([new Complex(4, -3), new Complex(-4, 3)]);
  });
});

describe('a / 0', () => {
  it('', () => {
    expect(() => a.div(new Complex(0, 0))).toThrow();
  });
});
