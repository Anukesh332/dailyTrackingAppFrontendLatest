import React, { useState } from 'react';
import QuantitySelector from './QuantitySelector';

function QuantitySelectorPerItem({ element, onUpdateQuantity }) {

    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (newQuantity) => {
        setQuantity(newQuantity);
        onUpdateQuantity(element, newQuantity);
    };

    return (
        <>
            <div className="product-item">
                <QuantitySelector quantity={quantity} onQuantityChange={handleQuantityChange} />
            </div>
        </>
    );
}

export default QuantitySelectorPerItem;