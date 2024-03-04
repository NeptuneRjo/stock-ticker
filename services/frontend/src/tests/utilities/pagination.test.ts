import * as Paginate from '../../utilities/pagination'

describe("Pagination module tests", () => {
    it("Returns a split array", () => {
        const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const count = 3

        const split = Paginate.applyCountToArray(array, count)

        expect(split.length).toBe(4)
        expect(split[0]).toStrictEqual([1, 2, 3])
        expect(split[3]).toStrictEqual([10])
    })
})


// Prevent compilation error
export {}