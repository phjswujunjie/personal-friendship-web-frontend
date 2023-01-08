<template>
  <div id="main" v-cloak>
    <!--   如果status为false(没有登录)则展示登录的界面   -->
    <div class="container" v-if="status===false" >
      <div class="jumbotron" style="opacity: 0.7;padding-bottom: 10px">
        <h2>我们发现您还没有登录,快来登陆创建您的博客吧!</h2>
        <el-button type="primary" round @click="login">立&nbsp;&nbsp;马&nbsp;&nbsp;登&nbsp;&nbsp;录</el-button>
        <p>还没有账号?<a href="http://localhost:8081/register" style="cursor: pointer;margin-top: 10px;display: inline-block">立即注册!</a></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Homepage",
  methods: {
    login: function () {
      window.location.href = "http://localhost:8081/login"
    }
  },
  data() {
    return {
      //是否登录
      status: true,
      headers: {
        headers: {
          token: window.localStorage.getItem("token")
        }
      }
    }
  },
  created(){
    //在Vue实例创建的时候发送异步请求将token作为请求头带去后端看用户是否登录
    this.$http.get("http://localhost:8080/loginOrOut", this.headers)
      .then(res => {
        // 如果没有登录,则将登陆状态status设置为false
        if (res.data.code !== 30001){
          this.status = false
        }
      })
  },
}
</script>

<style scoped>
  [v-cloak]{
    display: none;
  }
</style>
