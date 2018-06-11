<template>
  <div>
    <Card>
      <p slot="title">条件搜索</p>
      <Row>
        <Input v-model="table.filter.name" icon="search" clearable placeholder="客户姓名" style="width: 150px" />
        <Input v-model="table.filter.mobile" icon="search" clearable placeholder="客户手机号" style="width: 150px" />

        <span @click="handleSearch" style="margin: 0 10px;">
          <Button type="primary" icon="search">搜索</Button>
        </span>
        <Button @click="handleCancel" type="ghost">取消</Button>
      </Row>
    </Card>
    <Card class="margin-top-10">
      <Row>
        <span @click="handleCreate">
          <Button type="dashed" icon="search">新增</Button>
        </span>
      </Row>
      <Row class="margin-top-10">
        <Table :loading="table.loading" ref="selection" :columns="table.columns" :data="table.data" stripe></Table>
      </Row>
    </Card>
    <Card class="margin-top-10">
      <Page size="small" :total="table.recordCount" :page-size="table.pageSize" show-sizer show-elevator show-total @on-change="handlePageChange" @on-page-size-change="handleSizeChange"></Page>
    </Card>
  </div>
</template>

<script>
import Util from "../../../modules/Util/index";
import Config from "@/config/config";
import ViewBase from "@/views/ViewBase/index.vue";
import expandRow from "./components/table-expand.vue";

export default {
  extends: ViewBase,
  data() {
    return {
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 为ViewBase设置表格字段
      this.table.columns = [
        { type: "selection", width: 60, align: "center" },
        { type: "expand",width: 50,render: (h, params) => {return h(expandRow, {props: {row: params.row}});}},
        { key: "name", title: "客户名称"},
        { key: "mobile", title: "客户手机号码"},
        { key: "discount", title: "折扣率"},
        Util.generator.createDateColumn('createTime','创建时间'),
        Util.generator.createDateColumn('lastModifyTime','最后修改时间'),
        Util.generator.createActionColumn('操作',(params)=>{
          return [
            { text:'编辑',click:()=>{ this.$router.push({name: "whitelist-update",params: { id: params.row.id }}); } }
          ];
        })
      ];
      // 为ViewBase设置查询API
      this.table.api = Config.api.whitelist.query;
      // 为ViewBase设置查询条件定义
      this.table.filter = {
        name:'',
        mobile:''
      };
      // 调用ViewBase.search方法，执行数据查询
      this.search();
    },

    handleCreate(){
      this.$router.push({ name: "whitelist-create" });
    }
  }
};
</script>
