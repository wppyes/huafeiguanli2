<template>
  <div class="chargephone boxright">
            <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >      
        <el-form-item label="用户" prop="cid">
          <el-select v-model="temp.cid" placeholder="请选择角色" clearable>
            <el-option v-for="item in userlist" :label="item.UserName+'--'+item.ComPany" :key="item.Id" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道" prop="setting">
          <el-select v-model="temp.setting" placeholder="请选择角色" clearable>
            <el-option v-for="item in channelist" :label="item.ChannelName" :key="item.ChannelType" :value="item.ChannelType"></el-option>
          </el-select>
        </el-form-item>
        <el-upload
            class="upload-demo"
            drag
            :limit="1"
            ref="upload"
            accept=".xls,.xlsx"
            action=""
            :http-request="upLoad"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传xls文件</div>
        </el-upload>
      </el-form>
         <el-button type="primary" @click="submitUpload" style="margin-top:20px">确 定</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";
import upfile from '@/utils/upload';
export default {
  name: "chargephone",
  data() {
    return {
      userlist: null,//用户列表
      channelist: [], //通道列表
      temp: {
        cid: '',
        setting: "",
        filepath:''
      },
      rules: {
        cid: [
          { required: true, message: "用户必须填写！", trigger: "change" }
        ],
      },
    };
  },
  created() {
    request({
      url: "Charge/ChargePhone/GetNChannelSettingList",
      method: "get",
      params: {type: 1}
    }).then(response => {
      if(response.Status==1){
        this.channelist = response.List;
        this.userlist = response.modelCustomer;
      }      
    });
  },
  methods: {
     upLoad(param){
         upfile(param.file,'Charge/ChargePhone/Upload',(data => {
             if(data.Status){
                 this.temp.filepath=data.Path;
             }else{
                 this.$message({
                    message: data.Msg,
                    type: "error"
                });
             };
         }))
     },
    submitUpload(){
      
      if(!this.temp.setting){
        this.temp.setting=0;
      }
        this.$refs["dataForm"].validate(valid => {
        if (valid) {  
            if(this.temp.filepath==''){
                this.$message({
                    message: '请上传文件',
                    type: "error"
                });
                return;
            }
            var data = this.$qs.stringify(this.temp);
            request({
                url: "Charge/ChargePhone/Work",
                method: "post",
                data
            }).then(response => {
               if (response.Status==1) {
                    this.$message({
                        message: response.Msg,
                        type: "success"
                    });           
                }
            });
        }
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
