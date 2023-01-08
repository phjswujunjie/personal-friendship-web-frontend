<template>
  <div style="margin-left: 10px;" class="main">
    <div id="background">
      <div style="overflow: hidden;height: 256px">
        <a href="../../../static/image/img_1.png" target="_blank"><img src="../../../static/image/img_1.png" alt=""
                                                                       width="642px"
                                                                       height="350px" style="border-radius: 10px"></a>
        <a style="cursor: pointer;text-decoration: none" href="http://localhost:8081/homepage">
          <i class="el-icon-arrow-left" style="color: white;font-size: 50px;position: relative;bottom: 330px;left: 10px"></i>
          <span style="color: white;font-size: 30px;position: relative;bottom: 340px;">返回</span>
        </a>
      </div>
      <img :src="avatar" width="100px" class="img-circle" id="photo">
      <span v-if="info"
            style="position: absolute;left: 175px;font-weight: bolder;top: 265px;">{{ info.nickname }}</span>
      <span v-if="info && info.gender==='女'"
            style="position: absolute;left: 150px;font-weight: bolder;top: 265px;width: 20px;height: 20px;text-align:center;background-color: deeppink;border-radius: 10px;color: white"><i
        class="el-icon-female"></i> </span>
      <span v-else
            style="position: absolute;left: 150px;font-weight: bolder;top: 265px;width: 20px;height: 20px;text-align:center;background-color: deepskyblue;border-radius: 10px;color: white"><i
        class="el-icon-male"></i> </span>
      <span v-if="info" style="position: absolute;left: 150px;top: 310px;color: gray">账号 <span
        style="color:black ">{{ info.account }}</span></span>
      <span v-if="info" style="position: absolute;left: 150px;top: 290px;color: gray">粉丝 <span
        style="color:black ">{{ info.fansNumber }}</span></span>
      <span v-if="info" style="position: absolute;left: 210px;top: 290px;color: gray">关注 <span
        style="color:black ">{{ info.followNumber }}</span></span>
      <button title="关注"  v-if="info && !info.isSelf && relation===30000" @click="tipLogin" class="followButton" >
        <i  class="el-icon-plus" style="font-weight: bolder"></i>&nbsp;关注
      </button>
      <button title="关注" v-if="info && !info.isSelf && relation===50000" @click="addFollow" class="followButton" :flag="info.id">
        <i :flag="info.id" class="el-icon-plus" style="font-weight: bolder"></i>&nbsp;关注
      </button>
      <button title="回关" v-if="info && !info.isSelf && relation===50001" @click="addFollow" class="followButton" :flag="info.id">
        <i :flag="info.id" class="el-icon-plus" style="font-weight: bolder"></i>&nbsp;回关&nbsp;
      </button>
      <button @click="deleteFollow" v-if="info && relation===50002" class="attention"  :id="info.id">
        &nbsp;已关注
      </button>
      <button @click="deleteFollow" v-if="info && relation===50003" class="attention"  :id="info.id">
        &nbsp;互相关注
      </button>
      <span v-if="info" style="position: absolute;left: 50px;top: 340px;color: gray;font-size: 8px"><i
        class="el-icon-document"></i>&nbsp;&nbsp;{{ info.introduction === '' ? '暂无简介' : info.introduction }}</span>
      <span style="position: absolute;left: 550px;top: 335px;color: gray;font-size: 14px"><i id="icon"
                                                                                             class="el-icon-arrow-down"
                                                                                             @click="displayInfo"
                                                                                             style="background-color: lightgray;cursor:pointer;color: white;border-radius: 7px;"></i></span>
      <div v-if="info" id="displayInfoDiv" style="display: none">
        <span style="position: absolute;left: 50px;top: 370px;color: gray;font-size: 8px"><i class="el-icon-date"></i>&nbsp;&nbsp;2003-07-14</span>
        <span style="position: absolute;left: 180px;top: 370px;color: gray;font-size: 8px"><i
          class="el-icon-location-information"></i>&nbsp;&nbsp;{{ info.address }}</span>
        <span style="position: absolute;left: 50px;top: 400px;color: gray;font-size: 8px"><i class="el-icon-date"></i>&nbsp;&nbsp;{{ info.register_time }}加入博客网站</span>
      </div>
      <div id="smallNav">
        <hr style="margin: 12px auto">
        <span style="margin-left: 100px;font-size: 16px"><a @click="toSelected" class="linkClass">精选</a></span>
        <span style="margin-left: 150px;font-size: 16px"><a @click="toBlog" class="linkClass">博客</a></span>
        <span style="margin-left: 150px;font-size: 16px"><a @click="toAlbum" class="linkClass">相册</a></span>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Homepage",
  data: function () {
    return {
      flag: 1,
      info: null,
      avatar: '',
      relation: null,
      headers: {
        headers: {
          token: window.localStorage.getItem("token")
        }
      }
    }
  },
  methods: {
    tipLogin: function () {
      this.$message({
        duration: "1000",
        message: '请先进行登录',
        type: 'error'
      });
    },
    displayInfo: function () {
      this.flag *= -1
      if (this.flag === -1) {
        document.getElementById("background").style.height = "473px"
        document.getElementById("smallNav").style.marginTop = "70px"
        document.getElementById("icon").className = "el-icon-arrow-up"
        document.getElementById("displayInfoDiv").style.display = "block";
      } else {
        document.getElementById("background").style.height = "423px"
        document.getElementById("smallNav").style.marginTop = "0"
        document.getElementById("icon").className = "el-icon-arrow-down"
        document.getElementById("displayInfoDiv").style.display = "none";
      }
    },
    addFollow: function (e) {
      this.$http.post("http://localhost:8080/friends/" + e.target.getAttribute("flag"),{}, this.headers)
        .then(res => {
        console.log(e.target.innerText.length)
        if (res.data.code === 23001) {
          if(e.target.innerText.length===4){
            this.relation = 50003
          }else {
            this.relation = 50002
          }
        }
      })
    },
    deleteFollow: function (e) {
      this.$http.delete("http://localhost:8080/friends/" + e.target.id, this.headers).then(res => {
        if (res.data.code === 21001) {
          if(e.target.innerText.length === 5){
            this.relation = 50001
          }else {
            this.relation = 50000
          }
        }
      })
    },
    toSelected: function () {
      this.$router.push({path: "/u/" + this.$route.params["id"] + "/selected"})
    },
    toBlog: function () {
      this.$router.push({path: "/u/" + this.$route.params["id"] + "/blog"})
    },
    toAlbum: function () {
      this.$router.push({path: "/u/" + this.$route.params["id"] + "/album"})
    },
  },
  created() {
    this.$store.commit("saveId", this.$route.params["id"])
    this.$http.get("http://localhost:8080/users/" + this.$route.params["id"], this.headers).then(res => {
      if (res.data.code === 20000) {
        location.href = "http://localhost:8080/homepage"
      }
      this.info = res.data.data
      console.log(res.data.data)
      this.avatar = "http://localhost:8080/static/upload/" + this.info.avatar
      this.$store.commit("changeIsSelf", this.info.isSelf)
      if (!this.info.isSelf){
        this.$http.get("http://localhost:8080/friends/" + this.$route.params["id"],this.headers)
          .then(res => {
          console.log(res.data)
          this.relation = res.data.code
          console.log(this.relation)
        })
      }
    })
  },
}
</script>

<style scoped>
.followButton:hover {
  background-color: #f36126;
}

.followButton {
  position: absolute;
  left: 420px;
  top: 270px;
  width: 80px;
  border: none;
  background-color: #ff8200;
  color: white;
  font-weight: bolder;
  height: 30px;
  border-radius: 15px
}

.attention {
  position: absolute;
  left: 420px;
  top: 270px;
  width: 80px;
  border: none;
  background-color: lightgray;
  color: white;
  font-weight: bolder;
  height: 30px;
  border-radius: 15px
}

#background {
  position: relative;
  height: 413px;
  width: 642px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
}

#photo {
  position: relative;
  bottom: 38px;
  left: 40px;
  border: 2px white solid;
}

.linkClass {
  text-decoration: none;
  color: black;
  cursor: pointer;
}

.linkClass:hover {
  color: orange;
}

</style>
