const realizarPeticiones = async () => {
  const url =
    "http://localhost:3000/api/siat/sincronizar-parametricaMotivoAnulacion";

  for (let i = 0; i < 50; i++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cuis: "41A4F2FF",
        }),
      });

      if (!response.ok) {
        console.error(`Error en la solicitud: ${response.status}`);
      } else {
        const data = await response.json();
        console.log(`Respuesta exitosa (Iteración ${i + 1}):`, data);
      }
    } catch (error) {
      console.error(`Error en la iteración ${i + 1}:`, error);
    }
  }
};

module.exports = { realizarPeticiones };
