import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSearch,
  faClipboardList,
  faCartPlus,
  faShoppingCart,
  faMapMarkerAlt,
  faTruck,
  faCreditCard
} from "@fortawesome/free-solid-svg-icons";

const taskIconMap = {
  1: faUser,
  2: faSearch,
  3: faClipboardList,
  4: faCartPlus,
  5: faShoppingCart,
  6: faMapMarkerAlt,
  7: faTruck,
  8: faCreditCard
};

const processData = {
  process_title: "Shopping on Amazon",
  video_analysis_summary:
    "This video tutorial demonstrates how to shop on Amazon, covering login, search, selection, and checkout processes.",
  tasks: [
    {
      task_number: 1,
      task_name: "Account Login/Creation",
      task_description:
        "The user either logs into their existing Amazon account or creates a new one.",
      steps: [
        "Step 1.1: Navigate to the Amazon homepage.",
        "Step 1.2: Click on the 'Sign In' button.",
        "Step 1.3: If an existing user, enter the registered email or mobile number and password.",
        "Step 1.4: Click on 'Login'.",
        "Step 1.5: If a new user, click on 'I am a new customer'.",
        "Step 1.6: Fill out the registration form with name, email, and password.",
        "Step 1.7: Click on 'Create your Amazon account'."
      ]
    },
    {
      task_number: 2,
      task_name: "Product Search",
      task_description:
        "The user searches for the desired product either by browsing or typing in the search bar.",
      steps: [
        "Step 2.1: To search by category, click the 'Shop by Category' dropdown menu.",
        "Step 2.2: Select the relevant product category (e.g., 'Mobiles & Tablets'), then browse.",
        "Step 2.3: Alternatively, use the search bar by typing the product name or category.",
        "Step 2.4: Click the search icon."
      ]
    },
    {
      task_number: 3,
      task_name: "Product Selection and Review",
      task_description:
        "The user selects a product from the search results and reviews its details.",
      steps: [
        "Step 3.1: From the search results, browse the available products.",
        "Step 3.2: Check product ratings and customer reviews.",
        "Step 3.3: Click on the desired product to view its individual page.",
        "Step 3.4: Review the product images, details, specifications, and customer reviews."
      ]
    },
    {
      task_number: 4,
      task_name: "Adding to Cart/Buy Now",
      task_description:
        "The user adds the product to the cart for later purchase or proceeds directly to buy.",
      steps: [
        "Step 4.1: To buy immediately, click the 'Buy Now' button.",
        "Step 4.2: To add to cart for later purchase, click the 'Add to Cart' button."
      ]
    },
    {
      task_number: 5,
      task_name: "Cart Review (If Added to Cart)",
      task_description:
        "If items are added to the cart, the user reviews the items before checkout.",
      steps: [
        "Step 5.1: Click on the cart icon at the top right of the screen.",
        "Step 5.2: Review the items in the cart.",
        "Step 5.3: Adjust the quantity of each item, if desired.",
        "Step 5.4: Remove items if needed.",
        "Step 5.5: Click on 'Proceed to checkout'."
      ]
    },
    {
      task_number: 6,
      task_name: "Delivery Information",
      task_description: "The user provides the delivery address.",
      steps: [
        "Step 6.1: Select a previously saved delivery address.",
        "Step 6.2: Alternatively, add a new delivery address by filling out the address form.",
        "Step 6.3: Click 'Deliver to this address'."
      ]
    },
    {
      task_number: 7,
      task_name: "Delivery Options and Payment Method",
      task_description:
        "The user selects their delivery speed and payment method.",
      steps: [
        "Step 7.1: Confirm delivery address and choose a delivery speed and click on 'Continue'.",
        "Step 7.2: Select a payment method: credit card, debit card, or net banking.",
        "Step 7.3: For net banking, select the bank.",
        "Step 7.4: Click 'Continue'."
      ]
    },
    {
      task_number: 8,
      task_name: "Order Review and Payment Confirmation",
      task_description:
        "The user reviews the order and confirms payment through their selected method.",
      steps: [
        "Step 8.1: Review the order details and delivery address.",
        "Step 8.2: Enter any gift cards or promotional codes, if applicable.",
        "Step 8.3: Click 'Place your order and pay'.",
        "Step 8.4: Complete the payment process through the selected payment gateway (e.g. net banking, card).",
        "Step 8.5: After successful payment, a confirmation message is displayed ('Thank you for your order')."
      ]
    }
  ]
};

function Modal({ open, onClose, steps, taskName }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{ background: "#23262F", color: "#fff", borderRadius: 12, padding: 32, minWidth: 350, maxWidth: 500 }}>
        <h2 style={{ marginBottom: 16 }}>{taskName} - Steps</h2>
        <ol style={{ marginBottom: 24 }}>
          {steps.map((step, idx) => (
            <li key={idx} style={{ marginBottom: 8 }}>{step}</li>
          ))}
        </ol>
        <button onClick={onClose} style={{ background: "#E6E8EB", color: "#181A20", border: "none", borderRadius: 8, padding: "8px 24px", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>Close</button>
      </div>
    </div>
  );
}

export default function ProcessTaskSteps() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSteps, setModalSteps] = useState([]);
  const [modalTaskName, setModalTaskName] = useState("");

  const openModal = (steps, name) => {
    setModalSteps(steps);
    setModalTaskName(name);
    setModalOpen(true);
  };

  return (
    <div style={{ background: "#181A20", color: "#fff", minHeight: "100vh", fontFamily: "Inter, sans-serif", padding: 40 }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>{processData.process_title}
          <span style={{ background: "#3A2F18", color: "#F6C768", fontSize: 16, fontWeight: 600, borderRadius: 8, padding: "4px 12px", marginLeft: 16, verticalAlign: "middle" }}>IN REVIEW</span>
        </h1>
        <div style={{ color: "#B0B3B8", fontSize: 16, marginBottom: 32 }}>{processData.video_analysis_summary}</div>
        <h2 style={{ fontSize: 24, fontWeight: 600, margin: "32px 0 16px" }}>Process Tasks</h2>
        <div style={{ borderLeft: "2px solid #35373B", marginLeft: 16, paddingLeft: 25 }}>
          {processData.tasks.map((task, idx) => (
            <div key={task.task_number} style={{ display: "flex", alignItems: "flex-start", marginBottom: 36, position: "relative" }}>
              <div style={{ position: "absolute", left: -38, top: 0, fontSize: 28, color: "#B0B3B8" }}>
                <FontAwesomeIcon icon={taskIconMap[task.task_number]} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>{task.task_name}</div>
                <div style={{ color: "#B0B3B8", fontSize: 15, marginBottom: 2 }}>{task.task_description}</div>
                <button onClick={() => openModal(task.steps, task.task_name)} style={{ background: "none", color: "#3ED2B0", border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <FontAwesomeIcon icon={faClipboardList} style={{ color: "#3ED2B0" }} /> VIEW STEPS
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "right", marginTop: 40, display: "flex", gap: 16, justifyContent: "flex-end" }}>
          <button style={{ background: "#23262F", color: "#fff", border: "none", borderRadius: 16, padding: "12px 32px", fontWeight: 600, fontSize: 18, cursor: "pointer" }}>Regenerate</button>
          <button style={{ background: "#23262F", color: "#fff", border: "none", borderRadius: 16, padding: "12px 32px", fontWeight: 600, fontSize: 18, cursor: "pointer" }}>Edit Tasks</button>
          <button style={{ background: "#E6E8EB", color: "#181A20", border: "none", borderRadius: 16, padding: "12px 32px", fontWeight: 600, fontSize: 18, cursor: "pointer" }}>Approve</button>
        </div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} steps={modalSteps} taskName={modalTaskName} />
    </div>
  );
} 