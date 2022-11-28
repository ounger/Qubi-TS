import {
    getAllRowsWith1InCol,
    getTruthtable,
    getTruthtableCol,
    getTruthtableValueAt
} from "../../../../main/ch.oliverunger/logic/math/truth-table";

describe('calcRowsOfTruthtable1InCol', () => {
    test('', () => {
        expect(getAllRowsWith1InCol(1, 0)).toEqual([1]);

        expect(getAllRowsWith1InCol(2, 0)).toEqual([2, 3]);
        expect(getAllRowsWith1InCol(2, 1)).toEqual([1, 3]);

        expect(getAllRowsWith1InCol(3, 0)).toEqual([4, 5, 6, 7]);
        expect(getAllRowsWith1InCol(3, 1)).toEqual([2, 3, 6, 7]);
        expect(getAllRowsWith1InCol(3, 2)).toEqual([1, 3, 5, 7]);

        expect(getAllRowsWith1InCol(4, 0)).toEqual([8, 9, 10, 11, 12, 13, 14, 15]);
        expect(getAllRowsWith1InCol(4, 1)).toEqual([4, 5, 6, 7, 12, 13, 14, 15]);
        expect(getAllRowsWith1InCol(4, 2)).toEqual([2, 3, 6, 7, 10, 11, 14, 15]);
        expect(getAllRowsWith1InCol(4, 3)).toEqual([1, 3, 5, 7, 9, 11, 13, 15]);
    });
});

describe('getTruthtableValueAt', () => {
    test('', () => {
        expect(getTruthtableValueAt(1, 0, 0)).toEqual(0);
        expect(getTruthtableValueAt(1, 1, 0)).toEqual(1);

        expect(getTruthtableValueAt(2, 0, 0)).toEqual(0);
        expect(getTruthtableValueAt(2, 0, 0)).toEqual(0);
        expect(getTruthtableValueAt(2, 1, 0)).toEqual(0);
        expect(getTruthtableValueAt(2, 1, 1)).toEqual(1);
        expect(getTruthtableValueAt(2, 2, 0)).toEqual(1);
        expect(getTruthtableValueAt(2, 2, 1)).toEqual(0);
        expect(getTruthtableValueAt(2, 3, 0)).toEqual(1);
        expect(getTruthtableValueAt(2, 3, 1)).toEqual(1);

        expect(getTruthtableValueAt(3, 0, 0)).toEqual(0);
        expect(getTruthtableValueAt(3, 0, 1)).toEqual(0);
        expect(getTruthtableValueAt(3, 0, 2)).toEqual(0);
        expect(getTruthtableValueAt(3, 1, 0)).toEqual(0);
        expect(getTruthtableValueAt(3, 1, 1)).toEqual(0);
        expect(getTruthtableValueAt(3, 1, 2)).toEqual(1);
        expect(getTruthtableValueAt(3, 2, 0)).toEqual(0);
        expect(getTruthtableValueAt(3, 2, 1)).toEqual(1);
        expect(getTruthtableValueAt(3, 2, 2)).toEqual(0);
        expect(getTruthtableValueAt(3, 3, 0)).toEqual(0);
        expect(getTruthtableValueAt(3, 3, 1)).toEqual(1);
        expect(getTruthtableValueAt(3, 3, 2)).toEqual(1);
        expect(getTruthtableValueAt(3, 4, 0)).toEqual(1);
        expect(getTruthtableValueAt(3, 4, 1)).toEqual(0);
        expect(getTruthtableValueAt(3, 4, 2)).toEqual(0);
        expect(getTruthtableValueAt(3, 5, 0)).toEqual(1);
        expect(getTruthtableValueAt(3, 5, 1)).toEqual(0);
        expect(getTruthtableValueAt(3, 5, 2)).toEqual(1);
        expect(getTruthtableValueAt(3, 6, 0)).toEqual(1);
        expect(getTruthtableValueAt(3, 6, 1)).toEqual(1);
        expect(getTruthtableValueAt(3, 6, 2)).toEqual(0);
        expect(getTruthtableValueAt(3, 7, 0)).toEqual(1);
        expect(getTruthtableValueAt(3, 7, 1)).toEqual(1);
        expect(getTruthtableValueAt(3, 7, 2)).toEqual(1);

    });
});

describe('calcRowsOfTruthtable1InCol', () => {
    test('', () => {
        expect(getTruthtableCol(1, 0)).toEqual([0, 1]);

        expect(getTruthtableCol(2, 0)).toEqual([0, 0, 1, 1]);
        expect(getTruthtableCol(2, 1)).toEqual([0, 1, 0, 1]);

        expect(getTruthtableCol(3, 0)).toEqual([0, 0, 0, 0, 1, 1, 1, 1]);
        expect(getTruthtableCol(3, 1)).toEqual([0, 0, 1, 1, 0, 0, 1, 1]);
        expect(getTruthtableCol(3, 2)).toEqual([0, 1, 0, 1, 0, 1, 0, 1]);
    });
});

describe('getTruthtable', () => {

    test('#Columns = 1', () => {
        expect(getTruthtable(1)).toEqual([
            [0],
            [1]
        ]);
    });

    test('#Columns = 2', () => {
        expect(getTruthtable(2)).toEqual([
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1]
        ]);
    });

    test('#Columns = 3', () => {
        expect(getTruthtable(3)).toEqual([
            [0, 0, 0],
            [0, 0, 1],
            [0, 1, 0],
            [0, 1, 1],
            [1, 0, 0],
            [1, 0, 1],
            [1, 1, 0],
            [1, 1, 1]
        ]);
    });

    test('#Columns = 4', () => {
        expect(getTruthtable(4)).toEqual([
            [0, 0, 0, 0],
            [0, 0, 0, 1],
            [0, 0, 1, 0],
            [0, 0, 1, 1],
            [0, 1, 0, 0],
            [0, 1, 0, 1],
            [0, 1, 1, 0],
            [0, 1, 1, 1],
            [1, 0, 0, 0],
            [1, 0, 0, 1],
            [1, 0, 1, 0],
            [1, 0, 1, 1],
            [1, 1, 0, 0],
            [1, 1, 0, 1],
            [1, 1, 1, 0],
            [1, 1, 1, 1]
        ]);
    });

});

