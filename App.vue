<script>
	import utils from './static/utils.js'
	export default {
		onLaunch: async function() {
			if(utils.getStorage("logged")!=true){
				uni.reLaunch({url: '/pages/login/reg'});
				return
			}
			let form = {}
			form.AuthID = utils.getStorage('AuthID')
			form.AuthTime = utils.getStorage('AuthTime')
			form.AuthKey = utils.getStorage('AuthKey')
			form.AuthType = utils.getStorage('AuthType')
			form.AuthMsg = utils.getStorage('AuthMsg')
			var [err,res] = await utils.post("renew", form, '登录中', 'noAuth')
			if(err!=null){
				uni.reLaunch({url: '/pages/login/reg'});
			}else{
				utils.setStorage("AuthID",res.AuthID)
				utils.setStorage("AuthKey",res.AuthKey)
				utils.setStorage("AuthMsg",res.AuthMsg)
				utils.setStorage("AuthTime",res.AuthTime)
				utils.setStorage("AuthType",res.AuthType)
				utils.setStorage("logged",true)
			}
		},
		onShow: function() {
		},
		onHide: function() {
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
