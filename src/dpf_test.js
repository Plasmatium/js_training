/**
 * This js works, but still could not watch
 * such assignment: obj.prop = val, if prop
 * is not in obj, obj will create this prop,
 * but not use Object.defineProperties, so
 * we could not use this to watch these kind
 * of prop' creation
 */

Object.dpf = Object.defineProperties
Object.defineProperties = function () {
  let obj = arguments[0]
  let param = arguments[1]

  let keys = Object.keys(param)
  for (let key of Object.keys(param)) {
    if (key in obj) {
      console.log(key, 'in', obj)
    }
    else {
      console.log(key, 'not in', obj)
    }
  }

  Object.dpf(...arguments)
  return arguments[0]
}
