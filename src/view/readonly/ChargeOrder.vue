<template>
  <div class="chargeorder1 boxright">
    <div class="filter-container">
      <el-select
        v-model="listQuery.amount"
        placeholder="选择面值"
        clearable
        style="width: 110px"
        class="filter-item"
      >
        <el-option v-for="item in mianzhilist" :label="item+'元'" :value="item" :key="item"></el-option>
      </el-select>
      <el-input
        placeholder="请输入手机号码"
        v-model="listQuery.phone"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-select
        v-model="listQuery.category"
        placeholder="选择类型"
        clearable
        style="width: 110px"
        class="filter-item"
      >
        <el-option label="移动" value="1"></el-option>
        <el-option label="联通" value="2"></el-option>
        <el-option label="电信" value="3"></el-option>
      </el-select>
      <el-select
        v-model="listQuery.customerno"
        placeholder="选择用户"
        clearable
        class="filter-item"
        style="width: 200px"
      >
        <el-option
          v-for="item in userlist"
          :key="item.CustomeNo"
          :label="item.UserName+'-'+item.ComPany"
          :value="item.CustomeNo"
        />
      </el-select>
      <el-date-picker
        v-model="value7"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions2"
        value-format="yyyy-MM-dd"
        style="position:relative; top:-4px; width:380px;"
      ></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >批量下载</el-button>
    </div>
    <el-tabs v-model="listQuery.status" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="-1"></el-tab-pane>
      <el-tab-pane
        v-for="(item, index) in typelist"
        :key="item.Value"
        :label="item.Text"
        :name="item.Value"
      ></el-tab-pane>
    </el-tabs>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row @sort-change="timeset">
      <el-table-column label="通道" prop="SysTypeStr" align="center"></el-table-column>
      <el-table-column label="订单编号" prop="OrderNum" align="center"></el-table-column>
      <el-table-column label="手机号码" prop="Phone" align="center"></el-table-column>
      <el-table-column label="类型" align="center" class-name="setstyle">
        <template slot-scope="scope">
          <span v-if="scope.row.Category==1" class="maincolor">移动</span>
          <span v-if="scope.row.Category==2" class="orangecolor">联通</span>
          <span v-if="scope.row.Category==3" class="greencolor">电信</span>
        </template>
      </el-table-column>
      <el-table-column label="面值" prop="Amount" align="center"></el-table-column>
      <el-table-column label="提交时间" sortable="custom" prop="CreateTimeStr" align="center"></el-table-column>
      <el-table-column label="充值时间" sortable="custom" prop="RechargeTimeStr" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span
            v-for="item in typelist"
            :key="item.Value"
            :value="item.Value"
            v-if="scope.row.Status==item.Value"
            :class="'status'+item.Value"
          >{{item.Text}}</span>
        </template>
      </el-table-column>
    </el-table>
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
export default {
  name: "chargeorder1",
  components: { Pagination },
  data() {
    return {
      list: null,
      loading: true,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1, //页数
        sum: 10, //每页展示数量
        amount: "", //订单编号
        phone: "", //手机号码
        category: "", //类型
        customerno: "", //用户
        setting: "", //通道
        starttime: "",
        endtime: "",
        status:'-1',//状态
        time: 0 //升序或者降序
      },
      mianzhilist:[5,10,20,30,50,100,200,300,500],
      amount:0,//总结1
      actualprice:0,//总结2
      purchaseamount:0,//总结3
      typelist: null, //状态列表
      userlist: null, //用户列表
      channelist: null, //通道列表
      value7: "",
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      downloadLoading: false
    };
  },
  watch: {
    value7(val, oldval) {
      if(val){
        this.listQuery.starttime = val[0];
        this.listQuery.endtime = val[1];
      }else{
        this.listQuery.starttime='';
        this.listQuery.endtime='';
      }
    }
  },
  created() {
    var myDate = new Date();
    var time = myDate.toLocaleDateString().split('/').join('-');  
    this.value7=[time,time];
    request({
      url: "Charge/ChargeOrder/GetNChannelSettingList",
      method: "get",
      params: { type: 1 }
    }).then(response => {      
        if(response.Status==1){
          this.typelist = response.modelStatus;
          this.userlist = response.modelCustomer;
          this.channelist = response.List;
        }
    });
    this.getList();
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1;
      this.listQuery.status = '-1';
      this.getList();
    },
    getList() {
      this.listLoading = true;
      request({
        url: "Charge/ChargeOrder/GetOrderList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if(response.Status==1){
          this.list = response.List.DataList;
          this.total = response.List.TotalPage;
          this.amount = parseFloat(response.ModelSum.Amount).toLocaleString();
          this.actualprice = parseFloat(response.ModelSum.ActualPrice).toLocaleString();
          this.purchaseamount = parseFloat(response.ModelSum.PurchaseAmount).toLocaleString();
          this.listLoading = false;
        }
      });
    },
    handleClick(){
      this.listQuery.page = 1;
      this.getList();
    },
    timeset(column, prop, order){
      if(column.prop=='CreateTimeStr'){
        column.order=='ascending'?this.listQuery.time=1:this.listQuery.time=0;
      }else{        
        column.order=='ascending'?this.listQuery.time=2:this.listQuery.time=3;
      }
      this.handleClick();
    },
    handleDownload() {
      this.downloadLoading = true;
      this.$confirm("确定要导出数据吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          request({
            url: "Charge/ChargeOrder/ExcelNew",
            method: "get",
            params: {customeno:this.listQuery.customeno,starttime:this.listQuery.starttime,endtime:this.listQuery.endtime,status:this.listQuery.status,setting:this.listQuery.setting}
          }).then(response => {
        if(response.Status==1){
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = response.TableTitle;
              const filterVal = response.TableField;
              const data = this.formatJson(filterVal, response.List)
              if(response.List){
                excel.export_json_to_excel({
                  header: tHeader,
                  data,
                  filename: 'table-list'
                });
              }else{
                this.$message.error('暂无数据');
              }
              this.downloadLoading = false
            }); 
        }          
          });          
        }).catch(() => {         
        });
    },    
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },
    handleAgain(row){
      var ms = "";
      if (!this.listQuery.setting){
        ms = "您未选择通道，将按默认通道处理<br/>";
      };       
      var param={
        order: row.Order, 
        setting: this.listQuery.setting
      };
      var data=this.$qs.stringify(param);        
      this.$confirm(ms + "确定要再次充值吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
           request({
            url: "Charge/ChargeOrder/Single",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){              
              row.Status=1;
              row.Remark='';
             this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }).catch(() => {         
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

.chargeorder1 {  
  .el-row {
    line-height: 38px;
    color: #303133;
    .el-col {
      border-radius: 4px;
      margin-bottom: 20px;
      .box {
        text-indent: 20px;
        border-radius: 4px;
        min-height: 36px;
        border: 1px solid #ebeef5;
        .el-row {
          border-top: 1px solid #ebeef5;
          padding: 10px 0;
          .el-col {
            margin-bottom: 0;
          }
        }
        .el-icon-refresh {
          margin-left: -10px;
        }
      }
    }
  }
  .title {
    color: #303133;
    font-weight: normal;
  }
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
  .tab {
    margin-bottom: 20px;
    span {
      margin-right: 10px;
      cursor: pointer;
    }
  }
  .tips {
    line-height: 30px;
    margin-top: 5px;
    color: #303133;
  }
}
</style>
