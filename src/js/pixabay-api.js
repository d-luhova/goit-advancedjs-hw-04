import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export const fetchPhotosByQuery = async (searchedQuery, currentPage) => {
    const requestParams = new URLSearchParams({
        q: searchedQuery,
        per_page: 15,
        page: currentPage,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        key: '50720550-abdb0a32f459975af0b381b86',
    });

    const response = await axios.get('', { params: requestParams });
    return response.data;
};