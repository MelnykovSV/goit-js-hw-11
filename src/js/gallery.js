import { fetchImages } from './fetchImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

let page = 1;
let currentQuery;

const throttle = require('lodash.throttle');
const gallery = document.querySelector('.gallery-content');
const searchForm = document.querySelector('.search-form');
// const loadMoreButton = document.querySelector('.load-more');
const trigger = document.querySelector('.lds-roller');
const lightboxGallery = new SimpleLightbox('.gallery-content a', {
  captionsData: 'alt',
  captionDelay: 250,
});

//Detects scrolling to the end of the page

const infiniteScrollHandler = throttle(function () {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 300
  ) {
    scrolling();
  }
}, 1000);

///First pack of images

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  window.removeEventListener('scroll', infiniteScrollHandler);
  gallery.innerHTML = '';
  page = 1;

  const searchInputvalue = e.currentTarget.querySelector('input').value;

  currentQuery = e.currentTarget.querySelector('input').value;

  try {
    const data = await fetchImages(searchInputvalue, page);
    if (data.hits.length !== 0) {
      renderGallery(data.hits);
      console.log(data.totalHits);
      totalHits = data.totalHits;
      window.addEventListener('scroll', infiniteScrollHandler);
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

// loadMoreButton.addEventListener('click', async e => {
//   e.preventDefault();
//   trigger.classList.remove('visually-hidden');
//   page += 1;
//   try {
//     const data = await fetchImages(currentQuery, page);

//     if (data.hits.length !== 0) {
//       renderGallery(data.hits);
//       trigger.classList.add('visually-hidden');
//       return;
//     }
//     Notiflix.Notify.warning(
//       'Sorry, these are the last images matching your search query. Please try to search something else.'
//     );
//   } catch (error) {
//     console.log(error);
//   }
// });

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

  //Checking for maximum pages number
  if (page === 14) {
    Notiflix.Notify.warning(
      'Sorry, these are the last images matching your search query. Please try to search something else.'
    );
    window.removeEventListener('scroll', infiniteScrollHandler);
    return;
  }

  trigger.classList.remove('visually-hidden');
  window.removeEventListener('scroll', infiniteScrollHandler);

  //fires if fetch results in non-blank array
  try {
    const data = await fetchImages(currentQuery, page);

    if (data.hits.length !== 0) {
      renderGallery(data.hits);
      console.log(data.hits.length);
      Notiflix.Notify.success(`Hooray! We found ${data.hits.length} images.`);
      window.scrollBy({
        top: 200 * 2,
        behavior: 'smooth',
      });
      trigger.classList.add('visually-hidden');
      window.addEventListener('scroll', infiniteScrollHandler);
      return;
    }

    //fires if fetch results in blank array
    window.removeEventListener('scroll', infiniteScrollHandler);
    trigger.classList.add('visually-hidden');
    Notiflix.Notify.warning(
      'Sorry, these are the last images matching your search query. Please try to search something else.'
    );
  } catch (error) {
    //fires in case of error

    console.log(error);

    trigger.classList.add('visually-hidden');

    window.removeEventListener('scroll', infiniteScrollHandler);
  }
}
