<template>
    <div class="container" style="margin-top: 68px">
      <article class="w1">
        <section class="center">
          <div class="main">
            <router-view></router-view>
          </div>
        </section>
        <aside v-if="$store.state.isSelf" class="left">
          <h3 style="text-align: center;margin: 10px 0 10px">个人主页</h3>
          <a @click="toBlog" class="linkClass"><i class="el-icon-user"
                                                  style="margin-right: 15px;font-size: 20px"/>我的主页</a>
          <a @click="toFriend" class="linkClass"><i class="el-icon-user"
                                                  style="margin-right: 15px;font-size: 20px"/>我的朋友</a>
          <a @click="toFollow" class="linkClass"><i class="el-icon-user" style="margin-right: 15px;font-size: 20px"/>我的关注</a>
          <a @click="toFans" class="linkClass"><i class="el-icon-user"
                                                  style="margin-right: 15px;font-size: 20px"/>我的粉丝</a>
        </aside>
      </article>
    </div>
</template>

<script>
export default {
  name: "PersonalHomepage",
  methods: {
    toBlog: function () {
      this.$router.push({path: "/u/" + this.$store.state.id + "/blog"})
    },
    toFollow: function () {
      this.$router.push({path: "/u/" + this.$store.state.id + "/follow"})
    },
    toFans: function () {
      this.$router.push({path: "/u/" +  this.$store.state.id + "/fans"})
    },
    toFriend: function () {
      this.$router.push({path: "/u/" + this.$store.state.id + "/friend"})
    }
  },
}
</script>

<style scoped>
.linkClass:hover {
  background-color: #F5F5F5;
}

.linkClass {
  text-decoration: none;
  display: block;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 30px;
  color: black;
  cursor: pointer;
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
  margin: 0 200px;
}

.left {
  width: 190px;
  height: 500px;
  float: left;
  margin-left: -100%;
  background-color: white;
  padding: 5px;
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
