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

function* objectEntries() {
	let propKeys = Object.keys(this)
	for(let propKey of propKeys) {
		yield [propKey, this[propKey]]
	}
}

global.obj = new Proxy({}, {
  get: function (target, key, receiver) {
    console.log(`getting ${key}!`);
    return Reflect.get(target, key, receiver);
  },
  set: function (target, key, value, receiver) {
    console.log(`setting ${key}!`);
    return Reflect.set(target, key, value, receiver);
  }
});