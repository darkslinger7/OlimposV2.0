const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');


const twilio = require('twilio');
const accountSid = 'TU_ACCOUNT_SID_AQUI'; 
const authToken = 'TU_AUTH_TOKEN_AQUI'; 
const twilioNumber = 'whatsapp:+14155238886'; 

let client;
try {
    client = new twilio(accountSid, authToken);
} catch (e) {
    console.log("Twilio no configurado correctamente, se omitirá el envío de WhatsApp.");
}

router.use(verificarCargo([2])); 


router.get('/avisos', (req, res) => {
    const idHotel = req.session.usuario.id_hotel;
    const idUsuario = req.session.usuario.id;


    const sqlRecibidos = `
        SELECT a.*, u.nombre_apellido as remitente, u.id_cargo as cargo_remitente
        FROM avisos a
        JOIN inf_usuarios u ON a.id_emisor = u.id
        WHERE a.rol_destino IN ('administrador', 'todos')
        ORDER BY a.fecha DESC
    `;


    const sqlEnviados = `
        SELECT a.*, a.rol_destino as destinatario
        FROM avisos a
        WHERE a.id_emisor = ?
        ORDER BY a.fecha DESC
    `;

    conexion.query(sqlRecibidos, (err, recibidos) => {
        if (err) throw err;
        conexion.query(sqlEnviados, [idUsuario], (err2, enviados) => {
            if (err2) throw err2;
            res.render('administrador/avisos', {
                titulo: 'Centro de Comunicación',
                icono: 'fa-comments',
                usuario: req.session.usuario,
                recibidos,
                enviados
            });
        });
    });
});

router.post('/avisos/publicar', (req, res) => {
    const { titulo, mensaje, rol_destino, enviar_whatsapp } = req.body;
    const idEmisor = req.session.usuario.id;
    const idHotel = req.session.usuario.id_hotel;

    const sql = `INSERT INTO avisos (titulo, mensaje, id_emisor, rol_emisor, rol_destino) VALUES (?, ?, ?, 'administrador', ?)`;

    conexion.query(sql, [titulo, mensaje, idEmisor, rol_destino], (err) => {
        if (err) { console.error(err); return res.status(500).send("Error"); }

       
        if (enviar_whatsapp && client) {
            
            let cargoDestino = 0;
            if (rol_destino === 'trabajador') cargoDestino = 3;
            else if (rol_destino === 'cliente') cargoDestino = 4;
            
            if (cargoDestino > 0) {
                
                const sqlTelefonos = "SELECT telefono FROM inf_usuarios WHERE id_hotel = ? AND id_cargo = ?";
                
                conexion.query(sqlTelefonos, [idHotel, cargoDestino], (errPh, results) => {
                    if (!errPh && results.length > 0) {
                        
                        results.forEach(u => {
                            
                            let phone = u.telefono.replace(/\s+/g, '').replace(/\+/g, '');
                           
                            if(!phone.startsWith('58')) phone = '58' + phone; 
                            
                            client.messages.create({
                                body: `*${titulo}*\n\n${mensaje}\n\n- Administración ${req.session.usuario.hotel || 'Olimpos'}`,
                                from: twilioNumber,
                                to: `whatsapp:+${phone}`
                            }).then(message => console.log(`Enviado a ${phone}: ${message.sid}`))
                              .catch(e => console.error(`Error enviando a ${phone}:`, e));
                        });
                    }
                });
            }
        }
        
        res.redirect('/administrador/avisos');
    });
});

// Eliminar aviso
router.get('/avisos/eliminar/:id', (req, res) => {
    const idAviso = req.params.id;
    const idUsuario = req.session.usuario.id;
    conexion.query("DELETE FROM avisos WHERE id_aviso = ? AND id_emisor = ?", [idAviso, idUsuario], err => {
        if (err) return res.status(500).send('Error');
        res.redirect('/administrador/avisos');
    });
});

module.exports = router;