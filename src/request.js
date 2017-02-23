/**
 * Created by jonnywong on 2017/2/23.
 */

// request implemented by XMLHTTPRequest


const get = (url, res, rej) => {
  let req = new XMLHttpRequest();
  req.onreadystatechange = () => {
    if (req.readyState !== 4) return;
    if (req.status === 200) {
      res(req);
    }
    else {
      rej(req);
    }
  }

  req.open("GET", url, true);
  req.send();
};

global.get = get;

let url = 'http://localhost:8888/';
global.run = (num, totalTime = 5) => {
  for(let i=0; i<num; i++) {
    let delay = Math.random()*totalTime;
    let res = (r) => console.log(r.responseText);
    get(url+delay, res, null);
  }
}