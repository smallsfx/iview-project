<style lang="less">
@import "../../styles/common.less";
</style>

<template>
  <div></div>
</template>

<script>
export default {
  name: "system-log-search",
  data() {
    return {
      api: {},
      loading: false,
      filter: {},
      columns: [],
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

      this.$root.$axios.get(this.api.query, option, response => {
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
