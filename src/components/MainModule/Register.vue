<template>
  <div id="register">
    <h2 style="text-align: center;margin-bottom: 30px">注册</h2>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="账号" prop="account">
        <el-input v-model.number="ruleForm.account" placeholder="请输入由10位数字组成的账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"
                  placeholder="请输入8-15位由数字,字母,常用字符组成的密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="testCode">
        <el-input type="text" autocomplete="off" placeholder="请输入下图中的验证码" v-model="testCode"></el-input>
      </el-form-item>
    </el-form>
    <div id="verify-img"
         style="width: 200px; height: 50px;margin-left: 160px;display: inline-block"></div>
    <i style="font-size: 5px;color: darkgray;position: relative;bottom: 18px">看不清?点击图片试试</i>
    <h2 style="text-align: right;color: gray;font-size: 10px">已有账号?<a style="cursor:pointer;" href="http://localhost:8080/login">立即登录!</a></h2>
    <button id="submitRegister" @click="submitForm('ruleForm')">注册</button>
  </div>
</template>

<script>
import {GVerify} from "../../../static/js/Verify";

export default {
  name: "Register",
  mounted() {
    this.verifyCode = new GVerify({
      id: "verify-img",    //容器的ID
      type: "blend"    //图形验证码的类型：blend-数字字母混合类型(默认)、number-纯数字、letter-纯字母
    })
  },
  data() {
    var checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号不能为空'));
      }
      const regex = /^[1-9]\d{9}$/
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (!regex.test(value.toString())) {
            callback(new Error('账号长度必须为10的数字位且不能以0开头'));
          } else {
            var data = new URLSearchParams();
            data.append("account", this.ruleForm.account)
            this.$http.post("http://localhost:8080/accountIsExists", data)
              .then(res => {
                if (res.data.code === 40000) {
                  callback(new Error("账号已经存在,请重新输入"));
                } else {
                  callback();
                }
              })
          }
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      const regex = /^[a-zA-Z\d^*!_]{8,15}$/
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!regex.test(value)) {
        callback(new Error('密码必须以8-15位由字母,数字,常用字符组成'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var validateTestCode = (rule, value, callback) => {
      if (!this.verifyCode.validate(this.testCode)) {
        callback(new Error('验证码错误'));
      } else {
        callback()
      }
    };
    return {
      //存储用户输入的验证码
      testCode: '',
      verifyCode: null,
      ruleForm: {
        account: '',
        pass: '',
        checkPass: '',
      },
      rules: {
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ],
        account: [
          {validator: checkAccount, trigger: 'blur'}
        ],
        testCode: [
          {validator: validateTestCode, trigger: 'blur'}
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = new URLSearchParams();
          data.append("account", this.ruleForm.account)
          data.append("password", this.ruleForm.pass)
          this.$http.post("http://localhost:8080/registerUser", data)
            .then(res => {
              if (res.data.code === 23001) {
                window.localStorage.setItem("token", res.data.data.token)
                window.location.href = "http://localhost:8081/homepage"
              } else {
                alert("请输入正确的数据格式")
                this.verifyCode.refresh()
                return false;
              }
            })
        } else {
          alert("请正确的填写数据的格式")
          this.verifyCode.refresh()
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>
  #register {
    width: 600px;
    border: 1px gray solid;
    background-color: white;
    padding: 10px 40px 0 10px;
    margin: 10vh auto 0;
    border-radius: 12px;
    opacity: 0.9;
  }

  #submitRegister {
    width: 400px;
    height: 40px;
    margin: 20px 0 50px 100px;
    background-color: dodgerblue;
    border: none;
    color: white;
    font-size: 15px;
  }

  #submitRegister:hover {
    background-color: #056de8;
  }
</style>
