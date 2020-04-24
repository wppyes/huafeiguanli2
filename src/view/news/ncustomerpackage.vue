<template>
  <div class="ncustomerpackage boxright">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="公司名称" prop="ComPany" align="center"></el-table-column>
      <el-table-column label="加款金额" prop="Phone" align="center">
        <template slot-scope="scope">
          {{parseFloat(scope.row.Amount).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column label="加款时间" prop="CreateTimeStr" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span :class="'status'+scope.row.Status">{{scope.row.StatusStr}}</span>
        </template>
       
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.Status==0"
            size="mini"
            @click="handleAgain(1,scope.row)">确认加款</el-button>
          <el-button
            v-if="scope.row.Status==0"
            size="mini"
            @click="handleAgain(2,scope.row)">拒绝加款</el-button>
        </template>
      </el-table-column>
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
  name: "ncustomerpackage",
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1, //页数
        sum: 10, //每页展示数量
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      request({
        url: "News/NCustomerPackage/GetNCustomerPackageList",
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
    handleAgain(type,row){    
      var param={
        id: row.Id, 
        status: type
      };
      var data=this.$qs.stringify(param);    
      var str = type == 1 ? '确认' : '拒绝';    
      this.$confirm('是否要' + str + '加款吗？', '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
           request({
            url: "News/NCustomerPackage/Update",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              row.Status = type;
              row.StatusStr = type == 1 ? '加款成功' : '拒绝加款';
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
.ncustomerpackage{
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
