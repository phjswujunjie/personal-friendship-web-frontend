import Vue from 'vue'
import Vuex from "vuex";
import da from "element-ui/src/locale/lang/da";

Vue.use(Vuex)

const state = {
  id: '',
  infoData: null,
  isSelf: false,
  //登陆者个人的id
  selfId: null,
  //
  flag: 1,
}

const mutations = {
    saveId: function (state, id) {
      state.id = id;
    },
    saveInfoData: function (state, data) {
      state.infoData = data
    },
    changeIsSelf: function (state, data) {
      state.isSelf = data
    },
    saveSelfId: function (state, data) {
      state.selfId = data
    },
    saveFlag: function (state, data){
      state.flag = data
    }
}

const getters = {

}

const actions = {

}
const store = new Vuex.Store({
  state:state,
  mutations:mutations,
  getters:getters,
  actions:actions,
})

export default store
