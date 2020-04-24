<template>
  <div class="nchannelsetting boxright">
      <div class="filter-container">
        <el-button type="primary" @click="handleadd('增加通道',true)">
        <i class="el-icon-circle-plus"></i> 增加通道
        </el-button>
      </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="通道" prop="CompanyTypeName" align="center"></el-table-column>
      <el-table-column label="产品" prop="ChannelName" align="center"></el-table-column>
      <el-table-column label="状态" align="center" class="tdspan">
        <template slot-scope="scope">
          <span v-if="scope.row.IsOpen" class="maincolor">已启用</span>
          <span v-if="!scope.row.IsOpen" class="orangecolor">已关闭</span>
          <el-button size="mini" type="warn" @click="updatastatus(scope.row)">
            <i class="el-icon-edit"></i> 点击修改
          </el-button>
        </template>
      </el-table-column>      
      <el-table-column label="排序" align="center">
         <template slot-scope="scope">
          <span @click="sort(scope.row,scope.$index,-1)" :class="scope.$index==0?'disabled':''">  
          <i class="fa fa-arrow-up"></i>上移  
          </span>&nbsp;&nbsp;&nbsp;  
          <span @click="sort(scope.row,scope.$index,+1)" :class="scope.$index==list.length-1?'disabled':''">  
          <i class="fa fa-arrow-down"></i>下移  
          </span> 
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改通道',false)">
            <i class="el-icon-edit"></i> 编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)">
            <i class="el-icon-delete"></i> 删除
          </el-button>
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
      >
        <el-form-item label="通道" prop="CompanyType">
          <el-select v-model="temp.CompanyType" placeholder="请选择通道">
            <el-option v-for="item in CompanyType" :label="item.Text" :key="item.Value" :value="item.Value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品" prop="ChannelType">
          <el-select v-model="temp.ChannelType" placeholder="请选择产品">
            <el-option v-for="item in ChannelType" :label="item.Text" :key="item.Value" :value="item.Value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  name: "nchannelsetting",
  data() {
    return {
      list: null,
      listLoading: true,
      ChannelType: [], //
      CompanyType:[],//
      flag:true,
      temp: {
        Id: 0,
        ChannelType: "",
        CompanyType: ""
      },
      dialogStatus: "", //面板标题
      dialogFormVisible: false, //面板是否展示
      rules: {
        CompanyType: [{ required: true, message: "通道必须选择！", trigger: "change" }],        
        ChannelType: [{ required: true, message: "产品必须选择！", trigger: "change" }]
      }
    };
  },
  created() {
    request({
      url: "News/NChannelSetting/GetNChannelSettingList",
      method: "get",
      params: {}
    }).then(response => {
       if(response.Status==1){ 
        this.list = response.List;
        this.listLoading = false;
       }
    });
    request({
      url: "News/NChannelSetting/GetSettingTypeList",
      method: "get",
      params: {}
    }).then(response => {
       if(response.Status==1){ 
        this.ChannelType = response.ChannelType;
        this.CompanyType = response.CompanyType;
       }
    });
  },
  methods: {
    handleditor(row, title, creat) { 
      this.temp = {
        Id: row.Id,
        ChannelType: row.ChannelType.toString(),
        CompanyType: row.CompanyType.toString()
      };
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updatastatus(row){
        var str = row.IsOpen == 0 ? '开启' : '关闭';
        var flag = row.IsOpen == 0 ? 1 : 0;
      this.$confirm('确定要' + str + '通道吗？', "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          var statu = 0;
          row.Status == 0?statu = 1:statu = 0;
          var data = this.$qs.stringify({ id: row.Id,isopen: flag});
          request({
            url: "News/NChannelSetting/Update",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              row.IsOpen = flag;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    handledel(row) {
      var data = this.$qs.stringify({ id: row.Id });
      this.$confirm("确定要删除通道吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "News/NChannelSetting/Delete",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            }
          });
        })
        .catch(() => {});
    },
    handleadd(title, creat) {
      this.temp = {
        Id: 0,
        ChannelType: "",
        CompanyType: ""
      };
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "News/NChannelSetting/SetNChannelSetting",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
                this.temp.CompanyTypeName=this.getcomname(this.temp.CompanyType);
                this.temp.ChannelName=this.getChannelname(this.temp.ChannelType);
                if(this.temp.Id==0){
                    this.temp.Id = response.Id;
                    this.temp.IsOpen=0;
                    this.list.unshift(this.temp);
                }else{
                    for (let v in this.list) {
                        if (this.list[v].Id === this.temp.Id) {
                            this.list[v].CompanyTypeName=this.temp.CompanyTypeName;
                            this.list[v].ChannelName=this.temp.ChannelName;
                            this.list[v].ChannelType=this.temp.ChannelType;
                            this.list[v].CompanyType=this.temp.CompanyType;
                            break
                        }
                    }
                }
              this.dialogFormVisible = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    },
    getChannelname(id){
        for(let i in this.ChannelType){
            if(this.ChannelType[i].Value==id){
                return this.ChannelType[i].Text;
            }
        }
    },
    getcomname(id){
        for(let i in this.CompanyType){
            if(this.CompanyType[i].Value==id){
                return this.CompanyType[i].Text;
            }
        }
    },      
    sort: function (row, index, type) {//使用方法：传递当前数组的item,index下标,-1为上移，+1为下移  
        this.setup(row, index, type,this.list);
    },
    setup: function (row, index, type, arr1) {
        if (!this.flag) {
            return;
        }
        this.flag = false;
        if ((type < 0 && index == 0) || (type > 0 && index == arr1.length - 1)) {
            return;
        }; 
        var temp = arr1[index];        
        var id1 = row.Id, id2 = arr1[index + type].Id;//当前id为 id1,替换id为id2
        var data=this.$qs.stringify({id1: id1, id2: id2,});
        request({
          url: "News/NChannelSetting/Sort",
          method: "post",
          data
        }).then(response => {
          if(response.Status==1){              
            this.$set(arr1, index, arr1[index + type]);
            this.$set(arr1, index + type, temp);
          }
          this.flag = true;
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.tdspan span {
  margin-right: 10px;
}
  .nchannelsetting .disabled{color: #C0C4CC;}
  .nchannelsetting span{cursor: pointer;}
</style>
