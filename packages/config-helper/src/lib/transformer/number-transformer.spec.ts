import { numberTransformer } from "./number-transformer";


describe('string-transformer', () => {

	it('should return the given string', () => {
		expect(numberTransformer()(42)).toEqual(42)
	})

	it('should return the default value for null', () => {
		expect(numberTransformer(24)(null)).toEqual(24) // TODO: where to make the distinction between a explicit null value set and 'no value available'
	})

	it('should return null if default is not set and value is null', () => {
		expect(numberTransformer()(null)).toEqual(null)
	})

	it('should convert a number-string to a number', () => {
		expect(numberTransformer()('42')).toEqual(42)
	})

	it('should throw TypeError on a non-number-string', () => {
		expect(() => numberTransformer()('abc')).toThrow(TypeError)
	})

	it('should return TypeError on unknown Type', () => {
		expect(() => numberTransformer()({})).toThrow(TypeError)
	})
})