<template>
	<view style="position: absolute;width: 100%;height: 100%;display: grid;background-image:linear-gradient(180deg,#fbfbfb,#faf0e4)">
		<view style="height: 46px;overflow: hidden;position: absolute;width: 100%;height: 100%;" class="items">
			<van-nav-bar title="" left-text="返回" left-arrow @click-left="onClickLeft" >
				<template #right>
					<view style="position: relative;width: max-content;color: #6389fa;" @click="onClickRight">
						<van-icon name="wap-home" size="18"  style="top: 4rpx;bottom: 0;margin: auto;position: relative;" />
					</view>
				</template>
			</van-nav-bar>

		</view>
		<view style="grid-row-start: 2;grid-row-end: 3;position: relative;" class="items">
			<span class="items" style="position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: auto;
			width: 90%;text-align: center;font-size:35rpx;line-height: 70rpx;color: #f57f17;
			font-family: '阿里妈妈东方大楷';
			">
				马克思主义原理挑战模式排行榜不生效
			</span>
		
		</view>
		<view style="grid-row-start: 3;grid-row-end: 16	;position: relative;" class="items">
			<view
				style="width: 95%; height: 98%;position: absolute;left: 0;right: 0;margin: auto;top: 0;bottom: 0;overflow: auto;" class="item">
				<view v-for="i,index in personList" :key="index"
					style="display: flex;width: 90%;justify-content: space-around;font-size: 27rpx;position: relative;left: 0;right: 0;margin: auto;" class="items">
					<span style="white-space: nowrap;width: 35rpx;text-align: center;height: 80rpx;line-height: 80rpx;" class="items">{{i.place}}</span>
					<view style="height: 60rpx;width: 60rpx;border-radius: 100%;border: 2px solid black;position: relative;top: 0;bottom: 0;margin-top: auto;margin-bottom: auto;"></view>
					<span
						style="width: 300rpx;height: max-content;position: relative;top: 0;bottom: 0;margin: auto;margin-left: 0;margin-right: 0;" class="items">{{i.nickname}}</span>
					<span class="items" style="height: 80rpx;line-height: 80rpx;width: 100rpx;text-align: center;">{{i.time}}</span>
					<span class="items" style="height: 80rpx;line-height: 80rpx;width: 100rpx;text-align: center;">{{i.score}}分</span>

				</view>
			</view>
		</view>
		<view style="grid-row-start: 16;grid-row-end: 18;position: relative;" class="items">
			<view
				style="width: 95%; height: 98%;position: absolute;left: 0;right: 0;margin: auto;top: 0;bottom: 0;" class="item">
				<view style="position: absolute;background-color: #fbefda;width: 100%;height: 100rpx;transform: translateY(-13rpx);"></view>
				<view 
					style="display: flex;width: 90%;justify-content: space-around;font-size: 27rpx;position: relative;left: 0;right: 0;top:0;bottom:0;margin: auto;" class="items">
					<span style="white-space: nowrap;width: 35rpx;text-align: center;height: 80rpx;line-height: 80rpx;" class="items">{{ userInformation.place }}</span>
					<view style="height: 60rpx;width: 60rpx;border-radius: 100%;border: 2px solid black;position: relative;top: 0;bottom: 0;margin-top: auto;margin-bottom: auto;
					background-image: url(https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png);background-repeat: no-repeat;
					background-size: cover;"></view>
					<span
						style="width: 300rpx;height: max-content;position: relative;top: 0;bottom: 0;margin: auto;margin-left: 0;margin-right: 0;" class="items">{{userInformation.nickname}}</span>
					<span class="items" style="height: 80rpx;line-height: 80rpx;width: 100rpx;text-align: center;">{{userInformation.time}}</span>
					<span class="items" style="height: 80rpx;line-height: 80rpx;width: 100rpx;text-align: center;">{{userInformation.score}}分</span>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				personList:[],
			userInformation:{
					
					time: "4分59秒",
					score: "200",
					nickname: "巴啦啦小魔仙黑呼啦胡全身变",
					place:"25"
				},
				uid:""
			}
		},
		onLoad(option){
			//option.name获取题库名字
			this.uid = uni.getStorageSync("uid")
			uni.getStorage({
				key:"who",
				success: (res) => {
					this.who=res.data
					if(res.data=="游客"){
						this.userInformation={
							score:"0",
							nickname:"游客",
							place:"无"
						}
					}else{
						uni.request({
							url:"http://localhost:3000/rankingList",
							data:{
								username:this.who,
								questionBank:option.name,
								mode:"challenge",
								userId:this.uid
							},
							success: (res) => {
								this.personList=res.data.personList
								this.userInformation=res.data.userInformation
							}
						})
					}
						
				}
			})
		},
		beforeMount() {
			
		},
		methods: {
			onClickLeft() {
				uni.navigateBack()
				
			},
			onClickRight(){
				uni.navigateBack({
					delta:2
				})
			}
		}
	}
</script>

<style>
	.items {
		/* border: 1px solid black; */
	}
	
/* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
@font-face {
  font-family: "阿里妈妈东方大楷";font-weight: 400;src: url("//at.alicdn.com/wf/webfont/f2wEXLd1xeef/pkkGqnSNlJje.woff2") format("woff2"),
  url("//at.alicdn.com/wf/webfont/f2wEXLd1xeef/yuNIM3BDJh6A.woff") format("woff");
  font-display: swap;
}

</style>