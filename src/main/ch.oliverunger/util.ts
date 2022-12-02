export const range = (start: number, endExclusive: number): number[] =>
    Array.from(Array(endExclusive - start + 1).keys()).map(x => x + start);