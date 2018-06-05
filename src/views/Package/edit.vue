<template>
  <Card>
    <p slot="title">新增客户白名单</p>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="名称" prop="name">
        <Input v-model="formValidate.name" placeholder="输入白名单客户名称"></Input>
      </FormItem>
      <FormItem label="手机号码" prop="mobile">
        <Input v-model="formValidate.mobile" placeholder="输入白名单客户手机号码"></Input>
      </FormItem>

      <FormItem label="折扣率" prop="discount">
        <Slider v-model="formValidate.discount"  show-input></Slider>
      </FormItem>

      <FormItem v-for="(item, index) in formValidate.items" :key="index" :label="item.text">
        <Row>
          <Col span="11">
          <!-- :prop="'items[' + index + '].value1'" :rules="{required: true, message: '必须输入套餐订金金额', trigger: 'blur'}" -->
            <FormItem label="定金金额">
              <Input type="text" v-model="item.value1" placeholder="输入套餐需支付订金的金额"></Input>
            </FormItem>
          </Col>
          <Col span="11" offset="2">
           <!-- :prop="'items[' + index + '].value2'" :rules="{required: true, message: '必须输入套餐尾款金额', trigger: 'blur'}" -->
            <FormItem label="尾款金额">
              <Input type="text" v-model="item.value2" placeholder="输入套餐需支付尾款的金额"></Input>
            </FormItem>
          </Col>
        </Row>
      </FormItem>

      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
  </Card>
</template>
<script>
import Config from '@/config/config'
export default {
  data() {
    return {
      index:1,
      formValidate: {
        name: "",
        mobile: "",
        items:[],
        discount:100
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "请输入白名单客户姓名",
            trigger: "blur"
          }
        ],
        mobile: [
          {required: true,message: "请输入白名单客户手机号码",trigger: "blur"},
          {pattern: /^1[34578]\d{9}$/, message: '手机号码格式不正确'}
          // { type: "", message: "Incorrect email format", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleSubmit(name) {
      // console.log(this.formValidate);
      this.$refs[name].validate(valid => {

        if(valid){
          let data = {
            name:this.formValidate.name,
            mobile:this.formValidate.mobile,
            discount:this.formValidate.discount
          }
          let attrText = undefined;
          this.formValidate.items.forEach( item=>{
            if(attrText){
              attrText += '|';
            }else{
              attrText = '';
            }
            if( item.value1 != '' && item.value2 != ''){
              attrText += `${item.id},${item.value1},${item.value2}`;
            }
          });
          data.attrText = attrText;
          this.$root.$axios.post(Config.api.whitelist.create, data, response => {
            if (response === undefined) {
              return;
            }
            this.$root.$Notice.open({title: '操作成功'});
          this.$store.dispatch('closePage', 'package-edit');
          });
        }
        if (valid) {
          this.$Message.success("Success!");
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