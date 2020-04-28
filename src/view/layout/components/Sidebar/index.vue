<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      mode="vertical"
      router 
      ref="menuShow"
    >
      <sidebar-item v-for="(scope,index) in list" :key="scope.Id" :index="index" :item="scope" :base-path="scope.Url"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import request from '@/utils/request'
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  data() {
    return {
      list: null
    }
  },
  created(){
    request({
      url: 'Currency/GetMenusAllList',
      method: 'get',
      params: {}
    }).then(response => {
        if(response.Status==1){
        this.list = response.List;
        }
    })
  },
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
