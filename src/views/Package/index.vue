<template>
  <div>
    <Card>
      <p slot="title">条件搜索</p>
      <Row>
        <Input v-model="table.filter.code" icon="search" clearable placeholder="套餐编码" style="width: 150px" />
        <Input v-model="table.filter.name" icon="search" clearable placeholder="套餐名称" style="width: 150px" />
        <Select v-model="table.filter.status" style="width:100px" clearable placeholder="状态">
          <Option v-for="item in dicts.statuses" :value="item.value" :key="item.value">{{ item.text }}</Option>
        </Select>

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
import Util from "@/modules/Util/index";
import Config from "@/config/config";
import ViewBase from "@/views/ViewBase/index.vue";

const CONST_DICT_STATUS = {
  "1": "启用",
  "0": "禁用"
};

export default {
  extends: ViewBase,
  data() {
    return {
      dicts: {
        statuses: Util.dict2array(CONST_DICT_STATUS)
      }
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
        { key: "id", title: "编码", width: 80 },
        { key: "name", title: "名称" },
        {
          key: "status",
          title: "状态",
          width: 100,
          render: function(h, params) {
            return h("div", CONST_DICT_STATUS[this.row.status]);
          }
        },
        { key: "desc", title: "描述" },
        Util.generator.createActionColumn('操作',(params)=>{
          return [
            { text:'编辑',click:()=>{ this.$router.push({name: "package-update",params: { id: params.row.id }}); } }
          ];
        })
      ];
      // 为ViewBase设置查询API
      this.table.api = Config.api.package.query;
      // 为ViewBase设置查询条件定义
      this.table.filter = {
        name: "",
        code: "",
        status: ""
      };
      // 调用ViewBase.search方法，执行数据查询
      this.search();
    },

    handleCreate(){
      this.$router.push({ name: "package-create" });
    }
  }
};
</script>
