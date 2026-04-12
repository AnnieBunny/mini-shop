import { useNavigate } from "react-router-dom";

function SuccessPaymentPage() {
  const navigate = useNavigate();
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>
        
        <h1 style={styles.title}>Payment Successful!</h1>
        
        <p style={styles.text}>
          Thank you for your order. Your payment has been processed successfully.
        </p>

        <button style={styles.button} onClick={() => navigate("/")}>
          Back to Shop
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fb",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  icon: {
    fontSize: "50px",
    marginBottom: "20px",
  },
  title: {
    marginBottom: "15px",
    fontSize: "24px",
    fontWeight: "600",
  },
  text: {
    color: "#666",
    marginBottom: "25px",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default SuccessPaymentPage;