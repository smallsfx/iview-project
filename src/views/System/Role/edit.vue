<style lang="less">
@import "../../../styles/common.less";
</style>

<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
    <Row>
      <Col span="24">
      <Card>
        <p slot="title">基本信息</p>
        <FormItem label="角色名称" prop="name">
          <Input v-model="formValidate.name" placeholder="输入角色名称" clearable></Input>
        </FormItem>

        <FormItem label="角色描述">
          <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="输入角色描述..."></Input>
        </FormItem>
      </Card>
      </Col>
    </Row>
    <Row class="margin-top-10">
      <Col span="24">
      <Card dis-hover>
        <p slot="title">权限定制</p>
        <Scroll>
          <Tree ref="tree" @on-check-change="checkchange" :data="formValidate.groups" show-checkbox></Tree>
        </Scroll>
      </Card>
      </Col>
    </Row>
    <Row class="margin-top-10">
      <Col span="24">
      <!-- <Card dis-hover> -->
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
      </FormItem>
      <!-- </Card> -->
      </Col>
    </Row>
  </Form>
</template>

<script>
import { appRouter } from "@/modules/router/router";
import Config from "@/config/config";
export default {
  data() {
    return {
      formValidate: {
        name: "",
        remark: "",
        groups: []
      },
      ruleValidate: {
        name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }]
      },
      id:undefined
    };
  },
  mounted() {
    this.init();

    if( this.$route.params.id){
      this.id = this.$route.params.id;
      this.getDetail(this.$route.params.id);
    }

  },
  methods: {
    init(){
      let groups = [];
      appRouter.forEach(catalog => {
        let level1 = {
          title: catalog.title,
          text: catalog.title,
          name: catalog.name,
          // expand: true,
          children: []
        };
        if (catalog.children && catalog.children.length > 0) {
          catalog.children.forEach(moduleItem => {
            let level2 = {
              title: moduleItem.title,
              text: moduleItem.title,
              name: moduleItem.name,
              children: []
            };
            if (moduleItem.meta && moduleItem.meta.powers) {
              moduleItem.meta.powers.forEach(power => {
                level2.children.push({
                  title: power.text,
                  text: power.title,
                  code: `${power.code}`,
                  module: `${moduleItem.name}`,
                  name: `${moduleItem.name}-${power.code}`
                });
              });
            }
            level2.title = `[${level2.children.length}] - ${level2.title}`;
            level1.children.push(level2);
          });
        }
        level1.title = `[${level1.children.length}] - ${level1.title}`;
        groups.push(level1);
      });
      this.formValidate.groups = groups;
    },

    getDetail(id){

      this.$root.$axios.get(Config.api.role.detail, {id:id}, response => {
        if (response === undefined) {
          return;
        }
        this.formValidate.name = response.data.name;
        this.formValidate.remark = response.data.remark;

        if( response.data.permission){
          let permissions = response.data.permission.split(',');

          this.formValidate.groups.forEach( level1=>{
            level1.children.forEach(level2=>{
              level2.children.forEach(level3=>{
                level3.checked = permissions.indexOf( level3.name ) > -1;
              });
            });
          });
          this.checkchange();
        }
        // this.formValidate.groups
      });

    },

    handleSubmit(name) {
      let tree = this.$refs.tree;

      this.$refs[name].validate(valid => {
        try {
          if (valid) {
            let permissions = [];
            tree.getCheckedNodes().forEach(item => {
              if (!item.checked || !item.code || !item.module) {
                return;
              }
              permissions.push(item.name);
            });

            let option = {
              name: this.formValidate.name,
              remark: this.formValidate.remark,
              permission: permissions.join()
            };

            if( this.id === undefined){
              this.$root.$axios.post(Config.api.role.create, option, response => {
                if (response === undefined) {
                  return;
                }
                this.$root.$Notice.open({title: '新增角色成功'});
                this.$store.dispatch('closePage');
              });
            } else {
              option.id = this.id;
              this.$root.$axios.post(Config.api.role.update, option, response => {
                if (response === undefined) {
                  return;
                }
                this.$root.$Notice.open({title: '保存角色成功'});
                this.$store.dispatch('closePage');
              });
            }

          } else {
            this.$Message.error("Fail!");
          }
        } catch (ex) {
          console.error(ex.message);
        }
      });
    },

    handleReset(name) {
      this.$refs[name].resetFields();
    },

    checkchange() {
      this.formValidate.groups.forEach(level1 => {
        if (level1.children.length == 0) {
          return;
        }

        let level2Count = level1.children.length;
        let level2CheckCount = 0;
        let level2CheckNames = [];

        level1.children.forEach(level2 => {
          if (level2.children.length == 0) {
            return;
          }
          let checkeds = [];
          level2.children.forEach(level3 => {
            if (level3.checked) {
              checkeds.push(level3.title);
            }
          });

          let level3Count = level2.children.length;
          let level3CheckCount = checkeds.length;

          if (checkeds.length > 0) {
            level2CheckCount += 1;
            level2CheckNames.push(level2.text);
            level2.title = `[${level3CheckCount}/${level3Count}] - ${
              level2.text
            } - ${checkeds.join()}`;
          } else {
            level2.title = `[${level3CheckCount}/${level3Count}] - ${
              level2.text
            }`;
          }
        });
        if (level2CheckCount > 0) {
          level1.title = `[${level2CheckCount}/${level2Count}] - ${
            level1.text
          } - ${level2CheckNames.join()}`;
        } else {
          level1.title = `[${level2CheckCount}/${level2Count}] - ${
            level1.text
          }`;
        }
      });
    }
  }
};
</script>
