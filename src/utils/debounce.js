function debounce (fn ,wait = 50, immediate) {
  let timer = null;

  return function(...args) {
    if (immediate && (timer === null)) { // immediate表示是否第一次执行
      fn.apply(this, args);
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, wait);

  }
}

export default debounce;