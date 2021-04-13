<template>
	<view class="content">
		<view class="navbar">
			<uni-icons class="icon" type="arrowleft" size="30" color="#fff" @click="back"></uni-icons>
			<view class="title">发布主题</view>
		</view>
		<view class="main">
			<view class="query"><label>标 题</label><input maxlength="25" :value="title" @input="onInputTitle" placeholder="25字以内,可留空" /></view>
			<view class="query"><label>代 号</label><input maxlength="8" :value="name" @input="onInputName" placeholder="留空则自动生成" /></view>
			<view class="query"><label>板 块</label>
				<picker @change="bindPickerChange" :value="index" :range="array">
					<view class="uni-input">{{array[index]}}</view>
				</picker>
			</view>
			<view class="uni-textarea">
				<textarea :value="content" @input="onInputContent" maxlength="600" placeholder="正文栏" />
			</view>
		</view>
		<view @click="post" class="postbar">
			发布主题
		</view>
	</view>
</template>

<script>
	let dictColor = "青苍赤丹朱彤绛绯赩缇赭绀黄橙褐棕黑黧黛碧白蓝堇紫灰"
	let dictThing = "云霞石星月锦道岛灯城溪山河湖泽潮峰舫宫楼宇亭台榭港海晖镜林流"
	let dictFile = {'综合':2, '日记':3, '垃圾场':0, '值班室':1}
	import utils from '../../static/utils.js'
	import uniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
	export default {
		data() {
			return {
				array: ['综合', '日记', '垃圾场', '值班室'],
				index: 0,
				title: "",
				name: "",
				content:""
			}
		},
		components: {
			uniIcons,
		},
		onLoad() {

		},
		methods: {
			back() {
				uni.navigateBack()
			},
			onInputTitle(e) {
				this.title = e.detail.value
			},
			onInputName(e) {
				this.name = e.detail.value
			},
			onInputContent(e) {
				this.content = e.detail.value
			},
			bindPickerChange(e){
				this.index = e.target.value
			},
			async post(){
				let form = {}
				form.Title = this.title
				if(this.name==""){
					form.Name = dictColor[Math.floor(Math.random() * dictColor.length)]+dictThing[Math.floor(Math.random() * dictThing.length)]
				}else{
					form.Name = this.name
				}
				form.File = dictFile[this.array[this.index]]
				form.Content = this.content
				form.Root = 0
				if(form.Content.length<5){
					utils.toast("请勿灌水",2000)
					return
				}
				var [err,res] = await utils.post("post", form, '发送中', 'needAuth')
				if(err){
					utils.toast("系统错误",2000)
				}else{
					uni.reLaunch({url: '/pages/index/index?id='+res});
				}
			}
		}
	}
</script>

<style>
	.query {
		width: 750rpx;
		height: 80rpx;
		overflow: hidden;
		border-bottom: 1rpx solid #ddd;
	}

	.query label {
		display: inline-block;
		vertical-align: top;
		width: 120rpx;
		margin-right: 20rpx;
		text-align: center;
		line-height: 80rpx;
		color: #888;
	}

	.uni-textarea {
		padding: 20rpx;
		position: absolute;
		top: 350rpx;
    margin-top: var(--status-bar-height);
		bottom: 120rpx;
		left: 0;
		right: 0;
	}

	textarea {
		width: 100%;
		height: 100%;
	}

	.query input {
		display: inline-block;
		vertical-align: top;
		line-height: 80rpx;
		height: 80rpx;
		width:580rpx;
	}

	.query picker {
		display: inline-block;
		line-height: 80rpx;
		height: 80rpx;
		width:600rpx;
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
	}

	.main {
		padding-top: 100rpx;
    margin-top: var(--status-bar-height);
	}

	.icon {
		margin-left: 26rpx;
		margin-right: 26rpx;
	}

	.title {
		display: inline-block;
		vertical-align: top;
	}

	.postbar {
		position: fixed;
		bottom: 0;
		height: 115rpx;
		width: 750rpx;
		box-shadow: 0rpx 0 8rpx #bbb;
		line-height: 115rpx;
		font-size: 38rpx;
		color: #fff;
		background-color: #75B0F0;
		text-align: center;
	}
</style>
