<style lang="less">
@import '../../../styles/common.less';
@import './index.less';
</style>

<template>
    <div>
        <Row>
            <Input v-model="filter.contractPhone" icon="search" placeholder="联系人手机号搜索..." style="width: 200px" />
            <Input v-model="filter.customerPhone" icon="search" placeholder="新人手机号搜索..." style="width: 200px" />
            <Input v-model="filter.orderId" icon="search" placeholder="订单号搜索..." style="width: 200px" />
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

import Util from '../../../modules/Util/index';
const OrderStatus = {
    '0': '已关闭',
    '1': '未支付',
    '2': '等待拍摄',
    '3': '未取片',
    '4': '已完结'
};
const columns = [
    { type: 'selection', width: 60, align: 'center' },
    { key: 'id', title: '订单编号', width: 125 },
    {
        key: 'createTime',
        title: '下单时间',
        width: 150,
        render: function (h, params) {return h('div',Util.utcToString(params.row.createTime, 'yyyy-MM-dd hh:mm:ss'));}
    },
    {
        key: 'status',
        title: '订单状态',
        width: 100,
        render: function (h, params) {return h('div', OrderStatus[params.row.status]);}
    },
    { key: 'contractName', title: '联系人姓名', width: 150 },
    { key: 'contractPhone', title: '联系人电话', width: 150 },
    { key: 'customerName', title: '新人姓名', width: 150 },
    { key: 'customerPhone', title: '新人电话', width: 150 },
    {
        key: 'workTime',
        title: '拍摄时间',
        width: 200,
        render: function (h, params) {return h('div', Util.utcToString(params.row.workTime, 'yyyy-MM-dd hh:mm'));}
    },
    { key: 'workAddress', title: '拍摄地址', ellipsis: true, width: 200 },
    { key: 'packageCode', title: '套餐编码', width: 100 },
    { key: 'packageName', title: '套餐名称', width: 150 },
    {
        key: 'amountTotal',
        title: '总金额',
        width: 150,
        render: function (h, params) {return h('span',(parseInt(params.row.amountTotal) / 100).toFixed(2) + '元');}
    },
    {
        key: 'amountDiscount',
        title: '折扣金额',
        width: 150,
        render: function (h, params) {return h('span',(parseInt(params.row.amountDiscount) / 100).toFixed(2) + '元');}
    },
    { key: 'postAddress', title: '邮寄地址', ellipsis: true, width: 200 },
    { key: 'remark', title: '备注', ellipsis: true, width: 80 }
];

export default {
    name: 'searchable-table',
    data () {
        return {
            loading: false,
            filter: {
                contractPhone: '',
                customerPhone: '',
                orderId: ''
            },
            columns: columns,
            data: [],
            pageCount: 0,
            recordCount: 0,
            pageSize: 10,
            pageIndex: 1
        };
    },
    methods: {
        init () {
            this.search();
        },

        handleSearch () {
            this.search(this.filter);
        },

        search (filter, index, size) {
            this.loading = true;
            let self = this;
            let option = {
                page: index || this.pageIndex,
                pageSize: size || this.pageSize
            };
            if (filter && filter.customerPhone !== undefined) {
                option.customerPhone = filter.customerPhone;
            }
            if (filter && filter.contractPhone !== undefined) {
                option.contractPhone = filter.contractPhone;
            }
            if (filter && filter.orderId !== undefined) {
                option.orderId = filter.orderId;
            }
            this.$root.$axios.get('api/order/query', option, function revole (response) {
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

        handleCancel () {
            this.filter.contractPhone = '';
            this.filter.customerPhone = '';
            this.filter.orderId = '';
            this.search();
        },

        handlePageChange (index) {
            this.search(this.filter, index);
        },

        handleSizeChange (size) {
            if (size === this.pageSize) {
                return;
            }
            this.search(this.filter, 1, size);
        },

        rowClassName (row, index) {
            if (row.status === 0) {
                return 'status-close';
            } else if (row.status === 2) {
                return 'status-wait';
            } else if (row.status === 4) {
                return 'status-complated';
            }
            return '';
        }
    },
    mounted () {
        this.init();
    }
};
</script>
