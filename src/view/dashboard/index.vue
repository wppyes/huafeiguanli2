<template>
  <div class="dashboard-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="box">武汉福禄余额
          <el-row>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">平台：{{FlWHBalance?FlWHBalance:0}} 元
              <i class="el-icon-refresh" @click="getBanlance(0)"></i>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">系统：{{FLWHXTBalance?FLWHXTBalance:0}} 元
              <i class="el-icon-refresh" @click="getBanlance(10)"></i>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="box">云极余额
          <el-row>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">平台：{{YJBalance?YJBalance:0}} 元
              <i class="el-icon-refresh" @click="getBanlance(1)"></i>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">系统：{{YJXTBalance?YJXTBalance:0}} 元
              <i class="el-icon-refresh" @click="getBanlance(11)"></i>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="box">西藏福禄余额
          <el-row>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">平台：{{FlXZBalance?FlXZBalance:0}} 元
              <i class="el-icon-refresh" @click="getBanlance(2)"></i>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">系统：{{FlXZXTBalance?FlXZXTBalance:0}} 元
              <i class="el-icon-refresh" @click="getBanlance(12)"></i>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="box">聚速通余额
          <el-row>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">平台：{{JSTBalance?JSTBalance:0}} 元
              <i class="el-icon-refresh" @click="getBanlance(3)"></i>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">系统：{{JSTTBalance?JSTTBalance:0}} 元
              <i class="el-icon-refresh" @click="getBanlance(13)"></i>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- <h2 class="title">订单
      <i class="el-icon-refresh" v-on:click="getOrder()"></i>
    </h2>
    <el-row>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <table class="table layui-table">
            <thead class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
                <tr>
                    <th>今日</th>
                    <th>上方订单/条</th>
                    <th>平台订单/条</th>
                </tr>
            </thead>
            <tbody>
                <tr v-cloak>
                    <td>武汉福禄</td>
                    <td>{{list1?list1.JFLWH:0}}</td>
                    <td>{{list1?list1.JXTFLWH:0}}</td>
                </tr>
                <tr>
                    <td>西藏福禄</td>
                    <td>{{list1?list1.JFLXZ:0}}</td>
                    <td>{{list1?list1.JXTFLXZ:0}}</td>
                </tr>
                <tr>
                    <td>云极</td>
                    <td>{{list1?list1.JYJ:0}}</td>
                    <td>{{list1?list1.JXTJY:0}}</td>
                </tr>
                <tr>
                    <td>总订单</td>
                    <td>{{list1?list1.JFLWH+list1.JFLXZ+list1.JYJ:0}}</td>
                    <td>{{list1?list1.JXTZ:0}}</td>
                </tr>
            </tbody>
        </table>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">        
        <table class="table layui-table">
            <thead>
                <tr>
                    <th>今日</th>
                    <th>上方订单/条</th>
                    <th>平台订单/条</th>
                </tr>
            </thead>
            <tbody>
                <tr v-cloak>
                    <td>武汉福禄</td>
                    <td>{{list1?list1.JFLWH:0}}</td>
                    <td>{{list1?list1.JXTFLWH:0}}</td>
                </tr>
                <tr>
                    <td>西藏福禄</td>
                    <td>{{list1?list1.JFLXZ:0}}</td>
                    <td>{{list1?list1.JXTFLXZ:0}}</td>
                </tr>
                <tr>
                    <td>云极</td>
                    <td>{{list1?list1.JYJ:0}}</td>
                    <td>{{list1?list1.JXTJY:0}}</td>
                </tr>
                <tr>
                    <td>总订单</td>
                    <td>{{list1?list1.JFLWH+list1.JFLXZ+list1.JYJ:0}}</td>
                    <td>{{list1?list1.JXTZ:0}}</td>
                </tr>
            </tbody>
        </table>
      </el-col>
    </el-row> -->
    
  </div>
</template>

<script>

import request from '@/utils/request'
export default {
  name: "Dashboard",
  data() {
    return {
      list:null,
      loading:true,
      list1:null,      
      FlWHBalance: 0,
      FlXZBalance: 0,
      YJBalance: 0,

      FLWHXTBalance: 0,
      FlXZXTBalance: 0,
      YJXTBalance: 0,

      JSTBalance:0,
      JSTTBalance:0

    };
  },
  computed: {},
  created() {
   this.getBanlance(-1);
  },
  methods:{
     getBanlance: function (type) {
        request({
          url: 'Console/GetBanlance',
          method: 'get',
          params: {type: type}
        }).then(response => {
          if(response.Status==1){
             if (type == -1) {
                this.FlWHBalance = response.Cbalance.FlWHBalance;
                this.FlXZBalance = response.Cbalance.FlXZBalance;
                this.YJBalance = response.Cbalance.YJBalance;
                this.FLWHXTBalance = response.Cbalance.FLWHXTBalance;
                this.FlXZXTBalance = response.Cbalance.FlXZXTBalance;
                this.YJXTBalance = response.Cbalance.YJXTBalance;
                
                this.JSTBalance = response.Cbalance.JSTBalance;
                this.JSTTBalance = response.Cbalance.JSTTBalance;
            }
            if (type == 0) {
                this.FlWHBalance = response.Cbalance.FlWHBalance;
                this.FLWHXTBalance = response.Cbalance.FlWHBalance;
            }
            else if (type == 1) {
                this.YJBalance =  response.Cbalance.YJBalance;
                this.YJXTBalance = response.Cbalance.YJBalance;
            }
            else if (type == 2) {
                this.FlXZBalance =  response.Cbalance.FlXZBalance;
                this.FlXZXTBalance = response.Cbalance.FlXZBalance;
            }
  
            else if (type == 10) {
                this.FLWHXTBalance = 0;
            }
            else if (type == 11) {
                this.YJXTBalance = 0;
            }
            else if (type == 12) {
                this.FlXZXTBalance = 0;
            }
            this.loading = false
          }
        })
    },

    getOrder(){
      request({
        url: 'Console/GetTJ',
        method: 'get',
        params: {}
      }).then(response => {
         if(response.Status==1){
          this.list1 = response.Model;
         }
      })
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.dashboard-container {
  margin: 20px;
    i{cursor: pointer;}
  .el-row {
    line-height: 38px;
    color: #303133;
    .el-col {
      border-radius: 4px;
      margin-bottom: 20px;
      .box {
        text-indent: 20px;
        border-radius: 4px;
        min-height: 36px;
        border: 1px solid #ebeef5;
        .el-row {
          border-top: 1px solid #ebeef5;
          padding: 10px 0;
          .el-col {
            margin-bottom: 0;
          }
        }
        .el-icon-refresh {
          margin-left: -10px;
        }
      }
    }
  }
  .title {
    color: #303133;
    font-weight: normal;
    text-align: center; margin-bottom: 20px;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  table td, table th {
    position: relative;
    padding: 9px 15px;
    min-height: 20px;
    line-height: 20px;
    font-size: 14px;
    border-width: 1px;
    border-style: solid;
    border-color: #e6e6e6;
  }
}
</style>
