import React, { useEffect, useState } from 'react'
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';

const PhotoSlider = ({ photoItems }) => {

    const [ images, setImages ] = useState([]);

    useEffect( () => {
        const photos = photoItems.map((photo) => ({
            src: `/leisure/images/hotel/${photo.hotel_img}`,
            sizes: '(max-width: 1000px) 400px, (max-width: 2000px) 700px, 1000px'
        }));
        
        setImages(photos);
        
    }, []);

    return (
        <div className='carousel-container'>
            <Carousel 
                images={images} 
                shouldLazyLoad={false}
                canAutoPlay={false}
                transitionSpeed={1.5}
                widgetsHasShadow={true}
                hasIndexBoard={false}
                thumbnailWidth='15%'
                thumbnailHeight='15%'
                style={{ backgroundColor: "rgb(233 233 233)" }}
            />
        </div>
    )
}

export default PhotoSlider