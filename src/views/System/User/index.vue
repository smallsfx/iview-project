
<template>
  <div>
    <Card>
      <p slot="title">条件搜索</p>
      <Row>
        <Input v-model="table.filter.userName" icon="search" clearable placeholder="登录名称" style="width: 150px" />
        <Input v-model="table.filter.nickName" icon="search" clearable placeholder="用户名称" style="width: 150px" />

        <Select v-model="table.filter.roleId" style="width:100px" clearable placeholder="用户角色">
          <Option v-for="item in roles" :value="item.value" :key="item.value">{{ item.text }}</Option>
        </Select>

        <Select v-model="table.filter.status" style="width:100px" clearable placeholder="状态">
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

const CONST_DICT_STATUS = {
  "1": "启用",
  "0": "禁用"
};

const CONST_FILTER = (() => {
  return {
    userName: "",
    nickName: "",
    status: "",
    beginCreateTime: "", //创建时间范围最小值
    endCreateTime: "" //创建时间范围最大值
  };
})();

export default {
  extends: ViewBase,
  data() {
    return {
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
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 为ViewBase设置表格字段
      this.table.columns = [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        { key: "userName", title: "登录名称", width: 200 },
        { key: "nickName", title: "用户名称", width: 200 },
        { key: "roleName", title: "角色名称", width: 200 },
        { key: "email", title: "电子邮箱", width: 200 },
        { key: "mobile", title: "搜集号码", width: 200 },
        {
          key: "status",
          title: "状态",
          width: 100,
          render: function(h, params) {
            return h("div", CONST_DICT_STATUS[this.row.status]);
          }
        },
        { key: "remark", title: "描述", width: 150, ellipsis: true },
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
        },
        {
          title: "操作",
          key: "show_more",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h(
              "Button",
              {
                props: { type: "text", size: "small" },
                on: {
                  click: () => {
                    this.$router.push({
                      name: "user-update",
                      params: { id: params.row.id }
                    });
                  }
                }
              },
              "编辑"
            );
          }
        }
      ];
      // 为ViewBase设置查询API
      this.table.api = Config.api.user.query;
      // 为ViewBase设置查询条件定义
      this.table.filter = CONST_FILTER;
      // 调用ViewBase.search方法，执行数据查询
      this.search();
    },

    handleCreate() {
      this.$router.push({ name: "user-create" });
    }
  }
};
</script>
