<template>
  <div class="container">
    <article class="w1">
      <section class="center">
        <div class="main">
          <router-view :key="$route.fullPath"></router-view>
        </div>
      </section>
      <aside class="left">
        <h3 style="text-align: center;margin: 10px 0 10px">
          <i title="主页" @click="toHomepage" class="el-icon-arrow-left" style="position: relative;font-size: 40px;top: 7px;right: 50px;cursor: pointer">
          </i>我的好友
        </h3>
        <hr style="margin-bottom: 0;color: lightgray">
        <router-link v-for="friend in friendList" :key="friend.id" :to="friend.homepageLocation" class="linkClass">
          <img width="50px" height="50px" class="img-circle" style="position: relative;top: 15px" :src="friend.avatar"/>
          <sup v-if="messageNumber && Number(messageNumber[friend.id]) > 0" style="color: white;background-color: red;position: relative;right: 20px;bottom: 9px;padding: 2px 5px;border-radius: 10px">
            {{ Number(messageNumber[friend.id]) | showMessageNumber }}
          </sup>
          <p style="position: relative;bottom: 32px;left: 60px;color: black;width: 190px">{{ friend.nickname }}</p>
          <p v-if="friendStatus && friendStatus[friend.id]" style="color: green;position: relative;bottom: 38px;left: 60px;width: 50px;font-size: 8px">
            [<i class="el-icon-circle-check"></i>在线]
          </p>
          <p v-else-if="friendStatus" style="color: indianred;position: relative;bottom: 38px;left: 60px;width: 50px;font-size: 8px">
            [<i class="el-icon-circle-close"></i>离线]
          </p>
          <p v-if="messageNumber && Number(messageNumber[friend.id]) > 0" class="unreadMessage" style="position: relative;left: 105px;width: 160px;color: gray;bottom: 65px;font-size: 12px">{{messageList[friend.id].content | showMessage}}</p>
        </router-link>
      </aside>
    </article>
  </div>
</template>

<script>
export default {
  name: "Chat",
  data: function () {
    return {
      headers: {
        headers: {
          token: window.localStorage.getItem("token")
        }
      },
      friendList: null,
      friendId: [],
      friendStatus: null,
      messageNumber: null,
      messageList: null,
    }
  },
  filters:{
    showMessageNumber: function (val){
      if (val > 99){
        return "99+"
      }
      return val
    },
    showMessage: function (val) {
      if (val.replaceAll("<br/>", " ").length > 12){
        return val.replaceAll("<br/>", " ").substring(0, 12) + "..."
      }
      return val.replaceAll("<br/>", " ")
    }
  },
  methods:{
    toHomepage: function () {
      location.href = "http://localhost:8081/homepage"
    }
  },
  created() {
    this.$http.get("http://localhost:8080/friends", this.headers).then(res => {
      this.friendList = res.data.data
      for (const data of this.friendList) {
        this.friendId.push(data.id)
        data.homepageLocation = "/chat/userChat/" + data.id
      }
      const data = new URLSearchParams()
      data.append("idList", this.friendId)
      if (this.friendId.length !== 0) {
        this.$http.post("http://localhost:8080/friends/queryStatus", data, this.headers).then(res => {
          this.friendStatus = res.data.data[0]
          console.log(res.data)
          this.messageNumber = res.data.data[1]
          this.messageList = res.data.data[2]
        })
       setInterval(() => {
         this.$http.post("http://localhost:8080/friends/queryStatus", data,  this.headers).then(res => {
           this.friendStatus = res.data.data[0]
           this.messageNumber = res.data.data[1]
           this.messageList = res.data.data[2]
         })
       }, 2000)
      }
    })
  },
}
</script>

<style scoped>
.router-link-active sup{
  display: none;
}
.router-link-active .unreadMessage{
  display: none;
}

.linkClass:hover {
  opacity: 0.5;
}

.el-icon-arrow-left:hover{
  opacity: 0.5;
}

.linkClass {
  text-decoration: none;
  display: block;
  padding-left: 20px;
  color: white;
  cursor: pointer;
  border-bottom: 1px lightgray solid;
  height: 80px;
}

.w1 {
  min-width: 700px;
  overflow: hidden;
}

.center {
  width: 100%;
  float: left;
}

.main {
  margin: 0 0 0 290px;
}

.left {
  width: 290px;
  height: 100vh;
  float: left;
  margin-left: -100%;
  overflow: auto;
  overflow-x: unset;
  border: 1px solid lightgray;
  background-color: white;
}

.left::-webkit-scrollbar {
  display: block;
  width: 6px;
  background-color: whitesmoke;
  border-radius: 10px;
}

.left::-webkit-scrollbar-thumb {
  background-color: rgba(25, 132, 165, 0.7);
  border-radius: 10px;
}

/*.right{*/
/*  float: left;*/
/*  width: 190px;*/
/*  height: 500px;*/
/*  background-color: red;*/
/*  margin-left: -270px;*/
/*}*/
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.background-style {
  border-radius: 7px
}

.background-style:hover {
  background-color: lightgray;
  opacity: 0.4;
}
</style>
