<template>
	<uni-popup ref="pleaseLogin" type="message">
		<uni-popup-message type="error" message="抱歉游客不可使用,请登陆再试" :duration="2000"></uni-popup-message>
	</uni-popup>
  <view
    style="
      display: grid;
      grid-template-rows: 3;
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #faf1e6;
    "
  >
    <view
      style="
        grid-row-start: 1;
        grid-row-end: 2;
        position: relative;
        width: 100%;
        border-bottom: 2px solid whitesmoke;
      "
    >
	<view style="background-image: url('../../static/收藏夹.svg');
	background-repeat: no-repeat;background-size: cover; width: 50rpx;height: 50rpx;position: absolute;
	top: 0;bottom: 0;margin: auto;left: 30rpx;
	" @click="gotoStar">
		
	</view>
      <view
        style="
          position: absolute;

          border-radius: 100%;
          width: 90rpx;
          height: 90rpx;
          top: 0;
          bottom: 0;
          margin: auto 0;
          right: 90rpx;
          background-size: cover;
		  border: 1px solid white;
        " :style="{backgroundImage:'url('+pictureUrl+')'}"
        @click="gotoPerson"
      ></view>
    </view>

    <!-- 内容主体 -->

    <view style="grid-row-start: 2; grid-row-end: 9">
      <view
        class="img"
        v-for="(i, index) in questionBankList"
        :id="content[index]"
        @click="move"
        style="background-color: #ffe9bf; border-radius: 15rpx"
		:key="index"
		:data-name="i"
      >
	  <!-- 这里的data-name只是为了给点击普通模式或者挑战模式时候获取这个dom节点知道目前是哪个题库被点击 -->
        <view
          style="
            font-size: 20rpx;
            display: flex;
            color: #e3c830;
            position: relative;
            left: 70rpx;
            top: 15rpx;
          "
        >
          <view @click="gotoSearch(i, content[index])">搜题</view>
          <span>&nbsp;/&nbsp;</span>
          <view @click="gotoCN(i,content[index])">错题集</view>
        </view>
        <view
          style="
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
            top: 80rpx;
            font-size: 30rpx;
            text-align: center;
            color: #edb54c;
            font-family: '阿里妈妈东方大楷';
          "
        >
          {{ i }}
        </view>
        <button
          style="
            position: absolute;
            bottom: 50rpx;
            left: 0;
            right: 0;
            margin: auto;
            transform: scale(0.7);
            border-radius: 9999rpx;
          "
          @click="gotoRankingList(i, content[index])"
		  
        >
          排行榜
        </button>
      </view>

      <!-- <view class="img" :id="content[0]" @click="move" style="background-color: #ffe9bf;border-radius: 15rpx;">
				<view style="font-size: 20rpx;display: flex;color: #e3c830;position: relative;left: 70rpx;top: 15rpx;">
					<view @click="gotoSearch('马克思主义原理',content[0])">搜题</view>
					<span>&nbsp;/&nbsp;</span>
					<view>错题集</view>
				</view>
				<view style="
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
            top: 80rpx;
            font-size: 30rpx;
            text-align: center;
			color: #edb54c;
			font-family: '阿里妈妈东方大楷';
          ">
					马克思主义原理
				</view>
				<button style="
            position: absolute;
            bottom: 50rpx;
            left: 0;
            right: 0;
            margin: auto;
            transform: scale(0.7);
			border-radius: 9999rpx;
          " @click="gotoRankingList('马克思主义原理',content[0])">
					排行榜
				</button>
			</view>
			<view class="img" :id="content[1]" @click="move" style="background-color: #ffe9bf;border-radius: 15rpx;">
				<view style="font-size: 20rpx;display: flex;color: #e3c830;position: relative;left: 70rpx;top: 15rpx;">
					<view @click="gotoSearch('毛泽东思想',content[1])">搜题</view>
					<span>&nbsp;/&nbsp;</span>
					<view @click="gotoCN('毛泽东思想',content[1])">错题集</view>
				</view>
				<view style="
			  position: absolute;
			  left: 0;
			  right: 0;
			  margin: auto;
			  top: 80rpx;
			  font-size: 30rpx;
			  text-align: center;
			  color: #edb54c;
			  font-family: '阿里妈妈东方大楷';
			">
					毛泽东思想
				</view>
				<button style="
			  position: absolute;
			  bottom: 50rpx;
			  left: 0;
			  right: 0;
			  margin: auto;
			  transform: scale(0.7);
			 border-radius: 9999rpx;
			" @click="gotoRankingList('毛泽东思想',content[1])">
					排行榜
				</button>
			</view>
			<image src="https://picsum.photos/200/106" class="img" :id="content[2]" @click="move"></image>
			<image src="https://picsum.photos/200/138" class="img" :id="content[3]" @click="move"></image>
			<image src="https://picsum.photos/200/122" class="img" :id="content[4]" @click="move"></image> -->
    </view>
    <view style="grid-row-start: 9; grid-row-end: 11">
      <view>
        <view style="display: flex; justify-content: space-between">
          <button
            style="
              background-color: #cba43f;
              width: 250rpx;
              height: 80rpx;
              color: white;
            "
            @click="gotoAnswer('normal')"
	
			
          >
            普通模式
          </button>
          <button
            style="
              background-color: #cba43f;
              width: 250rpx;
              height: 80rpx;
              color: white;
            "
	
            @click="gotoAnswer('challenge')"
          >
            挑战模式
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
	data() {
		return {
			questionBankList:[],
			imgs: [],
		
			content: ["first","left", "middle", "right","last"],
			who:"",
			pictureUrl:"../../static/人.svg"
		};
	},
	onShow() {
		console.log("生命钩子触发");
		let pictureUrl=uni.getStorageSync("pictureUrl")
		if(pictureUrl!=""){
			this.pictureUrl=pictureUrl
		}
	},
	onLoad(){
	
	},
	beforeMount(){
		uni.getStorage({
			key:"who",
			success:(res)=>{
				this.who=res.data
			}
		})
		
		uni.getStorage({
			key:"token",
			success:(res) =>{
				console.log(res)
				//说明！！！！！！回调函数务必使用箭头函数比如 success:()=>{}这样的格式，不要使用success()=>{}这样的格式，这样会
				 // 出现this指向不为该页的vue实例而是的this.XXX拿不到对应的数据
				uni.request({
					url:"http://localhost:3000/questionBankList",
					method:"GET",
					header:{
						token:res.data
					},
					success:(res)=> {
						console.log(res);
						this.questionBankList=res.data.questionBankList
						if(this.questionBankList.length<=3){
							this.content= ["left", "middle", "right"]
						}else{
							this.content= ["first","left", "middle", "right","last"]
						}
					},
					fail(err) {
						console.log(err);
					}
				})
			}
		})
		
		// setTimeout(()=>{
		// 	this.questionBankList=["毛泽东思想","马克思主义原理","习近平新思想"]
			// if(this.questionBankList.length<=3){
			// 	this.content= ["left", "middle", "right"]
			// }else{
			// 	this.content= ["first","left", "middle", "right","last"]
			// }
		// },100)
	},

	methods: {
		move(current) {
			if (current.currentTarget.id == "left") {
				let a = this.content.shift();
				this.content.push(a);
			} else if (current.currentTarget.id == "right") {
				let a = this.content.pop();
				this.content.unshift(a);
			}
		},
		gotoPerson() {
			if(this.who=="游客"){
				this.$refs.pleaseLogin.open()
			}else{
				uni.navigateTo({
					url: "/pages/person/index",
					animationType: "fade-in"
				})
			}
			
		},
		gotoRankingList(topic, position) {
			console.log(topic);
			if (position == "middle") {
				console.log("允许跳转");
				uni.navigateTo({
					url: "/pages/RankingList/normal/index?name="+topic,
					animationType: "pop-in"
				})
			}
		},
		gotoAnswer(target) {
				
			uni.createSelectorQuery().select("#middle").fields({dataset:true},(context)=>{
				console.log(context.dataset.name);
				uni.navigateTo({
					url: `/pages/startAnswer/${target}/index?name=${context.dataset.name}`,
					animationType: "pop-in"
				})
			}).exec()
		
		},
		gotoSearch(topic, position) {
			console.log(topic);
			if (position == "middle") {
				console.log("允许跳转");
				uni.createSelectorQuery().select("#middle").fields({dataset:true},(context)=>{
					uni.navigateTo({
						url: "/pages/search/index?name="+context.dataset.name,
						animationType: "fade-in"
					})
				}).exec()
				
			}

		},
		gotoCN(topic, position) {
			if(this.who=="游客"){
				this.$refs.pleaseLogin.open()
			}else{
				console.log(topic);
				if (position == "middle") {
					console.log("允许跳转");
					uni.navigateTo({
						url: "/pages/correctionNotebook/index?name="+topic,
						animationType: "fade-in"
					})
				}
			}

		},
		gotoStar(){
			if(this.who=="游客"){
				this.$refs.pleaseLogin.open()
			}else{
				uni.navigateTo({
					url:"/pages/starList/index"
				})
			}

		}

	},
};
</script>

<style lang="css">
.img {
  position: absolute;
  width: 200rpx;
  height: 360rpx;
  left: 0;
  right: 0;
  margin: auto;
  transform: translateY(100rpx);
}

#middle {
  transform: scale(1.3) translateY(100rpx);
  z-index: 99;
  opacity: 1;
  transition-timing-function: ease-in;
  transition: 1s transform;
}

#left {
  transform: translateX(-200rpx) translateY(100rpx);
  z-index: 9;
  opacity: 1;
  transition: 1s transform;
}

#right {
  transform: translateX(200rpx) translateY(100rpx);
  z-index: 8;
  opacity: 1;
  transition: 1s transform;
}
.low-z-index{
	z-index:1
}

#first {
  transform: translateX(-300rpx) translateY(100rpx);
  z-index: 1;
  opacity: 0;
  transition: 1s opacity;
}

#last {
  transform: translateX(300rpx) translateY(100rpx);
  z-index: 1;
  opacity: 0;
  transition: 1s opacity;
}
</style>
