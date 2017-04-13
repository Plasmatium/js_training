/* range generator is a better way for range iterator
 * usage: range(10).walk(...), range(10,20).walk(...)
 * range(10, 20, 2).walk(...)
 */
global.range = function (...args) {
	let min, max, step
	// arguments type check
	args.forEach(arg => {
		if (typeof arg !== 'number') throw TypeError(`${arg} is not a number.`)
	})
	// arguments assignment
	if (args.length === 1) [min, max, step] = [0, args[0], 1]
	else if (args.length === 2) [min, max, step] = [...args, 1]
	else if (args.length === 3) [min, max, step] = args

	// main generator
	function* gen() {
		for (let i=min; i<max; i+=step) {
			yield i
		}
	}

	// return object
	let rslt = { min, max, step }
	rslt[Symbol.iterator] = gen
	return rslt
}

global.arr = [1,[[2,3],4],[5,6]]

global.flat = function* (a) {
	for (let i=0; i<a.length; i++) {
		if (typeof a[i] !== 'number') {
			yield* flat(a[i])
		} else {
			yield a[i]
		}
	}
}


/* 尝试自行构建es6.ruanyifeng.com上第一个promise和generator的例子
 * http://es6.ruanyifeng.com/#docs/promise#Generator函数与Promise的结合
 * run函数首先构建目标generator，并使用go函数执行。目标generator产生promise
 * （yield出来），go函数中判断generator是否done，如果没有done，那么递归调用go函数
 * 参数为generator的next函数
 */

global.timeout = (t, msg) => {
	return new Promise((res, rej) => {
		setTimeout(res, t*1000, msg)
	})
}

const doLog = v => {
	console.log('v is', v)
	let t = Math.random()
	return timeout(t, 'msg:'+t)
}

global.nthDoLog = (n, fetch=console.log) => {
	let t = Math.random()
	let currPromise = timeout(t, 'msg: '+t)

	for(let i=0; i<n; i++) {
		currPromise = currPromise.then(doLog)
	}

	currPromise.then(fetch)
}

global.g = function* (...args) {
	for(let p of range(...args)) {
		let t = Math.random()
		let msg = `This is No. ${p} excuted, cost ${t} seconds`
		console.log(`befor: ${p}=====>`)
		let prev = yield timeout(t, msg)
		console.log(`after ${p}, msg: ${prev}<======`)
	}
}

global.run = (iter) => {
	function go(result) {
		if(result.done) {
			return 'done'
		} else {
			result.value.then(v => {
				console.log('v is: ', v)
				console.log('in run, ready to iter.next')

				go(iter.next(v))
			})
		}
	}

	go(iter.next())
}

/* 第二个例子
 */

global.fetchSquare = (x, res, rej) => {
	return new Promise((res, rej) => {
		console.log(`fetching square of ${x}`)
		let t = Math.random()*3000
		if (typeof x === 'number') {
			setTimeout(res, t, x*x)
		} else {
			setTimeout(rej, t, `type of ${x} is not number`)
		}
	})
}

global.task = function* (x) {
	for (let i=0; i<5; i++) {
		x = yield fetchSquare(x)
	}
}

global.scheduler = (g) => {
	let rslt = []

	function go(result) {
		if(result.done) return 'done'
		result.value.then(v => {
			rslt.push(v)
			go(g.next(v))
		})
	}

	go(g.next())
	return rslt
}

/* 第17章 */
