

import { MessageBox } from 'element-ui'
import router from '../router/index'
var baseurl='http://192.168.1.145:8022/';
// var baseurl='/API/';
function upfile(file,url,call){
    var FileController = baseurl+url;     // 接收上传文件的后台地址 
    // FormData 对象
    var form = new FormData();
    form.append("file", file);       // 文件对象
    // XMLHttpRequest 对象
    var xhr = new XMLHttpRequest();
    xhr.open("post", FileController, true);    
    let token = localStorage.getItem('SiteKey');
    xhr.setRequestHeader("SiteKey",token);
    xhr.onload = function (data) {
        var a=data.target.responseText;
        var b=JSON.parse(a);
        if(b.Status ==400 ){
            MessageBox.alert('登录超时', '失败', {
                confirmButtonText: '确定',
                callback: action => {
                    localStorage.clear();
                    router.push({ path: "/" });
                }
              });            
            return;
          };
          if(b.Status ==401 ){
              router.push({ path: "/error/401" });
              return;
            };
        call(b);
    };
    xhr.send(form);
}
export default upfile