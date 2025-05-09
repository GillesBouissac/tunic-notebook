import { type Token, type Tokens, type TokensList } from 'marked';
import { SymbolBean } from "$lib/model/SymbolBean.svelte.js";
import { renderSymbol, SYMBOL_CODE_MASK } from '$lib/graphics/Symbol.svelte' ;

export const SYMBOL_PATTERN = /^tunic\s*\(\s*(0x[a-z0-9]+|[0-9]+)\s*\)(\s*)/i;
export const SYMBOL_PATTERN_GLOBAL = /tunic\s*\(\s*(0x[a-z0-9]+|[0-9]+)\s*\)(\s*)/gi;
export const SYMBOL_WORD_PATTERN = /(tunic\s*\(\s*(0x[a-z0-9]+|[0-9]+)\s*\))+/gi;

export type TunicOptions = {
    alphabet?: Map<number,SymbolBean>;
	decode?: {value:boolean};
	urls?: boolean;
	highlight?: {code:number};
}

const TAB_SIZE = 2;

/**
 * Marked extension builder
 * 
 * @param options Options provided
 * @returns The builder
 */
export function markedTunic (options: TunicOptions) {
	return {
		extensions: [
			tunicSymbolFromCode(options)
		]
	};
}

/**
 * The marked extension object
 * 
 * @param options Options provided
 * @returns The extension
 */
function tunicSymbolFromCode(options: TunicOptions) {
	if (options.decode===undefined) {
		options.decode = {value:true};
	}
	return {
		name: 'tunicSymbolCode',
		level: 'inline',
		start(src: string) { return src.match(/tunic/)?.index; }, 
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		tokenizer(src: string, tokens: Token[] | TokensList) {
			const match = src.match(SYMBOL_PATTERN);
			if (match) {
				return {
					type: 'tunicSymbolCode',
					raw: match[0],
                    code: parseInt(match[1]) & SYMBOL_CODE_MASK,
					spaces: match[2].replaceAll(/[^ \t]/g,"").replaceAll(/\t/g," ".repeat(TAB_SIZE)).length
				};
			}
		},
        renderer(token: Tokens.Generic) {
			const bean = options?.alphabet?.get(token.code);
            return renderSymbol(token.code, options.decode?.value ? bean?.meaning : undefined, token.spaces, options.urls, token.code==options.highlight?.code);
        }
	};
}
