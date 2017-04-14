function testable(target) {
  target.prototype.isTestable = true
}

@testable
class MyTestableClass {}
global.MyTestableClass = MyTestableClass
let m = new MyTestableClass()
console.log('asdfasdf', m.isTestable) // true

// function decorator
function now(func) {
  console.log(new Date().toLocalString())
  return func
}
