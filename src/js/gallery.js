import { fetchImages } from './fetchImages';
import { renderGallery } from './renderGallery';
// import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

let page = 1;
let currentQuery;
let totalPages;

const MAX_PAGES = 13;
const throttle = require('lodash.throttle');
export const gallery = document.querySelector('.gallery-content');
const searchForm = document.querySelector('.search-form');
const spinner = document.querySelector('.lds-roller');

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
      if (data.totalHits >= 500) {
        if (data.total.length < 520) {
          // foundPicsNumber = data.total.length;
          renderGallery(data.hits);
          console.log(data);
          window.addEventListener('scroll', infiniteScrollHandler);
          totalPages = Math.ceil(data.total.length / 40);
          console.log(`Total pages: ${totalPages}`);
          Notiflix.Notify.success(
            `Hooray! We found ${data.total.length} images.`
          );
          return;
        }
        // foundPicsNumber = 520;
        renderGallery(data.hits);
        console.log(data);
        window.addEventListener('scroll', infiniteScrollHandler);
        totalPages = 13;
        console.log(`Total pages: ${totalPages}`);
        Notiflix.Notify.success(`Hooray! We found 520 images.`);
        return;
      }

      // foundPicsNumber = data.hits.length;
      renderGallery(data.hits);
      console.log(data);
      console.log(data.totalHits);
      window.addEventListener('scroll', infiniteScrollHandler);
      totalPages = Math.ceil(data.totalHits / 40);
      console.log(`Total pages: ${totalPages}`);
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

async function scrolling() {
  console.log(page);
  page += 1;
  console.log(page);

  //Checking for maximum pages number

  spinner.classList.remove('visually-hidden');
  window.removeEventListener('scroll', infiniteScrollHandler);

  //fires if fetch results in non-empty array
  try {
    const data = await fetchImages(currentQuery, page);

    if (data.hits.length !== 0) {
      renderGallery(data.hits);
      // Notiflix.Notify.success(`Hooray! We found ${data.hits.length} images.`);
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
