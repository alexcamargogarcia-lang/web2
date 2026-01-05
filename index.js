const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// La URL de Discord debe ir en las variables de entorno de Railway
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

// Ruta para validar el token y devolver la URL de envío
app.post('/create-url', (req, res) => {
    const { token } = req.body;

    // Validación con el nuevo token proporcionado
    if (token !== "Shxdow_security_v3") {
        return res.status(403).json({ 
            success: false, 
            message: "Token de seguridad inválido" 
        });
    }

    const host = req.get('host');
    res.json({
        success: true,
        url: `https://${host}/send-data`
    });
});

// Ruta que recibe los datos del script de Roblox y los manda a Discord
app.post('/send-data', async (req, res) => {
    try {
        if (!DISCORD_WEBHOOK_URL) {
            return res.status(500).send("Error: DISCORD_WEBHOOK no configurado en Railway");
        }
        
        // Reenvío de los datos (catches, info del jugador, etc.)
        await axios.post(DISCORD_WEBHOOK_URL, req.body);
        res.status(200).send("OK");
    } catch (error) {
        console.error("Error al enviar a Discord:", error.message);
        res.status(500).send("Error en el servidor");
    }
});

// Heartbeat para mantener la sesión activa en el script
app.get('/send-data', (req, res) => {
    res.status(200).send("Active");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT} con Token V3`);
});
