<template>
  <div style="margin-left: 10px" class="main">
    <div id="background">
      <div>
        <div>
          <h4 style="border-bottom: 1px lightgray solid;padding-bottom: 10px;margin-bottom: 0">{{ toNickname }}</h4>
        </div>
        <div>
          <ul id="messageUl" style="overflow: auto;">
            <li :class="{'messageRight': message.user_id==$store.state.selfId}" :key="message.id"
                v-for="message in chatMessages">
              <img :src="message.avatar" style="cursor: pointer" width="40px" height="40px" class="img-circle">
              <el-card :body-style="{padding: '8px'}" class="box-card"
                       :class="{'messageDivRight': message.user_id==$store.state.selfId, 'messageDivLeft': message.user_id!=$store.state.selfId}">
                <div class="text item" v-html="message.content">
                </div>
              </el-card>
            </li>
          </ul>
        </div>
      </div>
      <div style="border-top: 1px lightgray solid;">
        <div>
          <i class="glyphicon glyphicon-picture" style="font-size: 15px"></i>
          <i class="glyphicon glyphicon-picture" style="margin-left: 10px;font-size: 15px"></i>
          <i class="glyphicon glyphicon-picture" style="margin-left: 10px;font-size:15px"></i>
          <i class="glyphicon glyphicon-picture" style="margin-left: 10px;font-size: 15px"></i>
        </div>
        <textarea v-model="message" id="text" placeholder="在这里输入信息"
                  style="width: 90%;height: 80px;resize: unset;background-color: #f0f1f4;border: none;outline: none;"></textarea>
        <button id="sendButton" :class="{'disableSend': message.trim() === ''}" @click="sendMessage">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
import da from "element-ui/src/locale/lang/da";

export default {
  name: "User",
  data: function () {
    return {
      headers: {
        headers: {
          token: window.localStorage.getItem("token")
        }
      },
      toNickname: null,
      chatMessages: null,
      selfAvatar: null,
      messageSocket: new WebSocket("ws://localhost:8080/chatWebSocket"),
      message: '',
    }
  },
  mounted() {
    console.log("mounted......")
    document.getElementById("text").focus()
    this.messageSocket.onmessage = res => {
      const message = JSON.parse(res.data)
      if (message.fromId == this.$route.params.id) {
        $("<li class='messageLeft'><img class='img-circle' width='40px' height='40px' style='cursor: pointer'" + " src=" + message.fromUserAvatar + "><div class='el-card box-card is-always-shadow messageDivLeft'><div class=\"el-card__body\" style='padding: 8px'><div class=\"text item\">" + message.content + "</div></div></div></li>").appendTo($("#messageUl"))
      }else {
        const data = new URLSearchParams()
        data.append("content", message.content)
        data.append("createTime", message.createTime)
        data.append("fromUserAvatar", message.fromUserAvatar)
        data.append("fromId", message.fromId)
        console.log(data)
        this.$http.post("http://localhost:8080/chatMessages/storageUnreadMessage", data, this.headers)
          .then(res => {
            console.log(res.data)
          })
      }
      document.getElementById("messageUl").scrollTop = document.getElementById("messageUl").scrollHeight
    }
  },
  created() {
    this.$http.get("http://localhost:8080/chatMessages/" + this.$route.params.id, this.headers)
      .then(res => {
        if (res.data.code === 20001) {
          this.selfAvatar = res.data.data[0].selfAvatar
          this.toNickname = res.data.data[0].toNickname
          this.chatMessages = res.data.data.slice(1, res.data.data.length)
          this.$nextTick(function () {
            document.getElementById("messageUl").scrollTop =  document.getElementById("messageUl").scrollHeight
          })
        } else {
          location.href = "http://localhost:8081/homepage"
        }
      })
    this.messageSocket.onopen = () => {
      const data = {"user_id": this.$store.state.selfId, "to_id": this.$route.params.id}
      this.messageSocket.send(JSON.stringify(data))
    }
  },
  methods: {
    sendMessage: function (e) {
     if (this.message.trim() !== ''){
       this.message = this.message.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>')
       $("<li class='messageRight'><img class='img-circle' width='40px' height='40px' style='cursor: pointer'" + " src=" + this.selfAvatar + "><div class='el-card box-card is-always-shadow messageDivRight'><div class=\"el-card__body\" style='padding: 8px'><div class=\"text item\">" + this.message + "</div></div></div></li>").appendTo($("#messageUl"))
       document.getElementById("messageUl").scrollTop = document.getElementById("messageUl").scrollHeight
       const data = {
         'content': this.message,
         'user_id': this.$store.state.selfId,
         'to_id': this.$route.params.id,
       }
       this.messageSocket.send(JSON.stringify(data))
       this.message = ''
       document.getElementById("text").focus()
     }
    }
  },
  beforeDestroy() {
    this.messageSocket.close()
  }
}
</script>

<style>
#sendButton {
  width: 50px;
  height: 26px;
  border: none;
  background-color: rgba(64, 255, 59, 0.83);
  border-radius: 5px
}

.disableSend {
  cursor: not-allowed;
}

#sendButton:hover {
  background-color: #19be1d;
}

.text {
  font-size: 14px;
}

.item {
  padding: 0;
}

.box-card {
  max-width: 260px;
}

#background {
  position: relative;
  height: 100vh;
  width: 842px;
  background-color: #f0f1f4;
  border-radius: 4px;
  padding: 10px;
}

#messageUl {
  height: 540px;
  overflow-x: unset;
  list-style-type: none;
  padding-left: 15px;
}

#messageUl li {
  margin-top: 10px;
}

.messageRight {
  text-align: right;
  margin-right: 10px;
}

.messageDivRight {
  position: relative;
  bottom: 30px;
  left: 480px;
  background-color: #07C160;
}

.messageDivRight .text {
  text-align: left;
}

.messageDivLeft {
  position: relative;
  bottom: 30px;
  left: 50px;
}

.messageLeft {

}

#messageUl::-webkit-scrollbar {
  display: block;
  width: 6px;
  background-color: rgba(25, 132, 165, 0.3);
  border-radius: 10px;
}

#messageUl::-webkit-scrollbar-thumb {
  background-color: rgba(25, 132, 165, 0.7);
  border-radius: 10px;
}
</style>
