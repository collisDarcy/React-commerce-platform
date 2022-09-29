import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios'
import nProgress from 'nprogress';
import { message } from 'antd'
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'
import store from './pages/store';
import './index.css';
import 'antd/dist/antd.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//设置请求的默认根路径--default.baseURL
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//http request拦截器
axios.interceptors.request.use((config) => {
  nProgress.start();
  //为请求头对象添加token，验证的Authorization字段
  config.headers.Authorization = window.localStorage.getItem('token');
  return config;
}, (error) => {
  return Promise.reject(error);
});
//http reponse拦截器
axios.interceptors.response.use((config) => {
  nProgress.done();
  return config;
}, (error) => {
  message.error(error);
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
