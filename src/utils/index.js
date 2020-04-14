// export function isPhone(val) {
//   const pattern = /^1(3|4|5|7|8|9)\d{9}$/;
//   if (pattern.test(val)) {
//     return true;
//   }
//   return false;
// }
// 当月1号
export function getThisMonth() {
  const myDate = new Date();
  const thisyear = myDate.getFullYear();
  const month = myDate.getMonth() + 1;
  const thismonth = month < 10 ? `0${month}` : { month };
  return `${thisyear}-${thismonth}-01`;
}

// 图表 设置千分位
export function formatNum(strNum) {
  if (strNum.length <= 3) {
    return strNum;
  }
  if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
    return strNum;
  }
  const a = RegExp.$1;
  let b = RegExp.$2;
  const c = RegExp.$3;
  const re = new RegExp();
  re.compile('(\\d)(\\d{3})(,|$)');
  while (re.test(b)) {
    b = b.replace(re, '$1,$2$3');
  }
  return `${a}${b}${c}`;
}

