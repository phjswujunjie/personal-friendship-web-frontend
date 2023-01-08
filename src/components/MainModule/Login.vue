<template>
  <div id="login" @keydown="login">
    <h2 style="text-align: center;margin-bottom: 30px">登录</h2>
    <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
      <el-form-item label="账号">
        <el-input v-model="account" placeholder="请输入您的账号"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="password" placeholder="请输入您的密码"></el-input>
      </el-form-item>
    </el-form>
    <h2 style="text-align: right;color: gray;font-size: 10px">还没账号?<a style="cursor:pointer;"
                                                                      href="http://localhost:8081/register">立即注册!</a>
    </h2>
    <button id="submitLogin" @click="toLogin">登录</button>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      labelPosition: 'right',
      formLabelAlign: {},
      account: "",
      password: "",
    }
  },
  methods: {
    login: function (e) {
      if (e.keyCode === 13) {
          this.toLogin()
      }
    },
    toLogin: function () {
      //将账号和密码信息封装在URLSearchParams中带给后端做校验
      var data = new URLSearchParams()
      data.append("account", this.account)
      data.append("password", this.password)
      this.$http({
        method: 'post',
        url: 'http://localhost:8080/loginExamine',
        data: data,
      }).then(res => {
        //如果校验成功的话,则进行页面的跳转以及将token存放到localStorage中
        if (res.data.code === 30001) {
          window.localStorage.setItem("token", res.data.data.token)
          window.location.href = "http://localhost:8081/homepage"
        } else {
          //展示提示信息
          alert("账号或者密码错误")
        }
      })
    }
  }
}
</script>

<style scoped>
/*#main {*/
/*  background-image: url("../../../static/image/login.png");*/
/*  background-repeat: no-repeat;*/
/*  background-position: center;*/
/*  background-attachment: fixed;*/
/*  background-size: cover;*/
/*  -webkit-background-size: cover;*/
/*  -moz-background-size: cover;*/
/*  -o-background-size: cover;*/
/*}*/

#login {
  width: 500px;
  height: 360px;
  border: 1px gray solid;
  background-color: white;
  padding: 10px 40px 0 10px;
  margin: 20vh auto 0;
  border-radius: 12px;
  opacity: 0.9;
}

#submitLogin {
  width: 300px;
  height: 40px;
  margin-left: 100px;
  margin-top: 20px;
  background-color: dodgerblue;
  border: none;
  color: white;
  font-size: 15px;
}

#submitLogin:hover {
  background-color: #056de8;
}
</style>
