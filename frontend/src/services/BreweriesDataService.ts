import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

class BreweriesDataService {
  getAll(page = 0) {
    return axios.get(
      `${BACKEND_URL}/api/v1/breweries?pageNumber=${page}`,
    );
  }
  get(id: string) {
    return axios.get(`${BACKEND_URL}/api/v1/breweries/id/${id}`);
  }
  find(query: string, by = "name") {
    return axios.get(
      `${BACKEND_URL}/api/v1/breweries?${by}=${query}`,
    );
  }
  getCommentsByBreweryId(id: string) {
    return axios.get(
      `${BACKEND_URL}/api/v1/breweries/id/${id}/comments`,
    );
  }
  createComment(data: unknown) {
    return axios.post(
      `${BACKEND_URL}/api/v1/breweries/comment`,
      data,
    );
  }
  updateComment(data: unknown) {
    return axios.put(
      `${BACKEND_URL}/api/v1/breweries/comment`,
      data,
    );
  }
  deleteComment(id: string, userId: string) {
    return axios.delete(
      `${BACKEND_URL}/api/v1/breweries/comment`,
      { data: { comment_id: id, userId: userId } },
    );
  }
}

const breweriesService = new BreweriesDataService();
export default breweriesService;
