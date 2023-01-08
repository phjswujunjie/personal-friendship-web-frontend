<template>
  <div style="margin-top: 68px">
    <div style="margin: 0 auto;width: 1000px">
      <h2 style="text-align: center;color: gray">编辑头像</h2>
      <div
        style="background-color: white;border-radius: 10px;padding:20px;width: 600px;display: inline-block;position: relative;left: 200px">
        <div class="box" style="width: 500px;height: 300px">
          <img src="" id="photo" alt="图片">
        </div>
      </div>
      <div
        style="position: relative;display: inline-block;left: 200px;bottom: 170px;margin-left: 40px;background-color: white;height: 330px;border-radius: 10px;padding-top: 50px">
        <span style="display: inline-block;width: 100px;font-size: 20px;margin-bottom: 20px;color: gray">&nbsp;&nbsp;头像预览</span>
        <div class="small img-circle" style="width: 70px;height: 70px;overflow: hidden;margin: 0 auto;"></div>
      </div>
    </div>
    <div style="margin: 0 auto;width: 100px;position: relative;bottom: 70px">
      <form>
        <label for="file" style="position: relative;bottom: 80px;right: 230px">
          <h5 style="font-size: 12px;color: orange;cursor:pointer;">更换头像</h5>
        </label>
        <input type="file" @change="replaceImage" id="file" style="display: none"
               accept="image/gif,image/jpeg,image/jpg,image/png">
      </form>
      <h5 style="font-size: 12px;color: orange;cursor:pointer;position: relative;bottom: 115px;left: 200px"
          @click="rotate"><i class="el-icon-refresh-right">90度旋转</i></h5>
      <el-button :plain="true" id="saveButton" @click="uploadAvatar">保&nbsp;&nbsp;存</el-button>
    </div>
  </div>
</template>

<script>
import Cropper from "cropperjs"
import "cropperjs/dist/cropper.css"
export default {
  name: "EditPhoto",
  data() {
    return {
      status: '',
      cropper: null,
      headers: {
        headers: {
          token: window.localStorage.getItem("token")
        }
      }
    }
  },
  methods: {
    uploadAvatar: function () {
      var data = new FormData()
      data.append("avatar", this.cropper.getCroppedCanvas().toDataURL("image/png"))
      this.$http.put("http://localhost:8080/users/avatars", data, this.headers)
        .then(res => {
          if (res.data.code === 30000) {
            alert("您的账号在别处进行了登录!!")
            location.href = "http://localhost:8081/homepage"
          } else if (res.data.code === 22001) {
            this.$message({
              message: '修改成功!',
              type: 'success',
              duration: 700
            });
            setTimeout(function () {
              location.href = "http://localhost:8081/personalInfo"
            }, 700)
          }
        })
    },
    replaceImage: function (e) {
      this.cropper.replace(window.URL.createObjectURL(e.target.files[0]))
    },
    rotate: function () {
      this.cropper.rotate(90)
    }
  },
  created() {
    this.$http.get("http://localhost:8080/users/avatars", this.headers)
      .then(res => {
        console.log(res.data)
        if (res.data.code === 20001) {
          // document.getElementById("photo").crossOrigin = 'anonymous';
          document.getElementById("photo").src = "http://localhost:8080/static/upload/" + res.data.data.avatar
          this.cropper = new Cropper(document.getElementById("photo"), {
            aspectRatio: 1,
            viewMode: 1,
            preview: ".small",
            dragMode: "move",
            background: false,
            modal: false,
            movable: false,
            checkCrossOrigin: false
          })
          console.log(this.cropper)
          this.status = true
        }else {
          location.href = "http://localhost:8081/homepage"
        }
      })
  }
}
</script>

<style scoped>
#saveButton {
  width: 80px;
  border-radius: 17px;
  background-color: #FF8200;
  color: white;
  border: none;
  height: 34px;
  position: relative;
  bottom: 100px;
}

#saveButton:hover {
  background-color: #f36126;
}

[v-cloak] {
  display: none;
}
</style>
