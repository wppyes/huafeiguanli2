<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">后台登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入登录密码"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>
      <el-button
        id="TencentCaptcha"
        type="primary"
        style="width:100%;margin-bottom:30px;" 
        @click="handleLogin"       
      >登录</el-button>
    </el-form>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "Login",
  components: {},
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        code: ""
      },
      key: "",
      path: "",
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名必须填写！" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码必须填写！" }
        ],
        code: [{ required: true, trigger: "blur", message: "验证码必须填写！" }]
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          var cap=new TencentCaptcha('2029555843', res=> {     
            var data = this.$qs.stringify({
              Name: this.loginForm.username,
              Pwd: this.loginForm.password,
              ticket: res.ticket, 
              randstr: res.randstr
            });
            request({
              url: "/home",
              method: "post",
              data
            }).then(response => {
              if (response.Status == 1) {
               this.loading = true;
                var tempdata = {
                  Name: response.Model.Name,
                  img: response.Model.Images
                };
                localStorage.setItem("SiteKey", response.SiteKey + ","+response.PathId);
                var modelobj = JSON.stringify(tempdata);
                localStorage.setItem("logintemp", modelobj);                
                this.loading = false;
                if(this.$route.query.redirect == location.hostname){
                  this.$router.go(-1);
                }else{
                  this.$router.push({
                    path: response.Path
                  });
                }                
              }
            });
          });
          cap.show();
          return;
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    &::first-line {
      color: $light_gray;
    }
  }
}
.coded {
  float: right;
  width: 28%;
  height: 47px;
  margin-top: 1px;
}

.coded img {
  width: 100%;
  height: 100%;
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
}
.code-left {
  width: 70%;
  float: left;
}
</style>
