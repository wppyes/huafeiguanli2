<template>
  <div class="ncustomer boxright">
    <div class="filter-container">
      <el-input
          placeholder="请输入关键字"
          v-model="listQuery.name"
          style="width: 150px;"
          class="filter-item"
          clearable
        />
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="公司名称" prop="ComPany" align="center"></el-table-column>
      <el-table-column label="类型" prop="TypeStr" align="center"></el-table-column>
      <el-table-column label="客户名" prop="UserName" align="center"></el-table-column>
      <el-table-column label="电话" prop="Phone" align="center"></el-table-column>
      <el-table-column label="登录名" prop="LoginName" align="center"></el-table-column>
      <el-table-column label="性别" align="center">
          <template slot-scope="scope">
              {{scope.row.Sex==1?'男':'女'}}
          </template>
      </el-table-column>
      <el-table-column label="账户(元)" align="center">
            <template slot-scope="scope">
                 {{parseFloat(scope.row.Balance).toLocaleString()}}
            </template>
      </el-table-column>
      <el-table-column label="状态" prop="LoginName" align="center">
          <template slot-scope="scope">
            <span :class="'status'+scope.row.IsZH">{{scope.row.IsZH==0?'未开通':'已开通'}}</span>
            </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tag size="small" v-show="scope.row.IsZH==1" @click="jiakuanpanel(scope.row,'加款')">加款</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogStatus" :visible.sync="dialogaddVisible" width="550px">
      <el-form
        ref="dataFormadd"
        :rules="rulesadd"
        :model="tempadd"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >       
        <el-form-item label="充值金额" prop="amount">
          <el-input v-model.number="tempadd.amount" placeholder="请填写充值金额"/>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="tempadd.remark" type="textarea" placeholder="请填写描述"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaddVisible = false">取消</el-button>
        <el-button type="primary" @click="addbth">确定</el-button>
      </div>
    </el-dialog>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.sum"
      @pagination="getList"
    />
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
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
  name: "ncustomer",
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,      
      listQuery: {
        page: 1, //页数
        sum: 10, //每页展示数量
        name: "" //关键字
      },
      total:0,
      NType:[],//充值视频还是话费类型
      CustomerType:[],//充值接口类型
      channel:[],//通道列表
      tempadd:{
        cid:0,
        amount:'',
        remark:''        
      },
      dialogStatus: "", //面板标题
      dialogaddVisible: false, //加款面板是否展示
      amounttype:1,//当前tab面板
      tabheadlist:[],//tab头部列表
      tablist:[],//tab列表
      templist:[],//列表总数据
      rulesadd:{
        amount: [
          { required: true, trigger: ['change'], validator: validnum },{ type: 'number', message: '金额必须为数字值'}
        ],
      }
    };
  },
  created() {
      request({
      url: "News/NCustomer/GetNewsTypeList",
      method: "get",
      params:{}
      }).then(response => {
        if(response.Status==1){
          this.NType = response.NType;
          this.CustomerType = response.CustomerType;
        }
      });
      this.getList();
  },
  methods: {
    handleFilter(){
        this.listQuery.page=1;
        this.getList();
    },
    getList(){
          this.listLoading = true;
          request({
          url: "News/NCustomer/GetNCustomerList",
          method: "get",
          params: this.listQuery
          }).then(response => {
        if(response.Status==1){
              this.list = response.List.DataList;
              this.total = response.List.TotalPage;
              this.listLoading=false;
        }
          });
    },     
    setstr(val) {
        for (let i in this.NType) {
            if (this.NType[i].Value == val) {
                return this.NType[i].Text;
            }
        }
    }, 
    addbth(){
      this.$refs["dataFormadd"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.tempadd);
        request({
            url: "News/NCustomer/SetNCustomerPackage",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              this.dialogaddVisible = false;
            }
          });
        }
      });
       
    },
    changelist(){
        this.tablist=this.templist.filter(v => v.ProductType == this.amounttype);
    },
    jiakuanpanel(row,title){
      this.dialogStatus = title;
      this.dialogaddVisible = true;
      this.tempadd={
        cid: row.Id,
        amount:'',
        remark:'' 
      };
      this.$nextTick(() => {
        this.$refs["dataFormadd"].clearValidate();
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.ncustomer .add {
  margin-bottom: 20px;
}
.ncustomer{
  .el-tag{cursor: pointer;}
  .status4 {
    color: #409eff;
  }
  .status2 {
    color: #67c23a;
  }
  .status3 {
    color: #f56c6c;
  }
  .status1 {
    color: #e6a23c;
  }
  .status5 {
    color: #500f51;
  }
  .status6 {
    color: #51210f;
  }
}

</style>
