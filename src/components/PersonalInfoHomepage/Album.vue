<template>
  <div style="margin-top: 10px" class="main">
    <div id="background">
      <h5>全部图片</h5>
      <div>
        <h4 style="text-align: center">11月</h4>
        <div style="width: 610px">
          <div v-if="image!=='http://localhost:8080/static/upload/'" class="imageDiv"
               v-for="image in images">
            <img :src="image" @load="changeImage" title="放大图像" style="cursor: zoom-in" alt="图片" class="image"
                 @dblclick="enlargeImage">
          </div>
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
  name: "Album",
  data: function () {
    return {
      images: [],
    }
  },
  created() {
    this.$http.get("http://localhost:8080/blogs/users/" + this.$route.params["id"], {
      headers: {
        token: window.localStorage.getItem("token")
      }
    }).then(res => {
      for (const i of res.data.data) {
        for (const iElement of i.image) {
          this.images.push(iElement)
        }
      }
    })
  },
  methods: {
    enlargeImage: function (e) {
      $('#imageModal').modal({
        backdrop: "static",
      })
      const originalImage = $("#originalImage")[0];
      originalImage.src = e.target.src
      originalImage.width = e.target.width * 4
      originalImage.height = e.target.height * 4
    },
    changeImage: function (e) {
      let image = e.target
      let rad = image.height / image.width;
      if (e.target.width > image.height) {
        image.width = 142
        image.height = Math.floor(142 * rad)
        image.style.marginTop = (142 - image.height) / 2 + "px"
        image.style.marginBottom = (142 - image.height) / 2 + "px"
      } else if (e.target.width < image.height) {
        image.height = 142
        image.width = Math.floor(142 / rad)
        image.style.marginLeft = (142 - image.width) / 2 + "px"
        image.style.marginRight = (142 - image.width) / 2 + "px"
      } else {
        image.width = 142
        image.height = 142
        image.style.borderRadius = "4px"
      }
      image.style.display = "inline-block"
    },
  }
}
</script>

<style scoped>
#background {
  position: relative;
  height: 413px;
  width: 643px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  padding: 15px;
}

.imageDiv {
  float: left;
  width: 142px;
  height: 142px;
  border-radius: 3px;
  background-color: black;
  margin-top: 5px;
  margin-left: 5px;
}
</style>
