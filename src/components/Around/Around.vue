<template>
  <div id="main" style="margin-top: 68px">
    <div class="blogDiv" v-for="(blog, key) in blogs">
      <div class="ownerInfoDiv">
        <a :href="blog.user_url"><img :src="blog.user_avatar" class="img-circle" width="50px" height="50px"
                                      alt="头像"></a>
        <button v-if="blog.loginStatus && blog.is_self"
                style=" width: 40px;border: none;background-color: #ff8200; height: 20px;font-size: 8px;position: relative;bottom: 10px;border-radius: 10px">
          &nbsp;本人
        </button>
        <span class="nicknameSpan">{{ blog.user_nickname }}</span>
        <span class="createTimeSpan">发布于{{ blog.create_time }}</span>
        <button title="关注" v-if="!blog.loginStatus" @click="tipLogin" class="followButton">
          <i class="el-icon-plus" style="font-weight: bolder"></i>&nbsp;关注
        </button>
        <button title="关注" @click="addFollow" v-if="blog.loginStatus && !blog.is_self && blog.relation===0"
                class="followButton" :flag="blog.user_id">
          <i :flag="blog.user_id" class="el-icon-plus" style="font-weight: bolder"></i>&nbsp;关注
        </button>
        <button title="回关" @click="addFollow" v-if="blog.loginStatus && !blog.is_self && blog.relation===8"
                class="followButton" :flag="blog.user_id">
          <i :flag="blog.user_id" class="el-icon-plus" style="font-weight: bolder"></i>&nbsp;回关&nbsp;
        </button>
        <button v-if="blog.loginStatus && !blog.is_self && blog.relation===4" class="attention ">
          <i class="el-icon-check"></i>&nbsp;已关注
        </button>
        <button style="width: 100px" v-if="blog.loginStatus && !blog.is_elf && blog.relation===2"
                class="attention">
          <i class="el-icon-check"></i>&nbsp;互相关注
        </button>
      </div>
      <div class="blogInfoDiv">
        <div style="margin-left: 10px;width: 566px;word-break: break-all;word-wrap: break-word">{{ blog.content }}
        </div>
        <div style="margin-top: 15px;overflow: hidden">
          <div v-if="image!=='http://localhost:8080/static/upload/'" class="imageDiv"
               v-for="image in blog.image">
            <img :src="image" @load="changeImage" title="放大图像" style="cursor: zoom-in" alt="图片" class="image"
                 @dblclick="enlargeImage">
          </div>
          <div v-if="video!=='http://localhost:8080/static/upload/'" class="imageDiv"
               v-for="video in blog.video">
            <video :src="video" @canplay="changeVideo" controls class="image"></video>
          </div>
        </div>
      </div>
      <div style="margin-left: 200px;margin-top: 25px">
            <span title="评论" @click="toComment" :id="blog.id" class="el-icon-chat-dot-square"
                  style="margin-right: 150px;cursor: pointer;font-size: 20px;color:grey;"></span>
        <span title="点赞" v-if="blog.loginStatus" @click="createLikes" :class="{'likeOrange' : blog.isLike==1}"
              class="iconfont icon-like" style="cursor: pointer;font-size: 25px;" :flag="blog.id" :index="key">
          <span :index="key" :flag="blog.id" style="font-size: 14px;margin-left: 2px;position: relative;bottom: 4px"
          v-if="blog.love_user_number != 0">{{ blog.love_user_number }}</span>
        </span>
        <span v-else @click="tipLogin" class="iconfont icon-like"
              style="cursor: pointer;font-size: 25px;color: grey">
          <span style="font-size: 14px;margin-left: 2px;position: relative;bottom: 4px">{{
            blog.love_user_number
          }}</span>
        </span>
      </div>
    </div>
    <div v-if="blogs && blogs.length===0" style="text-align: center;color: grey"><h5>~~还没有人分享博客,快去添加您的博客吧!~~</h5></div>
    <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" id="imageModal">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"
                                                                                            style="font-size: 35px;margin-right: 10px">&times;</span>
          </button>
          <img src="" alt="图像" id="originalImage">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Around",
  data() {
    return {
      blogs: null,
      likeFlag: null,
      headers: {
        headers: {
          token: window.localStorage.getItem("token")
        }
      }
    }
  },
  created() {
    this.$http.get("http://localhost:8080/blogs/around", this.headers)
      .then(res => {
        this.blogs = res.data.data
        console.log(this.blogs)
      })
  },
  methods: {
    //操作点赞
    createLikes: function (e) {
      this.likeFlag = Number(this.blogs[e.target.getAttribute("index")].isLike)
      //如果用户没有点赞该信息, 当触发此事件时则是要创建点赞信息
      if (this.likeFlag === 0) {
        this.likeFlag = 1
        //将此博客的是否点赞设置为1(用户已点赞)
        this.blogs[e.target.getAttribute("index")].isLike = 1
        //将此博客的点赞数加1
        this.blogs[e.target.getAttribute("index")].love_user_number += 1
      } else {
        this.likeFlag = 0
        this.blogs[e.target.getAttribute("index")].isLike = 0
        this.blogs[e.target.getAttribute("index")].love_user_number -= 1
      }
      const data = new URLSearchParams()
      //博客的id
      data.append("blogId", e.target.getAttribute("flag"))
      //进行的操作, 1为增加点赞信息, 0为删除点赞信息
      data.append("flag", this.likeFlag)
      //将操作点赞的信息发给后端, 进而对数据库中的点赞信息进行操作
      this.$http.post("http://localhost:8080/likes/blog", data, this.headers)
        .then(res => {
        })
    },
    addFollow: function (e) {
      this.$http.post("http://localhost:8080/friends/" + e.target.getAttribute("flag"), {}, this.headers).then(res => {
        if (res.data.code === 23001) {
          this.$message({
            type: "success",
            message: "关注成功",
            duration: "700"
          })
          for (const iElement of document.querySelectorAll("button[flag='" + e.target.getAttribute("flag") + "']")) {
            var button = document.createElement("button")
            var i = document.createElement("i")
            button.style.position = "absolute"
            button.style.left = "460px"
            button.style.width = "80px"
            button.style.border = "2px lightgray solid"
            button.style.backgroundColor = "white"
            button.style.color = "lightgray"
            button.style.fontWeight = "lighter"
            button.style.height = "30px"
            button.style.borderRadius = "15px"
            button.style.cursor = "not-allowed"
            i.className = "el-icon-check"
            if (iElement.innerText.length === 4) {
              i.innerText = " 互相关注"
              button.style.width = "100px"
            } else {
              i.innerText = " 已关注"
            }
            button.appendChild(i)
            iElement.after(button)
            iElement.remove()
          }
        }
      })
    },
    tipLogin: function () {
      this.$message({
        duration: "1000",
        message: '请先进行登录',
        type: 'error'
      });
    },
    toComment: function (e) {
      window.location.href = "http://localhost:8081/blogComment/" + e.target.id
    },
    changeImage: function (e) {
      let image = e.target
      let rad = image.height / image.width;
      if (e.target.width > image.height) {
        image.width = 130
        image.height = Math.floor(130 * rad)
        image.style.marginTop = (130 - image.height) / 2 + "px"
        image.style.marginBottom = (130 - image.height) / 2 + "px"
      } else if (e.target.width < image.height) {
        image.height = 130
        image.width = Math.floor(130 / rad)
        image.style.marginLeft = (130 - image.width) / 2 + "px"
        image.style.marginRight = (130 - image.width) / 2 + "px"
      } else {
        image.width = 130
        image.height = 130
        image.style.borderRadius = "4px"
      }
      image.style.display = "inline-block"
    },
    changeVideo: function (e) {
      let video = e.target
      let rad = video.clientHeight / video.clientWidth;
      if (video.clientWidth > video.clientHeight) {
        video.width = 130
        video.height = Math.floor(130 * rad)
        video.style.marginTop = (130 - video.height) / 2 + "px"
        video.style.marginBottom = (130 - video.height) / 2 + "px"
      } else if (video.clientWidth < video.clientHeight) {
        video.height = 130
        video.width = Math.floor(130 / rad)
        video.style.marginLeft = (130 - video.width) / 2 + "px"
        video.style.marginRight = (130 - video.width) / 2 + "px"
      } else {
        video.width = 130
        video.height = 130
        video.style.borderRadius = "4px"
      }
      video.style.display = "block"
    },
    enlargeImage: function (e) {
      $('#imageModal').modal({
        backdrop: "static",
      })
      const originalImage = $("#originalImage")[0];
      originalImage.src = e.target.src
      originalImage.width = e.target.width * 4
      originalImage.height = e.target.height * 4
    }
  }
}
</script>

<style scoped>
.icon-like:hover{
  color: orange;
}
.likeOrange {
  color: red;
}

.blogDiv {
  width: 670px;
  margin: 12px auto 0;
  background-color: white;
  padding: 25px 25px 0 25px;
  border-radius: 5px;
}

.ownerInfoDiv {
  width: 600px;
  margin: 0 auto 20px;
  position: relative;
}

.nicknameSpan {
  position: relative;
  bottom: 10px;
  color: #333;
  font-weight: bolder;
}

.createTimeSpan {
  position: absolute;
  bottom: 5px;
  font-size: 8px;
  color: #939393;
  left: 55px;
}

.blogInfoDiv {
  margin-left: 54px;
}

.imageDiv {
  float: left;
  width: 130px;
  height: 130px;
  border-radius: 3px;
  background-color: black;
  margin-top: 5px;
  margin-left: 5px;
}

.image {
  display: none;
}

.followButton:hover {
  background-color: #ff82003d;
}

.followButton {
  position: absolute;
  left: 460px;
  top: 5px;
  width: 80px;
  border: 1px solid #ff8200;
  background-color: white;
  color: #ff8200;
  font-weight: lighter;
  height: 30px;
  border-radius: 15px
}

.attention {
  position: absolute;
  left: 460px;
  top: 5px;
  width: 80px;
  border: 2px lightgray solid;
  background-color: white;
  color: lightgray;
  font-weight: lighter;
  height: 30px;
  border-radius: 15px;
  cursor: not-allowed;
}
</style>
