"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      personList: [],
      userInformation: {
        score: "200",
        nickname: "巴啦啦小魔仙黑呼啦胡全身变",
        place: "25"
      },
      who: "",
      uid: "",
      questionBank: ""
    };
  },
  onLoad(option) {
    this.uid = common_vendor.index.getStorageSync("uid");
    this.questionBank = option.name;
    common_vendor.index.getStorage({
      key: "who",
      success: (res) => {
        this.who = res.data;
        common_vendor.index.request({
          url: "http://localhost:3000/rankingList",
          data: {
            username: this.who,
            questionBank: option.name,
            mode: "normal",
            userId: this.uid
          },
          success: (res2) => {
            this.personList = res2.data.personList;
            if (res2.data == "游客") {
              this.userInformation = {
                score: "0",
                nickname: "游客",
                place: "无"
              };
            } else {
              this.userInformation = res2.data.userInformation;
            }
          }
        });
      }
    });
  },
  beforeMount() {
  },
  methods: {
    onClickLeft() {
      common_vendor.index.navigateBack();
    },
    onClickRight() {
      common_vendor.index.navigateTo({
        url: "/pages/RankingList/challenge/index?name=" + this.questionBank
      });
    }
  }
};
if (!Array) {
  const _component_van_icon = common_vendor.resolveComponent("van-icon");
  const _component_van_nav_bar = common_vendor.resolveComponent("van-nav-bar");
  (_component_van_icon + _component_van_nav_bar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.onClickRight),
    b: common_vendor.p({
      name: "arrow",
      size: "18"
    }),
    c: common_vendor.o($options.onClickLeft),
    d: common_vendor.p({
      title: "",
      leftText: "返回",
      leftArrow: true
    }),
    e: common_vendor.f($data.personList, (i, index, i0) => {
      return {
        a: common_vendor.t(i.place),
        b: common_vendor.t(i.nickname),
        c: common_vendor.t(i.score),
        d: index
      };
    }),
    f: common_vendor.t($data.userInformation.place),
    g: common_vendor.t($data.userInformation.nickname),
    h: common_vendor.t($data.userInformation.score)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/360MoveData/Users/lenovo/Desktop/scr/program-projectnew/pages/RankingList/normal/index.vue"]]);
wx.createPage(MiniProgramPage);
