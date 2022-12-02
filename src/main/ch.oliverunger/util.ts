export const range = (start: number, endExclusive: number): number[] =>
    Array.from(Array(endExclusive - start + 1).keys()).map(x => x + start);

// export const rotateArray = (array: any[], steps: number) => {
//     steps *= -1;
//     steps -= array.length * Math.floor(steps / array.length);
//     array.push.apply(array, array.splice(0, steps));
// }

export const rotateArray = (array: any[], n: number) => {
    let len = array.length;
    let res = new Array(array.length);
    if (n % len !== 0) {
        for (let i = 0; i < len; i++) {
            res[i] = array[(i + (len + n % len)) % len];
        }
        for (let i = 0; i < len; i++) {
            array[i] = res[i];
        }
    }
}