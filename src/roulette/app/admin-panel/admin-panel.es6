import User from '../../api/user'


export default class AdminPanel {

	static styles = [require('./admin-panel.styl')]
	static selector = 'admin-panel'
	static template = `

		<modal #modal> Настройки сектора </modal>


		<div .controls>
			<file #sectorBg label="Фон"></file>
			<file #sectorContent label="Контент"></file>
			<button (click)="addSector(sectorBg.value[0], sectorContent.value[0])">
				Добавить сектор
			</button>
			
			<form #loginForm>
				<text name="login" label="login"></text>
				<text name="pass" label="pass"></text>
				<button (click)="login(loginForm)">Войти</button>
				<button (click)="register(loginForm)">Заегистрировать</button>
				<button (click)="get()">get</button>
				<button (click)="logout()">logout</button>
			</form>
			
		</div>

		<ul .sectors>

			<li .sector *for="sector in sectors"
					.__selected="selectedSector is sector">

				<div .sector-content (click)="selectSector(sector)"
					 [style.backgroundImage]="url(/storage/{{sector.texture}})">
						{{ sector }}
				</div>

				<div .sector-controls>
					<div .remove (click)="sector.remove()">X</div>
				</div>
			</li> 
		</ul>
	`


	constructor() {
		this.sectors = []
		this.roulette = null
		this.selectedSector = null
		this.initHandlers()
	}


	async login(form) {
		try {
			let res = await User.login(form)
			console.log(res)
		} catch (e) {
			console.error(e)
		}
	}


	async logout() {
		try {
			let res = await User.logout()
			console.log(res)
		} catch (e) {
			console.error(e)
		}
	}


	async register(form) {
		try {
			let res = await User.register(form)
			console.log(res)
		} catch (e) {
			console.error(e)
		}
	}


	async get() {
		try {
			let res = await User.get()
			console.log(res)
		} catch (e) {
			console.error(e)
		}
	}


	initHandlers() {
		this.on('init', ()=> {
			this.roulette.on('sectorclick', this.selectSector)
		})
	}


	selectSector(sector) {
		this.selectedSector = sector
		this.roulette.rotateToSector(sector)
	}


	addSector(textureFile, contentTextureFile) {
		if (!textureFile) return this.app.error('Не выбрана текстура фона')
		if (!contentTextureFile) return this.app.error('Не выбрана текстура контента')

		this.sectors.add({
			name: 'ololo',
			texture: textureFile,
			contentTexture: contentTextureFile
		})
	}


}

