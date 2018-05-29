<style lang="less">
@import '../../styles/common.less';
</style>

<template>
  <div>
    <Row>
      <Input v-model="contractPhone" icon="search" placeholder="联系人手机号搜索..." style="width: 200px" />
      <Input v-model="customerPhone" icon="search" placeholder="新人手机号搜索..." style="width: 200px" />
      <Input v-model="orderId" icon="search" placeholder="订单号搜索..." style="width: 200px" />

      <Select v-model="type" style="width:200px">
        <Option v-for="item in types" :value="item" :key="item.value">{{ item }}</Option>
      </Select>
      <span @click="handleSearch" style="margin: 0 10px;">
        <Button type="primary" icon="search">搜索</Button>
      </span>
      <Button @click="handleCancel" type="ghost">取消</Button>
    </Row>
    <Row class="margin-top-10">
      <Table :row-class-name="rowClassName" :loading="loading" ref="selection" :columns="columns" :data="data"></Table>
    </Row>
    <Footer>
      <Page :total="recordCount" :page-size="pageSize" show-sizer show-elevator show-total @on-change="handlePageChange" @on-page-size-change="handleSizeChange"></Page>
    </Footer>
  </div>
</template>

<script>
import Util from '../../modules/Util/index';
/** 日志类型 */
const LOG_TYPE = {
  system: '系统',
  business: '业务',
  operate: '操作',
  exception: '异常'
}

/** 日志动作类型 */
const LOG_ACTION = {
  create: '新增',
  update: '修改',
  'order-pay-first': '订单支付',
  'order-pay-notice': '订单支付',
  'order-pay-last': '订单支付',
  'order-pay-close': '订单关闭',
  logout: '注销',
  login: '登录',
  'change-password': '修改密码',
  undefined: '未知'
}

const businessFlag = {
  login: '用户登录',
  user: '用户',
  role: '角色',
  system: '系统',
  'customer-order': '订单'
}

const columns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  { key: 'serviceFlag', title: '订单编号', width: 125 },
  { key: 'threadId', title: '线程', width: 80 },
  {
    key: 'businessFlag',
    title: '业务标识',
    width: 100,
    render: function(h, params) {
      return h('div', businessFlag[this.row.businessFlag])
    }
  },
  {
    key: 'content',
    title: '日志内容',
    width: 300,
    ellipsis: true
  },
  {
    key: 'type',
    title: '日志类型',
    width: 100,
    render: function(h, params) {
      return h('div', LOG_TYPE[this.row.type])
    }
  },
  {
    key: 'action',
    title: '操作类型',
    width: 100,
    render: function(h, params) {
      return h('div', LOG_ACTION[this.row.action])
    }
  },
  { key: 'operator', title: '操作员账号', width: 150 },
  {
    key: 'createTime',
    title: '操作时间',
    width: 150,
    render: function(h, params) {
      return h(
        'div',
        Util.utcToString(this.row.createTime, 'yyyy-MM-dd hh:mm:ss')
      )
    }
  },
  { key: 'ipAddress', title: '登录IP', width: 150 },
  { key: 'remark', title: '附加信息', width: 150, ellipsis: true }
]

export default {
  name: 'searchable-table',
  data() {
    return {
      loading: false,

      contractPhone: '',
      customerPhone: '',
      orderId: '',
      type: '',

      columns: columns,
      data: [],
      pageCount: 0,
      recordCount: 0,
      pageSize: 10,
      pageIndex: 0,

      types: LOG_TYPE,
      actions: []
    }
  },
  methods: {
    init() {
      this.search()
    },

    handleSearch() {
      this.search(this.filter)
    },

    search(filter, index, size) {
      this.loading = true
      let self = this
      let option = {
        page: index || this.pageIndex,
        pageSize: size || this.pageSize
      }
      if (filter && filter.customerPhone !== undefined) {
        option.customerPhone = filter.customerPhone
      }
      if (filter && filter.contractPhone !== undefined) {
        option.contractPhone = filter.contractPhone
      }
      if (filter && filter.orderId !== undefined) {
        option.orderId = filter.orderId
      }
      this.$root.$axios.get('api/system/log/query', option, function revole(
        response
      ) {
        self.loading = false
        if (response === undefined) {
          return
        }
        self.data = response.data.resultData
        self.pageCount = self.data.pageCount
        self.recordCount = self.data.recordCount
        self.pageSize = self.data.pageSize
        self.pageIndex = self.data.pageNumber
      })
    },

    handleCancel() {
      this.filter.contractPhone = ''
      this.filter.customerPhone = ''
      this.filter.orderId = ''
      this.search()
    },

    handlePageChange(index) {
      this.search(this.filter, index)
    },

    handleSizeChange(size) {
      if (size === this.pageSize) {
        return
      }
      this.search(this.filter, 1, size)
    },

    rowClassName(row, index) {
      if (row.status === 0) {
        return 'status-close'
      } else if (row.status === 2) {
        return 'status-wait'
      } else if (row.status === 4) {
        return 'status-complated'
      }
      return ''
    }
  },
  mounted() {
    this.init()
  }
}
</script>
