<template>
  <div style="margin-left: 10px" class="main">
    <div id="background">
    <h5 style="position: absolute;left: 300px;top: 300px;color: #939393">您还未选中或发起聊天，快去跟好友聊一聊吧</h5>
  </div>
  </div>
</template>

<script>
export default {
  name: "NoSelect",
}
</script>

<style scoped>
#background {
  position: relative;
  height: 100vh;
  width: 882px;
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
}
</style>
