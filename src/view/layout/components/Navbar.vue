<template>
  <div class="navbar">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />



    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="face" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>{{ username}}</el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="dialogFormVisible = true">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="dialogFormimg = true; filepath=''">修改头像</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" v-on:close="getclose">
      <el-form
        :model="form"
        :rules="loginRules"
        ref="dataForm"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item prop="logpassword" label="当前密码">
          <el-input
            style="width:80%"
            name="logpassword"
            v-model="form.logpassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="newpassword" label="新密码">
          <el-input
            style="width:80%"
            name="newpassword"
            v-model="form.newpassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="Nnewpassword" label="再次确认">
          <el-input
            style="width:80%"
            name="Nnewpassword"
            v-model="form.Nnewpassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="getpassword('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改头像" :visible.sync="dialogFormimg" width="400px">
      <div style="text-align:center">
        <el-upload
          class="avatar-uploader"
          :limit="1"
          ref="upload"
          :show-file-list="false"
          accept=".jpg, .png"
          action
          :http-request="upLoad"
        >
          <img v-if="filepath" :src="filepath" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div style="margin-top:20px">
        <el-button type="primary" @click="getupimg">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Hamburger from "@/components/Hamburger";
import request from "@/utils/request";
import upfile from "@/utils/upload";
import faceimg from '@/assets/temp.png'
export default {
  components: {
    Hamburger
  },
  data() {
    return {
      face: "",
      filepath: "",
      username: "",
      dialogFormVisible: false,
      dialogFormimg: false,
      form: {
        logpassword: "",
        newpassword: "",
        Nnewpassword: ""
      },
      loginRules: {
        logpassword: [
          {
            required: true,
            message: "当前密码不能为空！",
            trigger: "blur"
          }
        ],
        newpassword: [
          {
            required: true,
            message: "新密码不能为空！",
            trigger: "blur"
          }
        ],
        Nnewpassword: [
          {
            required: true,
            message: "确认密码不能为空！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["sidebar", "device"])
  },
  created() {
    var arr = JSON.parse(localStorage.getItem("logintemp"));
    if (arr) {
      this.face = arr.img || faceimg;
      this.username = arr.Name;
    }else{
      this.face=faceimg;
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("toggleSideBar");
    },
    logout() {
      this.$confirm("你确定要退出吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          request({
            url: "/home/SignOut",
            method: "get",
            param:{}
          }).then(response => {
            if (response.Status == 1) {
              this.$router.push({ path: "/" ,query:{redirect:location.hostname} });
              localStorage.clear();
              this.$message({
                message: '退出成功',
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    getclose() {
      this.form.logpassword = "";
      this.form.newpassword = "";
      this.form.Nnewpassword = "";
    },
    upLoad(param) {
      upfile(param.file, "Upload/UploadImage?folder=ModifyImg", data => {
        if (data.Status) {
          this.filepath = data.Path;
        } else {
          this.$message({
            message: data.Msg,
            type: "error"
          });
        }
      });
    },
    getupimg: function() {
      var data = this.$qs.stringify({ img: this.filepath });
      request({
        url: "Manager/Users/ModifyImg",
        method: "post",
        data
      }).then(response => {
        if (response.Status == 1) {
          this.face = this.filepath;
          this.dialogFormimg = false;
        }
      });
    },
    getpassword() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (this.form.logpassword == this.form.newpassword) {
            this.$message({
              message: "新密码不能与旧密码一样！",
              type: "error"
            });
          } else {
            if (this.form.newpassword !== this.form.Nnewpassword) {
              this.$message({
                message: "新密码与确认密码不一致！",
                type: "error"
              });
            } else {
              var data = this.$qs.stringify({
                old: this.form.logpassword,
                Pwd: this.form.newpassword
              });
              request({
                url: "Manager/Users/ModifyPwd",
                method: "post",
                data
              }).then(response => {
                if (response.Status == 1) {
                  this.dialogFormVisible = false;
                  this.$message({
                    message: response.Msg,
                    type: "success"
                  });
                  localStorage.clear();
                  setTimeout(function() {
                    location.reload();
                  }, 1000);
                }
              });
            }
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  border-bottom: 1px solid #e4e7ed;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .breadcrumb-container {
    float: left;
  }
.user-avatar{width: 50px; height: 50px; border-radius: 6px;}
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
 .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
  }
}
</style>
