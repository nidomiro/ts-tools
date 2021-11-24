export function prefixStringIfDefined(prefix: string, str: string): string
export function prefixStringIfDefined(prefix: string, str: null): null
export function prefixStringIfDefined(prefix: string, str: undefined): undefined
export function prefixStringIfDefined(prefix: string, str: string | null | undefined): string | null | undefined
export function prefixStringIfDefined(prefix: string, str: string | null | undefined): string | null | undefined {
	if (str == null) {
		return str
	}
	return prefix + str
}

export function trimString(str: string, trim: boolean | 'start' | 'end'): string {
	if (trim === false) {
		return str
	} else if (trim === 'start') {
		return str.trimStart()
	} else if (trim === 'end') {
		return str.trimEnd()
	} else {
		return str.trim()
	}
}
