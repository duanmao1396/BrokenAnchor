<template>
	<view class="content">
		<uniDrawer :visible="true" ref="showRight" mode="left">
			<view class="logo">
				<image mode="aspectFit" src="/static/charot.png" />
				DO WHAT THOU WILT SHALL BE THE WHOLE OF THE RULE
			</view>
			<view class="fileNav" @click="goFile(-1)">时间线</view>
			<view class="fileNav" @click="goFile(2)">综合</view>
			<view class="fileNav" @click="goFile(3)">日记</view>
			<view class="fileNav" @click="goFile(0)">垃圾场</view>
			<view class="fileNav" @click="goFile(1)">值班室</view>
		</uniDrawer>
		<view class="navbar">
			<uni-icons @click="showDrawer" class="icon" type="list" size="30" color="#fff"></uni-icons>
			<view class="title">{{title}}</view>
		</view>
		<view class="holder"></view>
		<view class="well" v-for="(item, index) in artis" :key="item.Id" @click="goArti(item.Id)">
			<view :class="['file2','file3','file0','file1'][item.File]"></view>
			<view class="artiNo">No. {{(Array(8).join(0) + item.Id).slice(-8)}}</view>
			<view class="artiTime">{{item.PostTime}}</view>
			<view class="artiTitle" v-if="item.Title!=''">{{item.Title}}</view>
			<view class="artiContent">{{item.Content}}</view>
			<view class="replyNum">
				<uni-icons type="chat" size="15" color="#bbb"></uni-icons> {{" "+item.ReplyNum}}
			</view>
		</view>
		<view style="width:100%;height:20rpx;"></view>
		<view @click="goPost" class="newArti">
			+
		</view>
	</view>
</template>

<script>
	import utils from '../../static/utils.js'
	let fileDict = ['时间线', '垃圾场', '值班室','综合', '日记']
	import uniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
	import uniDrawer from "@/uni_modules/uni-drawer/components/uni-drawer/uni-drawer.vue";
	export default {
		data() {
			return {
				title: '时间线',
				file: -1,
				artis: [],
				bottomFlg: false
			}
		},
		components: {
			uniIcons,
			uniDrawer
		},
		async onLoad(option) {
			if (option.file) {
				this.file = parseInt(option.file)
			} else {
				this.file = -1
			}
			this.title = fileDict[this.file + 1]
			await this.pullData(this.artis.length)
		},
		onReachBottom() {
			if (!this.bottomFlg) {
				this.pullData(this.artis.length)
			}
		},
		onPullDownRefresh() {
			this.pullData(0)
			uni.stopPullDownRefresh()
		},
		onShow(option) {},
		methods: {
			goFile(file) {
				if (file == this.file) {
          this.$refs.showRight.close();
					return
				}
				this.file = file
				this.title = fileDict[this.file + 1]
				this.artis = []
				this.pullData(this.artis.length)
				this.$refs.showRight.close();
			},
			showDrawer() {
				this.$refs.showRight.open();
			},
			goPost() {
				uni.navigateTo({
					url: 'newArti'
				});
			},
			async pullData(offset) {
				let form = {}
				form.File = this.file
				form.Offset = offset
				var [err, res] = await utils.post("viewList", form, '加载中', 'needAuth')
				if (err) {
					return
				} else {
					if (res != null) {
						let tmp = this.artis.concat(res)
						let method = this.method
						tmp.sort((a, b) => {
							return ((new Date(b.ReplyTime).getTime()) - (new Date(a.ReplyTime).getTime()))
						})
						let newRep = []
						newRep.push(tmp[0])
						for (let i = 1; i < tmp.length; i++) {
							if (tmp[i].Id !== tmp[i - 1].Id) {
								newRep.push(tmp[i])
							}
						}
						this.artis = newRep
					} else {
						this.bottomFlg = true
					}
				}
			},
			goArti(id) {
				uni.navigateTo({
					url: 'arti?id=' + id
				});
			}
		}
	}
</script>

<style>
	.fileNav {
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		font-size: 32rpx;
		color: #888;
		border-top: 1rpx solid #ddd;
		margin-top: 20rpx;
		padding: 10rpx;
		padding-top: 30rpx;
	}

	.logo {
		margin-top: 50rpx;
		width: 80%;
		margin-left: 10%;
		color: #ccc;
		font-size: 26rpx;
		text-align: center;
	}

	.logo image {
		width: 70%;
		margin: 20rpx 15%;
		height: 240rpx;
	}

	.replyNum {
		position: absolute;
		bottom: 20rpx;
		right: 28rpx;
		color: #bbb;
		font-size: 28rpx;
	}

	.artiName {
		font-size: 28rpx;
		padding-left: 18rpx;
		display: inline-block;
	}

	.artiTime {
		color: #999;
		font-size: 28rpx;
		padding: 16rpx 24rpx;
		display: inline-block;
		margin-top: 10rpx;
		text-align: right;
		width: 305rpx;
	}

	.artiTitle {
		font-size: 34rpx;
		padding: 18rpx 28rpx;
		padding-bottom: 5rpx;
	}

	.artiContent {
		font-size: 32rpx;
		padding: 18rpx 28rpx;
		padding-bottom: 0;
		margin-bottom: 24rpx;
		text-align: justify;
		max-height: 160rpx;
		line-height: 40rpx;
		white-space: pre-line;
		/* 显示多行 */
		display: -webkit-box;
		overflow: hidden;
		/* 5为显示的行数 */
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
	}

	.artiNo {
		color: #999;
		font-size: 28rpx;
		padding: 16rpx 24rpx;
		margin-top: 10rpx;
		display: inline-block;
		width: 200rpx;
	}

	.file0,
	.file1,
	.file2,
	.file3 {
		display: inline-block;
		font-size: 26rpx;
		background-color: #75B0F0;
		color: #fff;
		width: 80rpx;
		height: 40rpx;
		margin-top: 10rpx;
		text-align: center;
		border-radius: 6rpx;
		box-shadow: 0 0 1rpx #bbb;
		margin-left: 18rpx;
	}

	.file0:after {
		content: "综合";
	}

	.file1:after {
		content: "日记";
	}

	.file2:after {
		content: "树洞";
	}

	.file3:after {
		content: "站务";
	}

	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background: #75B0F0;
		color: #fff;
		height: 96rpx;
		line-height: 96rpx;
		padding: 0;
    padding-top:var(--status-bar-height);
		font-size: 36rpx;
		z-index: 100;
	}

	.holder {
		width: 100%;
		height: 90rpx;
    padding-top:var(--status-bar-height);
	}

	.icon {
		margin-left: 26rpx;
		margin-right: 26rpx;
	}

	.well {
		width: 700rpx;
		margin: 40rpx 25rpx;
		box-shadow: 0 0 5rpx #bbb;
		border-radius: 6rpx;
		display: block;
		position: relative;
		padding-bottom: 56rpx;
	}

	.title {
		display: inline-block;
		vertical-align: top;
	}

	.newArti {
		position: fixed;
		bottom: 70rpx;
		right: 50rpx;
		width: 120rpx;
		height: 120rpx;
		line-height: 105rpx;
		text-align: center;
		font-size: 80rpx;
		font-weight: bold;
		color: #ccc;
		box-shadow: 0rpx 0rpx 8rpx #ccc;
		background-color: #fff;
		border-radius: 100rpx;
	}
</style>
