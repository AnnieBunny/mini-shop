import React, { useState } from "react";
import { Button, Badge, Container, Navbar, Nav, Accordion } from 'react-bootstrap';
import { BsCart } from "react-icons/bs";

const Header = ({ cart, setCart, setExpanded }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);

 
    const handleAddToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
    };

   
    const handleRemoveFromCart = (productToRemove) => {
        setCart((prevCart) => prevCart.filter(product => product.id !== productToRemove.id));
    };

 
    const handlePayment = () => {
        alert("Processing payment...");
        setCart([]); 
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" style={{ position: 'relative' }}>
            <Container>
                <Navbar.Brand href="#">Mini Shop</Navbar.Brand>
                <Nav className="ms-auto">
                    <Button
                        variant="outline-light"
                        onClick={() => setIsCartOpen(!isCartOpen)}
                        aria-expanded={isCartOpen}
                    >
                        <BsCart size={30} />
                        <Badge bg="danger">{cart.length}</Badge>
                    </Button>
                </Nav>
            </Container>

            {isCartOpen && (
                        
                <Accordion   defaultActiveKey="0" className="mt-3" style={{
                    position: 'fixed', top: '44px', right: '0px', width: '250px', zIndex: 9999
                }}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header onClick={() => setIsCartOpen(!isCartOpen)}>Your Shopping Cart</Accordion.Header>
                        <Accordion.Body>
                            {cart.length === 0 ? (
                                <p>Your cart is empty</p>
                            ) : (
                                cart.map((product, index) => (
                                    <div key={index} className="d-flex justify-content-between mb-2">
                                        <span>{product.name}</span>
                                        <span>${product.price}</span>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemoveFromCart(product)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))
                            )}
                            {cart.length > 0 && (
                                <Button variant="success" onClick={handlePayment} className="mt-3 w-100">
                                    Pay Now
                                </Button>
                            )}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            )}
        </Navbar>
    );
};

export default Header;