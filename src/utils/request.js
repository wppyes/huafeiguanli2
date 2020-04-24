import axios from 'axios'
import { MessageBox ,Message } from 'element-ui'
import router from '../router/index'
var count=0;
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
const service = axios.create({
   baseURL: 'http://192.168.1.145:8022/',
  //  baseURL: '/API/', // api 的 base_url
  timeout: 5000, // request timeout
})
service.interceptors.request.use(
  config => {  
    let token = localStorage.getItem('SiteKey');
    if (token) {  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // config.headers.SiteKey = token;
        config.headers['SiteKey'] = token
    }
    return config;
  },
  error => {
    console.log(error) // for debug
    Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => {
    const res = response.data; 
    if(res.Status ==0 ){
      Message({
        message: res.Msg,
        type: 'error'
      });
      return;
    };
    if(res.Status ==400 ){
      count++;
      if(count==1){
        MessageBox.alert('登录超时', '失败', {
          confirmButtonText: '确定',
          callback: action => {
              localStorage.clear();
              router.push({ path: "/" ,query:{redirect:location.hostname}});
          }
        });   
        localStorage.clear();
        setTimeout(() => {
          count=0;
        }, 800);
      };
      // router.push({ path: "/" });
      return;
    };
    if(res.Status ==401 ){
      router.push({ path: "/error/401" });
      return;
    };
    return res;
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: '获取数据超时',
      type: 'error'
    });
    return Promise.reject(error)
  }
)
export default service
