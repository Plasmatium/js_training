global.round = (x, n) => {
  return Math.round(x*Math.pow(10,n))/Math.pow(10,n)
}

global.timeout = (t, msg) => {
  return new Promise((res, rej) => {
    let func = function (...args) {
      console.log(`after ${t}s, msg fetched: ${msg}`)
      res(...args)
    }
    if (msg == 'err') {
      func = rej
    }
    if(typeof msg === 'object') {
      //此段为了配合下面的steps1，正常情况下msg是string
      msg.total += t
      msg.str += t+'\n'
    }
    setTimeout(func, t*1000, msg)
  })
}

global.steps1 = async function (n) {
  let msg = {str:'start:\n', total:0}
  for (let i=0; i<n; i++) {
    let t = round(Math.random()/10, 2)
    msg = await timeout(t, msg)
  }

  msg.str += 'end'
  return new Promise((res, rej) => res(msg))
}


global.excute = function (g, result) {
  if (result.done) return result.value
  return result.value.then(value => {
    return excute(g, g.next(value))
  })
}

global.co = function (gen, ...args) {
  let g = gen(...args)
  return excute(g, g.next())
}

global.calc = function (n) {
  let start = new Date()
  steps1(n).then(msg => {
    let end = new Date()
    let interval = (end-start)/1000
    console.log('cost:', interval)
    console.log('eval:', msg.total)
  })
}

global.fetch = function (url) {
  let t = Math.random()
  t = Math.round(t*100)/100
  let msg = `data returned as: ${url}, cost ${t}s.`
  return timeout(t, msg).then(value => {
    return Promise.resolve({text: () => msg})
  })
}

//------------------------------
global.us = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10', 'h11', 'h12']

global.logInOrder_promise = function (urls) {
  // 远程读取所有URL
  const textPromises = urls.map(url => {
    return fetch(url).then(response => response.text());
  });

  // 按次序输出
  textPromises.reduce((chain, textPromise) => {
    let arr
    return chain.then(v => {arr = v;return textPromise})
      .then(text => {console.log(text);arr.push(text); return arr});
  }, Promise.resolve([]));
}

global.f = function (urls) {
  let ps = urls.map(url => {
    return fetch(url).then(resp=>resp.text())
  })
  //*
  ps.reduce((chain, p) => {
    return chain.then(() => p).then(console.log)
  }, Promise.resolve())
  //*/
}


global.f2 = async function (urls) {
  let ps = urls.map(url => {
    return fetch(url).then(resp=>resp.text())
  })

  for(let i=0; i<ps.length; i++) {
    let msg = await ps[i]
    console.log(msg)
  }
}
