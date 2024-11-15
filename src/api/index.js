import axios from "axios";

/**
 * Fetches all data from the specified URL.
 *
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise} A promise resolving to the response data or an error object.
 */
export const getAllData = async (url) => {
  try {
    const response = await axios.get(url);
    console.log(response);
    return response;
  } catch (err) {
    const errorMessage = err.message;
    return { errorMessage };
  }
};

/**
 * Adds new data to the specified URL.
 *
 * @param {string} url - The URL to post data to.
 * @param {FormData} data - The data to be added.
 * @param {object} [config] - Optional axios config.
 * @returns {Promise} A promise resolving to the response data or an error object.
 */
export const addData = async (url, data, config) => {
  try {
    const response = await axios.post(url, data, config);
    return response;
  } catch (err) {
    const errorMessage = err.message;
    return { errorMessage,err };
  }
};

/**
 * Edits existing data at the specified URL.
 *
 * @param {string} url - The URL to put data to.
 * @param {FormData} data - The data to be updated.
 * @returns {Promise} A promise resolving to the response data or an error object.
 */
export const editData = async (url, data) => {
  try {
    const response = await axios.put(url, data);
    return response;
  } catch (err) {
    const errorMessage = err.message;
    return { errorMessage };
  }
};

/**
 * Deletes data by ID at the specified URL.
 *
 * @param {string} url - The URL to post the deletion request to.
 * @param {string} _id - The ID of the data to be deleted.
 * @returns {Promise} A promise resolving to the response data or an error object.
 */
export const deleteData = async (url, _id) => {
  try {
    const response = await axios.post(url, { _id });
    return response;
  } catch (err) {
    const errorMessage = err.message;
    return { errorMessage };
  }
};

/**
 * Authenticates a user login request.
 *
 * @param {string} url - The URL to post the login request to.
 * @param {object} data - The login credentials.
 * @param {object} [config] - Optional axios config.
 * @returns {Promise} A promise resolving to the response data or an error object.
 */
export const authLogin = async (url, data, config) => {
  try {
    const response = await axios.post(url, data, config);
    return response;
  } catch (err) {
    const errorMessage = err.message;
    return { errorMessage };
  }
};


