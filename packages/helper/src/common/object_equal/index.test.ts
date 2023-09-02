import { equalObject } from './index'

describe('test the equalObject', () => {
    test('compare {name: 123} to equal {name: 123}', () => {
        expect(equalObject({name: 123},{name: 123})).toBe(true)
    })

    test('compare {name: null} to equal {name: undefined}', () => {
        expect(equalObject({name: null},{name: undefined})).toBe(false)
    })

    test('compare function to equal function', () => {
        expect(equalObject({name: () => console.log(123), age: [12,123], height: {hei: 123,width: null,date: true}},{name: () => console.log(123), age: [12,123], height: {hei: 123,width: null,date: true}})).toBe(true)
    })

    test('compare deep object equal deep object', () => {
        expect(equalObject({name:[1,2,3, {age: [{arr: [{nihao:'nihao'}]}]}]},{name:[1,2,3, {age: [{arr: [{nihao:'nihao'}]}]}]})).toBe(true)
    })
})