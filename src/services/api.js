import axios from 'axios';

// Pega a URL do backend do quasar.config.js
const API_URL = process.env.API_URL || 'http://localhost:3333';

// Cria instância do axios com configuração base
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se erro 401 (não autorizado), limpa token e redireciona para login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      // Poderia redirecionar aqui, mas vamos deixar o componente decidir
    }
    return Promise.reject(error);
  }
);

/**
 * Serviço centralizado de API
 */
const ApiService = {
  /**
   * Método genérico para executar requisições
   * @param {string} method - GET, POST, PUT, DELETE
   * @param {string} url - Endpoint da API (ex: '/api/auth/google')
   * @param {object} data - Dados para enviar (body)
   * @param {object} config - Configurações extras do axios
   */
  async executar(method, url, data = null, config = {}) {
    try {
      const response = await api({
        method,
        url,
        data,
        ...config,
      });
      return response;
    } catch (error) {
      console.error(`Erro na requisição ${method} ${url}:`, error);
      throw error;
    }
  },

  /**
   * GET request
   */
  async get(url, config = {}) {
    return this.executar('GET', url, null, config);
  },

  /**
   * POST request
   */
  async post(url, data, config = {}) {
    return this.executar('POST', url, data, config);
  },

  /**
   * PUT request
   */
  async put(url, data, config = {}) {
    return this.executar('PUT', url, data, config);
  },

  /**
   * DELETE request
   */
  async delete(url, config = {}) {
    return this.executar('POST', url, {}, config);
  },

  // ============================================
  // ENDPOINTS ESPECÍFICOS DA APLICAÇÃO
  // ============================================

  /**
   * Autenticação com Google OAuth
   */
  auth: {
    async loginComGoogle(googleToken) {
      return ApiService.post('/api/auth/google', {
        googleToken,
      });
    },
  },

  /**
   * Momentos de felicidade
   */
  momentos: {
    async criar(texto) {
      return ApiService.post('/api/momentos', {
        texto,
      });
    },

    async listar(params = {}) {
      return ApiService.get('/api/momentos', { params });
    },

    async aleatorio() {
      return ApiService.get('/api/momentos/aleatorio');
    },

    async estatisticas() {
      return ApiService.get('/api/momentos/estatisticas');
    },
  },

  /**
   * Sentimentos
   */
  sentimentos: {
    async registrar(nivel) {
      return ApiService.post('/api/sentimentos', {
        nivel,
      });
    },

    async historico() {
      return ApiService.get('/api/sentimentos/historico');
    },
  },

  /**
   * Usuário
   */
  usuario: {
    async obterDados() {
      return ApiService.get('/api/usuarios/me');
    },

    async atualizar(dados) {
      return ApiService.put('/api/usuarios/me', dados);
    },

    async deletar() {
      return ApiService.delete('/api/usuarios/delete');
    },

    async aceitarTermos() {
      return ApiService.post('/api/usuarios/acceptTerms', {});
    },
  },
};

export default ApiService;
