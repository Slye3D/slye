/**
 *    _____ __
 *   / ___// /_  _____
 *   \__ \/ / / / / _ \
 *  ___/ / / /_/ /  __/
 * /____/_/\__, /\___/
 *       /____/
 *       Copyright 2017 Slye Development Team. All Rights Reserved.
 *       Licence: MIT License
 */

const rtlRegex	= / |[\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufc3f]|[\ufe70-\ufefc]/
const checkRtl	= x => rtlRegex.test(x)

const persian4Kind = {
	'ئ': [
		'ئ',
		'ﺋ',
		'ﺊ',
		'ﺌ'
	]
	,'ب': [
		'ب',
		'ﺑ',
		'ﺐ',
		'ﺒ'
	]
	,'پ': [
		'پ',
		'ﭘ',
		'ﭗ',
		'ﭙ'
	]
	,'ت': [
		'ت',
		'ﺗ',
		'ﺖ',
		'ﺘ'
	]
	,'ث': [
		'ث',
		'ﺛ',
		'ﺚ',
		'ﺜ'
	]
	,'ج': [
		'ج',
		'ﺟ',
		'ﺞ',
		'ﺠ'
	]
	,'چ': [
		'چ',
		'ﭼ',
		'ﭻ',
		'ﭽ'
	]
	,'ح': [
		'ح',
		'ﺣ',
		'ﺢ',
		'ﺤ'
	]
	,'خ': [
		'خ',
		'ﺧ',
		'ﺦ',
		'ﺨ'
	]
	,'س': [
		'س',
		'ﺳ',
		'ﺲ',
		'ﺴ'
	]
	,'ش': [
		'ش',
		'ﺷ',
		'ﺶ',
		'ﺸ'
	]
	,'ص': [
		'ص',
		'ﺻ',
		'ﺺ',
		'ﺼ'
	]
	,'ض': [
		'ض',
		'ﺿ',
		'ﺾ',
		'ﻀ'
	]
	,'ط': [
		'ط',
		'ﻃ',
		'ﻂ',
		'ﻄ'
	]
	,'ظ': [
		'ظ',
		'ﻇ',
		'ﻆ',
		'ﻈ'
	]
	,'ع': [
		'ع',
		'ﻋ',
		'ﻊ',
		'ﻌ'
	]
	,'غ': [
		'غ',
		'ﻏ',
		'ﻎ',
		'ﻐ'
	]
	,'ف': [
		'ف',
		'ﻓ',
		'ﻒ',
		'ﻔ'
	]
	,'ق': [
		'ق',
		'ﻗ',
		'ﻖ',
		'ﻘ'
	]
	,'ک': [
		'ک',
		'ﮐ',
		'ﮏ',
		'ﮑ'
	]
	,'ك': [
		'ك',
		'ﮐ',
		'ﮏ',
		'ﮑ'
	]
	,'گ': [
		'گ',
		'ﮔ',
		'ﮓ',
		'ﮕ'
	]
	,'ل': [
		'ل',
		'ﻟ',
		'ﻞ',
		'ﻠ'
	]
	,'م': [
		'م',
		'ﻣ',
		'ﻢ',
		'ﻤ'
	]
	,'ن': [
		'ن',
		'ﻧ',
		'ﻦ',
		'ﻨ'
	]
	,'ه': [
		'ه',
		'ﻫ',
		'ﻪ',
		'ﻬ'
	]
	,'ي': [
		'ي',
		'ﯾ',
		'ﯽ',
		'ﯿ'
	]
	,'ی': [
		'ى',
		'ﯾ',
		'ﯽ',
		'ﯿ'
	]
	,'ى': [
		'ى',
		'ﯾ',
		'ﯽ',
		'ﯿ'
	]
}

// ة
// یة

// array -> array
function fixPersianText(t){
	let re = []
		, i

	let isBlank	= (i,x = false) => {
		if(!x)
			return [
				undefined,
				null,
				' ',
				'آ',
				'أ',
				'إ',
				'ا',
				'ؤ',
				'و',
				'د',
				'ذ',
				'ر',
				'ز',
				'ژ',
				'ة'
			].indexOf(t[i]) > -1

		if([
			'x',
			'آ',
			'أ',
			'إ',
			'ا',
			'ؤ',
			'و',
			'د',
			'ذ',
			'ر',
			'ز',
			'ژ',
			'ة'
		].indexOf(t[i]) > -1)
			return false
		return persian4Kind[t[i]] == undefined
	}


	let full = (isPrevBlank,isNextBlank,a,b,c,d) => {
		if(!isPrevBlank && isNextBlank){
			re.push(c)
		}
		if(!isPrevBlank && !isNextBlank){
			re.push(d)
		}
		if(isPrevBlank && !isNextBlank){
			re.push(b)
		}
		if(isPrevBlank && isNextBlank){
			re.push(a)
		}
	}

	// س
	// ل i - 1
	// ا i
	// م i + 1
	//
	// ی
	// ه
	//
	// ق
	// و
	// م
	for(i = t.length - 1;i > -1;i--){
		if(t[i] == 'x')
			continue
		if(t[i - 1] == 'ل'){
			if(t[i] == 'آ'){
				if(isBlank(i - 2))
					re.psuh('ﻵ')
				else
					re.push('ﻶ')
				t[i - 1] = 'x'
				continue
			}
			if(t[i] == 'أ'){
				if(isBlank(i - 2))
					re.psuh('ﻷ')
				else
					re.push('ﻸ')
				t[i - 1] = 'x'
				continue
			}
			if(t[i] == 'إ'){
				if(isBlank(i - 2))
					re.psuh('ﻹ')
				else
					re.push('ﻺ')
				t[i - 1] = 'x'
				continue
			}
			if(t[i] == 'ا'){
				if(isBlank(i - 2))
					re.psuh('ﻻ')
				else
					re.push('ﻼ')
				t[i - 1] = 'x'
				continue
			}
		}

		let isPrevBlank	= isBlank(i - 1)
		let isNextBlank = isBlank(i + 1, true)

		if(t[i] == 'آ' && !isPrevBlank){
			re.push('ﺂ')
			continue
		}
		if(t[i] == 'أ' && !isPrevBlank){
			re.push('ﺄ')
			continue
		}
		if(t[i] == 'إ' && !isPrevBlank){
			re.push('ﺈ')
			continue
		}
		if(t[i] == 'ا' && !isPrevBlank){
			re.push('ﺎ')
			continue
		}
		if(t[i] == 'ؤ' && !isPrevBlank){
			re.push('ﺆ')
			continue
		}
		if(t[i] == 'و' && !isPrevBlank){
			re.push('ﻮ')
			continue
		}
		if(t[i] == 'د' && !isPrevBlank){
			re.push('ﺪ')
			continue
		}
		if(t[i] == 'ذ' && !isPrevBlank){
			re.push('ﺬ')
			continue
		}
		if(t[i] == 'ر' && !isPrevBlank){
			re.push('ﺮ')
			continue
		}
		if(t[i] == 'ز' && !isPrevBlank){
			re.push('ﺰ')
			continue
		}
		if(t[i] == 'ژ' && !isPrevBlank){
			re.push('ﮋ')
			continue
		}
		if(t[i] == 'ة' && !isPrevBlank){
			re.push('ﮥ')
			continue
		}

		if(persian4Kind[t[i]]){
			full(isPrevBlank, isNextBlank, ...persian4Kind[t[i]])
			continue
		}
		re.push(t[i])
	}
	return re
}

function fixLine(text, dir = 'ltr'){
	text = text.split('')
	if(text.length < 2)
		return text.join('')
	let words	= []
	let isRtl	= checkRtl(text[0])
	let word	= []
	for(let i = 0;i < text.length;i++){
		if(checkRtl(text[i]) !== isRtl){
			if(isRtl)
				word = fixPersianText(word)
			words.push(word)
			word	= []
			isRtl	= !isRtl
		}
		word.push(text[i])
	}
	if(isRtl)
		word = fixPersianText(word)
	words.push(word)

	let re = []
	if(dir.toLowerCase() == 'rtl'){
		for(let i = words.length - 1;i > -1;i--){
			word = words[i]
			for(let j = 0;j < word.length;j++){
				re.push(word[j])
			}
		}
	}else{
		for(let i = 0;i < words.length;i++){
			word = words[i]
			for(let j = 0;j < word.length;j++){
				re.push(word[j])
			}
		}
	}
	// console.log(words, re);
	return re.join('')
}

function typer(text, dir = 'ltr'){
	return String(text).split(/\r?\n/).map(x => fixLine(x, dir)).join('\n')
}

export default typer
