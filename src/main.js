import { createGalleryCardTemplate } from './js/render-functions';
import { fetchPhotosByQuery } from './js/pixabay-api';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchForm: document.querySelector('.js-search-form'),
    gallery: document.querySelector('.js-gallery'),
    loader: document.querySelector('.js-loader'),
    loadMoreBtn: document.querySelector('.js-load-more'),
};

let currentPage = 1;
let searchedQuery = '';
let totalPages = 0;

const lightbox = new SimpleLightbox('.js-gallery a');

const onSearchFormSubmit = async event => {
    try {
        event.preventDefault();
        const { target: searchForm } = event;
        searchedQuery = searchForm.elements.user_query.value.trim();

        if (!searchedQuery) {
            return;
        }

        currentPage = 1;
        refs.loader.classList.add('active');
        refs.gallery.innerHTML = '';
        refs.loadMoreBtn.classList.add('is-hidden');
        refs.loadMoreBtn.removeEventListener('click', onLoadMoreBtnClick);

        const data = await fetchPhotosByQuery(searchedQuery, currentPage);
        refs.loader.classList.remove('active');

        if (data.totalHits === 0 || data.hits.length === 0) {
            iziToast.error({
                title: 'Error',
                message: 'Sorry, there are no images matching your search query. Please try again!',
            });
            refs.gallery.innerHTML = '';
            return;
        }

        totalPages = Math.ceil(data.totalHits / 15);

        const galleryCardsTemplate = data.hits
            .map(pictureInfo => createGalleryCardTemplate(pictureInfo))
            .join('');

        refs.gallery.innerHTML = galleryCardsTemplate;

        lightbox.refresh();

        if (currentPage < totalPages) {
            refs.loadMoreBtn.classList.remove('is-hidden');
            refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
        } else {
            iziToast.info({
                title: 'Info',
                message: "We're sorry, but you've reached the end of search results.",
            });
        }
    } catch (err) {
        console.log(err);
    }
};

refs.searchForm.addEventListener('submit', onSearchFormSubmit);

const onLoadMoreBtnClick = async () => {
    try {
        currentPage++;

        const data = await fetchPhotosByQuery(searchedQuery, currentPage);

        const galleryCardsTemplate = data.hits
            .map(pictureInfo => createGalleryCardTemplate(pictureInfo))
            .join('');

        refs.gallery.insertAdjacentHTML('beforeend', galleryCardsTemplate);

        lightbox.refresh();
        const { height: cardHeight } = document.querySelector('.js-gallery li').getBoundingClientRect();
        window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
        });

        if (currentPage >= totalPages) {
            refs.loadMoreBtn.classList.add('is-hidden');
            refs.loadMoreBtn.removeEventListener('click', onLoadMoreBtnClick);
            iziToast.info({
                title: 'Info',
                message: "We're sorry, but you've reached the end of search results.",
            });
        }
    } catch (err) {
        console.log(err);
    }
};