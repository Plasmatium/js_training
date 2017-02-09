console.log("Installing global_install.js.")

global.x = 'x';

//curry实现。使用递归方式，每次递归减少相应个数的参数
const _curry = function(func, arg_num_left, arg_list) {
  if(arg_num_left === 0) {
    return func(...arg_list);
  }

  return function() {
    let new_arg_list = [...arg_list, ...arguments];
    let diff_arg_num = arg_num_left - arguments.length;
    let new_arg_num_left = diff_arg_num >= 0 ? diff_arg_num : 0;
    return _curry(func, new_arg_num_left, new_arg_list);
  }
}

global.curry = (func) => {
  return _curry(func, func.length, []);
}
