import axios from 'axios';

const axiosConfig = {};
const defaultAxiosConfigHeader = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const getAxiosConfigOptions = (config) => {
  if (config && config.headers)
    Object.assign(defaultAxiosConfigHeader.headers, config.headers);

  return defaultAxiosConfigHeader;
};

export const httpGet = async (url, config = axiosConfig) => {
  try {
    const response = await axios.get(url, getAxiosConfigOptions(config));
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

export const httpPost = async (url, data = null, config = axiosConfig) => {
  try {
    const response = await axios.post(url, data, getAxiosConfigOptions(config));
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
