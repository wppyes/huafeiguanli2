<template>
  <div class="hfstatistics boxright">
      <div class="add">
            <el-input
                placeholder="请输入客户信息"
                v-model="listQuery.name"
                style="width: 150px;"
                class="filter-item"
                clearable
            />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="公司名称" prop="ComPany" align="center"></el-table-column>
      <el-table-column label="联系人" prop="UserName" align="center"></el-table-column>
      <el-table-column label="账户(元)" align="center">
        <template slot-scope="scope">
          {{parseFloat(scope.row.Balance).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tag size="small" @click="showadd(scope.row,'加款明细')">加款明细</el-tag>
          <el-tag size="small" @click="showinfo(scope.row,'交易流水')">交易流水</el-tag>
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
    <el-dialog :title="dialogtitle" :visible.sync="dialogaddVisible" width="550px">
        <el-table v-loading="addlistloading" :data="addlist" border fit highlight-current-row>
            <el-table-column label="加款金额" align="center">
                <template slot-scope="scope">
                    {{parseFloat(scope.row.Amount).toLocaleString()}}
                </template>
            </el-table-column>
            <el-table-column label="加款时间" prop="CreateTimeStr" align="center"></el-table-column>         
            <el-table-column label="状态" prop="LoginName" align="center">
                <template slot-scope="scope">
                    <span :class="'status'+scope.row.Status">{{scope.row.StatusStr}}</span>
                    </template>
            </el-table-column>
            </el-table>
            <pagination
            v-show="totaladd>0"
            :total="totaladd"
            :page.sync="listQueryadd.page"
            :limit.sync="listQueryadd.sum"
            @pagination="getaddList"
            />
    </el-dialog>
    <el-dialog :title="dialogtitle" :visible.sync="dialoginfoVisible" top="50px" width="850px">
        <div class="filter-container">            
            <el-date-picker
                v-model="value7"
                type="daterange"
                align="left"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2"
                value-format="yyyy-MM-dd"
                style="position:relative; top:-4px; width:380px;"
            ></el-date-picker>            
            <el-input
                placeholder="请输入关键字"
                v-model="listQueryinfo.orderno"
                style="width: 150px;"
                class="filter-item"
                clearable
            />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getinfoList">搜索</el-button>
        </div>
        <el-table v-loading="infolistloading" :data="infoList" border fit highlight-current-row>
            <el-table-column label="流水号" prop="OrderNo" align="center">
            </el-table-column>
            <el-table-column label="收支金额" prop="OrderNo" align="center">
                <template slot-scope="scope">
                    <span :class="[scope.row.Type>10?'status3':'status1']">
                        {{scope.row.Type>10?'-':'+'}}{{scope.row.Amount}}
                    </span>                    
                </template>
            </el-table-column>
            <el-table-column label="交易后余额" prop="Balance" align="center"></el-table-column>   
            <el-table-column label="类型" prop="TypeStr" align="center"></el-table-column>        
            <el-table-column label="时间" prop="CreatedStr" align="center"></el-table-column>        
            </el-table>
            <pagination
            v-show="totalinfo>0"
            :total="totalinfo"
            :page.sync="listQueryinfo.page"
            :limit.sync="listQueryinfo.sum"
            @pagination="getListinfo"
            />
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "hfstatistics",
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,  
      addlistloading:true,    
      infolistloading:true,
      listQuery: {
        page: 1, //页数
        sum: 10, //每页展示数量
        name: "" //关键字
      },  
      listQueryadd: {
        page: 1, //页数
        sum: 10, //每页展示数量
        cid:"" //id
      },
      listQueryinfo:{
        page: 1, //页数
        sum: 9, //每页展示数量
        cid:"", //id
        starttime:'',
        endtime:'',
        orderno:''
      },
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
      total:0,
      totaladd:0,
      totalinfo:0,
      dialogtitle:'',//弹出框标题
      dialogaddVisible:false,//
      dialoginfoVisible:false,//
      addlist:[],//加款列表
      infoList:[],
    };
  },
  created() {      
    var myDate = new Date();
    var time = myDate.toLocaleDateString().split('/').join('-');  
    this.value7=[time,time];
    this.getList();
  },
  watch: {
    value7(val, oldval) {
      if(val){
        this.listQueryinfo.starttime = val[0];
        this.listQueryinfo.endtime = val[1];
      }else{
        this.listQueryinfo.starttime='';
        this.listQueryinfo.endtime='';
      }
    }
  },
  methods: {
    handleFilter(){
        this.listQuery.page=1;
        this.getList();
    },
    getList(){
          this.listLoading = true;
          request({
          url: "Statistics/HFStatistics/GetNCustomerList",
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
    showadd(row,title){
        this.dialogtitle=row.ComPany+'-'+title;
        this.dialogaddVisible=true;
        this.listQueryadd.page=1;
        this.listQueryadd.cid=row.Id;
        this.getaddList();
    },
    getaddList(){
        this.addlistloading = true;        
        request({
        url: "Statistics/HFStatistics/GetNCustomerPackageList",
        method: "get",
        params: this.listQueryadd
        }).then(response => {
        if(response.Status==1){
            this.addlist = response.List.DataList;
            this.totaladd = response.List.TotalPage;
            this.addlistloading=false;
        }
        });
    },
    showinfo(row,title){
        this.dialogtitle=row.ComPany+'-'+title;
        this.dialoginfoVisible=true;
        this.listQueryinfo.cid=row.Id;
        this.listQueryinfo.page=1;
        this.listQueryinfo.orderno='';
        this.getListinfo();
    },
    getinfoList(){
        this.listQueryinfo.page=1;
    },
    getListinfo(){
       this.infolistloading = true;
        request({
        url: "Statistics/HFStatistics/GetTransactionRecordList",
        method: "get",
        params: this.listQueryinfo
        }).then(response => {
        if(response.Status==1){
            this.infoList = response.List.DataList;
            this.totalinfo = response.List.TotalPage;
            this.infolistloading=false;
        }
        });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.hfstatistics .add {
  margin-bottom: 20px;
}
.hfstatistics{
  .el-tag{cursor: pointer;}
  .status4 {
    color: #409eff;
  }
  .status3 {
    color: #67c23a;
  }
  .status1 {
    color: #f56c6c;
  }
  .status2 {
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
