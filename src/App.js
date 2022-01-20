import React, { Component } from 'react';
import styled from 'styled-components';
import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import Modal from './components/Modal';
import Loader from './components/Loader';
import Button from './components/Button';
// import toast, { Toaster } from 'react-hot-toast';
// import { TailSpin } from 'react-loader-spinner';
import axios from 'axios';

const AppWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  padding-bottom: 24px;
`;

const ErrorMessage = styled.p`
  text-align: center;
  margin-top: 50px;

  font-size: 19px;
  font-weight: bold;
  margin: 40px 0 20px;
`;

axios.defaults.baseURL = 'https://pixabay.com/api';
const KEY = '24296481-49f21b132d362d0e842f769a1';
const URI = `/?key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`;

export default class App extends Component {
  state = {
    images: [],
    page: 1,
    serchTerm: '',
    showModal: false,
    largeImageURL: '',
    status: 'idle',
  };

  setSerchTerm = serchTerm => {
    this.setState({ serchTerm });
  };

  onLargeImgClick = ({ largeImageURL }) => {
    this.setState({ largeImageURL: largeImageURL });
  };

  onToggleModal = img => {
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      largeImageURL: img,
    }));
  };

  onLoadMoreButton = async () => {
    const { page, serchTerm } = this.state;
    const res = await axios.get(`${URI}&q=${serchTerm}&page=${page}`);
    const newArray = res.data.hits;
    this.setState(prevState => {
      return {
        images: [...prevState.images, ...newArray],
        page: prevState.page + 1,
      };
    });

    this.handleScroll();
  };

  handleScroll = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 500);
  };

  async componentDidMount() {}

  async componentDidUpdate(_, prevState) {
    const { serchTerm } = this.state;

    if (prevState.serchTerm !== serchTerm) {
      this.setState({ images: [], page: 1, status: 'pending' });

      const res = await axios.get(`${URI}&q=${serchTerm}&page=1`);
      if (res.data.hits.length < 1) {
        this.setState({ status: 'rejected' });
        // toast.error('По вашему запросу ничего не найдно, введите другой запрос');
        return;
      }
      this.setState(prevState => {
        return {
          images: res.data.hits,
          page: prevState.page + 1,
          status: 'resolved',
        };
      });
      return;
    }
  }

  render() {
    const { images, status } = this.state;

    if (status === 'idle') {
      return <Searchbar onSubmit={this.setSerchTerm} />;
    }

    if (status === 'pending') {
      return <Loader />;
    }

    if (status === 'rejected') {
      return (
        <>
          <Searchbar onSubmit={this.setSerchTerm} />
          <ErrorMessage>Whoops, something went wrong! Please enter a valid request</ErrorMessage>
        </>
      );
    }

    if (status === 'resolved') {
      return (
        <AppWrapper>
          <Searchbar onSubmit={this.setSerchTerm} />
          {this.state.showModal && (
            <Modal onCloseModal={this.onToggleModal}>
              <img src={this.state.largeImageURL} alt="" />
            </Modal>
          )}
          <ImageGallery
            images={images}
            onOpenModal={this.onToggleModal}
            onLargeImgClick={this.onLargeImgClick}
          />
          <Button name={'Load more'} onLoadMoreButton={this.onLoadMoreButton} />
        </AppWrapper>
      );
    }
  }
}
