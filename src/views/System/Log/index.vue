<style lang="less">
@import "../../../styles/common.less";
</style>

<template>
  <div>
    <Card>
      <p slot="title">条件搜索</p>
      <Row>
        <Input v-model="filter.threadId" icon="search" clearable placeholder="线程号" style="width: 80px" />
        <Select v-model="filter.type" style="width:100px" clearable placeholder="日志类型">
          <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.text }}</Option>
        </Select>
        <Select v-model="filter.businessFlag" style="width:100px" clearable placeholder="业务标识">
          <Option v-for="item in businessFlags" :value="item.value" :key="item.value">{{ item.text }}</Option>
        </Select>
        <Select v-model="filter.action" style="width:140px" clearable placeholder="动作标识">
          <Option v-for="item in actions" :value="item.value" :key="item.value">{{ item.text }}</Option>
        </Select>

        <span @click="handleSearch" style="margin: 0 10px;">
          <Button type="primary" icon="search">搜索</Button>
        </span>
        <Button @click="handleCancel" type="ghost">取消</Button>
      </Row>
    </Card>
    <Card class="margin-top-10">
      <Row>
        <Table :loading="loading" ref="selection" :columns="columns" :data="data" stripe></Table>
      </Row>
    </Card>
    <Card class="margin-top-10">
      <Page size="small" :total="recordCount" :page-size="pageSize" show-sizer show-elevator show-total @on-change="handlePageChange" @on-page-size-change="handleSizeChange"></Page>
    </Card>
  </div>
</template>

<script>
import util from "../../../modules/Util/index";
import expandRow from "./components/table-expand.vue";
import Config from "@/config/config";
/** 日志类型 */
const CONST_DICT_TYPE = {
  system: "系统",
  business: "业务",
  operate: "操作",
  exception: "异常"
};
/** 日志动作类型 */
const CONST_DICT_ACTION = {
  create: "新增",
  update: "修改",
  "order-pay-first": "订单支付-定金",
  "order-pay-notice": "订单支付-通知",
  "order-pay-last": "订单支付-尾款",
  "order-pay-close": "订单关闭",
  logout: "注销",
  login: "登录",
  enable: "启用",
  disable: "禁用",
  "reset-password": "重置密码",
  "change-password": "修改密码",
  undefined: "未知"
};

const CONST_DICT_BUSINESS = {
  login: "用户登录",
  user: "用户",
  role: "角色",
  system: "系统",
  "customer-order": "订单",
  pay: "支付",
  whitelist: "客户白名单"
};

const CONST_COLUMNS = [
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  { key: "serviceFlag", title: "服务节点标志", width: 125 },
  { key: "threadId", title: "线程", width: 80 },
  {
    key: "type",
    title: "日志类型",
    width: 100,
    render: function(h, params) {
      return h("div", CONST_DICT_TYPE[this.row.type]);
    }
  },
  {
    key: "businessFlag",
    title: "业务标识",
    width: 100,
    render: function(h, params) {
      return h("div", CONST_DICT_BUSINESS[this.row.businessFlag]);
    }
  },
  {
    key: "action",
    title: "操作类型",
    width: 100,
    render: function(h, params) {
      return h("div", CONST_DICT_ACTION[this.row.action]);
    }
  },
  {
    key: "content",
    title: "日志内容",
    width: 300,
    ellipsis: true
  },
  { key: "operator", title: "操作员账号", width: 150 },
  {
    key: "createTime",
    title: "操作时间",
    width: 150,
    render: function(h, params) {
      return h(
        "div",
        util.utcToString(this.row.createTime / 1000, "yyyy-MM-dd hh:mm:ss")
      );
    }
  },
  { key: "ipAddress", title: "登录IP", width: 150 },
  { key: "remark", title: "附加信息", width: 150, ellipsis: true }
];

const CONST_FILTER = (() => {
  return {
    serviceFlag: "", //服务节点标志
    businessFlag: "", //业务标志
    targetId: "", //操作目标记录主键
    threadId: "", //线程号
    action: "", //动作
    type: "", //类型
    ipAddress: "", //IP地址
    operator: "", //操作者
    beginCreateTime: "", //创建时间范围最小值
    endCreateTime: "" //创建时间范围最大值
  };
})();

export default {
  name: "system-log-search",
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
      businessFlags: util.dict2array(CONST_DICT_BUSINESS),
      types: util.dict2array(CONST_DICT_TYPE),
      actions: util.dict2array(CONST_DICT_ACTION)
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

      this.$root.$axios.get(Config.api.queryLog, option, response => {
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
