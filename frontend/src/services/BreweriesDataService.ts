import axios from "axios";

import type { AxiosResponse } from "axios";

import type { BreweriesResponse, Brewery, Comment } from "../types";

const REACT_APP_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const getAll = async (page = 0): Promise<AxiosResponse<BreweriesResponse>> =>
  axios.get(`${REACT_APP_BACKEND_URL}/api/v1/breweries?pageNumber=${page}`);

const get = async (id: string): Promise<AxiosResponse<Brewery>> =>
  axios.get(`${REACT_APP_BACKEND_URL}/api/v1/breweries/${id}`);

const find = async (
  query: string,
  by = "name",
): Promise<AxiosResponse<BreweriesResponse>> => {
  if (!query || query.trim() === "") {
    return getAll();
  }
  return axios.get(
    `${REACT_APP_BACKEND_URL}/api/v1/breweries?${by}=${encodeURIComponent(query)}`,
  );
};

const getCommentsByBreweryId = async (
  id: string,
): Promise<AxiosResponse<Comment[]>> =>
  axios.get(`${REACT_APP_BACKEND_URL}/api/v1/breweries/${id}/comments`);

const createComment = async (data: {
  brewery_id: string;
  name: string;
  user_id: string;
  text: string;
}): Promise<AxiosResponse<{ status: string }>> =>
  axios.post(`${REACT_APP_BACKEND_URL}/api/v1/breweries/comment`, data);

const updateComment = async (data: {
  comment_id: string;
  user_id: string;
  text: string;
}): Promise<AxiosResponse<{ status: string }>> =>
  axios.put(`${REACT_APP_BACKEND_URL}/api/v1/breweries/comment`, data);

const deleteComment = async (
  id: string,
  userId: string,
): Promise<AxiosResponse<{ status: string }>> =>
  axios.delete(`${REACT_APP_BACKEND_URL}/api/v1/breweries/comment`, {
    data: { comment_id: id, user_id: userId },
  });

export default {
  getAll,
  get,
  find,
  getCommentsByBreweryId,
  createComment,
  updateComment,
  deleteComment,
};
