//封装一个格式化时间的组件
export function formateDate(time) {

  let date = new Date(time);
  let year = date.getFullYear();
  let month = RoundZero(date.getMonth() + 1);
  let day = RoundZero(date.getDate());
  let h = RoundZero(date.getHours());
  let m = RoundZero(date.getMinutes());
  let s = RoundZero(date.getSeconds());
  return year + '/' + month + '/' + day + '---' + h + ":" + m + ":" + s;


}
//补零函数,m>10，补零
function RoundZero(m) {
  return m > 9 ? m : '0' + m;
}