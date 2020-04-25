<template>
  <div class="memberrecharge boxright">
            <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 600px; margin-left:50px;"
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
        <div class="el-form-item is-required">
          <label for="Name" class="el-form-item__label" style="width: 100px;">选择类型</label>
          <div class="el-form-item__content" style="margin-left: 100px;">            
            <el-tabs v-model="status" type="card" @tab-click="handleClick">
            <el-tab-pane
                v-for="(item, index) in typelist"
                :key="item.Value"
                v-if="item.Value>3"
                :label="item.Text"
                :name="item.Value"
            ></el-tab-pane>
            </el-tabs>
            <el-table v-loading="listLoading" :data="listget" border fit highlight-current-row >               
                <el-table-column label="名称" align="center" width="120">
                    <template slot-scope="scope">
                        <span>
                            {{scope.row.ProductName}}
                        </span>                        
                    </template>
                </el-table-column>
                <el-table-column label="面值" prop="Parvalue" width="80px" align="center"></el-table-column>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <span @click="temp.productid=scope.row.GoodId">
                            <i v-show="scope.row.GoodId!=temp.productid" class="fa fa-square-o"></i>
                            <i v-show="scope.row.GoodId==temp.productid" class="fa fa-check-square"></i>
                        </span>
                    </template>
                </el-table-column>
                </el-table>
          </div>
        </div>
        <el-form-item label="账号" prop="account">
          <el-input v-model.number="temp.account"></el-input>
        </el-form-item>
        <el-form-item label="购买数量" prop="buynum">
          <el-input v-model.number="temp.buynum"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="submitUpload" style="margin-top:20px;margin-left:150px">确 定</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";
  var validnum=(rule, value,callback)=>{
      if (value<=0){
          callback(new Error('请输入正确的购买数量！'))
      }else {
          callback()
      }
  }
export default {
  name: "memberrecharge",
  data() {
    return {
      userlist: null,//用户列表
      channelist: [], //通道列表
      list:null,//
      typelist:null,//
      temp: {
        cid: '',
        setting: "",
        buynum:'',
        account:'',
        productid:''
      },   
      vediolist:[],
      listLoading:false,
      listget:[],
    status:'4',
      rules: {
        cid: [
          { required: true, message: "用户必须填写！", trigger: "change" }
        ],
        setting: [{ required: true, message: "通道必须选择！", trigger: "change" }],
        account:[{ required: true, trigger: ['change'],  message: "请输入账号！" }],
        buynum:[{ required: true, trigger: ['change'], validator: validnum },{ type: 'number', message: '购买数量必须为数字值'}]
      },
    };
  },
  created() {
    request({
      url: "Charge/ChargeOrder/GetNChannelSettingList",
      method: "get",
      params: {type: 0,status:1,producttype:1,packageproduct:1,ptype:1}
    }).then(response => {
      if(response.Status==1){
        this.channelist = response.List;
        this.userlist = response.modelCustomer;
        this.list=response.PackageProduct;
        this.typelist=response.PackageProductType;
        this.handleClick();
      }
    });
  },
  methods: {
      handleClick(){
        this.listget=this.list.filter(v => v.ProductType == this.status)
      },
    submitUpload(){
        this.$refs["dataForm"].validate(valid => {
        if (valid) {
            if (this.temp.productid == '') {
                this.$message({
                message: "请选择产品！",
                type: "error"
                });
                return;
            };
            var data = this.$qs.stringify(this.temp);
            request({
                url: "Charge/MemberRecharge/Single",
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
    .memberrecharge i{cursor: pointer; color: #409EFF; font-size: 15px;}
</style>
