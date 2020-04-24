<template>
  <div class="ncustomer1 boxright">
    
    <div class="filter-container">
      <el-button type="primary" class="add" @click="handleadd('增加客户',true)" style="margin-right:20px;">
        <i class="el-icon-circle-plus"></i> 增加客户
      </el-button>
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
      <el-table-column label="公司名称" prop="ComPany" align="center" width="150px"></el-table-column>
      <el-table-column label="类型" prop="TypeStr" align="center" width="80px"></el-table-column>
      <el-table-column label="客户名" prop="UserName" align="center" width="100px"></el-table-column>
      <el-table-column label="电话" prop="Phone" align="center" width="120px"></el-table-column>
      <el-table-column label="登录名" prop="LoginName" align="center" width="100px"></el-table-column>
      <el-table-column label="性别" align="center" width="60px">
          <template slot-scope="scope">
              {{scope.row.Sex==1?'男':'女'}}
          </template>
      </el-table-column>
      <el-table-column label="账户(元)" align="center" width="200px">
            <template slot-scope="scope">
                 {{parseFloat(scope.row.Balance).toLocaleString()}}
            </template>
      </el-table-column>
      <el-table-column label="状态" prop="LoginName" align="center" width="100px">
          <template slot-scope="scope">
            <span :class="'status'+scope.row.IsZH">{{scope.row.IsZH==0?'未开通':'已开通'}}</span>
            </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tag size="small" @click="handleditor(scope.row,'修改客户',true)">
            <i class="el-icon-edit"></i> 编辑
          </el-tag>
          <el-tag size="small" @click="statuschage(scope.row)">开通账户</el-tag>
          <el-tag v-show="scope.row.Status==0" size="small" @click="changes(scope.row,1)">
            禁用
          </el-tag>
          <el-tag v-show="scope.row.Status==1" size="small"  @click="changes(scope.row,0)">
            启用
          </el-tag>
          <el-tag size="small" @click="resetPwd(scope.row)">重置密码</el-tag>
          <el-tag size="small" v-show="scope.row.IsZH==1"@click="showtongdao(scope.row,'通道管理')">通道管理</el-tag>
          <el-tag size="small" v-show="scope.row.IsZH==1" @click="jiakuanpanel(scope.row,'加款')">加款</el-tag>
          <el-tag size="small" @click="settaocan(scope.row,'设置套餐')">设置套餐</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" width="550px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      > <el-form-item label="类型" prop="Type">
          <el-select v-model="temp.Type" placeholder="请选择类型">
            <el-option v-for="item in CustomerType" :label="item.Text" :key="item.Value" :value="item.Value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司名称" prop="ComPany">
          <el-input v-model="temp.ComPany" placeholder="请填写公司名称"/>
        </el-form-item>
        <el-form-item label="客户名字" prop="UserName">
          <el-input v-model="temp.UserName" placeholder="请填写客户名字"/>
        </el-form-item>
        <el-form-item label="电话" prop="Phone">
          <el-input v-model="temp.Phone" placeholder="请填写电话"/>
        </el-form-item>
        <el-form-item label="登录名" prop="LoginName">
          <el-input v-model="temp.LoginName" placeholder="请填写登录名"/>
        </el-form-item>
        <el-form-item label="性别" prop="Sex">
          <el-radio-group v-model="temp.Sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="dialogStatus" :visible.sync="dialogchannelVisible" width="550px">
      <el-table v-loading="listLoading" :data="channel" border fit highlight-current-row>
        <el-table-column label="分类" align="center">
            <template slot-scope="scope">
              <span v-text="setstr(scope.row.ChannelType)"></span>
            </template>
        </el-table-column>
        <el-table-column label="开关" align="center">
              <template slot-scope="scope">
                  <el-switch v-model="scope.row.IsOpen"></el-switch> 
              </template>
        </el-table-column>
        <el-table-column label="白名单" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.WhiteIP"></el-input>
            </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogchannelVisible = false">取消</el-button>
        <el-button type="primary" @click="channlbth">确定</el-button>
      </div>
    </el-dialog>
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
          <el-input v-model="tempadd.amount" placeholder="请填写充值金额"/>
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
    <el-dialog :title="dialogStatus" :visible.sync="dialogtaocanVisible" width="550px" top="30px" height="600px">
       <el-tabs v-model="amounttype" type="card" @tab-click="changelist">
        <el-tab-pane
            v-for="(item, index) in tabheadlist"
            :key="item.Value"
            :label="item.Text"
            :name="item.Value"
        ></el-tab-pane>
        </el-tabs>
      <el-table v-loading="listLoading" :data="tablist" border fit highlight-current-row>
        <el-table-column label="商品名" prop="ProductName" align="center">
        </el-table-column>
        <el-table-column label="面值" align="center">
              <template slot-scope="scope">
                  {{scope.row.Parvalue}}元
              </template>
        </el-table-column>
        <el-table-column label="扣款金额" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.ActualAmont"></el-input>
            </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogtaocanVisible = false">取消</el-button>
        <el-button type="primary" @click="taocanbth">确定</el-button>
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
       var r = /^[0-9]*[1-9][0-9]*$/
      var r1=/^(-?\d+)(\.\d+)?$/
      if(r.test(value) || r1.test(value)&&value>0){
        callback()
      }else{
        callback(new Error('请输入正确的金额'))
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
      temp: {
        Id: 0,
        Type: "",
        ComPany:'',
        UserName: "",
        Phone: '',
        Sex: '',
        LoginName: ''
      },
      tempadd:{
        cid:0,
        amount:'',
        remark:''        
      },
      dialogStatus: "", //面板标题
      dialogFormVisible: false, //面板是否展示
      dialogchannelVisible: false, //通道面板是否展示
      dialogaddVisible: false, //加款面板是否展示
      dialogtaocanVisible:false,//套餐面板是否展示
      iscreate: false, //是否是添加
      amounttype:1,//当前tab面板
      tabheadlist:[],//tab头部列表
      tablist:[],//tab列表
      templist:[],//列表总数据
      rules: {
        Type: [
          { required: true, message: "类型必须选择！", trigger: "change" }
        ],
        ComPany: [
          { required: true, message: "公司名字必须填写！", trigger: "blur" }
        ],
        UserName: [
          { required: true, message: "客户名必须填写！", trigger: "blur" }
        ],
        Phone:[{ required: true, trigger: ['change'], validator: validPhone }],
        LoginName: [
          { required: true, message: "登录名必须填写！", trigger: "blur" }
        ],
        Sex: [{ required: true, message: "角色必须选择！", trigger: "change" }]
      },
      rulesadd:{
        amount: [
         { required: true, trigger: ['change'], validator: validnum }
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
    channlbth(){//通道确认按钮
        for (let i in this.channel) {
            if (this.channel[i].WhiteIP == '') {
                this.$message({
                  message: '白名单不能为空',
                  type: "error"
                });
                return;
            };
        }
        var param = {
            cid: this.temp.Id,
            list: this.channel
        };
        var data = this.$qs.stringify(param);
        request({
            url: "News/NCustomer/SetNCustomerChannel",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
               this.dialogchannelVisible = false;
            }
          });

    },
    statuschage(row) {        
      this.$confirm("确定要开通账户吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          var data = this.$qs.stringify({ CId: row.Id});
          request({
            url: "News/NCustomer/SetNCallUser",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              row.IsZH = 1;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    handleditor(row, title, creat) {      
      this.temp={
        Id: row.Id,
        Type: row.Type.toString(),
        ComPany:row.ComPany,
        UserName: row.UserName,
        Phone:  row.Phone,
        Sex:  row.Sex.toString(),
        LoginName:  row.LoginName
      };
      this.dialogStatus = row.ComPany+'-'+title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleadd(title, creat) {
      this.temp={
        Id: 0,
        Type: "",
        ComPany:'',
        UserName: "",
        Phone: '',
        Sex:'1',
        LoginName: ''
      }
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "News/NCustomer/SetNCustomer",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {              
              var str = '';
              for (var i in this.CustomerType) {
                  if (this.CustomerType[i].Value == this.temp.Type) {
                      str = this.CustomerType[i].Text;
                      break;
                  }
              }
              if(this.temp.Id==0){
                this.temp.Id = 12;
                this.temp.TypeStr=str;
                this.temp.CId= 0;
                this.temp.IsZH= 0;
                this.temp.HFAccount= 0;
                this.temp.TXAccount= 0;
                this.temp.Balance= 0;
                this.list.push(this.temp);
              }else{
                 for (let i in this.list) {
                    if (this.list[i].Id == this.temp.Id) {
                        this.list[i].Type = this.temp.Type;
                        this.list[i].TypeStr = str;
                        this.list[i].ComPany = this.temp.ComPany;
                        this.list[i].UserName = this.temp.UserName;
                        this.list[i].Phone = this.temp.Phone;
                        this.list[i].Sex = this.temp.Sex;
                        this.list[i].HFAccount = 0;
                        this.list[i].TXAccount = 0;
                    };
                };
              }
              this.$message({
                message: response.Msg,
                type: "success"
              });              
              this.dialogFormVisible = false;
            }            
          });
        }
      });
    },    
    changes(row, type) {
        var cz=type == 0?'启用':'禁用'
      this.$confirm('确定要' + cz + '吗？', "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          return;
          var data = this.$qs.stringify({ Id: row.Id,Status: type});
          request({
            url: "News/NCustomer/UpdateStatus",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              row.Status = type;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    resetPwd(row) {
         var data = this.$qs.stringify({ Id: row.Id });
      this.$confirm("确定要重置密码吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "News/NCustomer/Reset",
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
        })
        .catch(() => {});
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
    showtongdao(row,title) {
      this.dialogStatus = row.ComPany+'-'+title;
      this.dialogchannelVisible = true;
      this.temp={
        Id: row.Id
      };
      request({
      url: "News/NCustomer/GetNCustomerChannel",
      method: "get",
      params:{cid: row.Id}
      }).then(response => {
         if(response.Status==1){ 
          this.channel = [];
          if (response.List.length == this.NType.length) {
              this.channel = response.List;
          };
          if (response.List.length < this.NType.length) {
              this.channel = response.List;
              for (let i in this.NType) {
                  var count = 0
                  for (let j in response.List) {
                      if (response.List[j].ChannelType == this.NType[i].Value) {
                          count++;
                      }
                  }
                  if (count == 0) {
                      var param = {
                          ChannelType: this.NType[i].Value,
                          IsOpen: false,
                          WhiteIP: ''
                      }
                      this.channel.push(param);
                  };
              }
          };
         }
      });
    },
    jiakuanpanel(row,title){
      this.dialogStatus = row.ComPany+'-'+title;
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
    settaocan(row,title) {
      this.temp.Id=row.Id;
      this.dialogStatus = row.ComPany+'-'+title;
      this.dialogtaocanVisible = true;
      this.amounttype = '1';
      request({
      url: "News/NCustomer/GetNCustomerPrice",
      method: "get",
      params:{id: row.Id}
      }).then(response => {
         if(response.Status==1){ 
          this.tabheadlist = response.NType;
          this.templist = response.List;
          this.changelist();
         }
      });
    },
    taocanbth(){
      for (let i in this.templist) {
          if (this.templist[i].ActualAmont == '' || this.templist[i].ActualAmont == 0) {
              this.amounttype = this.templist[i].ProductType.toString();
              this.changelist();
              this.$message({
                message: '请填写金额',
                type: "error"
              });
              return;
          };
      }
      var arr = [];
      for (let i in this.templist) {
          var param = {
              Id: this.templist[i].Id,
              ProductId: this.templist[i].PId,
              ProductType: this.templist[i].ProductType,
              Amount: this.templist[i].Parvalue,
              ActualAmont: this.templist[i].ActualAmont
          };
          arr.push(param);
      }
      var param = {
          id: this.temp.Id,
          list: arr
      };
      var data = this.$qs.stringify(param);
      request({
          url: "News/NCustomer/SetNCustomerPrice",
          method: "post",
          data
        }).then(response => {
          if (response.Status==1) {
            this.$message({
              message: response.Msg,
              type: "success"
            });
            this.dialogtaocanVisible = false;
          }
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.ncustomer .add {
  margin-bottom: 20px;
}
.ncustomer1{
  .el-tag{cursor: pointer;}
  .status4 {
    color: #409eff;
  }
  .status2 {
    color: #e6a23c;
  }
  .status0 {
    color: #f56c6c;
  }
  .status1 {
    color: #67c23a;
  }
  .status5 {
    color: #500f51;
  }
  .status6 {
    color: #51210f;
  }
}

</style>
