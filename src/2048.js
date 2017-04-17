global.$2048_ = function func(arr) {
  let len = arr.length
	let flag = 1
	for(let x=1; x<len; x++) {
    for(let i=flag; i<len; i++) {
      if (arr[i] === 0) { continue }
			if (arr[i-1] === arr[i]) {
				arr[i-1] *= 2
				arr[i] = 0
				flag = i+1
      } else if (arr[i-1] === 0){
        [arr[i-1], arr[i]] = [arr[i], 0]
      }
    }
  }
  return arr
}

global.arr2tile = function(arr) {
  return arr.map((val, idx) => {
    let id
    if(val === 0) id = 'null'
    else id = sha1(Math.random().valueOf().toString(16))
    return {id, val}
  })
}

global.$2048 = function func(arr) {
  let len = arr.length
	let flag = 1
	for(let x=1; x<len; x++) {
    for(let i=flag; i<len; i++) {
      if (arr[i].val === 0) { continue }
			if (arr[i-1].val === arr[i].val) {
				arr[i-1].val *= 2
        arr[i-1].id = arr[i].id
				arr[i] = {id:'null', val:0}
				flag = i+1
      } else if (arr[i-1].val === 0){
        [arr[i-1], arr[i]] = [arr[i], {id:'null', val:0}]
      }
    }
  }
  return arr
}

global.desLog = (arr) => {
  arr.forEach(d => {
    let {id, val} = d
    console.log('id:', id)
    console.log('val:', val)
  })
}

global.test2048 = (arr) => {
  let a = arr2tile(arr)
  desLog(a)
  $2048(a)
  console.log('****************************************')
  desLog(a)
}
