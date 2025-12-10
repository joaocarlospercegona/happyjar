export default {
	methods: {
		async realizarLogin(credenciais) {
			let response = await this.metodoExecutar({ url: 'login', method: 'post', data: credenciais })
			console.log('reseponse', response)
      if (response.status === 200) {
				// await this.$store.commit('setDados', { key: 'login', value: response.data.login })
				// await this.$store.commit('setDados', { key: 'usuario', value: response.data.usuario })

				// this.$router.push('/');
			} else this.$q.notify({ message: 'Dados de login incorretos!', type: 'negative' })
		},
		async deslogar() {
			if (this.getLogin.token) await this.metodoExecutar({ url: 'logout', method: 'post', data: { refresh_token: this.getLogin.refreshToken, fcm_token: this.getDeviceId } })
			await this.$store.commit('limparStore')
			delete this.$axios.defaults.headers.common['Authorization']
			this.$router.push('/login')
		},
	}
}
