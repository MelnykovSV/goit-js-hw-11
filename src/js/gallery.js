import { fetchImages } from './fetchImages';
import { renderGallery } from './renderGallery';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

import { testFunc } from './scrolling';

// let page = 1;
let currentQuery;
// let totalPages;

const throttle = require('lodash.throttle');
export const gallery = document.querySelector('.gallery-content');
const searchForm = document.querySelector('.search-form');
// const spinner = document.querySelector('.lds-roller');

//Detects scrolling to the end of the page

// ===============================REPLACE===============================
global.page = 1;
export let totalPages;
export const spinner = document.querySelector('.lds-roller');

// function testFunc1(pag) {
//   pag += 1;
//   console.log(pag);
//   return pag
// }

// function testFunc() {
//   console.log(page);
//   page += 1;
//   console.log(page);
// }

testFunc();
// console.log(page);
testFunc();
// console.log(page);

const infiniteScrollHandler = throttle(function () {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 300
  ) {
    scrolling();
  }
}, 1000);

async function scrolling() {
  page += 1;

  spinner.classList.remove('visually-hidden');
  window.removeEventListener('scroll', infiniteScrollHandler);

  //fires if fetch results in non-empty array
  try {
    const data = await fetchImages(currentQuery, page);

    if (data.hits.length !== 0) {
      renderGallery(data.hits);
      window.scrollBy({
        top: 200 * 2,
        behavior: 'smooth',
      });
      spinner.classList.add('visually-hidden');

      if (page === totalPages) {
        Notiflix.Notify.warning(
          'Sorry, these are the last images matching your search query. Please try to search something else.'
        );
        return;
      }

      window.addEventListener('scroll', infiniteScrollHandler);
      return;
    }
  } catch (error) {
    console.log(error);

    spinner.classList.add('visually-hidden');

    window.removeEventListener('scroll', infiniteScrollHandler);
  }
}

// ===============================REPLACE===============================

///First pack of images

searchForm.addEventListener('submit', async e => {
  e.preventDefault();

  currentQuery = e.currentTarget.querySelector('input').value.trim();

  if (!currentQuery) {
    Notiflix.Notify.failure('Enter valid value!');
    return;
  }

  window.removeEventListener('scroll', infiniteScrollHandler);
  gallery.innerHTML = '';
  page = 1;

  e.currentTarget.reset();

  try {
    const data = await fetchImages(currentQuery, page);

    if (data.hits.length !== 0) {
      renderGallery(data.hits);
      window.addEventListener('scroll', infiniteScrollHandler);

      if (data.totalHits >= 500) {
        /// 500-519 hits

        if (data.total.length < 520) {
          totalPages = Math.ceil(data.total.length / 40);
          Notiflix.Notify.success(
            `Hooray! We found ${data.total.length} images.`
          );
          return;
        }

        /// 520+ hits

        totalPages = 13;
        Notiflix.Notify.success(`Hooray! We found 520 images.`);
        return;
      }

      /// 1-499 hits

      totalPages = Math.ceil(data.totalHits / 40);
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      return;
    }

    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } catch (error) {
    console.log(error);
  }
});
