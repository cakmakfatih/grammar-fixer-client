import axios, { AxiosInstance, HttpStatusCode } from "axios";
import { ApiGrammarResponse } from "../core/types";

interface ApiService {
  checkGrammar(msg: string): Promise<ApiGrammarResponse | null>;
}

class ApiServiceImpl implements ApiService {
  #httpClient: AxiosInstance;

  constructor() {
    this.#httpClient = axios.create({
      baseURL: "http://localhost:3000",
    });
  }

  async checkGrammar(msg: string): Promise<ApiGrammarResponse | null> {
    const response = await this.#httpClient<ApiGrammarResponse>({
      url: "/api/v1/grammar-check",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        input: msg,
      },
    });

    if (response.status !== HttpStatusCode.Ok) {
      return null;
    }

    return response.data;
  }
}

const apiService = new ApiServiceImpl();

export { apiService };
