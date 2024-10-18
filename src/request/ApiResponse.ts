import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiResponse<T> {
  code: string;
  message: string;
  result: T;
}

const apiRequest = async <T>(
  method: 'GET' | 'POST',
  url: string,
  data?: any, // POST 요청 시 보낼 데이터
  headers?: Record<string, string> // 추가 헤더
): Promise<ApiResponse<T>> => {
  try {
    const baseUrl = "http://localhost:8080";
    url = baseUrl + url;

    const config: AxiosRequestConfig = {
      method,
      url,
      headers,
    };

    // GET 요청인 경우 URL에 데이터 추가
    if (method === 'GET' && data) {
      const params = new URLSearchParams(data).toString();
      config.url += `?${params}`;
    } else if (method === 'POST' && data) {
      config.data = data; // POST 데이터 추가
    }

    const response: AxiosResponse<ApiResponse<T>> = await axios(config);
    return response.data; // 응답 데이터 반환
  } catch (error) {
    // 에러 처리
    console.error('API 요청 실패:', error);
    throw error; // 에러를 호출한 곳으로 전달
  }
};

export default apiRequest;
