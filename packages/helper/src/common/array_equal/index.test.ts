import { equalArray } from './index'

describe('test the equalArray', () => {
    test('compare [1,2] to equal [1,2]', () => {
        expect(equalArray([1,2],[1,2])).toBe(true)
    })

    test('compare [1,2,3] to equal [1,3,2]', () => {
        expect(equalArray([1,2,3],[1,3,2])).toBe(false)
    })

    test('compare [{name: 123,age: 123, }] to equal [{name: `123`,age:123}]', () => {
        expect(equalArray([{name: 123,age: 123, }],[{name:'123',age:123}])).toBe(false)
    })

    test('compare [{name: 0,age: 123, }] to equal [{name: null,age:123}]', () => {
        expect(equalArray([{name: 0,age: 123, }],[{name: null,age:123}])).toBe(false)
    })

    test('compare [{name: 123 ...more to equal [{name: 123 ...more', () => {
        expect(equalArray([{name: 123,age: [{name: 'nihao', age: [{one: 'one',two:[]}]},{haha: {nihao: [123,123]}}] }],[{name: 123,age: [{name: 'nihao', age: [{one: 'one',two:[]}]},{haha: {nihao: [123,123]}}] }])).toBe(true)
    })

   
})