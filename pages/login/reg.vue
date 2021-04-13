<template>
	<view class="content">
		<view class="logo">
			<image mode="aspectFit" src="../../static/charot.png" />
		</view>
		<view class="mail">
			<input placeholder="邮箱" @input="onInputMail"/>
			<input placeholder="验证码" class="code" @input="onInputCode"/><button :disabled="disabled" @click="sendCode" class="code">{{codeText}}</button>
			<button @click="login" class="login">登录</button>
		</view>
	</view>
</template>

<script>
	import utils from '../../static/utils.js'
	export default {
		data() {
			return {
				codeText: '发送验证码',
				mail:'',
				code:'',
				disabled:false,
				time:90,
				clockTimer:0
			}
		},
		onLoad() {

		},
		methods: {
			async sendCode(){
				let mail = this.mail
				if(mail.substr(-12)!="@sjtu.edu.cn"){
					utils.toast("邮箱格式不规范",2000)
					return
				}
				let form = {}
				form.mail = mail
				var [err,res] = await utils.post("register", form, '发送中', 'noAuth')
				if(err!=null){
					utils.toast("错误，请检查您的邮箱",2000)
					return
				}
				this.disabled = true
				this.codeText = "重新发送(90s)"
				let this_ = this
				this_.clockTimer = setInterval(() => {
					this_.time--
					this_.codeText = "重新发送(" + this_.time + 's)'
					if (this_.time < 0) {
						clearInterval(this_.clockTimer)
						this_.codeText = '发送验证码'
						this_.time = 90
						this_.disabled = false
					}
				}, 1000)
			},
			async login(){
				let mail = this.mail
				if(mail.substr(-12)!="@sjtu.edu.cn"){
					utils.toast("邮箱格式不规范",2000)
					return
				}
				if(this.code.length!=6){
					utils.toast("验证码错误",2000)
					return
				}
				let hash = utils.MD5(utils.MD5(mail)+"93")
				let form = {}
				form.hash = hash
				form.code = this.code
				var [err,res] = await utils.post("login", form, '验证中', 'noAuth')
				if(err!=null){
					utils.toast(err.data.data,2000)
					return
				}else{
					utils.setStorage("AuthID",res.AuthID)
					utils.setStorage("AuthKey",res.AuthKey)
					utils.setStorage("AuthMsg",res.AuthMsg)
					utils.setStorage("AuthTime",res.AuthTime)
					utils.setStorage("AuthType",res.AuthType)
					utils.setStorage("logged",true)
					uni.reLaunch({url: '/pages/index/index'});
				}
			},
			onInputMail(e){
				this.mail = e.detail.value
			},
			onInputCode(e){
				this.code = e.detail.value
			}
		}
	}
</script>

<style>
	input {
		width: 560rpx;
		height: 80rpx;
		line-height: 80rpx;
		margin-bottom: 20rpx;
		border: 1rpx solid #bbb;
		left: 75rpx;
		padding: 10rpx 20rpx;
		position: relative;
		border-radius: 5rpx;
	}

	input.code {
		display: inline-block;
		width: 300rpx;
		vertical-align: top;
	}

	button.code {
		display: inline-block;
		width: 237rpx;
		height: 100rpx;
		left: 95rpx;
		margin: 0;
		vertical-align: top;
		border-radius: 5rpx;
		font-size: 28rpx;
		line-height: 100rpx;
		color:#fff;
		background-color: #007AFF;
	}
	
	button[disabled]{
		background-color: #75b0f0;
	}
	
	button.login {
		display: block;
		width: 600rpx;
		height: 100rpx;
		left: 75rpx;
		margin: 0;
		vertical-align: top;
		border-radius: 5rpx;
		font-size: 32rpx;
		line-height: 100rpx;
		color:#fff;
		background-color: #007AFF;
		margin-top: 20rpx;
	}

	.content {
		width: 750rpx;
		position: absolute;
		top: 0;
		bottom: 0;
		padding: 0;
	}

	.logo {
		top: 10%;
		position: absolute;
		left: -140rpx;
		margin-left: 375rpx;
	}

	.logo image {
		width: 280rpx;
	}

	.mail {
		position: absolute;
		top: 10%;
		margin-top: 450rpx;
	}
</style>
