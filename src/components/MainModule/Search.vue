<template>
  <div style="width: 1050px;margin: 68px auto 0;">
    <h4 style="color: #999">找到 <span class="resultSpan"> "{{ $route.params.condition }}"</span> 相关内容共 <span
      class="resultSpan">{{ resultNumber | showResultNumber }}</span> 个</h4>
    <hr>
    <h3>相关用户</h3>
    <div v-for="result in searchResults">
      <a :href="result.id" class="userInfoResultA">
        <img class="img-circle userAvatar"
             :src="result.avatar">
        <p class="nickname">{{ result.nickname | showNickname}}</p>
        <p class="account">账号:{{ result.account }}</p>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Search",
  filters: {
    showResultNumber: function (val) {
      if (val > 99) {
        return "99+"
      }
      return val
    },
    showNickname: function (val) {
      if (val.length > 6){
        return val.substring(0, 6) + "..."
      }
      return val
    }
  },
  data: function () {
    return {
      searchResults: null,
      resultNumber: 5,
    }
  },
  created() {
    this.$http.get("http://localhost:8080/users/search/" + this.$route.params.condition)
      .then(res => {
        this.searchResults = res.data.data
        this.resultNumber = this.searchResults.length
      })
  },
  methods: {
  }
}
</script>

<style scoped>
.resultSpan {
  color: red;
  font-weight: bolder
}

.userInfoResultA {
  background-color: white;
  width: 161px;
  height: 168px;
  border-radius: 10px;
  position: relative;
  float: left;
  margin-right: 47px;
  margin-bottom: 26px;
  text-decoration: none;
}

.userInfoResultA:hover {
  border: 1px solid orange;
  box-shadow: 5px 0 5px 0 lightgray;
}

.userAvatar {
  width: 86px;
  height: 86px;
  position: absolute;
  top: 15px;
  left: 37px;
}

.nickname {
  font-weight: bold;
  position: absolute;
  top: 105px;
  left: 35px;
  color: black;
}

.account {
  font-size: 12px;
  color: #999;
  position: absolute;
  top: 125px;
  left: 35px;
}
</style>
