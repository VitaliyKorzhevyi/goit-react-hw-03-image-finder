import { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ToastContainer, toast } from 'react-toastify';
import { fetchImages } from '../helpers/api/index';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { AppWrap } from './App.styled';
import 'react-toastify/dist/ReactToastify.css';

export class App extends Component {
  state = {
    images: [],
    search: '',
    currentPage: 1,
    currentImage: '',
    currentScoreImages: 0,
    totalHits: 0,
    status: 'idle',
    showModal: false,
  };

  async componentDidMount() {
    try {
      this.setState({ status: 'pending' });

      const { search } = this.state;

      const { hits, totalHits } = await fetchImages(search);

      this.setState({
        images: hits,
        totalHits,
        status: 'resolve',
      });
    } catch (error) {
      this.setState({ status: 'reject' });
      toast.error('ooops something went wrong');
    }
  }

  async componentDidUpdate(_, prevState) {
    try {
      const { search, currentPage } = this.state;
      const prevSearch = prevState.search;
      const prevPage = prevState.currentPage;

      if (prevSearch !== search || prevPage !== currentPage) {
        const { hits } = await fetchImages(search, currentPage);
        this.setState({
          status: 'pending',
          currentScoreImages: 0,
        });

        this.setState(prevState => ({
          images: [...new Map([...prevState.images, ...hits].map(image => [image.id, image])).values()],
          status: 'resolve',
        }));

        if (hits.length === 0) {
          toast.info(`on request ${search} Nothing found`);
        }
      }
    } catch (error) {
      this.setState({ status: 'reject' });
      toast.error('ooops something went wrong');
    }
  }

  handleSearchValue = (value, { resetForm }) => {
    this.setState({ search: value.search, currentPage: 1, images: [] });

    resetForm();
  };

  handleNextPageClick = () => {
    this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
  };

  handleCurrentImgClick = evt => {
    this.setState({ currentImage: evt, showModal: true });
  };

  handleModalClose = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { images, status, showModal, currentImage, totalHits } = this.state;
    const currentScoreImages = images.length;

    return (
      <AppWrap>
        <Searchbar onSubmit={this.handleSearchValue} />
        <ImageGallery imgList={images} onClick={this.handleCurrentImgClick} />

        {status === 'pending' && <Loader />}

        {status === 'resolve' && currentScoreImages < totalHits && (
          <Button onClick={this.handleNextPageClick} />
        )}

        {showModal && (
          <Modal
            image={currentImage}
            handleModalClose={this.handleModalClose}
          />
        )}

        <ToastContainer />
      </AppWrap>
    );
  }
}
