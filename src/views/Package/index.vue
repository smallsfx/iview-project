<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div>
    <Row class="margin-top-10">
      <Table border :loading="loading" ref="selection" :columns="columns" :data="data"></Table>
    </Row>
    <Footer>
      <Page :total="recordCount" :page-size="pageSize" show-sizer show-elevator show-total @on-change="handlePageChange" @on-page-size-change="handleSizeChange"></Page>
    </Footer>
  </div>
</template>

<script>
import util from "../../modules/Util/index";

const CONST_API = {
  QUERY: "api/package/query"
};
const CONST_COLUMNS = [
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  { key: "id", title: "编码", width: 80 },
  { key: "name", title: "名称"},
  { key: "desc", title: "描述"}
];

const CONST_FILTER = (() => {
  return {
    serviceFlag: "", //服务节点标志
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
      pageIndex: 0
    };
  },
  methods: {
    init() {
      this.search();
    },

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

      this.$root.$axios.get(CONST_API.QUERY, option, response => {
        self.loading = false;
        if (response === undefined) {
          return;
        }
        self.data = response.data.resultData;
        self.pageCount = self.data.pageCount;
        self.recordCount = self.data.recordCount;
        self.pageSize = self.data.pageSize;
        self.pageIndex = self.data.pageNumber;
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
