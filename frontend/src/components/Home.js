import { useState, useEffect } from "react";
import '../App.css';
import { Card, Button, Row, Col, Container, Accordion, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as homeService from '../../src/services/homeService';
import Header from './Header';

function Home() {
    const [products, setProducts] = useState([{ name: '', price: 0 }]);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [cart, setCart] = useState([]);  

    useEffect(() => {
        getProducts();
    }, []);  

 
    function getProducts() {
        homeService.getProducts().then((data) => {
            console.log(data); 
            const validProducts = data.filter((product) => product.name && product.price > 0);
            setProducts(validProducts);
        }).catch((err) => {
            console.log("Error fetching products:", err);
        });
    }


    function addProduct() {
        if (!productName || !productPrice || productPrice <= 0) {
            toast.error("Please enter valid product name and price.");
            return;
        }

        homeService.addNewProduct(productName, Number(productPrice))
            .then(() => {
              
                setProductName('');
                setProductPrice(0);
                getProducts(); 
                setExpanded(false);  
            }).catch((err) => {
                console.log("Error adding product:", err);
            });
    }

    return (
        <>
          
            <Header cart={cart} setCart={setCart} setExpanded={setExpanded} />

            <Container style={{ marginTop: '100px' }}> 
            <h1 className="my-4 text-center" style={{
                    fontFamily: 'Roboto, sans-serif', color: '#333', fontWeight: '700'
                }}>Our Products</h1>

                <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                  
                    <Col xs={12} md={8}>
                        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                            {Array.isArray(products) && products.length > 0 ? (
                                products.map((product) => (
                                    <Col key={product.id}>
                                        <Card
                                            style={{
                                                backgroundColor: '#f8f9fa',  
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  
                                                borderRadius: '10px',  
                                                padding: '20px',  
                                            }}
                                        >
                                            <Card.Body>
                                                <Card.Title>{product.name}</Card.Title>
                                                <Card.Text>
                                                    Price: ${product.price}
                                                </Card.Text>
                                                <Button variant="primary" onClick={() => setCart([...cart, product])}>
                                                    Buy Now
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <p>No valid products available</p>  
                            )}
                        </Row>
                    </Col>

                   
                    <Col xs={12} md={4}>
                        <Accordion activeKey={expanded ? '0' : null} onSelect={(selectedKey) => setExpanded(selectedKey === '0')}>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    <Button variant="primary">Add Product</Button>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Form>
                                        <Form.Group className="mb-3" controlId="formProductName">
                                            <Form.Label>Product Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter product name"
                                                value={productName}
                                                onChange={(e) => setProductName(e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formProductPrice">
                                            <Form.Label>Product Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter product price"
                                                value={productPrice}
                                                onChange={(e) => setProductPrice(e.target.value)}
                                            />
                                        </Form.Group>

                                        <Button variant="success" onClick={addProduct}>Add Product</Button>
                                    </Form>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </>
    );
}

export default Home;