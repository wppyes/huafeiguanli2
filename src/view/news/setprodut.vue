<template>
  <div class="setproduct boxright">
    <div class="filter-container">
      <el-button type="primary" class="add" @click="handleadd('增加配置',true)">
        <i class="el-icon-circle-plus"></i> 增加配置
      </el-button>
    </div>
    <div class="filter-container">
      <el-radio-group v-model="temp.Category" @change="handlechange">
        <el-radio-button v-for="item in Type" :label="item.Value" :key="item.Value">{{item.Text}}</el-radio-button>
      </el-radio-group>
    </div>
    <el-table v-loading="listLoading" :data="BigList" border fit highlight-current-row>
      <el-table-column label="名称" prop="Name" align="center"></el-table-column>
      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改')">
            <i class="el-icon-edit"></i> 编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row,2)">
            <i class="el-icon-delete"></i> 删除
          </el-button>
          <el-button
            size="mini"
            type
            @click="handledel(scope.row,1)"
            v-show="scope.row.Status==0"
          >启用</el-button>
          <el-button size="mini" type="warning" v-show="scope.row.Status==1">已启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" width="550px" top="20px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="名称" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写名字"/>
        </el-form-item>
        <el-tabs v-model="nTypeid" type="card" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in NType"
            :key="item.Value"
            :name="item.Value"
            :label="item.Text"
            v-if="temp.Category==0 && item.Value<=3 || temp.Category==1 && item.Value>3"
          ></el-tab-pane>
        </el-tabs>
        <el-table v-loading="listLoading" :data="List" border fit highlight-current-row>
          <el-table-column label="名称" prop="ProductName" align="center" width="100px"></el-table-column>
          <el-table-column label="面值" prop="Parvalue" align="center" width="60px"></el-table-column>
          <el-table-column label="选择" align="center">
            <template slot-scope="{row}">
              <el-select
                v-if="row.Channel"
                v-model="row.Config"
                placeholder="请选择"
                style="width: 150px"
                class="filter-item"
              >
                <el-option
                  v-for="item in JSON.parse(row.Channel)"
                  :label="item.ChannelName"
                  :value="JSON.stringify(item)"
                  :key="item.ChannelType"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
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
var arr = [],
  bigarr = [];
var validlist = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};
export default {
  name: "npackageproduct",
  data() {
    return {
      BigList: [],
      List: [],
      nTypeid: "1", //
      NType: [], //
      Type: [], //
      listLoading: true,
      temp: {
        Id: 0,
        Name: "",
        Category: 0,
        ConfigJson: []
      },
      show: 0,
      index: -1,
      dialogStatus: "", //面板标题
      dialogFormVisible: false, //面板是否展示
      rules: {
        Name: [{ required: true, message: "名称必须填写！", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getinfo();
    request({
      url: "News/ProductConfig/GetTypeProduct",
      method: "get",
      params: {}
    }).then(response => {
      if (response.Status == 1) {
        this.NType = response.NType;
        this.Type = response.Type;
        arr = response.List;
        for (let i in arr) {
          if (arr[i].Channel) {
            let j = JSON.parse(arr[i].Channel);
            arr[i].Config = JSON.stringify(j[0]);
          } else {
            arr[i].Config = "";
          }
        }
        this.getlist();
      }
    });
  },
  methods: {
    getinfo() {
      request({
        url: "News/ProductConfig/GetProductConfigList",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          bigarr = response.List;
          this.listLoading = false;
          this.handlechange();
        }
      });
    },
    getlist() {
      this.List = [];
      this.List = arr.filter(v => v.ProductType == this.nTypeid);
    },
    handlechange() {
      this.BigList = [];
      this.BigList = bigarr.filter(v => v.Category == this.temp.Category);
    },
    handleClick() {
      this.getlist();
    },
    handleditor(row, title) {
      this.temp.Id = row.Id;
      this.temp.Name = row.Name;
      this.temp.ConfigJson = JSON.parse(row.ConfigJson);
      for (let i in arr) {
        if (arr[i].Channel) {
          let j = JSON.parse(arr[i].Channel);
          arr[i].Config = JSON.stringify(j[0]);
        }
      }
      for (let i in arr) {
        for (let j in this.temp.ConfigJson) {
          if (this.temp.ConfigJson[j].ProductId == arr[i].Id) {
            let k = JSON.parse(arr[i].Channel);
            for (let q in k) {
              if (k[q].ChannelType == this.temp.ConfigJson[j].ChannelType) {
                arr[i].Config = JSON.stringify(k[q]);
                break;
              }
            }
          }
        }
      }
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.setdiv();
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    setdiv(){
      if(this.temp.Category==0){
        this.nTypeid='1'
      }else{
        this.nTypeid='4'
      };
      this.getlist();
    },
    handledel(row, type) {
      var str = type == 1 ? "启用" : "删除";
      var data = this.$qs.stringify({ id: row.Id, status: type });
      this.$confirm("确定要" + str + "吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "News/ProductConfig/Del",
            method: "post",
            data
          }).then(response => {
            if (response.Status == 1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              this.getinfo();
            }
          });
        })
        .catch(() => {});
    },
    handleadd(title, creat) {
      this.temp.Id = 0;
      this.temp.Name = "";
      this.temp.ConfigJson = [];
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      for (let i in arr) {
        if (arr[i].Channel) {
          let j = JSON.parse(arr[i].Channel);
          arr[i].Config = JSON.stringify(j[0]);
        } else {
          arr[i].Config = "";
        }
      }
      this.setdiv();
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      for (let i in arr) {
        if (this.temp.Category == 0 && arr[i].ProductType <= 3) {
          let j = JSON.parse(arr[i].Config);
          let param = {
            ProductId: arr[i].Id,
            ChannelType: j.ChannelType,
            ChannelName: j.ChannelName
          };
          this.temp.ConfigJson.push(param);
        }
        if (this.temp.Category == 1 && arr[i].ProductType > 3) {
          let j = JSON.parse(arr[i].Config);
          let param = {
            ProductId: arr[i].Id,
            ChannelType: j.ChannelType,
            ChannelName: j.ChannelName
          };
          this.temp.ConfigJson.push(param);
        }
      }
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          let params = {
            model: {
              Id: this.temp.Id,
              Name: this.temp.Name,
              Category: this.temp.Category
            },
            list: this.temp.ConfigJson
          };
          var data = this.$qs.stringify(params);
          request({
            url: "News/ProductConfig/SetProductConfig",
            method: "post",
            data
          }).then(response => {
            if (response.Status == 1) {
              this.dialogFormVisible = false;
              if (this.temp.Id == 0) {
                this.temp.Id = response.Id;
                var param = {
                  Id: response.Id,
                  Category: this.temp.Category,
                  Name: this.temp.Name,
                  ConfigJson: JSON.stringify(this.temp.ConfigJson),
                  Status: 0
                };
                bigarr.push(param);
              } else {
                for (let i in bigarr) {
                  if (bigarr[i].Id == this.temp.Id) {
                    bigarr[i].Category = this.temp.Category;
                    bigarr[i].Name = this.temp.Name;
                    bigarr[i].ConfigJson = JSON.stringify(this.temp.ConfigJson);
                    break;
                  }
                }
              }
              this.handlechange();
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
