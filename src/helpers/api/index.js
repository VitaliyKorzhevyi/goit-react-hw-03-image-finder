import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function fetchImages(value, page = 1) {
  const searchParams = new URLSearchParams({
    key: `33064708-e869c07a3c852e671a2fdaacb`,
    image_type: 'photo',
    orientation: 'horizontal',
    page,
    per_page: 12,
    q: value,
  });

  const response = await axios.get(`?${searchParams}`);
  return response.data;
}


// async componentDidUpdate(_, prevState) {
//   try {
//     const { search, currentPage } = this.state;
//     const prevSearch = prevState.search;
//     const prevPage = prevState.currentPage;

//     console.log("поточний пошук:",  search);
//     console.log("поточна сторінка:",  currentPage);
//     console.log("попередній пошук:",  prevSearch);
//     console.log("попередня сторінка:",  prevPage);
    
//     if (prevSearch !== search || prevPage !== currentPage) {
//       // this.setState({ status: 'pending' });
//       this.setState({
//         status: 'pending',
//         // currentPage: 1,
//         currentScoreImages: 0,
//       });

//       const { hits, totalHits } = await fetchImages(search, currentPage);
//       this.setState({
//         images: [...prevState.images, ...hits],
//         totalHits,
//         status: 'resolve',
//       });

//       if (hits.length === 0) { //Ok
//         toast.info(`on request ${search} Nothing found`);
//       }
//     }

//   } catch (error) {
//     this.setState({ status: 'reject' });
//     toast.error('ooops something went wrong');
//   }
// }