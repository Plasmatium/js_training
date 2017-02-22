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

/**
 * curry的帮助函数，用以完成curry的内部实现
 * @param  {Function} func       被curry的原始函数
 * @param  {Array}    arg_list   保存了将被用于func求值的实参列表
 * @param  {Array}    curr_args  当前传入的实参
 * @param  {Number}   arg_cursor 循环指针，用以指示arg_list中接下来要
 *                               替换的placeholder
 * @return {AnyValue|Function}   返回func(...arg_list)执行结果，或者返回
 *                               具有剩余未被替换的placeholder作为形参的
 *                               函数
 */
const _curry = function(func, arg_list, curr_args, arg_cursor) {
  // curry函数调用此帮助函数时，将会为arg_list填充func.length长度的
  // '__'(placeholder), 然后逐渐用curr_args中的实参填充到arg_list，
  // 没填充一次，arg_cursor向后移动一次，直到最后。此时要么全部填充
  // 完毕，并求值func(...arg_list)，要么返回一个需要从头开始继续填
  // 充的函数。
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
