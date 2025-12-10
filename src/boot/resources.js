import moment from 'moment'
export default ({ app }) => {
	app.mixin({

		methods: {
			metodoExecutar: async function (data) {
				let response
				try {
					if (this.getLogin && this.getLogin.token && !this.$axios.defaults.headers.common['Authorization']){
						this.$axios.defaults.headers.common['Authorization'] = this.getLogin.type + ' ' + this.getLogin.token
					}

					response = await this.$axios.request(data)
				} catch (e) {
					response = e.response
				}
				return response
			},
			metodoRespostaErro: function (response) {
				if (response.data.error) this.$q.notify({ message: response.data.error.message ? response.data.error.message.replace(/\n/g, '<br>') : response.data.error.e || '', type: 'negative', html: true })
				else if (response.data.length > 0) {
					let m = ''
					for (let item of response.data) m += (m === '' ? '' : '<br>') + item.message
					this.$q.notify({ message: m.replace(/\n/g, '<br>'), type: 'negative', html: true })
				} else this.$q.notify({ message: 'Não foi possível executar a solicitação!', type: 'negative' })
			},
			formatarDataHora: function (d, f1, f2) {
				return f2 ? moment(d, f1).format(f2) : moment(d).format(f1)
			},
			async setupPush() {
				let self = this
				async function sendToken(token) {
					if ((self.getLogin && !self.getDeviceId) || self.getDeviceId !== token) {
						let response = await self.metodoExecutar({ method: 'post', url: 'Cliente/deviceId', data: { token: token, cliente_id: self.getUsuarioLogado.id } })
						if (response.status === 200){
							await self.$store.commit('setDados', { key: 'deviceId', value: token })
						}
					}
				}
				sendToken(await FCM.getToken())
				FCM.onTokenRefresh(token => sendToken(token))
				FCM.onNotification(data => {
					this.$store.commit('addNotificacao', data)
					if (data.wasTapped){
					}
				})
				let startNotification = await FCM.getInitialPushPayload()
				if (startNotification) {
					this.$store.commit('addNotificacao', startNotification)
					if (startNotification.wasTapped) {
					}

				}
				if (this.$q.platform.is.ios === true) await FCM.requestPushPermission({ timeAout: 10, interval: 0.3 })
			},
		}
	})
}
