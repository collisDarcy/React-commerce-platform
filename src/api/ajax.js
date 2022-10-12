//react封装请求接口的组件
//完善promise
import axios from 'axios'
import { message } from 'antd'
export default function ajax(url, data = {}, type) {
  return new Promise((resolve, reject) => {
    let promise;
    //发起ajax请求
    if (type === 'GET') {
      promise = axios.get(url, {//配置对象
        params: data//指定请求的参数
      })
    }
    else if (type === 'PUT') {
      promise = axios.put(url, data)
    }
    else {
      promise = axios.post(url, data);
    }
    //成功的回调
    promise.then((reponse) => {
      resolve(reponse);
    }).catch((error) => {
      //失败的回调
      message.error('请求出错' + error);
      reject(error);
    })
  })

}