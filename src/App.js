import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import Modal from './components/Modal';
import Loader from './components/Loader';
import Button from './components/Button';
import getImages from './service/imagesAPI';

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

export default function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [serchTerm, setSerchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);

  const setChangeSerchTerm = serchTerm => {
    setSerchTerm(serchTerm);
  };

  const onLargeImgClick = largeImageURL => {
    setLargeImageURL(largeImageURL);
  };

  const onToggleModal = img => {
    setShowModal(!showModal);
    setLargeImageURL(img);
  };

  const onLoadMoreButton = () => {
    getImages(serchTerm, page).then(data => {
      setImages(prevState => [...prevState, ...data.hits]);
      setPage(prevState => prevState + 1);
    });
    handleScroll();
  };

  const handleScroll = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 500);
  };

  useEffect(() => {
    if (serchTerm === '') {
      setStatus('pending');
    }

    const fetchImages = async () => {
      setPage(1);
      await getImages(serchTerm, 1).then(data => {
        if (data.total < 1) {
          setStatus('rejected');
          return;
        }
        setData(data.totalHits);
        setImages(data.hits);
        setPage(prevState => prevState + 1);
        setStatus('resolved');
      });
    };
    fetchImages();
  }, [serchTerm]);

  if (status === 'idle') {
    return <Searchbar onSubmit={setChangeSerchTerm} />;
  }

  if (status === 'pending') {
    return <Loader />;
  }

  if (status === 'rejected') {
    return (
      <>
        <Searchbar onSubmit={setChangeSerchTerm} />
        <ErrorMessage>Whoops, something went wrong! Please enter a valid request</ErrorMessage>
      </>
    );
  }

  if (status === 'resolved') {
    return (
      <AppWrapper>
        <Searchbar onSubmit={setChangeSerchTerm} />
        {showModal && (
          <Modal onCloseModal={onToggleModal}>
            <img src={largeImageURL} alt="" />
          </Modal>
        )}
        <ImageGallery
          images={images}
          onOpenModal={onToggleModal}
          onLargeImgClick={onLargeImgClick}
        />
        {data > 12 && <Button name={'Load more'} onLoadMoreButton={onLoadMoreButton} />}
      </AppWrapper>
    );
  }
}
