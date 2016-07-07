import Cookies from '../core/cookies'
import API from '../core/api'


export default class User extends API {

	static current = null


	static _setCurrentUser(loginData) {
		let key = loginData.session.key
		this.current = loginData.user
		Cookies.set('session-key', key)
	}


	static _clearCurrentUser() {
		this.current = null
		Cookies.remove('session-key')
	}


	static async login(form) {
		let loginData = await this.call('login', form)
		this._setCurrentUser(loginData)
		return loginData
	}


	static async logout() {
		await this.call('logout')
		// this._clearCurrentUser()
	}


	static async register(form) {
		let loginData = await this.call('register', form)
		this._setCurrentUser(loginData)
		return loginData
	}


	static get() {
		return this.call('current')
	}

}



