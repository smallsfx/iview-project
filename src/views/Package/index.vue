<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Card>
      <p slot="title">条件搜索</p>
      <Row>
        <Input v-model="filter.name" icon="search" clearable placeholder="套餐名称" style="width: 150px" />

        <Select v-model="filter.status" style="width:100px" clearable placeholder="状态">
          <Option v-for="item in statuses" :value="item.value" :key="item.value">{{ item.text }}</Option>
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
        <Table :loading="loading" ref="selection" :columns="columns" :data="data" stripe></Table>
      </Row>
    </Card>
    <Card class="margin-top-10">
      <Page size="small" :total="recordCount" :page-size="pageSize" show-sizer show-elevator show-total @on-change="handlePageChange" @on-page-size-change="handleSizeChange"></Page>
    </Card>
  </div>
</template>

<script>
import Util from "../../modules/Util/index";
import Config from "@/config/config";

const CONST_DICT_STATUS = {
  "1": "启用",
  "0": "禁用"
};

const CONST_COLUMNS = [
  {
    type: "selection",
    width: 60,
    align: "center"
  },
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
  { key: "desc", title: "描述" }
];

const CONST_FILTER = (() => {
  return {
    name: "",
    status: ""
  };
})();

export default {
  name: "package-search",
  data() {
    return {
      loading: false,
      filter: CONST_FILTER,
      columns: CONST_COLUMNS,
      data: [],
      pageCount: 0,
      recordCount: 0,
      pageSize: 10,
      pageIndex: 0,
      statuses: Util.dict2array(CONST_DICT_STATUS)
    };
  },
  methods: {
    init() {
      this.search();
    },
    handleCreate() {},

    handleSearch() {
      this.search(this.filter);
    },

    search(filter, index, size) {
      this.loading = true;
      let self = this;
      let option = {
        page: index || this.pageIndex,
        pageSize: size || this.pageSize
      };

      if (filter) {
        Object.keys(filter).forEach((name, index) => {
          let value = filter[name];
          if (value) {
            option[name] = value;
          }
        });
      }

      this.$root.$axios.get(Config.api.package.query, option, response => {
        self.loading = false;
        if (response === undefined) {
          return;
        }
        self.data = response.data.resultData;
        self.pageCount = response.data.pageCount;
        self.recordCount = response.data.recordCount;
        self.pageSize = response.data.pageSize;
        self.pageIndex = response.data.pageNumber;
      });
    },

    handleCancel() {
      this.filter = CONST_FILTER;
      this.search();
    },

    handlePageChange(index) {
      this.search(this.filter, index);
    },

    handleSizeChange(size) {
      if (size === this.pageSize) {
        return;
      }
      this.search(this.filter, 1, size);
    }
  },
  mounted() {
    this.init();
  }
};
</script>
