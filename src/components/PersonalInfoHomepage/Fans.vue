<template>
  <div style="margin-left: 10px" class="main">
    <div id="background">
      <h4 style="margin-left: 20px">全部粉丝({{fansNumber}})</h4>
      <hr style="margin: 10px"/>
      <div :flag="friend.homepageLocation" @click="toHomepage"  class="followList" style="cursor:pointer;width: 100%;height: 92px;position: relative" v-for="friend in fansList[1]">
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
      <div :flag="fans.homepageLocation" @click="toHomepage"  class="followList" style="cursor:pointer;width: 100%;height: 92px;position: relative" v-for="fans in fansList[0]">
        <img :flag="fans.homepageLocation" :src="fans.avatar" width="50px" height="50px" class="img-circle" style="position: absolute;
          top: 21px;left: 20px">
        <span :flag="fans.homepageLocation" style="position: absolute;left: 80px;top: 22px;font-weight: bolder">{{fans.nickname}}</span>
        <span :flag="fans.homepageLocation" style="position: absolute;left: 80px;top: 40px;font-size: 12px;color: #939393">{{fans.introduction === ''? '暂无简介' : fans.introduction}}</span>
        <button title="关注" @click="addFollow" class="followButton" :flag="fans.id">
          <i :flag="fans.id" class="el-icon-plus" style="font-weight: bolder"></i>&nbsp;回关
        </button>
        <button @click="deleteFollow"  style="display: none" class="attention"  :id="fans.id">
          &nbsp;互相关注
        </button>
      </div>
      <div v-if="initialNumber === 0" style="background-color: white;width: 642px;height: 300px;border-radius: 5px">
        <div style="position: relative;left: 290px;top: 140px">
          <i class="el-icon-warning" style="font-size: 50px;color: #507daf"></i>
          <p style="position: relative;right: 20px;font-weight: bolder">还没有任何粉丝</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Fans",
  data: function () {
    return {
      fansList:[],
      fansNumber:null,
      initialNumber:null,
      headers: {
        headers: {
          token: window.localStorage.getItem("token")
        }
      }
    }
  },
  created() {
    this.$http.get("http://localhost:8080/friends/fans", this.headers).then(res => {
      this.fansList = res.data.data
      this.fansNumber = res.data.data[0].length +  res.data.data[1].length
      this.initialNumber = res.data.data[0].length +  res.data.data[1].length
      console.log(res.data)
    })
    this.$store.commit("changeIsSelf", true)
    this.$store.commit("saveId", this.$route.params.id)
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
      this.$http.delete("http://localhost:8080/friends/" + e.target.id, this.headers).then(res => {
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
}
</script>

<style scoped>
#background {
  position: relative;
  height: 413px;
  width: 642px;
  background-color: white;
  border-radius: 10px;
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
