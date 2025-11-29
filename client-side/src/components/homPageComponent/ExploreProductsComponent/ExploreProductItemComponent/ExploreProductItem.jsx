// src/components/homPageComponent/ExploreProductsComponent/ExploreProductItem/ExploreProductItem.jsx (ĐÃ CHỈNH SỬA)

import React from 'react';
import styles from '../ExploreProducts.module.scss'; 

const ExploreProductItem = ({ tour }) => {
    
    const backgroundImage = tour.image 
        ? tour.image
        : '/images/default-tour.jpg'; 

    return (
        <div 
            className={styles.productCard} 
            onClick={() => console.log(`Chuyển đến tour ID: ${tour.id || tour.tourID}`)} 
        >
            <div 
                className={styles.imageWrapper}
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                {/* Overlay và tên tour */}
                <div className={styles.cardOverlay}>
                    <p className={styles.cardTitle}>{tour.tourName}</p>
                </div>
            </div>
        </div>
    );
};

export default ExploreProductItem;