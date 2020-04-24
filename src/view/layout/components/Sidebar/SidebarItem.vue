<template>
  <div class="menu-wrapper">
    <el-submenu :index="index+''" :unique-opened="true">
      <template slot="title">
        <item :icon="item.Icon" :title="item.Name" />
      </template>   
      <el-menu-item v-if="item.MenuE" v-for="(child,index) in item.MenuE" 
        :index="child.Url" 
        :key="child.Url"
        @click="linkto(child)" >
        <item :icon="child.Icon" :title="child.Name" />
      </el-menu-item>
   
    </el-submenu>

  </div>
</template>

<script>
import { isExternal } from '@/utils/validate'
import Item from './Item'
import FixiOSBug from './FixiOSBug'
export default {
  name: 'SidebarItem',
  components: { Item },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  created(){

  },
  methods: {
    linkto(item){
      var keys=localStorage.getItem('SiteKey');
      var ley=localStorage.getItem('SiteKey').split(',');
      localStorage.setItem('SiteKey',ley[0]+','+item.Id);
      this.$router.push({path:item.Url});
    },
  }
}
</script>
