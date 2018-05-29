<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>

                        <FormItem prop="captcha">
                            <Row>
                                <Col span="16">
                                    <Input v-model="form.captcha" placeholder="请输入验证码">
                                        <span slot="prepend">
                                            <Icon :size="14" type="locked"></Icon>
                                        </span>
                                    </Input>
                                </Col>
                                <Col span="8">
                                    <img style="width:100%" :src="form.captchaurl" @click="refreshCaptcha"></img>
                                </Col>
                            </Row>
                        </FormItem>

                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Util from '../../modules/Util/index';
export default {
    data () {
        return {
            form: {
                userName: 'admin',
                password: 'admin',
                captcha:'',
                captchaurl:'',
                scope:0
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                captcha: [
                    { required: true, message: '验证码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            let self = this;
            this.$refs.loginForm.validate((valid) => {
                if( !valid){ return;}
                let option = {
                    username:self.form.userName,
                    password:Util.md5(self.form.password),
                    captcha:self.form.captcha,
                    captcha_scope:self.form.scope
                };
                self.$root.$axios.post('api/user/login', option, function revole (response) {
                    if (response === undefined) { return; }
                    let data = response.data;
                    self.$store.commit('setSecurity', data);
                    //  self.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                    self.$router.push({name: 'home_index'});
                });
            });
        },

        refreshCaptcha (){
            this.form.scope = Date.parse(new Date());
            this.form.captchaurl = 'http://localhost:8080/captcha?scope='+this.form.scope+'&'+Date.parse(new Date());
        }
    },
    mounted () {
        this.refreshCaptcha();
    },
};
</script>

<style>

</style>
