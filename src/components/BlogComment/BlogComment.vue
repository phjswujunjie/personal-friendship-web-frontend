<template>
  <div id="main" style="margin-top: 68px">
    <div class="blogDiv">
      <div class="ownerInfoDiv" v-if="blog">
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
      <div class="blogInfoDiv" v-if="blog">
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
            <span class="el-icon-chat-dot-square"
                  style="margin-right: 150px;cursor: pointer;font-size: 20px;color:#ff82008f;"></span>
        <span title="点赞" v-if="blog && blog.loginStatus" @click="createLikes" :class="{'likeOrange' : blog.isLike==1}"
              class="iconfont icon-like" style="cursor: pointer;font-size: 25px;" :flag="blog.id">
          <span :flag="blog.id" style="font-size: 14px;margin-left: 2px;position: relative;bottom: 4px"
                v-if="blog.love_user_number != 0">
            {{ blog.love_user_number }}
          </span>
        </span>
        <span v-else @click="tipLogin" class="iconfont icon-like" style="cursor: pointer;font-size: 25px;color: grey">
            <span v-if="blog" style="font-size: 14px;margin-left: 2px;position: relative;bottom: 4px">
              {{ blog.love_user_number }}
            </span>
        </span>
      </div>
      <hr style="margin-bottom: 5px"/>
      <div v-if="blog" class="commentDiv">
        <img :src="blog.selfAvatar" class="img-circle" width="35px">
        <input type="text" v-model="comment" class="commentInput" placeholder="发布你的评论" v-if="blog.selfAvatar"
               style="width: 90%">
        <input @click="tipLogin" type="text" v-model="comment" class="commentInput" placeholder="发布你的评论" v-else
               style="width: 100%">
        <button class="commentButton" :class="{controlCommentButton: comment.trim()===''}" @click="sendComment">评论
        </button>
      </div>
      <hr/>
      <span style="margin-right: 40px;cursor: pointer">按热度</span>
      <span style="cursor: pointer">按时间</span>
      <div id="commentsContainer" style="margin-top: 15px;width: 600px">
        <div style="position: relative;margin-bottom: 15px" v-for="(comment,index) in commentsResult" :key="index">
          <a :href="comment.homepage">
            <img :src="comment.avatar"
                 width="35px" class="img-circle commentUserAvatar">
          </a>
          <div class="commentDiv">
            <span class="commentUserNickname">{{ comment.nickname }}</span>
            <span class="commentContent">
              :{{ comment.content }}
            </span>
          </div>
          <span class="commentCreateTime">{{ comment.createTime.substring(2) }}</span>
          <span style="margin-left: 360px">
            <i class="el-icon-s-comment" style="cursor: pointer" @click="openReplyModal" :ownerId="index"
               :ownerName="comment.nickname" title="回复"></i>
            <span title="点赞" v-if="blog && blog.loginStatus" @click="createCommentLikes"
                  :class="{'likeOrange' : comment.isLike==1}" class="iconfont icon-like"
                  style="cursor:pointer;margin-left: 20px;font-size: 18px" :flag="comment.commentId" :index="index">
              <span :flag="comment.commentId" style="font-size: 12px;margin-left: 2px;position: relative;bottom: 2px"
                    v-if="comment.loveUserNumber != 0" :index="index">
                {{ comment.loveUserNumber }}
              </span>
            </span>
            <span title="点赞" v-else @click="tipLogin" class="iconfont icon-like"
                  style="cursor: pointer;margin-left: 20px;font-size: 18px">
              <span  v-if="comment.loveUserNumber != 0" style="font-size: 12px;margin-left: 5px;position: relative;bottom: 2px">
                {{ comment.loveUserNumber }}
              </span>
           </span>
          </span>
          <p v-if="comment.replyNumber != 0" style="font-size: 12px;cursor:pointer;color: orange;margin-left: 40px"
             @click="openDisplayReplyModal" :commentIndex="index" :commentId="comment.commentId">
            共{{ comment.replyNumber }}条回复
            <i :commentIndex="index" :commentId="comment.commentId" class="el-icon-caret-bottom"></i>
          </p>
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
    <div id="replyDisplayModal">
      <div style="position: relative">
        <h4 style="margin-left: 20px;font-weight: bolder;display: inline-block">
          {{ replyNumber }}条回复
        </h4>
        <i @click="closeDisplayReplyModal" class="el-icon-close"
           style="position: absolute;cursor:pointer;top:5px;right:15px;font-size: 20px"></i>
        <hr>
      </div>
      <div style="overflow: auto;height: 500px">
        <div id="commentsContainer" style="margin-top: 15px;width: 600px">
          <div style="position: relative;margin-left: 20px">
            <a id="modalHomepage">
              <img id="modalAvatar"
                   width="35px" class="img-circle commentUserAvatar">
            </a>
            <div class="commentDiv">
              <span class="commentUserNickname" id="modalNickname"></span>
              <span class="commentContent" id="modalContent">
            </span>
            </div>
            <span class="commentCreateTime" id="modalCreateTime"></span>
            <span style="margin-left: 360px;width: 60px">
            <i class="el-icon-s-comment" style="cursor: pointer" title="回复"></i>
            <i class="glyphicon glyphicon-thumbs-up" style="margin-left: 20px"></i>
          </span>
          </div>
        </div>
        <div style="margin-top: 10px;margin-left: 55px">
          <span style="cursor: pointer;font-size: 12px;font-weight: bolder;">按热度</span>
          <span style="cursor: pointer;font-size: 12px;font-weight: bolder;margin-left: 20px;color: orange">按时间</span>
        </div>
        <div class="replyDiv">
          <div style="position: relative;margin-left: 20px" v-if="reply" v-for="reply in repliesResult">
            <div>
              <a :href="reply.homepage" style="text-decoration: none"><span
                class="commentUserNickname">{{ reply.nickname }}</span> </a>
              <span class="commentContent">
              :{{ reply.content }}
            </span>
            </div>
            <span style="font-size: 12px;color: #999999">{{ reply.createTime.substring(2) }}</span>
            <span style="margin-left: 320px;width: 60px">
            <i class="el-icon-s-comment" style="cursor: pointer" title="回复"></i>
            <i class="glyphicon glyphicon-thumbs-up" style="margin-left: 20px"></i>
          </span>
          </div>
        </div>
      </div>
      <hr style="width: 170px;margin-left: 60px;display: inline-block">
      <span style="margin: 0 35px;font-size: 12px;color: gray">没有更多回复了</span>
      <hr style="width: 170px;display: inline-block">
    </div>
    <div id="replyModal">
      <div style="position: relative">
        <h4 style="margin-left: 20px;font-weight: bolder;display: inline-block" id="replayUserNickname">
        </h4>
        <i @click="closeReplyModal" class="el-icon-close"
           style="cursor: pointer;font-size: 20px;position: absolute;right: 15px;top: 5px"></i>
        <hr>
      </div>
      <div>
        <textarea v-model="reply" class="replyTextarea" placeholder="发布你的回复"></textarea>
      </div>
      <button @click="sendReply" class="replyButton" id="modalReplyButton"
              :class="{controlCommentButton: reply.trim()===''}">回复
      </button>
    </div>
    <div class="replyModalBackdrop"></div>
  </div>
</template>

<script>
export default {
  name: "BlogComment",
  data() {
    return {
      blog: null,
      comment: "",
      commentsResult: null,
      repliesResult: null,
      reply: "",
      replyNumber: 0,
      likeFlag: null,
      commentLikeFlag: null,
      headers: {
        headers: {
          token: window.localStorage.getItem("token")
        }
      }
    }
  },
  created() {
    this.$http.get("http://localhost:8080/blogs/" + this.$route.params['blogId'], this.headers)
      .then(res => {
        this.blog = res.data.data[0]
        res.data.data.splice(0, 1)
        this.commentsResult = res.data.data
        console.log(this.blog)
        console.log(this.commentsResult)
      })
    //拉取最新的评论信息
    // setInterval(() => {
    //   this.$http.get("http://localhost:8080/comments/" + this.$route.params['blogId'])
    //     .then(res => {
    //       this.commentsResult = res.data.data
    //     })
    // }, 10000)
  },
  methods: {
    // 控制评论点赞的操作
    createCommentLikes: function (e) {
      this.commentLikeFlag = Number(this.commentsResult[e.target.getAttribute("index")].isLike)
      //如果用户没有点赞该信息, 当触发此事件时则是要创建点赞信息
      if (this.commentLikeFlag === 0) {
        console.log("创建点赞信息")
        this.commentLikeFlag = 1
        //将此博客的是否点赞设置为1(用户已点赞)
        this.commentsResult[e.target.getAttribute("index")].isLike = 1
        //将此博客的点赞数加1
        this.commentsResult[e.target.getAttribute("index")].loveUserNumber += 1
      } else {
        console.log("删除点赞信息")
        this.commentLikeFlag = 0
        this.commentsResult[e.target.getAttribute("index")].isLike = 0
        this.commentsResult[e.target.getAttribute("index")].loveUserNumber -= 1
      }
      const data = new URLSearchParams()
      //博客的id
      data.append("commentId", e.target.getAttribute("flag"))
      //进行的操作, 1为增加点赞信息, 0为删除点赞信息
      data.append("flag", this.commentLikeFlag)
      //将操作点赞的信息发给后端, 进而对数据库中的点赞信息进行操作
      this.$http.post("http://localhost:8080/likes/comment", data, this.headers)
        .then(res => {
        })
    },
    //控制博客点赞的操作
    createLikes: function (e) {
      this.likeFlag = Number(this.blog.isLike)
      //如果用户没有点赞该信息, 当触发此事件时则是要创建点赞信息
      if (this.likeFlag === 0) {
        this.likeFlag = 1
        //将此博客的是否点赞设置为1(用户已点赞)
        this.blog.isLike = 1
        //将此博客的点赞数加1
        this.blog.love_user_number += 1
      } else {
        this.likeFlag = 0
        this.blog.isLike = 0
        this.blog.love_user_number -= 1
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
    openReplyModal: function (e) {
      $("#replyModal").fadeIn()
      $(".replyModalBackdrop").fadeIn()
      $("#replayUserNickname")[0].innerText = "回复@" + e.target.getAttribute("ownerName")
      $("#modalReplyButton")[0].setAttribute("ownerId", e.target.getAttribute("ownerId"))
    },
    closeReplyModal: function () {
      $("#replyModal").fadeOut()
      $(".replyModalBackdrop").fadeOut()
      this.reply = ''
    },
    closeDisplayReplyModal: function () {
      $("#replyDisplayModal").fadeOut()
      $(".replyModalBackdrop").fadeOut()
    },
    openDisplayReplyModal: function (e) {
      this.$http.get("http://localhost:8080/replies/" + e.target.getAttribute("commentId"))
        .then(res => {
          console.log(res.data.data)
          this.repliesResult = res.data.data
          this.replyNumber = res.data.data.length
        })
      $("#modalHomepage")[0].href = this.commentsResult[e.target.getAttribute("commentIndex")].homepage
      $("#modalAvatar")[0].src = this.commentsResult[e.target.getAttribute("commentIndex")].avatar
      $("#modalNickname")[0].innerText = this.commentsResult[e.target.getAttribute("commentIndex")].nickname
      $("#modalContent")[0].innerText = ":" + this.commentsResult[e.target.getAttribute("commentIndex")].content
      $("#modalCreateTime")[0].innerText = this.commentsResult[e.target.getAttribute("commentIndex")].createTime.substring(2)
      $("#replyDisplayModal").fadeIn()
      $(".replyModalBackdrop").fadeIn()
    },
    sendReply: function (e) {
      if (this.reply.trim() !== "" && this.blog.loginStatus) {
        this.commentsResult[e.target.getAttribute("ownerId")].replyNumber += 1
        console.log(this.commentsResult[e.target.getAttribute("ownerId")])
        const data = {
          "content": this.reply,
          "commentId": this.commentsResult[e.target.getAttribute("ownerId")].commentId,
          "blogId": this.blog.id,
          "blogOwnerId": this.blog.user_id,
          "replyObjectId": this.commentsResult[e.target.getAttribute("ownerId")].ownerId,
        }
        this.$http({
          method: "post",
          url: 'http://localhost:8080/replies',
          data: data,
          headers: {
            token: window.localStorage.getItem("token"),
            'Content-Type': 'application/json',
          },
        }).then(res => {
          console.log(res.data)
          if (res.data.code === 30000) {
            location.href = "http://localhost:8081/homepage"
          } else if (res.data.code === 23000) {
            alert("插入失败")
          } else {
            this.closeReplyModal()
            this.$message({
              type: "success",
              message: "回复成功",
              duration: "700"
            })
          }
          this.reply = ""
        })
      }
    },
    sendComment: function () {
      if (this.comment.trim() !== '' && this.blog.loginStatus) {
        let date = new Date()
        let createTime = (date.getFullYear() + "-" + this.adjustSeconds((date.getMonth() + 1)) + "-" + this.adjustSeconds(date.getDate()) + " " + this.adjustSeconds(date.getHours()) + ":"
          + this.adjustSeconds(date.getMinutes()) + ":" + this.adjustSeconds(date.getSeconds()))
        const data = new FormData()
        data.append("createTime", createTime)
        data.append("blogOwnerId", this.blog.user_id)
        data.append("blogId", this.blog.id)
        data.append("content", this.comment)
        console.log(data)
        this.$http({
          method: "post",
          url: 'http://localhost:8080/comments',
          data: data,
          headers: {
            token: window.localStorage.getItem("token"),
            'Content-Type': 'application/json',
          },
        }).then(res => {
          if (res.data.code === 23001) {
            console.log(res.data)
            const newComment = {
              avatar: this.blog.selfAvatar,
              nickname: this.blog.selfNickname,
              content: this.comment,
              homepage: "http://localhost:8081/u/" + this.blog.selfId + "/blog",
              createTime: createTime,
              media: "",
              commentId: res.data.data,
              replyNumber: 0,
              ownerId: this.blog.selfId,
              isLike: 0,
              loveUserNumber: 0
            }
            // this.$set(this.commentsResult, 0, newComment)
            this.commentsResult.unshift(newComment)
            console.log(this.commentsResult)
            this.comment = ""
            this.$message({
              type: "success",
              message: "评论成功",
              duration: "700"
            })
          } else if (res.data.code === 30000) {
            location.href = "http://localhost:8081/homepage"
          } else {
            alert("评论失败")
          }
        })
      }
    },
    addFollow: function (e) {
      this.$http.post("http://localhost:8080/friends/" + e.target.getAttribute("flag"), {}, this.headers)
        .then(res => {
          if (res.data.code === 23001) {
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
            if (e.target.innerText.length === 4) {
              i.innerText = " 互相关注"
              button.style.width = "100px"
            } else {
              i.innerText = " 已关注"
            }
            button.appendChild(i)
            if (e.target.className === "el-icon-plus") {
              e.target.parentNode.after(button)
              e.target.parentNode.remove()
            } else {
              e.target.after(button)
              e.target.remove()
            }
            this.$message({
              type: "success",
              message: "关注成功",
              duration: "700"
            })
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
    },
    adjustSeconds: function (seconds) {
      if (seconds < 10) {
        return "0" + seconds
      }
      return seconds
    }
  }
}
</script>

<style scoped>
.icon-like:hover {
  color: orange;
}

.likeOrange {
  color: red;
}

.el-icon-s-comment:hover {
  color: orange;
}

.el-icon-s-comment {
  color: #999999;
}

.replyButton {
  width: 70px;
  background-color: #ff8200;
  color: white;
  font-weight: bolder;
  height: 34px;
  border: none;
  border-radius: 17px;
  margin-left: 530px;
}

.replyTextarea {
  width: 90%;
  margin: 10px 5% 0;
  height: 80px;
  border: 1px solid orange;
  outline: none;
  border-radius: 10px;
  padding: 5px;
  resize: none;
}

#replyModal {
  position: fixed;
  width: 640px;
  top: 30vh;
  left: 30vw;
  background-color: white;
  border-radius: 10px;
  height: 195px;
  display: none;
  z-index: 1200;
}

#replyDisplayModal {
  position: fixed;
  width: 640px;
  top: 10vh;
  left: 30vw;
  background-color: white;
  border-radius: 10px;
  height: 545px;
  display: none;
  z-index: 1100;
}

.replyModalBackdrop {
  z-index: 1040;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .5);
  display: none;
}

.replyDiv {
  margin-left: 60px;
  border-left: 1px gray solid;
  margin-top: 15px;
}

hr {
  margin: 2px;
}

.commentUserAvatar {
  position: absolute;
  top: 2px;
}

.commentUserNickname {
  font-size: 12px;
  color: #eb7350;
}

.commentContent {
  font-size: 12px;
  color: black;

}

.commentDiv {
  margin-left: 40px;
  display: inline-block;
  width: 560px;
}

.commentCreateTime {
  font-size: 12px;
  color: #999999;
  margin-left: 38px;
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

.el-icon-chat-dot-square:hover {
  border-radius: 10px;
  background-color: #ff820047;
}

.commentInput {
  border: none;
  background-color: #f0f1f4;
  height: 38px;
  border-radius: 12px;
  margin-bottom: 10px;
  padding-left: 10px;
  outline: none;
}

.commentInput:focus {
  border: 1px solid #ff8200;
  background-color: white;
}

.commentButton {
  width: 70px;
  background-color: #ff8200;
  color: white;
  font-weight: bolder;
  height: 34px;
  border: none;
  border-radius: 17px;
  margin-left: 520px;
}

.controlCommentButton {
  cursor: not-allowed;
  background-color: #fec42d99;
}
</style>
