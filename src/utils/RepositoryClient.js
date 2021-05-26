import base64 from 'base-64';
import { GATEWAY_URL } from '../env';
export default class RepositoryClient {
  static oaiPmhRequest = async (uri) => {
    const BASE_URL = `${GATEWAY_URL}/oai/`;
    try {
      const response = await fetch(BASE_URL + uri);
      return response.text();
    } catch (error) {
      return "<xml><user_message>Ocurrió un error</user_message></xml>"
    }
  }

  static openSearchRequest = async (uri) => {
    const BASE_URL = `${GATEWAY_URL}/open-search/discover`;
    try {
      const response = await fetch(BASE_URL + uri);
      return response.text();
    } catch (error) {
      return "<xml><user_message>Ocurrió un error</user_message></xml>"
    }
  }

  static sruRequest = async (uri) => {
    const BASE_URL = `${GATEWAY_URL}/sru`;
    try {
      const response = await fetch(BASE_URL + uri);
      return response.text();
    } catch (error) {
      return "<xml><user_message>Ocurrió un error</user_message></xml>"
    }
  }

  static swordRequest = async (user, pass) => {
    const BASE_URL = `${GATEWAY_URL}/swordv2`;
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + base64.encode(user + ":" + pass));
    const uri = "/servicedocument";
    try {
      const response = await fetch(BASE_URL + uri, {
        method: "GET",
        headers: headers
      });
      if ((response.status === 401) || (response.status === 403)) {
        return "Unauthorized"
      }
      return response.text();
    } catch (error) {
      return "<xml><user_message>Ocurrió un error</user_message></xml>"
    }
  }

  static swordStepOne = async (user, pass, collection, entry, obo = "") => {
    const BASE_URL = `${GATEWAY_URL}/swordv2`;
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + base64.encode(user + ":" + pass));
    if (obo !== "") {
      headers.set("On-Behalf-Of", obo);
    }
    headers.set("In-Progress", "true");
    headers.set("Content-Type", "application/atom+xml;type=entry"); 
    try {
      const response = await fetch(`${BASE_URL}/collection/${collection}`, {
        method: "POST",
        headers: headers,
        body: entry
      });
      if ((response.status === 401) || (response.status === 403)) {
        return "Unauthorized"
      }
      return response.text();
    } catch (error) {
      return "<xml><user_message>Ocurrió un error</user_message></xml>"
    }
  }

  static swordStepTwo = async (user, pass, edit_iri, obo = "") => {
    const BASE_URL = `${GATEWAY_URL}/swordv2`;
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + base64.encode(user + ":" + pass));
    headers.set("Content-Length", 0);
    headers.set("In-Progress", "false");
    if (obo !== "") {
      headers.set("On-Behalf-Of", obo);
    }
    try {
      const response = await fetch(`${BASE_URL}/edit/${edit_iri}`, {
        method: "POST",
        headers: headers
      });
      if ((response.status === 401) || (response.status === 403)) {
        return "Unauthorized"
      }
      if (response.status === 400){
        return "Bad Request";
      }
      return response.text();
    } catch (error) {
      return "<xml><user_message>Ocurrió un error</user_message></xml>"
    }
  }

  static restRequest = async (uri, handle) => {
    const BASE_URL = "http://localhost:8000/rest";
    try {
      const response = await fetch(BASE_URL + uri + "/" + handle + "?expand=metadata");
      return response.text();
    } catch (error) {
      return "<xml><user_message>Ocurrió un error</user_message></xml>"
    }
  }
}