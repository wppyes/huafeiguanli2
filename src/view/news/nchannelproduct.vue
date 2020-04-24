<template>
  <div class="nchannelproduct boxright">
    <div class="filter-container">
        <el-select v-model="Companyid" placeholder="请选择通道" @change="temp.ChannelType=-1;temp.ProductType=''">
          <el-option
            v-for="item in CompanyType"
            :label="item.Text"
            :key="item.Value"
            :value="item.Value"           
          ></el-option>
        </el-select>
    </div>
    <el-row class="filter-container"> 
        <el-radio-group v-model="temp.ChannelType">
          <el-radio-button v-for="item in SettingList" v-show="Companyid==item.CompanyType" :label="item.ChannelType" :key="item.ChannelType">{{item.ChannelName}}</el-radio-button>
        </el-radio-group>
    </el-row>
    <el-tabs v-show="temp.ChannelType!='-1'" v-model="temp.ProductType" type="card" @tab-click="handleClick">
        <el-tab-pane v-for="item in NType" 
            :key="item.Value" 
            :name="item.Value.toString()"
            v-if="temp.ChannelType<21 && item.Value<4 || temp.ChannelType>=21 && item.Value>=4" 
            :label="item.Text">
        </el-tab-pane>   
    </el-tabs>     
    <div class="filter-container" v-show="temp.ProductType>0 && temp.ChannelType!='-1'">
        <el-button type="primary" class="add" @click="handleadd('增加套餐产品',true,true)"><i class="el-icon-circle-plus"></i> 增加套餐产品</el-button>
    </div>
    <div v-show="temp.ChannelType<21">
      <el-table v-show="temp.ProductType>0 && temp.ChannelType!='-1'" :data="List" border fit highlight-current-row>
          <el-table-column label="名称" prop="ProductName" align="center"></el-table-column>
          <el-table-column label="面值" prop="Parvalue" align="center"></el-table-column>
          <el-table-column label="采购价" prop="PurchasePrice" align="center">
          </el-table-column>     
          <el-table-column label="操作" align="center">
              <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改套餐',false)">
                  <i class="el-icon-edit"></i> 编辑
              </el-button>
              <el-button size="mini" type="danger" @click="handledel(scope.row)">
                  <i class="el-icon-delete"></i> 删除
              </el-button>
              </template>
          </el-table-column>
      </el-table>
    </div>
    <div v-show="temp.ChannelType>=21">
      <el-table v-show="temp.ProductType>0 && temp.ChannelType!='-1'" :data="List2" border fit highlight-current-row>
          <el-table-column label="名称" prop="ProductName" align="center"></el-table-column>
          <el-table-column label="面值" prop="Parvalue" align="center"></el-table-column>
          <el-table-column label="GoodsId" prop="GoodsId" align="center"></el-table-column>
          <el-table-column label="采购价" prop="PurchasePrice" align="center">
          </el-table-column>     
          <el-table-column label="操作" align="center">
              <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改套餐',false)">
                  <i class="el-icon-edit"></i> 编辑
              </el-button>
              <el-button size="mini" type="danger" @click="handledel(scope.row)">
                  <i class="el-icon-delete"></i> 删除
              </el-button>
              </template>
          </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" width="550px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      > <el-form-item label="面值" prop="ProductId">
          <el-select v-model="temp.ProductId" placeholder="请选择面值" @change="getmoney">
            <el-option v-for="item in PackageModel" v-if="item.ProductType==temp.ProductType" :label="item.ProductName" :key="item.Id" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额">
          {{money.Parvalue}}
        </el-form-item>
        <el-form-item label="商品id" prop="GoodsId" v-show="temp.ChannelType>=21">
          <el-input v-model="temp.GoodsId" placeholder="请填写商品id"/>
        </el-form-item>
        <el-form-item label="采购价" prop="PurchasePrice">
          <el-input v-model="temp.PurchasePrice" placeholder="请填写采购价"/>
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
var flag=false;
export default {
  name: "nchannelproduct",
  data() {
    return {
      CompanyType: [], //一级通道列表
      Companyid: '1', //通道选中值
      List: [],
      List2:[],
      NType: [],
      PackageModel: [],//面值
      SettingList: [], //二级通道
      temp: {
        Id: 0,
        ChannelType: 1,
        ProductId: "",
        ProductType:'',
        GoodsId:'',
        PurchasePrice:''
      },
      money:{},//金额
      dialogStatus: "", //面板标题
      dialogFormVisible: false, //面板是否展示
      rules: {
        GoodsId:[{ required: flag, message: "id必须选择！", trigger: "blur" }],
        ProductId: [
          { required: true, message: "面值必须选择！", trigger: "change" }
        ],
        PurchasePrice: [
          { required: true, message: "采购价必须填写！", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    request({
      url: "News/NChannelProduct/GetNChannelProductList",
      method: "get",
      params: {}
    }).then(response => {
       if(response.Status==1){ 
        this.CompanyType = response.CompanyType;
        arr = response.List;
        this.NType = response.NType;
        this.PackageModel = response.PackageModel;
        this.SettingList = response.SettingList;
       }
    });
  },
  methods: {
        getlist(){
            this.List=arr.filter(v => v.ProductType == this.temp.ProductType && this.temp.ChannelType==v.ChannelType);
        },
        getlist2(){
            this.List2=arr.filter(v => v.ProductType == this.temp.ProductType && this.temp.ChannelType==v.ChannelType);
        },
        handleClick(){
          if(this.temp.ChannelType<21){
            this.getlist();
          }else{
            this.getlist2()
          }
            
        },
        getmoney(){
          for(let i in this.PackageModel){
            if(this.PackageModel[i].Id==this.temp.ProductId){
              this.money=this.PackageModel[i];
              break;
            }
          }
        },
        handleditor(row, title, creat) {
          this.temp = {
            Id: row.Id,
            ChannelType: row.ChannelType.toString(),
            ProductId: row.ProductId,
            ProductType: row.ProductType.toString(),
            GoodsId: row.GoodsId,
            PurchasePrice: row.PurchasePrice
          };
          this.getmoney();
          this.dialogStatus = title;
          this.dialogFormVisible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].clearValidate();
          });
        },
       handledel(row) {
        var data = this.$qs.stringify({ id: row.Id });
        this.$confirm("确定要删除吗？", "提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
        .then(() => {
          request({
            url: "News/NChannelProduct/Delete",
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
              this.handleClick();
            } else {
              this.$message({
                message: response.Msg,
                type: "error"
              });
            }
          });
        })
        .catch(() => {});
    },
    handleadd(title, creat) {
      this.temp.Id=0;
      this.temp.ProductId='';
      this.temp.PurchasePrice='';
      this.money={};
      this.temp.GoodsId='';
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.temp.ChannelType>=21?flag=true:flag=false;
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "News/NChannelProduct/SetNChannelProduct",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              if(this.temp.Id==0){
                var param={
                  Id:response.Id,
                  Parvalue:this.money.Parvalue,
                  ProductName:this.money.ProductName,
                  ChannelType:parseInt(this.temp.ChannelType),
                  ProductId:parseInt(this.temp.ProductId),
                  ProductType:parseInt(this.temp.ProductType),
                  GoodsId:this.temp.GoodsId,
                  PurchasePrice:parseFloat(this.temp.PurchasePrice)
                }
                arr.push(param);
              }else{
                for(let i in arr){
                  if(arr[i].Id==this.temp.Id){
                    arr[i].ProductId=this.temp.Id;
                    arr[i].GoodsId=this.temp.GoodsId;
                    arr[i].PurchasePrice=this.temp.PurchasePrice;
                    arr[i].Parvalue=this.money.Parvalue;

                  }
                }
              }
              this.dialogFormVisible = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
              this.handleClick();
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.tdspan span {
  margin-right: 10px;
}
.nchannelproduct .disabled {
  color: #c0c4cc;
}
.nchannelproduct span {
  cursor: pointer;
}
</style>
