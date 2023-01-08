<template>
  <div>
    <nav
      v-if="this.$route.path !== '/login' && this.$route.path !== '/register' && !this.$route.path.startsWith('/chat')"
      class="navbar navbar-default navbar-fixed-top" style='margin-bottom: 10px;background-color: white'>
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                  data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1" style='position: relative'>
          <ul class="nav navbar-nav">
            <li class="background-style" style='position: absolute;left: 100px' title="主页">
              <router-link to="/homepage"><span class="glyphicon glyphicon-home" style="font-size: 23px;"></span>
              </router-link>
            </li>
            <li class="background-style" style='position: absolute;left: 300px' title="周围">
              <router-link to="/around"><span class="glyphicon glyphicon-globe" style="font-size: 23px;"></span>
              </router-link>
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li v-if="status===true" v-cloak class="background-style" style='position: absolute;left: 500px' title="个人">
              <a :href='selfHomepageLocation' style='cursor: pointer'><img :src="image"
                                                                           style='position:relative;bottom: 4px'
                                                                           width="32px" height="32px" class="img-circle"
                                                                           alt="头像"/></a></li>
            <li v-else v-cloak class="background-style" style='position: absolute;left: 500px' title="个人">
              <router-link to="/login"><span class="glyphicon glyphicon-user" style="font-size: 23px;"></span>
              </router-link>
            </li>
            <li class="background-style searchLi" style='position: absolute;left: 620px;top: 10px' >
              <input @focus="search" @blur="closedResult" type="text" class="searchInput" placeholder="搜索发现" v-model="searchMessage" @keyup="search"></input>
              <button class="searchButton" @click="toSearch">
                <i class="el-icon-search"></i>
              </button>
            </li>
            <li v-if="status===true" class="background-style" style='position: absolute;left: 1150px' title="发博客">
              <router-link to="/createBlog"><span class="glyphicon glyphicon-edit" style="font-size: 23px;"></span>
              </router-link>
            </li>
            <li v-else class="background-style" title="发博客" style='position: absolute;left: 1150px'>
              <router-link to="/login"><span class="glyphicon glyphicon-edit" style="font-size: 23px;"></span>
              </router-link>
            </li>
            <el-badge v-if="status===true" :value="messageNumber" class="item" :max="99">
              <li class="background-style" title="聊天">
                <router-link to="/chat"><span class="el-icon-message" style="font-size: 30px;"></span></router-link>
              </li>
            </el-badge>
            <li v-else class="background-style" title="聊天" style='position: absolute;left: 950px;'>
              <router-link to="/login"><span class="el-icon-message" style="font-size: 30px;"></span></router-link>
            </li>
          </ul>
          <ul v-if="status===true" class="nav navbar-nav navbar-right" style="position: relative; left: 170px">
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                 aria-expanded="false"><span class="glyphicon glyphicon-cog" style="font-size: 23px;"></span></a>
              <ul class="dropdown-menu">
                <li><a href="#"></a></li>
                <li>
                  <router-link to="/personalInfo">账号设置</router-link>
                </li>
                <li>
                  <router-link to="/editPhoto">设置头像</router-link>
                </li>
                <li><a href="#">账号安全</a></li>
                <li><a @click='loginOut' style='cursor: pointer'>退出登录</a></li>
              </ul>
            </li>
          </ul>
          <div id="searchResult" style="position: absolute;left: 620px;z-index: 100;background-color: white;top: 55px;width: 280px;
    border-radius: 10px;box-shadow:10px 0 10px 0 lightgray;padding: 10px;display: none">
            <div  class="linkClass" v-for="result in searchResults" @mouseover="flag=1" @mouseout="flag=0">
              <a :href="result.id" style="text-decoration: none">
                <img width="50px" height="50px" class="img-circle" style="position: relative;" :src="result.avatar">
                <p style="color: black;width: 150px;position: relative;bottom: 45px;left: 54px;font-weight: bolder">{{result.nickname | showNickname}}</p>
                <p style="color: black;width: 150px;font-weight: lighter;font-size: 8px;bottom: 50px;left: 54px;position: relative">账号:{{result.account}}</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import da from "element-ui/src/locale/lang/da";

export default {
  name: 'App',
  components: {},
  filters: {
    showNickname: function (val) {
      if (val.length > 9){
        return val.substring(0, 9) + "..."
      }
      return val
    }
  },
  data: function () {
    return {
      status: false,
      image: '',
      selfHomepageLocation: '',
      messageNumber: null,
      searchMessage: "",
      searchResults: null,
      flag: 0,
      headers: {
        headers: {
          token: window.localStorage.getItem("token")
        },
      },
    }
  },
  methods: {
    //退出登录,将token删除即可
    loginOut: function () {
      window.localStorage.removeItem("token")
      location.reload()
    },
    search: function () {
      if (this.searchMessage.trim() !== ''){
        this.$http.get("http://localhost:8080/users/search/" + this.searchMessage.trim())
          .then(res => {
            this.searchResults = res.data.data
            if (this.searchResults.length !== 0){
              if (this.searchResults.length > 5){
                this.searchResults = this.searchResults.slice(0, 5)
              }
              document.getElementById("searchResult").style.display = "block"
            }else {
              document.getElementById("searchResult").style.display = "none"
            }
          })
      }
    },
    toSearch: function () {
      if (this.searchMessage.trim() !== '') {
        this.$router.push("/search/" + this.searchMessage.trim())
      }
    },
    closedResult: function () {
     if (this.flag === 0){
       document.getElementById("searchResult").style.display = "none"
     }

    }
  },
  created() {
    //当头部被创建的时候向后端发送请求得到头像地址
    this.$http.get("http://localhost:8080/users/avatars", this.headers)
      .then(res => {
        if (res.data.code === 20001) {
          this.image = "http://localhost:8080/static/upload/" + res.data.data.avatar
          this.status = true
          this.selfHomepageLocation = "http://localhost:8081/u/" + res.data.data.id + "/blog"
          this.selfId = res.data.data.id
          this.$store.commit("saveSelfId", res.data.data.id)
          this.$store.commit("saveFlag", 2)
          console.log("flags:::" + this.$store.state.flag)
          setInterval(() => {
            this.$http.get("http://localhost:8080/chatMessages/queryMessageNumber", this.headers)
              .then(res => {
                if (res.data.data != 0) {
                  this.messageNumber = res.data.data
                } else {
                  this.messageNumber = null
                }
              })
          }, 5000)
        }
      })
    //提交用户的上线信息
    console.log("flag:::" + this.$store.state.flag)
    const webSocket = new WebSocket("ws://localhost:8080/loginInfoWebSocket")
    if (window.localStorage.getItem("token") != null && window.localStorage.getItem("token").length >= 33) {
      webSocket.onopen = function () {
        const data = {"user_id": Number.parseInt(window.localStorage.getItem("token").substring(32, window.localStorage.getItem("token").length))}
        webSocket.send(JSON.stringify(data))
      }
    }
    webSocket.onmessage = res => {
      if (res.data != 0) {
        this.messageNumber = res.data
      }
      console.log("传过来的数据::::" + res.data)
    }
  },
}
</script>

<style scoped>
.linkClass{
  height: 60px;
  padding: 5px;
}

.linkClass:hover{
  background-color: #e5e7eb;
}

.searchInput {
  border: none;
  outline: none;
  height: 35px;
  border-radius: 8px 0 0 8px;
  background-color: #e5e7eb;
  padding-left: 10px;
  font-size: 12px;
}
.searchLi:hover .searchInput{
  border-bottom: 1px solid orange;
  border-left: 1px solid orange;
  border-top: 1px solid orange;
}
.searchLi:hover .searchButton{
  border-bottom: 1px solid orange;
  border-right: 1px solid orange;
  border-top: 1px solid orange;
}

.searchInput:focus{
  border-bottom: 1px solid orange;
  border-left: 1px solid orange;
  border-top: 1px solid orange;
  background-color: white;
}

.searchButton {
  position: relative;
  right: 4px;
  border: none;
  outline: none;
  background-color: #e5e7eb;
  height: 35px;
  border-radius: 0 8px 8px 0;
  font-size: 12px;
}

.searchResult:hover{
  display: block;
}

.searchButton:hover{
  background-color: white;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.item {
  margin-top: 10px;
  margin-right: 40px;
  position: absolute;
  left: 950px;
  top: 2px;
}

html {
}
</style>
