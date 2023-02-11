import { fetchImages } from './fetchImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

let page = 1;
let currentQuery;

const gallery = document.querySelector('.gallery-content');
const searchForm = document.querySelector('.search-form');
const loadMoreButton = document.querySelector('.load-more');

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  gallery.innerHTML = '';
  page = 1;

  const searchInputvalue = e.currentTarget.querySelector('input').value;

  currentQuery = e.currentTarget.querySelector('input').value;

  try {
    const data = await fetchImages(searchInputvalue, page);
    if (data.hits.length !== 0) {
      renderGallery(data.hits);
      return;
    }
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } catch (error) {
    console.log(error);
  }
});

loadMoreButton.addEventListener('click', async e => {
  e.preventDefault();
  page += 1;
  try {
    const data = await fetchImages(currentQuery, page);

    if (data.hits.length !== 0) {
      renderGallery(data.hits);
      return;
    }
    Notiflix.Notify.warning(
      'Sorry, these are the last images matching your search query. Please try to search something else.'
    );
  } catch (error) {
    console.log(error);
  }
});

//renders gallery

function renderGallery(arrayOfObjects) {
  const listArray = arrayOfObjects.map(item => {
    const listData = {};
    listData.webformatURL = item.webformatURL;
    listData.largeImageURL = item.largeImageURL;
    listData.alt = item.tags;
    listData.likes = item.likes;
    listData.views = item.views;
    listData.comments = item.comments;
    listData.downloads = item.downloads;
    return listData;
  });

  const markup = listArray
    .map(item => {
      return `<a href="${item.largeImageURL}" class="photo-card gallery-item" data-capture="${item.tags}"><div class="photo-card__thumb"><img src="${item.webformatURL}" alt="${item.alt}" loading="lazy" width="320" height="220" data-largeImageURL='${item.largeImageURL}'/></div>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${item.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${item.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${item.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${item.downloads}
        </p>
      </div>
    </a>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  const lightboxGallery = new SimpleLightbox('.gallery-content a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}
