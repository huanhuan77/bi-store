/**
 * Created by zyj on 2019-12-9
 * 过滤器
 */
import Vue from 'vue';
// 设置千分位
Vue.filter('NumFormat', (value) => {
  if (!value) return '0.00';

  /* 原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正 */
  const intPart = Number(value) | 0; // 获取整数部分
  const intPartFormat = intPart.toString()
    .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); // 将整数部分逢三一断

  let floatPart = '.00'; // 预定义小数部分
  const value2Array = value.toString()
    .split('.');

  //= 2表示数据有小数位
  if (value2Array.length == 2) {
    floatPart = value2Array[1].toString(); // 拿到小数部分
    if (floatPart.length == 1) { // 补0,实际上用不着
      return `${intPartFormat}.${floatPart}0`;
    }
    return `${intPartFormat}.${floatPart}`;
  }
  return intPartFormat + floatPart;
});

// 设置千分位  不保留小数
Vue.filter('formatAmount', (value) => {
  if (!value) return '0';
  const c = (value.toString().indexOf('.') !== -1) ? value.toLocaleString() : value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return c;
});
// 四舍五入 保留小数点后两位
Vue.filter('numFilter', (value) => {
  if (!value) return '0.00';
  // 截取当前数据到小数点后两位
  const realVal = parseFloat(value)
    .toFixed(2);
  return realVal;
});

// 格式化年月日
Vue.filter('replaceDate', (time) => {
  if (!time) return;
  if (time) {
    const value = time.toString();
    const d = value.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');
    return d;
  }
});

// 格式化周
Vue.filter('replaceWeek', (time) => {
  if (!time) return '';
  if (time) {
    const value = time.toString();
    const w = `第${value}周`;
    return w;
  }
});
// 格式化年月
Vue.filter('replaceMonth', (time) => {
  if (!time) return '';
  if (time) {
    const value = time.toString();
    const m = value.replace(/^(\d{4})(\d{2})$/, '$1-$2');
    return m;
  }
});


// 设置 小数转为整数
Vue.filter('formatPercent', (value) => {
  if (!value) return '0';
  const str = `${parseFloat((value * 100).toPrecision(12))}`;
  return str;
});

Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1, // month
    'd+': this.getDate(), // day
    'h+': this.getHours(), // hour
    'm+': this.getMinutes(), // minute
    's+': this.getSeconds(), // second
    'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
    S: this.getMilliseconds(), // millisecond
  };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
  for (const k in o) if (new RegExp(`(${k})`).test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : (`00${o[k]}`).substr((`${o[k]}`).length));
  return format;
};
