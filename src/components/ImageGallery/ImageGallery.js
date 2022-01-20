import PropTypes from 'prop-types';
import ImageGalleryItem from '../ImageGalleryItem/';
import styled from 'styled-components';

const ImageGalleryList = styled.ul`
  display: grid;
  max-width: calc(100vw - 48px);
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
  margin-top: 0;
  margin-bottom: 0;
  padding: 0;
  list-style: none;
  margin-left: auto;
  margin-right: auto;
`;

const ImageGallery = ({ images, onOpenModal }) => (
  <ImageGalleryList>
    {images.map(({ id, tags, webformatURL, largeImageURL }) => (
      <ImageGalleryItem
        key={id}
        id={id}
        tags={tags}
        webformatURL={webformatURL}
        largeImageURL={largeImageURL}
        onOpenModal={onOpenModal}
      />
    ))}
  </ImageGalleryList>
);

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      tags: PropTypes.string,
      webformatURL: PropTypes.string.isRequired,
      largeImageURL: PropTypes.string.isRequired,
    }),
  ),
  onOpenModal: PropTypes.func.isRequired,
};

export default ImageGallery;
