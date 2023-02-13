import { Loading } from 'notiflix/build/notiflix-loading-aio';
export async function fetchImages(valueToSearch, page) {
  const response = await fetch(
    `https://pixabay.com/api/?key=33543328-1e01a52b77697b8d064c91a7e&q=${valueToSearch}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  // Loading.standard();
  if (!response.ok) {
    throw new Error(response.status);
  }
  return response.json();
}
