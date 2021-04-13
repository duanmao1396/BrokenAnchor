<template>
	<view class="content">
		<view class="navbar">
			<uni-icons class="icon" type="arrowleft" size="30" color="#fff" @click="back"></uni-icons>
			<view class="title">No. {{(Array(8).join(0) + id).slice(-8)}}</view>
		</view>
		<view class="holder"></view>
		<view class="well">
			<view class="artiName">{{arti.Name}}
				<view class="artiHash">{{arti.Hash}}</view>
			</view>
			<view class="artiNo">No. {{(Array(8).join(0) + arti.Id).slice(-8)}}</view>
			<view class="artiTitle" v-if="arti.Title!=''">{{arti.Title}}</view>
			<view class="artiTime">{{arti.PostTime}}</view>
			<view class="artiContent">{{arti.Content}}</view>
			<view class="replyNum">
				<uni-icons type="chat" size="15" color="#bbb"></uni-icons> {{" "+arti.ReplyNum}}
			</view>
		</view>
		<view class="method" @click="switchMethod">
			<uni-icons type="map" size="15" color="#bbb"></uni-icons>{{[" 时间倒序",""," 时间顺序"][method+1]}}
		</view>
		<view class="noreply" v-if="replys.length==0">暂无更多回复</view>
		<view class="replywell" v-for="(item, index) in replys" :key="item.Id">
			<view class="artiName">{{item.Name}}
				<view class="artiHash">{{item.Hash}}</view>
			</view>
			<view class="artiNo">No. {{(Array(8).join(0) + item.Id).slice(-8)}}</view>
			<view class="artiContent">{{item.Content}}</view>
			<view class="artiTime">{{item.PostTime}}</view>
		</view>
		<view class="holder"></view>
		<view class="replyHolder">
			<view class="uni-textarea">
				<textarea :adjust-position="false" :auto-height="true" :value="reply" :maxlength="600" :fixed="true" @input="onInputReply"
					maxlength="600" placeholder="回复主题" />
			</view>
			<uni-icons @click="postReply" class="reply-button" type="undo-filled" size="20" color="#bbb"></uni-icons>
		</view>
	</view>
</template>

<script>
	import utils from '../../static/utils.js'
	import uniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
	export default {
		data() {
			return {
				array: ['综合', '日记', '垃圾场', '值班室'],
				id: 0,
				arti: {},
				reply: '',
				method: 1,
				replys: [],
				bottomFlg: false
			}
		},
		components: {
			uniIcons,
		},
		onLoad(options) {
			if (options == null || options.id == null) {
				utils.toast("主题不存在", 2000)
				uni.reLaunch({
					url: '/pages/index/index'
				});
				return
			}
			this.id = options.id
			this.loadArti()
			this.viewReply(0)
		},
		onReachBottom() {
			if (!this.bottomFlg) {
				this.viewReply(this.replys.length)
			}
		},
		onPullDownRefresh(){
			this.viewReply(0)
			uni.stopPullDownRefresh()
		},
		methods: {
			switchMethod() {
				if (this.bottomFlg) {
					this.method = -this.method
					this.replys = this.replys.reverse()
				} else {
					this.replys = []
					this.method = -this.method
					this.viewReply(this.replys.length)
				}
			},
			back() {
				uni.navigateBack()
			},
			async loadArti() {
				let form = {}
				form.id = this.id
				var [err, res] = await utils.post("viewArti", form, '加载中', 'needAuth')
				if (err) {
					return
				} else {
					this.arti = res
				}
			},
			onInputReply(e) {
				this.reply = e.detail.value
			},
			async postReply() {
				let form = {}
				form.Title = ""
				form.Name = 123
				form.Hash = this.arti.Hash
				form.Name = this.arti.Name
				form.File = -1
				form.Content = this.reply
				form.Root = this.id
				if (form.Content.length < 2) {
					utils.toast("请勿灌水", 2000)
					return
				}
				var [err, res] = await utils.post("post", form, '发送中', 'needAuth')
				if (err) {

				} else {
					this.reply = ''
					if(this.method==1){
						this.viewReply(this.replys.length)
					}else{
						this.viewReply(0)
					}
				}
			},
			async viewReply(offset) {
				let form = {}
				form.Id = this.id * this.method
				form.Offset = offset
				var [err, res] = await utils.post("viewReply", form, '加载中', 'needAuth')
				if (err) {
					return
				} else {
					if (res != null) {
						let tmp = this.replys.concat(res)
						let method = this.method
						tmp.sort((a, b) => {
							return method * (a.Id - b.Id)
						})
						let newRep = []
						newRep.push(tmp[0])
						for (let i = 1; i < tmp.length; i++) {
							if (tmp[i].Id !== tmp[i-1].Id) {
								newRep.push(tmp[i])
							}
						}
						this.replys = newRep
					} else {
						this.bottomFlg = true
					}
				}
			}
		}
	}
</script>

<style>
	.noreply {
		color: #ddd;
		width: 750rpx;
		margin: 0;
		padding: 0;
		text-align: center;
		font-size: 28rpx;

	}

	.method {
		width: 690rpx;
		margin: 40rpx 25rpx;
		text-align: right;
		color: #bbb;
		font-size: 28rpx;
	}

	.reply-button {
		position: absolute;
		right: 36rpx;
		bottom: 28rpx;
	}

	.uni-textarea {
		border: 1rpx solid #ddd;
		border-radius: 5rpx;
		margin: 12rpx 12rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		padding: 14rpx;
		width: 592rpx;
	}

	textarea {
		width: 588rpx;
	}

	.replyHolder {
		position: fixed;
		width: 100%;
		left: 0;
		right: 0;
		bottom: 0;
		min-height: 100rpx;
		box-shadow: 0 0 5rpx #bbb;
		background-color: #fff;
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
		padding-left: 28rpx;
		display: inline-block;
		width: 300rpx;
	}

	.artiHash {
		font-size: 26rpx;
		padding-left: 18rpx;
		display: inline-block;
		color: #ddd;
	}

	.artiTime {
		color: #bbb;
		font-size: 26rpx;
		padding: 16rpx 24rpx;
		display: inline-block;
		padding-top: 0;
		text-align: right;
		width: 650rpx;
	}

	.replyTime {
		color: #bbb;
		font-size: 26rpx;
		padding: 16rpx 24rpx;
		display: inline-block;
		padding-top: 0;
		text-align: right;
		width: 400rpx;
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
		line-height: 40rpx;
		white-space: pre-wrap;
	}

	.artiNo {
		color: #bbb;
		font-size: 26rpx;
		padding: 16rpx 24rpx;
		margin-top: 10rpx;
		display: inline-block;
		width: 320rpx;
		text-align: right;
	}

	.replyNo {
		color: #bbb;
		font-size: 26rpx;
		padding: 16rpx 24rpx;
		margin-top: 10rpx;
		display: inline-block;
		width: 200rpx;
		text-align: left;
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
		content: "垃圾场";
	}

	.file3:after {
		content: "值班室";
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
		font-size: 36rpx;
		z-index: 100;
    padding-top:var(--status-bar-height);
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

	.replywell {
		width: 700rpx;
		margin: 40rpx 25rpx;
		box-shadow: 0 0 5rpx #bbb;
		border-radius: 6rpx;
		display: block;
		position: relative;
		padding-bottom: 16rpx;
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
