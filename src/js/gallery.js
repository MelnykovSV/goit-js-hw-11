import { fetchImages } from './fetchImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const throttle = require('lodash.throttle');

let page = 1;
let currentQuery;

const gallery = document.querySelector('.gallery-content');
const searchForm = document.querySelector('.search-form');
const loadMoreButton = document.querySelector('.load-more');
const trigger = document.querySelector('.lds-roller');
const handler = throttle(function () {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 500
  ) {
    scrolling();
  }
}, 1000);

// window.addEventListener('scroll', handler);

const lightboxGallery = new SimpleLightbox('.gallery-content a', {
  captionsData: 'alt',
  captionDelay: 250,
});

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  gallery.innerHTML = '';
  page = 1;

  const searchInputvalue = e.currentTarget.querySelector('input').value;

  currentQuery = e.currentTarget.querySelector('input').value;
  window.addEventListener('scroll', handler);

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

///More images on click

loadMoreButton.addEventListener('click', async e => {
  e.preventDefault();
  trigger.classList.remove('visually-hidden');
  page += 1;
  try {
    const data = await fetchImages(currentQuery, page);

    if (data.hits.length !== 0) {
      renderGallery(data.hits);
      trigger.classList.add('visually-hidden');
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

  lightboxGallery.refresh();
}

async function scrolling() {
  page += 1;
  trigger.classList.remove('visually-hidden');
  window.removeEventListener('scroll', handler);

  try {
    const data = await fetchImages(currentQuery, page);

    if (data.hits.length !== 0) {
      renderGallery(data.hits);
      window.scrollBy({
        top: 300 * 2,
        behavior: 'smooth',
      });
      trigger.classList.add('visually-hidden');
      window.addEventListener('scroll', handler);
      return;
    }
    window.removeEventListener('scroll', handler);
    Notiflix.Notify.warning(
      'Sorry, these are the last images matching your search query. Please try to search something else.'
    );
  } catch (error) {
    console.log(error);

    trigger.classList.add('visually-hidden');

    window.removeEventListener('scroll', handler);
  }
}
