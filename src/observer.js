/**
 * 实现观察者模式
 */
let obj1 = [1,2,3,4,5]
global.testObj = {
  func1: (v) => console.log(v),
  obj1,
  obj2: {x:1, y:2, z: function() {console.log(arguments)}},
  func2: (x,y) => console.log(x+y),
  func3: (z) => console.log(z),
  obj3: {x: ['a1', ...obj1, 'a2', {y: (g) => console.log('g:', g)}]}
}

global.testWatcher = {
  _targetUpdate: (obj, key, val) => {
    console.log('obj:', obj)
    console.log('key:', key)
    console.log('val:', val)
  }
}

/**
 * 遍历obj，并apply func至member m
 */
global.walk = (obj, func=console.log) => {
  // assert(typeof obj === 'object')
  Object.keys(obj).forEach((key) => {
    let val = obj[key]
    if (!val) return

    let type = typeof val
    if (type === 'function') return

    func(obj, val, key)
    if (type === 'object') {
      walk(val, func)
    }
  })
}

global._observablize = (obj, val, key) => {
  if (obj[key+'_watched']) return
  // 强化属性
  if (obj.__ob__ === undefined) {
    Object.defineProperties(obj, {
      __ob__: {
        value: {},
        configurable: false,
        enumerable: false,
        writable: true
      }
    })
  }
  Object.defineProperties(obj.__ob__, {
    [key+'_watched']: {
      value: true,
      configurable: false,
      enumerable: false,
      writable: false
    },

    [key+'_watchers']: {
      value: [],
      configurable: false,
      enumerable: false,
      writable: true
    },

    [key+'_val']: {
      value: val,
      configurable: false,
      enumerable: false,
      writable: true
    },
  })

  Object.defineProperties(obj, {
    [key]: {
      configurable: true,
      enumerable: true,
      // 设置get，set
      get: () => obj.__ob__[key+'_val'],
      // 值改变
      set: (newVal) => {
        obj.__ob__[key+'_val'] = newVal
        let watchers = obj.__ob__[key+'_watchers']
        for(let watcher of watchers) {
          watcher._targetUpdate(obj, key, newVal)
        }

        // 重新搞一下，使newVal可被观测并添加watchers，
        // 如果newVal是一个Object的话
        observablize(obj)
        watchers.forEach((w) => addWatcher(w, obj))
      }
    }
  })
}

global.observablize = (obj) => {
  walk(obj, _observablize)
  return obj
}

global.addWatcher = (watcher, obj) => {
  walk(obj, (theObj, value, key) => {
    let watchers = theObj.__ob__[key+'_watchers']
    if(!watchers) debugger
    if (watchers.includes(watcher)) {
      return
    }
    watchers.push(watcher)
  })
}
