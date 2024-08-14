const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const generateExternalTransactionId = () => {
  let id = uuidv4();
  id = id.substring(0, 64);
  return id;
};

const isString = (value) => typeof value === "string";
const isNumber = (value) => typeof value === "number";

const isValidName = (name) => {
  const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)+$/;
  return namePattern.test(name);
};

async function checkoutPaymentController(req, res) {
  const {
    name,
    email,
    amount,
    currency_id,
    id,
    description,
    nameBySource,
    type,
    number,
    country,
  } = req.body;

  if (
    !name ||
    !email ||
    !amount ||
    !currency_id ||
    !id ||
    !description ||
    !nameBySource ||
    !type ||
    !number ||
    !country
  ) {
    return res
      .status(400)
      .send("Debe proporcionar todos los campos requeridos.");
  }

  if (
    !isString(name) ||
    !isString(email) ||
    !isString(amount) ||
    !isString(currency_id) ||
    !isString(id) ||
    !isString(description) ||
    !isString(nameBySource) ||
    !isString(type) ||
    !isString(country) ||
    !isNumber(number)
  ) {
    return res
      .status(400)
      .send("Los datos enviados tienen un formato incorrecto.");
  }

  if (!isValidName(name)) {
    return res
      .status(400)
      .send(
        "El formato del nombre es incorrecto. Debe contener al menos un nombre y un apellido."
      );
  }

  const external_transaction_id = generateExternalTransactionId();

  const newObject = {
    description,
    external_transaction_id,
    currency_id,
    amount,
    payer: {
      name,
      email,
      identification: {
        type,
        number,
        country,
      },
    },
    source: {
      id,
      name: nameBySource,
    },
  };

  try {
    const response = await axios.post(
      "https://checkouts.payfun.com.ar/v2/single_payment",
      newObject,
      {
        headers: {
          "x-api-key": process.env.API_KEY,
          "x-access-token": process.env.ACCESS_TOKEN,
        },
      }
    );
    
    if (response.status === 200) {
      return res
        .status(200)
        .json({ message: "Orden de pago generada", data: response.data });
    } 
     else {
      return res.status(400).json({
        message: "Error al generar la orden de pago",
        error: response.data.error,
      });
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({
        message: "Error en la solicitud al servicio externo",
        error: error.response.data.error || "Error desconocido",
      });
    }
      return res.status(500).json({ message: "Error al generar la orden de pago" });
  }
}

module.exports = checkoutPaymentController;
