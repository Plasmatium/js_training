console.log("Installing global_install.js.");

/**************************
 * training 1             *
 * curry with placeholder *
 **************************/

const __ = Symbol('@@placeholder');
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

/******************************************************
 * training2                                          *
 * redux, big reducer                                 *
 * https://cnodejs.org/topic/56a050ac8392272262331d62 *
 ******************************************************/
global.items = [{price: 10}, {price: 120}, {price: 1000}];

var reducers = {
  totalInDollar: function(state, item) {
    state.dollars += item.price;
    return state;
  },
  totalInEuros : function(state, item) {
    state.euros += item.price * 0.897424392;
    return state;
  },
  totalInPounds : function(state, item) {
    state.pounds += item.price * 0.692688671;
    return state;
  },
  totalInYen : function(state, item) {
    state.yens += item.price * 113.852;
    return state;
  }
  // more...
};

var initialState = {dollars: 0, euros:0, yens: 0, pounds: 0};

const combineReducer = (reducers) => {
  
};

var tatols = items.reduce(combineReducer(reducers), initialState)
// {dollars: 1130, euros: 1015.11531904, yens: 127524.24, pounds: 785.81131152}
