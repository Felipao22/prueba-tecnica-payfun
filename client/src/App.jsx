import { useState } from "react";
import "./App.css";
import apiClient from "./utils/client";

function App() {
  const initialValues = {
    description: "descripción de la orden de pago",
    currency_id: "ARS",
    name: "",
    email: "",
    amount: "",
    id: "000001",
    nameBySource: "direct-op",
    type: "DNI_ARG",
    number: "",
    country: "ARG",
  };

  const [values, setValues] = useState(initialValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const validateFields = () => {
    const dniRegex = /^[0-9]{7,8}$/;
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (values.number !== "" && !dniRegex.test(values.number)) {
      return "El DNI ingresado no es válido. Debe ser un número de 7 u 8 dígitos.";
    }
    if (values.name !== "" && !nameRegex.test(values.name)) {
      return "El nombre ingresado no es válido. Debe contener solo letras y espacios.";
    }
    if (values.email !== "" && !emailRegex.test(values.email)) {
      return "El correo electrónico ingresado no es válido.";
    }
  
    return null;
  };

  const handleSubmmit = async (e) => {
    e.preventDefault();

    const validationError = validateFields();
    if (validationError) {
      alert(validationError);
      return;
    }

    const payload = {
      ...values,
      number: values.number ? parseInt(values.number, 10) : null,
    };

    try {
      const response = await apiClient.post("/", payload);
      setValues(initialValues);
      alert(response.data?.message);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      if (error.response.status === 400) {
        alert(error.response?.data);
      } else {
        alert(`Error: ${error.response?.data?.error}` || "Error desconocido");
      }
    }
  };

  return (
    <>
      <div style={{ border: "solid", borderRadius: "10px", padding: "30px" }}>
        <h1>Generar orden de pago</h1>
        <form
          onSubmit={handleSubmmit}
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <label style={{ textAlign: "left" }}>Nombre y Apellido</label>
          <input
            onChange={handleInputChange}
            name="name"
            value={values.name}
            type="text"
          />
          <label style={{ textAlign: "left" }}>Correo electrónico</label>
          <input
            onChange={handleInputChange}
            name="email"
            value={values.email}
            type="email"
          />
          <label style={{ textAlign: "left" }}>DNI</label>
          <input
            onChange={handleInputChange}
            name="number"
            value={values.number}
            type="number"
          />
          <label style={{ textAlign: "left" }}>Monto</label>
          <input
            onChange={handleInputChange}
            name="amount"
            value={values.amount}
            type="number"
          />
          <button type="submit" style={{ marginTop: "10px" }}>
            Generar orden
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
