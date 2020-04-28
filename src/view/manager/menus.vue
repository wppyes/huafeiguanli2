<template>
  <div class="menus boxright">
    <div class="filter-container">
        <div class="filter-item">
          <el-button type="primary" @click="handleadd(0,'增加菜单',true,true)"><i class="el-icon-circle-plus"></i> 增加菜单</el-button>
        </div>
      </div>
    
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column type="expand" align="center">
          <template slot-scope="props">
             <el-table :data="props.row.MenuE" border fit highlight-current-row >
                <el-table-column label="菜单名称" prop="Name" align="center" width="140" >
                </el-table-column>
                <el-table-column label="图标" width="100px" align="center">
                    <template slot-scope="scope">
                        <i :class="scope.row.Icon"></i>
                    </template>
                </el-table-column>            
                <el-table-column label="排序" width="170px" align="center">
                  <template slot-scope="scope">
                    <span @click="sort2(scope.row,scope.$index,-1,props.$index)" :class="scope.$index==0?'disabled':''">  
                    <i class="fa fa-arrow-up"></i>上移  
                    </span>&nbsp;&nbsp;&nbsp;  
                    <span @click="sort2(scope.row,scope.$index,+1,props.$index)" :class="scope.$index==props.row.MenuE.length-1?'disabled':''">  
                    <i class="fa fa-arrow-down"></i>下移  
                    </span> 
                  </template>
                </el-table-column>
                <el-table-column label="链接地址" prop="Url" width="200px" align="center"></el-table-column>
                <el-table-column label="控制器" prop="Controller" width="200px" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"  type="primary"
                      @click="handleditor(scope.row,'修改子菜单',false,false)"><i class="el-icon-edit"></i> 编辑</el-button>
                    <el-button
                      size="mini" type="danger"
                      @click="handledel(scope.row)"><i class="el-icon-delete"></i> 删除</el-button>
                  </template>
                </el-table-column>
             </el-table>
          </template>
      </el-table-column>
      <el-table-column label="菜单名称" prop="Name" align="center" width="140">
      </el-table-column>
      <el-table-column label="图标" width="100px" align="center">
          <template slot-scope="scope">
              <i :class="scope.row.Icon"></i>
          </template>
      </el-table-column>
      <el-table-column label="排序" width="170px" align="center">
         <template slot-scope="scope">
          <span @click="sort(scope.row,scope.$index,-1)" :class="scope.$index==0?'disabled':''">  
          <i class="fa fa-arrow-up"></i>上移  
          </span>&nbsp;&nbsp;&nbsp;  
          <span @click="sort(scope.row,scope.$index,+1)" :class="scope.$index==list.length-1?'disabled':''">  
          <i class="fa fa-arrow-down"></i>下移  
          </span> 
        </template>
      </el-table-column>
      <el-table-column label="链接地址" prop="Url" width="200px" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
         <template slot-scope="scope">
          <el-button
            size="mini"  type="primary"
            @click="handleditor(scope.row,'修改菜单',true,false)"><i class="el-icon-edit"></i> 编辑</el-button>
          <el-button
            size="mini" type="danger"
            @click="handledel(scope.row)"><i class="el-icon-delete"></i> 删除</el-button>
          <el-button
            size="mini" type="success"
            @click="handleadd(scope.row,'增加子菜单',false,true,scope.$index)"><i class="el-icon-circle-plus"></i> 增加子菜单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="550px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="菜单名称" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写菜单名称"/>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="temp.Icon" placeholder="请填写菜单图标"/>
        </el-form-item>
        <el-form-item label="链接" v-show="!ismain">
          <el-input v-model="temp.Url" placeholder="请填写菜单链接"/>
        </el-form-item>
        <el-form-item label="控制器" v-show="temp.ParentId!=0">
          <el-input v-model="temp.Controller" placeholder="请填写菜单控制器"/>
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
  name: "menus",
  data() {
    return {
      list: null,
      listLoading: true,
      temp: {
        Id: 0,
        Name: '',
        ParentId: 0,
        Url: '',
        Icon: '',
        Controller:''
      },
      flag:true,//排序连点禁止
      dialogStatus:'',//面板标题    
      dialogFormVisible: false,//面板是否展示
      ismain:false,//是否一级菜单
      iscreate:false,//是否是添加
      index:0,//当前index
      rules: {
        Name: [{ required: true, message: '菜单名称必须填写！', trigger: 'blur' }]
      },
    };
  },
  created() {
    request({
      url: "Menus/GetMenusList",
      method: "get",
      params: {}
    }).then(response => {
      if(response.Status==1){
        this.list = response.List;
        this.listLoading = false;
      }
    });
  },
  methods: {
    handleditor(row,title,isok,creat){      
      this.temp={
        Id: row.Id,
        Name: row.Name,
        ParentId: row.ParentId,
        Sort: row.Sort,
        Url: row.Url,
        Icon: row.Icon,
        Controller:row.Controller
      };
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate=creat;
      this.ismain=isok;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handledel(row,title,isok){
      var data=this.$qs.stringify({Id:row.Id});
      this.$confirm("确定要删除菜单吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
           request({
            url: "Menus/DelMenus",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              this.$message({
                message: response.Msg,
                type: 'success'
              });          
              if(row.ParentId==0){
                const index = this.list.indexOf(row)
                this.list.splice(index, 1)
              }else{
                  for(let i in this.list){
                    if(this.list[i].Id===row.ParentId){
                      for (let v in this.list[i].MenuE) {                      
                        if (this.list[i].MenuE[v].Id === row.Id) {
                          this.list[i].MenuE.splice(v, 1)
                          break
                        }
                      }
                    }
                  }
              } 
            }                      
          });
        }).catch(() => {         
      })  
    },
    handleadd(row,title,isok,creat,index){   
      if(isok){
        this.temp={
          Id: 0,
          Name: '',
          ParentId: 0,
          Url: '',
          Icon: '',
          MenuE:[],
          Controller:''
        };
      }else{
        this.temp={
          Id: 0,
          Name: '',
          ParentId: 0,
          Url: '',
          Icon: '',
          Controller:''
        };
      }  
      if(row!=0){
        this.temp.ParentId=row.Id;
      };
      this.iscreate=creat;
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.ismain=isok;
      isok?this.index=0:this.index=index;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      var data=this.$qs.stringify(this.temp);
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {              
          request({
            url: "Menus/SaveMenus",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              if(this.iscreate){
                this.temp.Id=response.Id;
                if(this.ismain){
                  this.list.push(this.temp);
                }else{
                  this.list[this.index].MenuE.push(this.temp);
                }              
              }else{
                if(this.temp.ParentId==0){
                  for (let i in this.list) {
                    if (this.list[i].Id === this.temp.Id) {
                      this.list[i].Name=this.temp.Name;
                      this.list[i].Url=this.temp.Url;
                      this.list[i].Icon=this.temp.Icon;
                      this.list[i].Controller=this.temp.Controller;
                      break
                    }
                  }
                }else{
                  for(let i in this.list){
                    if(this.list[i].Id===this.temp.ParentId){
                      for (let v in this.list[i].MenuE) {                      
                        if (this.list[i].MenuE[v].Id === this.temp.Id) {
                          this.list[i].MenuE[v].Name=this.temp.Name;
                          this.list[i].MenuE[v].Url=this.temp.Url;
                          this.list[i].MenuE[v].Icon=this.temp.Icon;
                          this.list[i].MenuE[v].Controller=this.temp.Controller;
                          break
                        }
                      }
                    }
                  }
                }              
              }
              this.dialogFormVisible = false
              this.$message({
                message: response.Msg,
                type: 'success'
              })
            }
          });
        }
      })
    },    
    sort: function (item, index, type) {//使用方法：传递当前数组的item,index下标,-1为上移，+1为下移  
        this.setup(item, index, type,this.list);
    },
    sort2: function (item, index, type,indexbig) {//使用方法：传递当前数组的item,index下标,-1为上移，+1为下移   
        this.setup(item, index, type,this.list[indexbig].MenuE);
    },
    setup: function (item, index, type, arr1) {
        if (!this.flag) {
            return;
        }
        this.flag = false;
        if ((type < 0 && index == 0) || (type > 0 && index == arr1.length - 1)) {
            return;
        }; 
        var temp = arr1[index];        
        var id1 = item.Id, id2 = arr1[index + type].Id;//当前id为 id1,替换id为id2
        var data=this.$qs.stringify({id1: id1, id2: id2,});
        request({
          url: "Menus/Sort",
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
  .menus .disabled{color: #C0C4CC;}
  .menus span{cursor: pointer;}
</style>
