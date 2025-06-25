import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import EncryptStorage from 'encrypt-storage';

interface UserInfo {
  token: string;
  // Add other user info properties here if needed
}

const fetchApi = (type: string = ""): AxiosInstance => {
  const encryptStorage = new EncryptStorage(process.env.REACT_APP_SECRET_KEY as string);
  const baseURL = process.env.REACT_APP_SERVICE as string;

  // Get Token
  const userInfo: UserInfo | null = encryptStorage.getItem("___info");
  const accessToken: string = userInfo?.token || "";

  const api: AxiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Access-Control-Allow-Origin": true,
      "Access-Control-Allow-Credentials": true,
      "Accept-Language": "en",
    },
  });

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (type === "auth") {
        return Promise.reject(error);
      } else {
        if (error?.response?.status === 403) {
          // Token Expired
          encryptStorage.clear();
          localStorage.clear();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    }
  );

  return api;
};

export default fetchApi;