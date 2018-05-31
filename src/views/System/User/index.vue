<style lang="less">
@import "../../../styles/common.less";
</style>

<template>
  <div>
    <Card>
      <p slot="title">条件搜索</p>
      <Row>
        <Input v-model="filter.userName" icon="search" clearable placeholder="登录名称" style="width: 150px" />
        <Input v-model="filter.nickName" icon="search" clearable placeholder="用户名称" style="width: 150px" />

        <Select v-model="filter.roleId" style="width:100px" clearable placeholder="用户角色">
          <Option v-for="item in roles" :value="item.value" :key="item.value">{{ item.text }}</Option>
        </Select>
        
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
import Util from "../../../modules/Util/index";
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
  { key: "userName", title: "登录名称", width: 200 },
  { key: "nickName", title: "用户名称", width: 200 },
  { key: "roleName", title: "角色名称", width: 200 },
  {
    key: "status",
    title: "状态",
    width: 100,
    render: function(h, params) {
      return h("div", CONST_DICT_STATUS[this.row.status]);
    }
  },
  {
    key: "createTime",
    title: "创建时间",
    width: 150,
    render: function(h, params) {
      return h(
        "div",
        Util.utcToString(this.row.createTime, "yyyy-MM-dd hh:mm:ss")
      );
    }
  },
  {
    key: "lastModifyTime",
    title: "最后修改时间",
    width: 150,
    render: function(h, params) {
      return h(
        "div",
        Util.utcToString(this.row.lastModifyTime, "yyyy-MM-dd hh:mm:ss")
      );
    }
  }
];

const CONST_FILTER = (() => {
  return {
    userName: "",
    nickName: "",
    status:"",
    beginCreateTime: "", //创建时间范围最小值
    endCreateTime: "" //创建时间范围最大值
  };
})();

export default {
  name: "system-user-search",
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
      roles: [],
      statuses: Util.dict2array(CONST_DICT_STATUS)
    };
  },
  created() {
    let self = this;
    this.$root.$axios.get(Config.api.role.query, {}, response => {
      if (response === undefined) {
        return;
      }
      response.data.resultData.forEach(item => {
        self.roles.push({
          value: item.id,
          text: item.name
        });
      });
    });
  },
  methods: {
    init() {
      this.search();
    },

    search(filter, index, size) {
      this.loading = true;
      let self = this;
      let option = {
        page: index || this.pageIndex || 1,
        pageSize: size || this.pageSize || 10
      };

      if (filter) {
        Object.keys(filter).forEach((name, index) => {
          let value = filter[name];
          if (value) {
            option[name] = value;
          }
        });
      }

      this.$root.$axios.get(Config.api.user.query, option, response => {
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

    handleCreate() {
      this.$router.push({ name: "user-create" });
    },

    handleSearch() {
      this.search(this.filter);
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
