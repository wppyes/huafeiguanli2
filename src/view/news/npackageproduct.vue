<template>
  <div class="npackageproduct boxright">
    <el-tabs v-model="temp.ProductType" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in NType"
        :key="item.Value"
        :name="item.Value"
        :label="item.Text"
      ></el-tab-pane>
    </el-tabs>
    <div class="filter-container">
      <el-button type="primary" class="add" @click="handleadd('增加产品',true)">
        <i class="el-icon-circle-plus"></i> 增加产品
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="List" border fit highlight-current-row>
      <el-table-column label="产品编码" prop="GoodId" align="center"></el-table-column>
      <el-table-column label="名称" prop="ProductName" align="center"></el-table-column>
      <el-table-column label="面值" prop="Parvalue" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改产品')">
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
        <el-form-item label="通道" prop="list">
          <el-checkbox-group v-model="temp.list">
            <el-checkbox v-for="item in channelist" :label="JSON.stringify(item)" :key="item.ChannelType" name="type">{{item.ChannelName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="产品编码" prop="GoodId">
          <el-input v-model="temp.GoodId" placeholder="请填写产品编码"/>
        </el-form-item>
        <el-form-item label="名称" prop="ProductName">
          <el-input v-model="temp.ProductName" placeholder="请填写产品名字"/>
        </el-form-item>
        <el-form-item label="面值" prop="Parvalue">
          <el-input v-model.number="temp.Parvalue" placeholder="请填写面值"/>
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
var arr=[];
var validnum=(rule, value,callback)=>{
      if (value<=0){
          callback(new Error('请输入正确的金额'))
      }else {
          callback()
      }
  }
export default {
  name: "npackageproduct",
  data() {
    return {
      List: [],
      nTypeid:'1',//
      NType:[],//
      listLoading:true,
      temp: {
        Id: 0,
        ProductType: "1",
        ProductName: "",
        GoodId:'',
        Parvalue:'',
        list:[]
      },
      channelist:[],
      channelist1:[],
      channelist2:[],
      dialogStatus: "", //面板标题
      dialogFormVisible: false, //面板是否展示
      rules: {
        GoodId: [
          { required: true, message: "产品编码必须填写！", trigger: "blur" }
        ],
        ProductName: [
          { required: true, message: "产品名称必须填写！", trigger: "blur" }
        ],
        Parvalue: [
          { required: true, trigger: ['change'], validator: validnum },{ type: 'number', message: '金额必须为数字值'}
        ],
        list: [
          { required: true, trigger: "blur", message: '通道必须选择'}
        ]
      }
    };
  },
  created() {
    request({
      url: "News/NPackageProduct/GetNPackageProductList",
      method: "get",
      params: {}
    }).then(response => {      
        if(response.Status==1){
          arr=response.List;
          this.listLoading=false;
          this.getlist();
        }
    });
    request({
      url: "News/NPackageProduct/GetTypeList",
      method: "get",
      params: {}
    }).then(response => {      
        if(response.Status==1){
          this.NType=response.NType;
          for(let i in response.HFModel){
            let tem={
              ChannelType:response.HFModel[i].ChannelType,
              ChannelName:response.HFModel[i].ChannelName
            };
            this.channelist1.push(tem)
          };
          this.channelist=this.channelist1;
          for(let j in response.SPModel){
            let tem={
              ChannelType:response.SPModel[j].ChannelType,
              ChannelName:response.SPModel[j].ChannelName
            };
            this.channelist2.push(tem)
          };
        };        
    });
  },
  methods: {
        getlist(){
          this.List=[];
          this.List=arr.filter(v => v.ProductType == this.temp.ProductType);
        },
        handleClick(){
          if(this.temp.ProductType<=3){
            this.channelist=this.channelist1;
          }else{
            this.channelist=this.channelist2;
          }
          this.getlist();
        },
        handleditor(row, title) {
            this.temp = {
                Id: row.Id,
                GoodId:row.GoodId,
                ProductType: row.ProductType.toString(),
                ProductName: row.ProductName,
                Parvalue: row.Parvalue,
                list:[]
            };
            if(row.Channel){
              this.temp.list=JSON.parse(row.Channel);
              for(let k in this.temp.list){
                this.temp.list[k]=JSON.stringify(this.temp.list[k])
              }
            };
            this.dialogStatus = title;
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
    handledel(row) {
        var data = this.$qs.stringify({ id: row.Id });
        this.$confirm("确定要删除套餐吗？", "提示", {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        })
            .then(() => {
            request({
                url: "News/NPackageProduct/Update",
                method: "post",
                data
            }).then(response => {
                if (response.Status==1) {
                this.$message({
                    message: response.Msg,
                    type: "success"
                });
                const index = arr.indexOf(row);
                arr.splice(index, 1);
                this.getlist();
                }
            });
            })
            .catch(() => {});
    },
    handleadd(title, creat) {      
        this.temp.Id=0;
        this.temp.ProductName='';
        this.temp.Parvalue='';
        this.temp.GoodId='';
        this.temp.list=[];
        this.dialogStatus = title;
        this.dialogFormVisible = true;
        this.$nextTick(() => {
            this.$refs["dataForm"].clearValidate();
        });
    },
    createData() {
      for(let k in this.temp.list){
        this.temp.list[k]=JSON.parse(this.temp.list[k])
      };
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "News/NPackageProduct/SetNPackageProduct",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
                this.dialogFormVisible = false;
                if(this.temp.Id==0){
                    this.temp.Id=response.Id;
                     var param={
                        Id: response.Id,
                        ProductType: parseInt(this.temp.ProductType),
                        ProductName: this.temp.ProductName,
                        GoodId:this.temp.GoodId,
                        Parvalue:parseFloat(this.temp.Parvalue),
                        Channel:JSON.stringify(this.temp.list)
                      };
                    arr.unshift(param);
                }else{
                  for(let i in arr){
                    if(arr[i].Id==this.temp.Id){
                      arr[i].ProductType =parseInt(this.temp.ProductType);
                      arr[i].ProductName=this.temp.ProductName;
                      arr[i].GoodId=this.temp.GoodId;
                      arr[i].Parvalue=parseFloat(this.temp.Parvalue);
                      arr[i].Channel=JSON.stringify(this.temp.list);
                      break;
                    }
                  }
                };  
                this.getlist();      
                this.$message({
                    message: response.Msg,
                    type: "success"
                });
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
</style>
