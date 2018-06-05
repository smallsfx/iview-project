<style lang="less">
@import "../../../styles/common.less";
</style>

<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
    <Row>
      <Col span="24">
      <Card>
        <p slot="title">基本信息</p>
        
        <FormItem label="登录名" prop="username">
          <Input v-model="formValidate.username" placeholder="输入登录" clearable></Input>
        </FormItem>

        <FormItem v-if="id===undefined" label="登录密码" prop="password">
          <Input type="password" v-model="formValidate.password" placeholder="输入登录密码" clearable></Input>
        </FormItem>

        <FormItem v-if="id===undefined" label="确认密码" prop="password2">
          <Input type="password" v-model="formValidate.password2" placeholder="输入确认密码" clearable></Input>
        </FormItem>

        <FormItem label="用户名称" prop="nickname">
          <Input v-model="formValidate.nickname" placeholder="输入用户名称" clearable></Input>
        </FormItem>

        <FormItem label="电子邮箱" prop="email">
          <Input v-model="formValidate.email" placeholder="输入电子邮箱" clearable></Input>
        </FormItem>

        <FormItem label="手机号码" prop="mobile">
          <Input v-model="formValidate.mobile" placeholder="输入手机号码" clearable></Input>
        </FormItem>

        <FormItem label="用户角色" prop="roleId">
          <Select v-model="formValidate.roleId" clearable placeholder="用户角色">
            <Option v-for="item in roles" :value="item.value" :key="item.value">{{ item.text }}</Option>
          </Select>
        </FormItem>

        <FormItem label="用户描述">
          <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="输入用户描述..."></Input>
        </FormItem>
      </Card>
      </Col>
    </Row>
    
    <Row class="margin-top-10">
      <Col span="24">
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
          <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
import Config from "@/config/config";
export default {
  data() {
    return {
      formValidate: {
        nickname: "",
        username: "",
        roldId:'',
        password:'',
        password2:'',
        email:'',
        mobile: '',
        remark:''
      },
      ruleValidate: {
        nickname: [{ required: true, message: "用户名称必须输入", trigger: "blur" }],
        username: [{ required: true, message: "登录名必须输入", trigger: "blur" }],
        roleId: [{ required: true, message: "必须为用户分配一个角色", trigger: "change" }],
        email:[
          { type: 'email', message: '电子邮箱格式不正确' }
        ],
        mobile:[
          {pattern: /^1[34578]\d{9}$/, message: '手机号码格式不正确'}
        ],
        password: [
          {
            trigger: "blur",
            validator:(rule, value, callback, source, options)=> {
              if (value === '') {
                return callback(new Error('请输入密码'));
              } else if (value.length < 7) {
                return callback(new Error('密码需由6个以上字符组成'));
              } else {
                callback();
              }
            }
          }
        ],
        password2: [
            {
              validator:(rule, value, callback, source, options)=> {
                if (value === '') {
                  return callback(new Error('请再次输入密码'));
                } else if (value !== this.formValidate.password) {
                  return callback(new Error('两次密码不一致'));
                } else {
                  callback();
                }
              }
            }
        ],
      },
      roles:[],
      id:undefined
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

    if( this.$route.params.id){
      this.id = this.$route.params.id;
      this.getDetail(this.$route.params.id);
    }

  },
  methods: {
    init(){

    },

    getDetail(id){

      this.$root.$axios.get(Config.api.user.detail, {id:id}, response => {
        if (response === undefined) {
          return;
        }
        this.formValidate.nickname = response.data.nickName;
        this.formValidate.username = response.data.userName;
        this.formValidate.roleId = response.data.roleId;
        this.formValidate.password = response.data.password;
        this.formValidate.email = response.data.email;
        this.formValidate.mobile = response.data.mobile;
        this.formValidate.remark = response.data.remark;
      });

    },

    handleSubmit(name) {
      this.$refs[name].validate(valid => {
          if (valid) {
            let option = {
              userName: this.formValidate.username,
              nickName: this.formValidate.nickname,
              remark: this.formValidate.remark,
              roleId :this.formValidate.roleId,
              password:this.formValidate.password,
              email:this.formValidate.email,
              mobile:this.formValidate.mobile
            };

            if( this.id === undefined){
              this.$root.$axios.post(Config.api.user.create, option, response => {
                if (response === undefined) {
                  return;
                }
                this.$root.$Notice.open({title: '新增用户成功'});
                this.$store.dispatch('closePage');
              });
            } else {
              option.id = this.id;
              this.$root.$axios.post(Config.api.user.update, option, response => {
                if (response === undefined) {
                  return;
                }
                this.$root.$Notice.open({title: '保存用户成功'});
                this.$store.dispatch('closePage');
              });
            }

          } else {
            this.$Message.error("Fail!");
          }
      });
    },

    handleReset(name) {
      this.$refs[name].resetFields();
    }

  }
};
</script>
