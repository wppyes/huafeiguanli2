<template>
  <div class="role boxright">
    <el-button type="primary" class="add" @click="handleadd('增加角色',true)">
      <i class="el-icon-circle-plus"></i> 增加角色
    </el-button>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="角色名" prop="Name" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改角色',false)">
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
        <el-form-item label="角色名字" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写菜单名称"/>
        </el-form-item>
        <div class="el-form-item is-required">
          <label for="Name" class="el-form-item__label" style="width: 100px;">分配菜单</label>
          <div class="el-form-item__content" style="margin-left: 100px;">
            <el-tree :data="menulist" show-checkbox ref="tree" node-key="Id" :props="defaultProps"></el-tree>
          </div>
        </div>
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
  name: "role",
  data() {
    return {
      list: null,
      listLoading: true,
      menulist: [], //菜单列表
      temp: {
        Id: 0,
        Name: ""
      },
      dialogStatus: "", //面板标题
      dialogFormVisible: false, //面板是否展示
      iscreate: false, //是否是添加
      rules: {
        Name: [
          { required: true, message: "菜单名称必须填写！", trigger: "blur" }
        ]
      },
      defaultProps: {
        children: "MenuE",
        label: "Name"
      }
    };
  },
  created() {
    request({
      url: "role/GetRoleList",
      method: "get",
      params: {}
    }).then(response => {
      if(response.Status==1){ 
      this.list = response.List;
      this.listLoading = false;
      }
    });
    request({
      url: "Menus/GetMenusList",
      method: "get",
      params: {}
    }).then(response => {
      if(response.Status==1){ 
      this.menulist = response.List;
      }
    });
  },
  methods: {
    handleditor(row, title, creat) {
      this.temp = {
        Id: row.Id,
        Name: row.Name
      };
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      request({
        url: "Role/GetRoleById",
        method: "get",
        params: { Id: row.Id }
      }).then(response => {        
      if(response.Status==1){ 
        var arr = response.List[0].MenuIds.split(",").map(function (e) { return parseInt(e, 10) });
        for(let i in this.menulist){
          var index=arr.indexOf(this.menulist[i].Id);
          if(index>=0){
            arr.splice(index,1);
          }
        }
        this.$refs.tree.setCheckedKeys(arr);
      }
      });
    },
    handledel(row, title, isok) {
      var data = this.$qs.stringify({ Id: row.Id });
      this.$confirm("确定要删除角色吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "role/delrole",
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
        Name: ""
      };
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
        this.$refs.tree.setCheckedKeys([]);
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {          
          if (this.$refs.tree.getCheckedKeys().length == 0) {
            this.$message({
              message: "请分配菜单",
              type: "error"
            });
            return;
          }
          var arr = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
          var param = {
            Id: this.temp.Id,
            Name: this.temp.Name,
            MenuIds: arr.join(",")
          };
          var data = this.$qs.stringify(param);
          request({
            url: "Role/CreatRole",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              if (this.iscreate) {
                this.temp.Id=response.AId;
                this.list.push(this.temp);
              } else {
                for (let i in this.list) {
                  if (this.list[i].Id === this.temp.Id) {
                    this.list[i].Name = this.temp.Name;
                    break;
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
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
  .role .add{margin-bottom: 20px;}
</style>
