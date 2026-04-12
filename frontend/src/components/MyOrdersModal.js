import { Modal, Table, Badge } from 'react-bootstrap';

function MyOrdersModal(props) {

  const getStatusVariant = (status) => {
    switch (status) {
      case "succeeded":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={props.close}
      centered
    >
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>My Orders</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!props.orders ? (
          <div className="text-center text-muted py-4">
            No orders found.
          </div>
        ) : (
          <Table striped bordered responsive className="text-center align-middle shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Amount ($)</th>
                <th>Status</th>
                <th>Payment Intent</th>
              </tr>
            </thead>

            <tbody>
              {props.orders.length ? (
                props.orders.map((order) => (
                  <tr key={order.id}>
                    <td className="fw-bold">{order.id}</td>
                    <td>${Number(order.amount).toFixed(2)}</td>
                    <td>
                      <Badge bg={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="text-truncate" style={{ maxWidth: "200px" }}>
                      {order.stripe_payment_intent_id}
                    </td>
                  </tr>
                ))
              ) : (
              
                <tr>
                  <td className="fw-bold">{props.orders.id}</td>
                  <td>${Number(props.orders.amount).toFixed(2)}</td>
                  <td>
                    <Badge bg={getStatusVariant(props.orders.status)}>
                      {props.orders.status}
                    </Badge>
                  </td>
                  <td className="text-truncate" style={{ maxWidth: "200px" }}>
                    {props.orders.stripe_payment_intent_id}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default MyOrdersModal;