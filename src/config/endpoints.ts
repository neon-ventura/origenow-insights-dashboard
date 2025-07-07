
// Domínio principal da API
export const API_BASE_URL = 'https://dev.huntdigital.com.br';

// Endpoints organizados por categoria conforme a documentação da API
export const ENDPOINTS = {
  // Autenticação e Usuário
  AUTH: {
    LOGIN: '/projeto-amazon/login',
    LOGOUT: '/projeto-amazon/logout',
    REGISTER: '/projeto-amazon/cadastro',
    SEND_EMAIL_CODE: '/projeto-amazon/enviar-codigo-email',
    VERIFY_EMAIL: '/projeto-amazon/verificar-email',
    CHANGE_PASSWORD: '/projeto-amazon/alterar-senha',
    USERS: '/projeto-amazon/users',
  },

  // Imagens
  IMAGES: {
    UPLOAD: '/projeto-amazon/upload-images',
    GET_IMAGE: (usuario: string, filename: string) => `/projeto-amazon/images/${usuario}/${filename}`,
    DELETE_IMAGE: (usuario: string, filename: string) => `/projeto-amazon/images/${usuario}/${filename}`,
    LIST_USER_IMAGES: (usuario: string) => `/projeto-amazon/images/${usuario}`,
    DELETE_ALL_USER_IMAGES: (usuario: string) => `/projeto-amazon/images/${usuario}`,
  },

  // Produtos e Ofertas
  PRODUCTS: {
    VERIFY_GTINS: '/projeto-amazon/verify-gtins',
    UPDATE_PRICE_STOCK: '/projeto-amazon/atualizar-preco-estoque',
    AMAZON_PRODUCTS: '/projeto-amazon/produtos-amazon',
    PROCESS_OFFERS: '/projeto-amazon/processar-ofertas',
    SUPPLIERS: '/projeto-amazon/fornecedores',
    SUPPLIERS_LIST: '/projeto-amazon/fornecedores-lista',
  },

  // Jobs e Relatórios
  JOBS: {
    USER_JOBS: (userName: string) => `/projeto-amazon/user-jobs/${userName}`,
    JOB_DETAILS: (jobId: string) => `/projeto-amazon/job/${jobId}`,
    JOB_PROGRESS: (jobId: string) => `/projeto-amazon/job-progress/${jobId}`,
  },

  // Deleção de SKUs
  DELETE: {
    SINGLE_SKU: '/projeto-amazon/deletar-sku',
    BULK_SKU: '/projeto-amazon/deletar-sku-em-massa',
    TEMPLATE: '/projeto-amazon/template-deletar',
  },

  // Notificações e Pedidos
  NOTIFICATIONS: {
    LIST: '/projeto-amazon/notificacoes',
    ORDERS: '/projeto-amazon/pedidos',
  },

  // Templates e Utilitários
  TEMPLATES: {
    GTIN_VERIFICATION: '/projeto-amazon/download-template',
    PRICE_STOCK_UPDATE: '/projeto-amazon/download-template-atualizacao',
    OFFERS: '/projeto-amazon/template-ofertas',
  },

  // Downloads de Jobs
  DOWNLOADS: {
    OFFERS: (jobId: string) => `/projeto-amazon/ofertas-download/${jobId}`,
    PRICE_STOCK: (jobId: string) => `/projeto-amazon/atualizacao-download/${jobId}`,
    GTIN_VERIFICATION: (jobId: string) => `/projeto-amazon/verify-gtins-download/${jobId}`,
  },

  // Vídeos
  VIDEOS: {
    CREATE: '/projeto-amazon/videos',
    LIST: '/projeto-amazon/videos',
    GET: (id: string) => `/projeto-amazon/videos/${id}`,
    UPDATE: (id: string) => `/projeto-amazon/videos/${id}`,
    DELETE: (id: string) => `/projeto-amazon/videos/${id}`,
  },

  // Administração e Utilidades
  ADMIN: {
    ROUTINES_REPORT: '/projeto-amazon/relatorio-rotinas',
    FORCE_ROUTINES: '/projeto-amazon/forcar-rotinas',
    CLEAN_BANNED_ASINS: '/projeto-amazon/limpar-asins-banidos',
    DICTIONARY: '/projeto-amazon/dicionario',
    DASHBOARD: '/projeto-amazon/dashboard',
  },
};

// Função para construir URL completa
export const buildUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
