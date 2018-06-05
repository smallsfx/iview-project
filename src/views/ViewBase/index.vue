<!--
描述：公共查询页面业务逻辑基础类  
路径：/views/ViewBase/index.vue
作者：王鑫
时间：2018-6-3
-->
<style lang="less">
@import "../../styles/common.less";
</style>

<script>
export default {
  data() {
    return {
      table: {
        /** 查询数据调用的API */
        api: "",
        /** 表格数据缓存 */
        data: [],
        /** 表格中字段定义 */
        columns: [],
        /** 设置分页查询中表格是否处于查询状态 */
        loading: false,
        /** 查询条件对象：需在派生类中设置查询条件 */
        filter: {},
        /** 当前分页查询中页面总数 */
        pageCount: 0,
        /** 当前分页查询中数据总数 */
        recordCount: 0,
        /** 当前分页大小 */
        pageSize: 10,
        /** 当前分页索引 */
        pageIndex: 0
      },
      permission: []
    };
  },
  /** 页面生成之前调用 */
  beforeMount(){
    /** 初始化模块页面权限 */
    this._init_permission();
    // console.log(this.permission);
  },
  methods: {
    /** 初始化页面权限 */
    _init_permission() {
      // console.info(`view-base:this.$route`);
      let powers = this.$route.meta.powers;
      powers.forEach(power => {
        this.permission.push(power.code);
      });
    },
    /**
     * 通用查询方法：需在派生类中实现方法
     * @param {any} filter 查询条件
     * @param {number} index 页面索引
     * @param {number} size 分页大小
     */
    search(filter, index, size) {
      this.table.loading = true;
      let self = this;
      let option = {
        page: index || this.table.pageIndex || 1,
        pageSize: size || this.table.pageSize || 10
      };

      if (filter) {
        Object.keys(filter).forEach((name, index) => {
          let value = filter[name];
          if (value) {
            option[name] = value;
          }
        });
      }

      this.$root.$axios.get(this.table.api, option, response => {
        self.table.loading = false;
        if (response === undefined) {
          return;
        }
        self.table.data = response.data.resultData;
        self.table.pageCount = response.data.pageCount;
        self.table.recordCount = response.data.recordCount;
        self.table.pageSize = response.data.pageSize;
        self.table.pageIndex = response.data.pageNumber;
      });
    },
    /** 通用查询按钮点击事件处理 */
    handleSearch() {
      console.info(`view-base:handleSearch()`);
      this.search(this.table.filter,1);
    },
    /** 通用取消按钮点击事件处理 */
    handleCancel() {
      console.info(`view-base:handleCancel()`);
      this.search();
    },
    /**
     * 通用分页按钮点击事件处理
     * @param {number} index 调整后的页面索引
     */
    handlePageChange(index) {
      console.info(`view-base:handlePageChange(${index})`);
      this.search(this.table.filter, index);
    },
    /**
     * 通用页面大小改变事件处理
     * @param {number} size 调整后的分页大小
     */
    handleSizeChange(size) {
      console.info(`view-base:handleSizeChange(${size})`);
      if (size === this.table.pageSize) {
        return;
      }
      this.search(this.table.filter, 1, size);
    }
  }
};
</script>