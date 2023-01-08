<template>
  <div style="margin-left: 10px" class="main">
    <div id="background">
      <h4 style="margin-left: 20px">全部关注({{followNumber}})</h4>
      <hr style="margin: 10px"/>
      <div :flag="follow.homepageLocation" @click="toHomepage"  class="followList" style="cursor:pointer;width: 100%;height: 92px;position: relative" v-for="follow in followList[0]">
       <img :flag="follow.homepageLocation" :src="follow.avatar" width="50px" height="50px" class="img-circle" style="position: absolute;
          top: 21px;left: 20px">
        <span :flag="follow.homepageLocation" style="position: absolute;left: 80px;top: 22px;font-weight: bolder">{{follow.nickname}}</span>
        <span :flag="follow.homepageLocation" style="position: absolute;left: 80px;top: 40px;font-size: 12px;color: #939393">{{follow.introduction === ''? '暂无简介' : follow.introduction}}</span>
        <button title="关注" style="display: none" @click="addFollow" class="followButton" :flag="follow.id">
          <i :flag="follow.id" class="el-icon-plus" style="font-weight: bolder"></i>&nbsp;关注
        </button>
        <button @click="deleteFollow" class="attention"  :id="follow.id">
          &nbsp;已关注
        </button>
      </div>
      <div :flag="friend.homepageLocation" @click="toHomepage"  class="followList" style="cursor:pointer;width: 100%;height: 92px;position: relative" v-for="friend in followList[1]">
        <img :flag="friend.homepageLocation" :src="friend.avatar" width="50px" height="50px" class="img-circle" style="position: absolute;
          top: 21px;left: 20px">
        <span :flag="friend.homepageLocation" style="position: absolute;left: 80px;top: 22px;font-weight: bolder">{{friend.nickname}}</span>
        <span :flag="friend.homepageLocation" style="position: absolute;left: 80px;top: 40px;font-size: 12px;color: #939393">{{friend.introduction === ''? '暂无简介' : friend.introduction}}</span>
        <button title="关注" style="display: none" @click="addFollow" class="followButton" :flag="friend.id">
          <i :flag="friend.id" class="el-icon-plus" style="font-weight: bolder"></i>&nbsp;回关
        </button>
        <button @click="deleteFollow" class="attention"  :id="friend.id">
          &nbsp;互相关注
        </button>
      </div>
      <div v-if="initialNumber === 0" style="background-color: white;width: 642px;height: 300px;border-radius: 5px">
        <div style="position: relative;left: 290px;top: 140px">
          <i class="el-icon-warning" style="font-size: 50px;color: #507daf"></i>
          <p style="position: relative;right: 110px;font-weight: bolder">还没有关注任何人,快去关注你感兴趣的人吧!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Follow",
  data: function () {
    return {
      followList:[],
      followNumber:null,
      initialNumber:null,
      headers: {
        headers: {
          token: window.localStorage.getItem("token")
        }
      }
    }
  },
  methods:{
    addFollow: function (e) {
      e.stopPropagation()
      this.$http.post("http://localhost:8080/friends/" + e.target.getAttribute("flag"),{}, this.headers).then(res => {
        if (res.data.code === 23001) {
          this.followNumber++
          e.target.nextElementSibling.style.display = "block"
          e.target.style.display = "none"
        }
      })
    },
    deleteFollow: function (e) {
      e.stopPropagation()
      this.$http.delete("http://localhost:8080/friends/" + e.target.id, this.headers)
        .then(res => {
        if (res.data.code === 21001) {
          this.followNumber--
          e.target.previousElementSibling.style.display = "block"
          e.target.style.display = "none"
        }
      })
    },
    toHomepage: function (e) {
      location.href = e.target.getAttribute("flag")
    }
  },
  created() {
    this.$http.get("http://localhost:8080/friends/follow", this.headers).then(res => {
      this.followList = res.data.data
      this.followNumber = res.data.data[0].length +  res.data.data[1].length
      this.initialNumber = res.data.data[0].length +  res.data.data[1].length
      console.log(res.data)
    })
    this.$store.commit("changeIsSelf", true)
    this.$store.commit("saveId", this.$route.params.id)
  }
}
</script>

<style scoped>

#background {
  position: relative;
  height: 413px;
  width: 642px;
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
}

.followList:hover{
  background-color: #F5F5F5;
}

.followButton:hover {
  background-color: #f36126;
}

.followButton {
  position: absolute;
  right: 40px;
  top: 30px;
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
  right: 40px;
  top: 30px;
  width: 80px;
  border: 1px solid black;
  background-color: white;
  color: black;
  font-weight: bolder;
  height: 30px;
  border-radius: 15px
}

.attention:hover{
  background-color: lightgray;
}
</style>
