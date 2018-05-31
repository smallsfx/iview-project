<template>
    <Table :columns="columns" :data="packages"></Table>
</template>
<script>
import Config from "@/config/config";
export default {
  props: {
    row: Object
  },
  data() {
    return {
      columns: [
        {
            title: '套餐编码',
            key: 'id'
        },
        {
            title: '套餐名称',
            key: 'name'
        },
        {
            title: '定金金额',
            key: 'value1'
        },
        {
            title: '尾款金额',
            key: 'value2'
        }
      ],
      packages: []
    };
  },
  created() {
    let self = this;
    this.$root.$axios.get(Config.api.package.query, {}, response => {
      if (response === undefined) {
        return;
      }
      let packages = response.data.resultData;
      packages.forEach(item => {
        this.packages.push({ id: item.id, name: item.name,value1:item.amountFirst,value2:item.amountLast });
      });
      let data = {
      mobile: this.row.mobile
    };
    this.$root.$axios.get(Config.api.whitelist.attrQuery, data, response => {
      if (response === undefined) {
        return;
      }
      //filter
      response.data.resultData.forEach(item=>{
        let attr = item.attrKey.split('-');
        let code = attr[0];
        let type = attr[1];
        let child = this.packages.filter(child =>{
          return child.id === code;
        });
        if(child && child.length == 1){
          switch(type){
            case "1":
              child[0].value1 = item.attrValue;
            break;
            case "2":
              child[0].value2 = item.attrValue;
            break;
          }
        }
      });
    });
    });
    
  },
  mounted() {
    
  }
};
</script>