import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Table } from "react-bootstrap";

function MyOrdersModal(props) {
 


  return (
    <>
      
     
      <Modal
        size="lg"
        show={props.show} onHide={props.close}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
           
          </Modal.Title>
        </Modal.Header>
        <Modal.Body> <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Amount ($)</th>
          <th>Status</th>
          <th>Payment Intent</th>
        </tr>
      </thead>
      <tbody>
        {props.orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.amount}</td>
            <td>{order.status}</td>
            <td>{order.stripe_payment_intent_id}</td>
          </tr>
        ))}
      </tbody>
    </Table></Modal.Body>
      </Modal>
    </>
  );
}

export default MyOrdersModal;