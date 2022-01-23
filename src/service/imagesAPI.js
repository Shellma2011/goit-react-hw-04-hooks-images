import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';
const KEY = '24296481-49f21b132d362d0e842f769a1';
const URI = `/?key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`;

export const getImages = async (serchTerm, page) => {
  const response = await axios.get(`${URI}&q=${serchTerm}&page=${page}`);
  return response.data;
};

export default getImages;
