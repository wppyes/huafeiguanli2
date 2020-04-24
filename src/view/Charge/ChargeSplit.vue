<template>
  <div class="ChargeSplit boxright">     
        <el-upload
            class="upload-demo"
            drag
            :limit="1"
            ref="upload"
            accept=".xls,.xlsx"
            action=""
            :http-request="upLoad"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传xls文件</div>
        </el-upload>
        <el-button v-show="filepath!=''" type="primary" @click="begin">点击开始拆分</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";
import upfile from '@/utils/upload';
export default {
  name: "ChargeSplit",
  data() {
    return {
        dialogVisible:false,
        filepath:''
    };
  },
  created() {
  },
  methods: {
     upLoad(param){
         upfile(param.file,'Charge/ChargePhone/Upload',(data => {          
             if(data.Status==1){
                this.filepath=data.Path;
                this.dialogVisible=true;
             }else{
                 this.$message({
                    message: data.Msg,
                    type: "error"
                });
             };
         }))
     },
    begin: function () {
      this.$confirm("确定要批量拆分吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
            this.dialogVisible=true;
             request({
                url: "Charge/ChargeSplit/OneKeySplit",
                method: "get",
                params: {filepath:this.filepath}
            }).then(response => {
              if(response.Status==1){
                import('@/vendor/Export2Excel').then(excel => {
                const tHeader = response.TableTitle;
                const filterVal = response.TableField;
                const data = this.formatJson(filterVal, response.List)
                if(response.List){
                    excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: '拆分'
                    });
                }else{
                  this.$message({
                      message: '暂无数据',
                      type: "error"
                  });
                }
                }); 
              }          
            }); 
        })
        .catch(() => {});
    },
       
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },

  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
