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
          <el-select v-model="temp.cid" placeholder="请选择角色">
            <el-option v-for="item in userlist" :label="item.UserName+'--'+item.ComPany" :key="item.Id" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道" prop="setting">
          <el-select v-model="temp.setting" placeholder="请选择角色">
            <el-option v-for="item in channelist" :label="item.ChannelName" :key="item.ChannelType" :value="item.ChannelType"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.number="temp.phone"></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model.number="temp.amount"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="submitUpload" style="margin-top:20px;margin-left:150px">确 定</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";
import {isvalidPhone} from '@/utils/validate';
var validPhone=(rule, value,callback)=>{
      if (!value){
          callback(new Error('请输入电话号码'))
      }else  if (!isvalidPhone(value)){
        callback(new Error('请输入正确的11位手机号码'))
      }else {
          callback()
      }
  }
  var validnum=(rule, value,callback)=>{
      if (value<=0){
          callback(new Error('请输入正确的金额'))
      }else {
          callback()
      }
  }
export default {
  name: "chargephone",
  data() {
    return {
      userlist: null,//用户列表
      channelist: [], //通道列表
      temp: {
        cid: '',
        setting: "",
        phone:'',
        amount:''
      },
      rules: {
        cid: [
          { required: true, message: "用户必须填写！", trigger: "change" }
        ],
        phone:[{ required: true, trigger: ['change'], validator: validPhone }],
        amount:[{ required: true, trigger: ['change'], validator: validnum },{ type: 'number', message: '金额必须为数字值'}]
      },
    };
  },
  created() {
    request({
      url: "Charge/ChargeOrder/GetNChannelSettingList",
      method: "get",
      params: {type: 1,status:1}
    }).then(response => {
      if (response.Status==1) {
      this.channelist = response.List;
      this.userlist = response.modelCustomer;
      }
    });
  },
  methods: {
    submitUpload(){
      if(!this.temp.setting){
        this.temp.setting=0;
      }
        this.$refs["dataForm"].validate(valid => {
        if (valid) {
            var data = this.$qs.stringify(this.temp);
            request({
                url: "Charge/Telephone/Single",
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
