<style lang="less">
@import "../../../styles/common.less";
</style>
<template>
    <div>
        <Row>
            <Input v-model="filter.name" icon="search" placeholder="客户姓名" style="width: 200px" />
            <Input v-model="filter.mobile" icon="search" placeholder="客户手机号码" style="width: 200px" />
            <span @click="handleSearch" style="margin: 0 10px;">
                <Button type="primary" icon="search">搜索</Button>
            </span>
            <Button @click="handleCancel" type="ghost">取消</Button>
        </Row>
        <Row class="margin-top-10">
            <Table :loading="loading" ref="selection" :columns="columns" :data="data"></Table>
        </Row>
        <Footer>
            <Page :total="recordCount" :page-size="pageSize" show-sizer show-elevator show-total @on-change="handlePageChange" @on-page-size-change="handleSizeChange"></Page>
        </Footer>
    </div>
</template>

<script>
import Util from '../../../modules/Util/index';
import expandRow from "./components/table-expand.vue";
const CONST_API = {
  QUERY: "api/whitelist/query",
  CREATE: "api/whitelist/create",
  UPDATE: "api/whitelist/update",
  REMOVE: "api/whitelist/remove"
};
const columns = [
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  {
    type: "expand",
    width: 50,
    render: (h, params) => {
      return h(expandRow, {
        props: {
          row: params.row
        }
      });
    }
  },
  { key: 'name', title: '客户名称'},
  { key: 'mobile', title: '客户手机号码'},
  { key: 'discount', title: '折扣率'},
  // { key: 'status', title: '状态', width: 100 }
  // {
  //     key: 'createTime',
  //     title: '创建时间',
  //     width: 150,
  //     render: function (h, params) {return h('div',Util.utcToString(params.row.createTime, 'yyyy-MM-dd hh:mm:ss'));}
  // },
  // {
  //     key: 'lastModifyTime',
  //     title: '修改时间',
  //     width: 150,
  //     render: function (h, params) {return h('div',Util.utcToString(params.row.lastModifyTime, 'yyyy-MM-dd hh:mm:ss'));}
  // }
];

export default {
    name: 'whitelist-search',
    data () {
        return {
            loading: false,
            filter: {
                name:'',
                mobile:''
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

        search (filter, index, size) {
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
            this.$root.$axios.get(CONST_API.QUERY, option, function revole (response) {
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
        
        handleSearch () {
            this.search(this.filter);
        },

        handleCancel () {
            this.filter.name = '';
            this.filter.mobile = '';
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
        }
    },
    mounted () {
        this.init();
    }
};
</script>
