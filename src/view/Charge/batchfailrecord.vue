<template>
  <div class="chargeorder boxright">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="公司名称" prop="CName" align="center"></el-table-column>
      <el-table-column label="充值号码" prop="Phone" align="center"></el-table-column>
      <el-table-column label="金额" prop="Amount" align="center"></el-table-column>
      <el-table-column label="时间" prop="CreateTimeStr" align="center"></el-table-column>
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
  name: "ChargeOrder",
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1, //页数
        sum: 10 //每页展示数量
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
        url: "Charge/BatchFailRecord/GetBatchFailRecordList",
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
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">


</style>
