/**
 * @author Siddhant Bahuguna
 *
 * @description collection.service is intended to get and post data to its
 * respective microservice
 */

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SyncMsService {
  /**
   * @description Microservice
   * @param {string} url Url value
   * @param {object} payload Payload
   * @param {object} header set header object for call api
   */
  post = (url, payload, header): Promise<{ data }> => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: url,
        headers: header,
        data: payload,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          resolve(error.response);
        });
    });
  };
  /**
   * @description Put method
   * @param {string} url Url value
   * @param {object} payload Payload
   * @param {object} header set header object for call api
   */
  put = (url, payload, header) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'PUT',
        url: url,
        headers: header,
        data: payload,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          resolve(error.response);
        });
    });
  };
  /**
   * @description Put method
   * @param {string} url Url value
   * @param {object} payload Payload
   * @param {object} header set header object for call api
   */
  get = (url, payload, header) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: url,
        headers: header,
        data: payload,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          resolve(error.response);
        });
    });
  };
  /**
   * @description Put method
   * @param {string} url Url value
   * @param {object} payload Payload
   * @param {object} header set header object for call api
   */
  delete = (url, payload, header) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'DELETE',
        url: url,
        headers: header,
        params: payload,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          resolve(error.response);
        });
    });
  };
}
