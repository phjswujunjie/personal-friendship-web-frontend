<template>
  <div id="uploadFile" style="margin-top: 68px">
    <input type="file" @change="fileUpload" id="fileUpload" multiple style="display: none" accept=".gif,.png,.jpg,.jpeg,.mp4">
    <div style="text-align: center;"><h3>发布博客</h3></div>
    <div id="img">
      <textarea id="text" placeholder="快来分享新鲜事吧!" v-model="text"></textarea>
      <label for="fileUpload" id="label">
        <i id="icon" class="el-icon-plus"></i><br>
        <span class="iconSpan">添加图片或视频(最多9个)</span><br>
        <span class="iconSpan">(jpg,jpeg,png,gif,mp4等常见文件格式)</span>
      </label>
    </div>
    <div style="margin: 50px auto 0;width: 400px;">
      <el-radio v-model="is_public" label="1" style="display: inline-block">仅自己可见</el-radio>
      <el-radio v-model="is_public" label="2" style="display: inline-block">仅朋友可见</el-radio>
      <el-radio v-model="is_public" label="4" style="display: inline-block">全部可见</el-radio>
    </div>
    <div style="margin: 20px auto 0;width: 120px">
      <button id="submit" @click="submit">发&nbsp;&nbsp;布</button>
    </div>
    <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"  id="imageModal">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" style="font-size: 35px;margin-right: 10px">&times;</span></button>
          <img src="" alt="图像" id="originalImage">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateBlog",
  data() {
    return {
      fileList: [],
      text: "",
      is_public: "2",
      headers: {
        headers: {
          token: window.localStorage.getItem("token")
        }
      }
    }
  },
  created(){
    //在Vue实例创建的时候发送异步请求将token作为请求头带去后端看用户是否登录
    this.$http.post("http://localhost:8080/loginOrOut", {}, this.headers)
      .then(res => {
        // 如果没有登录,则将登陆状态status设置为false
        if (res.data.code !== 30001){
          location.href = "http://localhost:8080/homepage"
        }
      })
  },
  methods: {
    submit: function () {
      var data = new FormData()
      for (const fileListElement of this.fileList) {
        if (fileListElement !== null) {
          data.append("files", fileListElement)
        }
      }
      if (data.get("files") === null && this.text === ""){
        this.$message.error('不能发布为空的博客!');
        return;
      }
      data.append("text", this.text)
      data.append("isPublic", this.is_public)
      this.$http.post("http://localhost:8080/blogs", data, this.headers)
        .then(res => {
          if (res.data.code === 23001){
            this.$message({
              message:"发布成功",
              type: 'success',
              duration:700,
            });
            setTimeout(function () {
              // location.href = "http://localhost:8080/homepage"
              location.reload()
            }, 700)
          }else if(res.data.code === 30000){
            this.$message.error('登陆状态失效,发布失败!')
            setTimeout(function () {
              location.href = "http://localhost:8081/homepage"
            }, 700)
          }else {
            this.$message.error('发布失败,请稍后再试!')
          }
        })
    },
    fileUpload: function (e) {
      console.log(e.target.files)
      const img = document.getElementById("img");
      const label = document.getElementById("label");
      //当用户选择了文件时
      for (const file of e.target.files) {
        //实现遍历fileList中的所有元素,将有效的File对象元素统计出来个数
        var uploadFileList = [];
        for (const fileListElement of this.fileList) {
          if (fileListElement !== null) {
            uploadFileList.push(fileListElement)
          }
        }
        //如果此时用户选择上传的文件个数超过9个,则直接显示提示信息,不做操作
        if (uploadFileList.length === 9) {
          this.$message.error('只能添加9个图像或视频!!');
          return;
        }
        //将用户选择的上传文件推到fileList中,供后面统一进行文件的上传
        this.fileList.push(file)
        //创造一个div
        let divElement = document.createElement("div");
        //给div加样式
        divElement.classList.add("divElement")
        //创造icon来让用户删除准备上传的图片
        var span = document.createElement("span")
        span.classList.add("el-icon-circle-close")
        span.classList.add("iElement")
        //为每个icon(每个图像都有一个icon)绑定图像(File对象)在fileList中的位置,以便将对应的File删除
        span.setAttribute("flag", (this.fileList.length - 1) + "")
        span.title = "删除"
        //为每个icon绑定点击事件,当点击删除的图标时,将对应的File对象从fileList中删除,而且将对应的imageDOM元素删除
        span.onclick = (e) => {
          this.fileList.splice(Number.parseInt(e.target.getAttribute("flag")), 1, null)
          e.target.parentNode.remove()
        }
        //将icon放到div中
        divElement.appendChild(span)
        //将div放到上传图标的前面
        img.insertBefore(divElement, label)
        //对上传的图像或者视频向用户进行展示(对图像或视频进行等比例缩小)
        if (file.type.startsWith("video")) {
          let videoElement = document.createElement("video");
          videoElement.src = window.URL.createObjectURL(file)
          divElement.appendChild(videoElement)
          videoElement.controls = true
          videoElement.oncanplay = function () {
            let rad = this.clientHeight / this.clientWidth;
            if (this.clientWidth > this.clientHeight) {
              this.width = 150
              this.height = Math.floor(150 * rad)
              this.style.marginTop = (150 - this.height) / 2 + "px"
              this.style.marginBottom = (150 - this.height) / 2 + "px"
            } else if (this.clientWidth < this.clientHeight) {
              this.height = 150
              this.width = Math.floor(150 / rad)
              this.style.marginLeft = (150 - this.width) / 2 + "px"
              this.style.marginRight = (150 - this.width) / 2 + "px"
            } else {
              this.width = 150
              this.height = 150
              this.style.borderRadius = "4px"
            }
          }
        } else {
          //给图像添加双击事件,当双击时则放大图片
          divElement.title = "双击放大"
          divElement.ondblclick = function () {
            $('#imageModal').modal({
              backdrop:"static",
            })
            const originalImage = $("#originalImage")[0];
            originalImage.src = this.lastChild.src
            originalImage.width = this.lastChild.width * 4
            originalImage.height = this.lastChild.height * 4
          }
          let image = new Image();
          image.src = window.URL.createObjectURL(file)
          divElement.appendChild(image)
          image.onload = function () {
            let rad = this.height / this.width;
            if (this.width > this.height) {
              this.width = 150
              this.height = Math.floor(150 * rad)
              this.style.marginTop = (150 - this.height) / 2 + "px"
              this.style.marginBottom = (150 - this.height) / 2 + "px"
            } else if (this.width < this.height) {
              this.height = 150
              this.width = Math.floor(150 / rad)
              this.style.marginLeft = (150 - this.width) / 2 + "px"
              this.style.marginRight = (150 - this.width) / 2 + "px"
            } else {
              this.width = 150
              this.height = 150
              this.style.borderRadius = "4px"
            }
          }
        }
      }
      e.target.value = ""
    }
  }
}
</script>

<style>
#img {
  width: 650px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px orange solid;
  border-radius: 10px;
  padding-top: 10px;
  padding-left: 10px;
}

.divElement {
  width: 150px;
  height: 150px;
  background-color: black;
  cursor: pointer;
  float: left;
  margin-left: 5px;
  margin-bottom: 5px;
  border-radius: 4px;
  position: relative;
}

.iElement {
  font-size: 16px;
  position: absolute;
  right: 0;
  top: 0;
  color: lightgray;
  cursor: pointer;
}

.iElement:hover {
  opacity: 0.5;
}

#label {
  width: 150px;
  height: 150px;
  border: 1px gray dashed;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
  margin-top: 5px;
}

#label:hover {
  border: 1px dashed lightskyblue;
}

#icon {
  font-size: 50px;
  color: grey;
  margin-top: 30px;
  margin-left: 45px;
}

#label:hover #icon {
  color: lightskyblue
}

.iconSpan {
  color: lightgray;
  font-size: 10px;
  margin-left: 7px
}

#label:hover .iconSpan {
  color: lightskyblue
}

#text {
  width: 630px;
  height: 200px;
  display: block;
  resize: none;
  border: none;
  outline: none;
  margin-bottom: 20px;
  background-color: #F5F5F5;
}

#submit {
  width: 100px;
  height: 30px;
  border: none;
  outline: none;
  border-radius: 14px;
  background-color: orange;
  color: white;
}

#submit:hover {
  background-color: darkorange;
}
</style>
