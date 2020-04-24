<template>
  <div class="tongji boxright">
    <div class="filter-container">
      <el-select
        v-model="listQuery.customeno"
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
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="公司名称" prop="ComPany" align="center"></el-table-column>
      <el-table-column label="历史账单" prop="Payment" align="center">
        <template slot-scope="scope">
          <el-tag size="small" style="cursor: pointer;" @click="handlehistory(scope.row,'历史账单')">
            点击查看
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="当月账单" align="center">
        <template slot-scope="scope">
          <el-tag size="small" style="cursor: pointer;" @click="handlenow(scope.row,'当月账单')">
            点击查看
          </el-tag>
        </template></el-table-column>
    </el-table>
      <el-dialog :title="dialogStatus" :visible.sync="dialogVisible" width="550px" height="600px">
      <el-table v-loading="listLoading1" :data="tablist" border fit highlight-current-row>
        <el-table-column label="月份" prop="MonthStr" align="center">
        </el-table-column>
        <el-table-column label="期初余额" align="center">
              <template slot-scope="scope">
                   {{parseFloat(scope.row.InitialBalance).toLocaleString()}}               
              </template>
        </el-table-column>
        <el-table-column label="加款金额" align="center">
            <template slot-scope="scope">
              {{parseFloat(scope.row.IncomeAmount).toLocaleString()}}    
            </template>
        </el-table-column>
        <el-table-column label="消费金额" align="center">
            <template slot-scope="scope">
              {{parseFloat(scope.row.ConsumeAmount).toLocaleString()}}    
            </template>
        </el-table-column>
        <el-table-column label="期末金额" align="center">
            <template slot-scope="scope">
              {{parseFloat(scope.row.EndingBalance).toLocaleString()}}  
            </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="historylist.page"
        :limit.sync="historylist.sum"
        @pagination="gethistory"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </div>
    </el-dialog>  
    <el-dialog :title="dialogStatus" :visible.sync="dialognowVisible" width="550px">
      <el-table v-loading="listLoading1" :data="nowlist" border fit highlight-current-row>
        <el-table-column label="月份" prop="MonthStr" align="center">
        </el-table-column>
        <el-table-column label="期初余额" align="center">
              <template slot-scope="scope">
                   {{parseFloat(scope.row.InitialBalance).toLocaleString()}}               
              </template>
        </el-table-column>
        <el-table-column label="加款金额" align="center">
            <template slot-scope="scope">
              {{parseFloat(scope.row.IncomeAmount).toLocaleString()}}    
            </template>
        </el-table-column>
        <el-table-column label="消费金额" align="center">
            <template slot-scope="scope">
              {{parseFloat(scope.row.ConsumeAmount).toLocaleString()}}    
            </template>
        </el-table-column>
        <el-table-column label="期末金额" align="center">
            <template slot-scope="scope">
              {{parseFloat(scope.row.EndingBalance).toLocaleString()}}  
            </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialognowVisible = false">确定</el-button>
      </div>
    </el-dialog>  
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "tongji",
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      userlist:[],
      listQuery: {
        customeno: "", //
        starttime: "",
        endtime: "",
      },
      dialogVisible:false,
      dialognowVisible:false,
      dialogStatus:'',
      listLoading1:true,
      historylist:{
        cid:'',
        page:1,
        sum:10
      },
      tablist:null,
      nowlist:[],
    };
  },
  created() {
    request({
      url: "Charge/ChargeOrder/GetNChannelSettingList",
      method: "get",
      params: { type: 1 }
    }).then(response => {
        if(response.Status==1){
      this.userlist = response.modelCustomer;
        }
    });
    this.getList();
  },
  methods: {
    handlehistory(row,title){
      this.dialogStatus=row.ComPany+'-'+title;
      this.historylist.cid=row.CId;
      this.historylist.page=1;
      this.dialogVisible=true;
      this.gethistory();
    },
    handlenow(row,title){
      this.dialogStatus=row.ComPany+'-'+title;
      this.dialognowVisible=true;
      this.listLoading1 = true;
      this.nowlist=[];
      request({
        url: "Statistics/HFStatistics/GetMonthlyBill",
        method: "get",
        params: {cid:row.CId}
      }).then(response => {
        if(response.Status==1){
        this.nowlist.push(response.Model);
        this.listLoading1 = false;
        }
      });
    },
    gethistory(){
      this.listLoading1 = true;
      request({
        url: "Statistics/HFStatistics/GetBillList",
        method: "get",
        params: this.historylist
      }).then(response => {
        if(response.Status==1){
        this.tablist = response.List.DataList;
        this.total = response.List.TotalPage;
        this.listLoading1 = false;
        }
      });
    },
    getList() {
      this.listLoading = true;
      request({
        url: "Statistics/HFStatistics/Reconciliation",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if(response.Status==1){
        this.list = response.List;
        // this.total = response.List.TotalPage;
        this.listLoading = false;
        }
      });
    },
    handleFilter(){
      this.getList();
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

.tongji{  
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
