console.log("Installing global_install.js.");

global.x = 'x';

//curry实现。使用递归方式，每次递归减少相应个数的参数
const _curry1 = function(func, arg_num_left, arg_list) {
  if(arg_num_left === 0) {
    return func(...arg_list);
  }

  return function() {
    let new_arg_list = [...arg_list, ...arguments];
    let diff_arg_num = arg_num_left - arguments.length;
    let new_arg_num_left = diff_arg_num >= 0 ? diff_arg_num : 0;
    return _curry1(func, new_arg_num_left, new_arg_list);
  }
};

global.curry1 = (func) => {
  return _curry1(func, func.length, []);
};

//==========curry with place_holder==========
const __ = Symbol('@@place_holder');
global.__ = __;

/******************************
 * 增加placeholder实现，在开始curry时，
 * 原函数有多少参数，就填充多少placeholder，
 * 在调用被curry化的函数时，逐渐用真实参数
 * 填充placeholder，如果给出的真实参数还是
 * placeholder，则保留位置，不填充，直至所
 * 有placeholder被填充，然后求值函数。
*/
const _curry = function(func, arg_list, curr_args, arg_cursor) {
  // func：原始函数
  // arg_list：当前已经收集的真实参数列表
  // curr_args：当前的调用所传递进来的参数列表
  // ph_position：placeholder所在位置

  let gen_curr_args = curr_args.entries();
  for (; arg_cursor < arg_list.length; arg_cursor++) {
    if (arg_list[arg_cursor] !== __) continue;

    let packaged_passed_in_arg = gen_curr_args.next();
    if (packaged_passed_in_arg.done === true) break;

    arg_list[arg_cursor] = packaged_passed_in_arg.value[1];
  }

  if (arg_list.includes(__)) {
    return function () {
      // 如果arg_cursor光标已经走完了arg_list（即arg_list >= arg_list.length，
      // 那么说明还有placeholder没有被替换掉，所以arg_cursor从头开始继续。
      if (arg_cursor >= arg_list.length) arg_cursor = 0;
      return _curry(func, [...arg_list], [...arguments], arg_cursor);
    }
  }
  return func(...arg_list);
};

global.curry = (func) => {
  let arg_list = new Array(func.length);
  arg_list.fill(__);
  return function () {
    return _curry(func, [...arg_list], [...arguments], 0);
  }
};


//test func
global.func = (x,y,z,a,b,c) => console.log(a,b,c,x,y,z);
global.cf = curry(func);
//==========redux, big reducer===============
