import { fetchImages } from './fetchImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import InfiniteAjaxScroll from '@webcreate/infinite-ajax-scroll';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

const throttle = require('lodash.throttle');

let page = 1;
let currentQuery;

let lastImage;

const gallery = document.querySelector('.gallery-content');
const searchForm = document.querySelector('.search-form');
const loadMoreButton = document.querySelector('.load-more');
// const infScrollButton = document.querySelector('.infScroll');
const trigger = document.querySelector('.pagination');

// infScrollButton.addEventListener('click', () => {
//   infScroll = new InfiniteScroll(document.body, {
//     // options
//     path: '.pagination__next',
//     append: '.gallery-item',
//     status: '.scroller-status',
//     history: false,
//     scrollThreshold: 100,
//   });
//   infScroll.pageIndex = 1;

//   console.log(infScroll);

//   infScroll.on('scrollThreshold', scrolling);
// });

// window.addEventListener('load', () => {
//   trigger.style.visibility = 'hidden';
// });

// trigger.style.visibility = 'hidden';
lv.updateBar(type, barElement, newValue, maxValue);

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  gallery.innerHTML = '';
  page = 1;

  const searchInputvalue = e.currentTarget.querySelector('input').value;

  currentQuery = e.currentTarget.querySelector('input').value;

  window.removeEventListener('scroll', handler);

  try {
    trigger.style.visibility = 'visible';
    const data = await fetchImages(searchInputvalue, page);
    console.log(data);
    if (data.hits.length !== 0) {
      renderGallery(data.hits);
      lastImage = gallery.lastChild;
      trigger.style.visibility = 'hidden';
      window.addEventListener('scroll', handler);
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

async function scrolling() {
  page += 1;
  console.log('it works');

  try {
    const data = await fetchImages(currentQuery, page);

    if (data.hits.length !== 0) {
      renderGallery(data.hits);
      window.scrollBy({
        top: 300 * 2,
        behavior: 'smooth',
      });
      return;
    }
    window.removeEventListener('scroll', handler);
    Notiflix.Notify.warning(
      'Sorry, these are the last images matching your search query. Please try to search something else.'
    );
  } catch (error) {
    console.log(error);
    window.removeEventListener('scroll', handler);
  }
}

// observer.observe(trigger);
const handler = throttle(function () {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 500
  ) {
    scrolling();
  }
}, 1000);

window.addEventListener('scroll', handler);

function scrollDetect() {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 500
  ) {
    scrolling();
  }
}

const { height: cardHeight } = document
  .querySelector('.gallery-content')
  .firstElementChild.getBoundingClientRect();
