import React from 'react';
import { Form } from 'react-bootstrap';

const SearchBar = ({ data, setFilteredData }) => {
    const handleChange = (event) => {
        const term = event.target.value;
        if (term.trim() === '') {
            setFilteredData(data);
        } else {
            const filteredProducts = data.filter(data =>
                data.product_name.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredData(filteredProducts)
        }
    };

    return (
        <Form style={{"border":"1px solid darkgray"}}>
            <Form.Group controlId="search">
                <Form.Control
                    type="text"
                    placeholder="Search..."
                    onChange={handleChange}
                />
            </Form.Group>
        </Form>
    );
};

export default SearchBar;