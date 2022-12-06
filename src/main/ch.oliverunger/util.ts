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

export function randomIntFromInterval(min: number, maxExclusive: number): number {
    return Math.floor(Math.random() * (maxExclusive - min) + min);
}