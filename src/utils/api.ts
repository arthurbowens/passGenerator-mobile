import axios from "axios";

const app = axios.create({
  // baseURL para qd fizer requisição pelo emulador
    baseURL: "http://10.0.2.2:8080/passGenerator/",
    headers: {
      'Content-Type': 'application/json',
    }
});

// Interceptor para requisições
app.interceptors.request.use(
  (config) => {
    console.log('Requisição sendo enviada:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas
app.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  (error) => {
    // console.error('Erro na resposta:', {
    //   status: error.response?.status,
    //   statusText: error.response?.statusText,
    //   data: error.response?.data,
    //   headers: error.response?.headers
    // });
    return Promise.reject(error);
  }
);

export default app;