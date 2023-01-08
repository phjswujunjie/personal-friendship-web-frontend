<template>
  <div>
    <div id="main">
      <h4>全部博客({{ blogNumber }})</h4>
      <div class="blogDiv" v-for="(blog, key) in blogs">
        <div class="ownerInfoDiv">
          <img :src="blog.user_avatar" class="img-circle" width="50px" height="50px">
          <span class="nicknameSpan">{{ blog.user_nickname }}</span>
          <span class="createTimeSpan">发布于{{ blog.create_time }}</span>
          <span v-if="$store.state.isSelf"><i @click="displayMore" class="el-icon-arrow-down icon"
                                              style="cursor:pointer;color: gray;border-radius: 9px;position: absolute;right: 20px;top: 10px;font-size: 18px"></i></span>
          <div class="iconMore">
            <h6 :id="blog.id" @click="deleteBlog">删除</h6>
            <h6>置顶</h6>
          </div>
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
            <span title="评论" class="el-icon-chat-dot-square"
                  style="margin-right: 150px;cursor: pointer;font-size: 20px;color:grey;" :id="blog.id" @click="toBlogComment"></span>
          <span title="点赞" v-if="blog.loginStatus" @click="createLikes" :class="{'likeOrange' : blog.isLike==1}" class="iconfont icon-like" style="cursor: pointer;font-size: 25px;" :flag="blog.id" :index="key"><span :index="key" :flag="blog.id" style="font-size: 14px;margin-left: 2px;position: relative;bottom: 4px" v-if="blog.love_user_number != 0">{{ blog.love_user_number }}</span></span>
          <span v-else @click="tipLogin" class="iconfont icon-like" style="cursor: pointer;font-size: 20px;color: grey" >
            <span style="font-size: 14px;margin-left: 5px;position: relative;bottom: 5px">{{ blog.love_user_number }}</span>
          </span>
        </div>
      </div>
      <div v-if="blogNumber === 0" style="background-color: white;width: 642px;height: 300px;border-radius: 5px">
        <div style="position: relative;left: 290px;top: 140px">
          <i class="el-icon-warning" style="font-size: 50px;color: #507daf"></i>
          <p>暂无内容</p>
        </div>
      </div>
    </div>
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
  name: "Blog",
  data: function () {
    return {
      blogs: [],
      flag: -1,
      blogNumber: null,
      headers: {
        headers: {
          token: window.localStorage.getItem("token")
        }
      }
    }
  },
  created() {
    console.log("blog.....")
    this.$http.get("http://localhost:8080/blogs/users/" + this.$route.params["id"], this.headers)
      .then(res => {
        this.blogs = res.data.data
        this.blogNumber = this.blogs.length
        console.log(res.data)
        console.log(this.$store.state.isSelf)
      })
  },
  methods: {
    //操作点赞
    createLikes: function (e){
      this.likeFlag = Number(this.blogs[e.target.getAttribute("index")].isLike)
      //如果用户没有点赞该信息, 当触发此事件时则是要创建点赞信息
      if (this.likeFlag === 0){
        this.likeFlag = 1
        //将此博客的是否点赞设置为1(用户已点赞)
        this.blogs[e.target.getAttribute("index")].isLike = 1
        //将此博客的点赞数加1
        this.blogs[e.target.getAttribute("index")].love_user_number += 1
      }else {
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
    tipLogin: function () {
      this.$message({
        duration: "1000",
        message: '请先进行登录',
        type: 'error'
      });
    },
    toBlogComment: function (e) {
      location.href = "http://localhost:8081/blogComment/" + e.target.id
    },
    deleteBlog: function (e) {
      this.$http.delete("http://localhost:8080/blogs/" + e.target.id, this.headers)
        .then(res => {
          if (res.data.code === 21001) {
            this.$message({
              message: "删除成功",
              type: 'success',
              duration: 700,
            });
            e.target.parentNode.parentNode.parentNode.remove()
            this.blogNumber--
          }
        })
    },
    displayMore: function (e) {
      this.flag *= -1
      this.flag === 1 ? e.target.parentNode.nextElementSibling.style.display = "block" : e.target.parentNode.nextElementSibling.style.display = "none"
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
  },
}
</script>

<style scoped>
.icon-like:hover{
  color: orange;
}
.likeOrange{
  color: red;
}
.icon:hover {
  background-color: rgba(245, 178, 42, 0.98);
}

.blogDiv {
  width: 643px;
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

.iconMore {
  display: none;
  z-index: 10;
  background-color: white;
  position: absolute;
  width: 100px;
  border-radius: 5px;
  top: 25px;
  right: 35px;
  border: 1px solid lightgray
}

h6 {
  height: 25px;
  padding-top: 5px;
  padding-left: 10px;
}

h6:hover {
  background-color: #f2f2f2;
  cursor: pointer;
}
</style>
