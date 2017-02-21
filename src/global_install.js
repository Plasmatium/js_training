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
const _curry = function(func, arg_list, curr_args) {
  // func：原始函数
  // arg_list：当前已经收集的真实参数列表
  // curr_args：当前的调用所传递进来的参数列表
  // ph_position：placeholder所在位置
/*
debugger;
  let len1 = ph_position.length;
  let len2 = curr_args.length;
  for(let i=0; i<Math.min(len1, len2); i++) {
    let arg = curr_args.shift();
    if(arg !== __) {
      let idx = ph_position.shift();
      arg_list[idx] = arg;
    }
  }

  if(ph_position.length === 0) {
      return func(...arg_list);
  }
  */

  let gen_curr_args = curr_args.entries();
  for(let idx of arg_list) {
    if(arg_list[idx] !== __) continue;

    let packaged_passed_in_arg = gen_curr_args.next();
    if(packaged_passed_in_arg.done === true) break;

    let arg_value = packaged_passed_in_arg.value[1];
    arg_list[idx] = arg_value; 
  }

  if(!arg_list.includes(__)) {
    return func(...arg_list);
  }

  return function () {
    return _curry(func, [...arg_list], [...arguments]);
  }
};

global.curry = (func) => {
  let arg_list = new Array(func.length);
  arg_list.fill(__);
  let ph_position = arg_list.map((val, idx) => idx);
  return function () {
    return _curry(func, [...arg_list], [...arguments], [...ph_position]);
  }
};


//test func
global.func = (x,y,z,a,b,c) => console.log(a,b,c,x,y,z);
global.cf = curry(func);
//==========redux, big reducer===============
