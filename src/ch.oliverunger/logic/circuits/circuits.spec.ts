import {qrng} from './circuits';
import {bit} from "../math/truth-table";

describe('QRNG should generate 0s and 1s', () => {
  it('', () => {
    let hasZero = false;
    let hasOne = false;
    let counter = 0;
    while ((!hasZero || !hasOne) && counter < 100) {
      counter++;
      const rand: bit = qrng();
      if (rand === 0 && !hasZero) {
        hasZero = true;
      } else if (rand === 1 && !hasOne) {
        hasOne = true;
      }
    }
    expect(hasZero && hasOne).toBeTruthy();
  });
});
