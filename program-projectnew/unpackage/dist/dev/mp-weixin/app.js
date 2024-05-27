"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/homepage/index.js";
  "./pages/person/index.js";
  "./pages/startAnswer/normal/index.js";
  "./pages/startAnswer/challenge/index.js";
  "./pages/search/index.js";
  "./pages/correctionNotebook/index.js";
  "./pages/RankingList/normal/index.js";
  "./pages/RankingList/challenge/index.js";
  "./pages/starList/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/360MoveData/Users/lenovo/Desktop/scr/program-projectnew/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
