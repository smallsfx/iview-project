<style lang="less">
@import "./index.less";
</style>

<template>
  <div>
    <Card>
      <p slot="title">条件搜索</p>
      <Row>
        <Input v-model="table.filter.contractPhone" icon="search" placeholder="联系人手机号搜索..." style="width: 200px" />
        <Input v-model="table.filter.customerPhone" icon="search" placeholder="新人手机号搜索..." style="width: 200px" />
        <Input v-model="table.filter.orderId" icon="search" placeholder="订单号搜索..." style="width: 200px" />
      
        <span @click="handleSearch" style="margin: 0 10px;">
          <Button type="primary" icon="search">搜索</Button>
        </span>
        <Button @click="handleCancel" type="ghost">取消</Button>
      </Row>
    </Card>
    <Card class="margin-top-10">
      <Row>
        <Table :row-class-name="rowClassName" :loading="table.loading" ref="selection" :columns="table.columns" :data="table.data" stripe></Table>
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

const OrderStatus = {
  "0": "已关闭",
  "1": "未支付",
  "2": "等待拍摄",
  "3": "未取片",
  "4": "已完结"
};

export default {
  extends: ViewBase,
  data() {
    return {
    };
  },
  methods: {
    init() {
      // 为ViewBase设置表格字段
      this.table.columns = [
        { type: "selection", width: 60, align: "center" },
        { key: "id", title: "订单编号", width: 125 },
        Util.generator.createDateColumn('createTime','下单时间'),
        Util.generator.createFormatColumn('订单状态',(params)=>{
          return OrderStatus[params.row.status];
        }),
        { key: "contractName", title: "联系人姓名", width: 150 },
        { key: "contractPhone", title: "联系人电话", width: 150 },
        { key: "customerName", title: "新人姓名", width: 150 },
        { key: "customerPhone", title: "新人电话", width: 150 },
        Util.generator.createDateColumn('workTime','拍摄时间'),
        { key: "workAddress", title: "拍摄地址", ellipsis: true, width: 200 },
        { key: "packageCode", title: "套餐编码", width: 100 },
        { key: "packageName", title: "套餐名称", width: 150 },
         Util.generator.createFormatColumn('总金额',(params)=>{
          return (parseInt(params.row.amountTotal) / 100).toFixed(2) + "元";
        }),
        Util.generator.createFormatColumn('折扣金额',(params)=>{
          return (parseInt(params.row.amountDiscount) / 100).toFixed(2) + "元";
        }),
        { key: "postAddress", title: "邮寄地址", ellipsis: true, width: 200 },
        { key: "remark", title: "备注", ellipsis: true, width: 80 },
        Util.generator.createActionColumn('操作',(params)=>{
          return [
            { text:'编辑',click:()=>{ this.$router.push({name: "package-update",params: { id: params.row.id }}); } }
          ];
        })
      ];
      // 为ViewBase设置查询API
      this.table.api = Config.api.order.query;
      // 为ViewBase设置查询条件定义
      this.table.filter = {
        contractPhone: "",
        customerPhone: "",
        orderId: "",
        beginCreateTime: "", //创建时间范围最小值
        endCreateTime: "" //创建时间范围最大值
      };
      // 调用ViewBase.search方法，执行数据查询
      this.search();
    },

    rowClassName(row, index) {
      if (row.status === 0) {
        return "status-close";
      } else if (row.status === 2) {
        return "status-wait";
      } else if (row.status === 4) {
        return "status-complated";
      }
      return "";
    }
  },
  mounted() {
    this.init();
  }
};
</script>
