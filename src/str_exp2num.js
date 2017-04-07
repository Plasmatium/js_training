global.tstr = '1.1+2.3-3.2*4.05+5.3/6.7*7+8.8-9.7'

global.calcReg = str => {
	let sign = {'+':1, '-':-1}[str[0]]
	let reg = str.slice(1).replace(/[*\/]/g, c=>`-${c}-`).split('-')

	let rslt = Number(reg.shift())
	for(let i=0; i<reg.length; i+=2) {
		let op = {
			'*': num => rslt *= num,
			'/': num => rslt /= num
		}[reg[i]]

		let num = Number(reg[i+1])
		op(num)
	}
	return sign*rslt
}

global.exp2num = str => {
	let sum = 0
	let reg = []
	reg = `+${str}`.replace(/[\+\-]/g, c=>`&${c}`).split('&')
	reg.shift()

	return reg.reduce((acc, str) => {
		let reg = calcReg(str)
		acc += reg
		return acc
	}, sum)

}

//====================================================================

global.e2n = str => {
	reg = `+${str}`.replace(/[\+\-]/g, c=>`&${c}`).split('&')
	reg.shift()
}