const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

//registrarme con senal de datos https://www.twilio.com/en-us
const twilio = require('twilio');
const accountSid = 'TU_ACCOUNT_SID_AQUI'; 
const authToken = 'TU_AUTH_TOKEN_AQUI'; 
const twilioNumber = 'whatsapp:+14155238886'; 

let client;
try {
    client = new twilio(accountSid, authToken);
} catch (e) {
    console.log("Twilio no configurado, se omitirá WhatsApp.");
}

router.use(verificarCargo([1])); 


router.get('/avisos', (req, res) => {
   
    const idUsuario = req.session.usuario.id;

    const sqlAvisos = `
        SELECT a.*, u.nombre_apellido AS emisor
        FROM avisos a
        LEFT JOIN inf_usuarios u ON a.id_emisor = u.id
        WHERE a.rol_emisor = 'super' 
        ORDER BY a.fecha DESC
    `;

    conexion.query(sqlAvisos, (err, avisos) => {
        if (err) throw err;
        res.render('super/avisos', { 
            titulo: 'Gestión de Comunicados Globales',
            icono: 'fa-bullhorn',
            usuario: req.session.usuario,
            avisos 
        });
    });
});


router.post('/avisos/publicar', (req, res) => {
    const { titulo, mensaje, rol_destino, enviar_whatsapp } = req.body;
    const idEmisor = req.session.usuario.id;

  
    const sql = `
        INSERT INTO avisos (titulo, mensaje, id_emisor, rol_emisor, rol_destino)
        VALUES (?, ?, ?, 'super', ?)
    `;

    conexion.query(sql, [titulo, mensaje, idEmisor, rol_destino], (err) => {
        if (err) { 
            console.error(err); 
            return res.status(500).send("Error al publicar aviso"); 
        }

        
        if (enviar_whatsapp && client) {
            let queryTelefonos = "";
            let params = [];

            
            if (rol_destino === 'administrador') {
                queryTelefonos = "SELECT telefono FROM inf_usuarios WHERE id_cargo = 2";
            } else if (rol_destino === 'trabajador') {
                queryTelefonos = "SELECT telefono FROM inf_usuarios WHERE id_cargo = 3";
            } else if (rol_destino === 'cliente') {
                queryTelefonos = "SELECT telefono FROM inf_usuarios WHERE id_cargo = 4";
            } else {
                
                queryTelefonos = "SELECT telefono FROM inf_usuarios WHERE id_cargo IN (2, 3, 4)";
            }

            if (queryTelefonos) {
                conexion.query(queryTelefonos, (errPh, numbers) => {
                    if (!errPh && numbers.length > 0) {
                        numbers.forEach(u => {
                            if (u.telefono && u.telefono.length > 10) {
                                
                                let phone = u.telefono.replace(/\D/g, ''); 
                                
                                if (!phone.startsWith('58')) phone = '58' + phone; 

                                client.messages.create({
                                    body: `📢 *COMUNICADO OLIMPOS*\n\n*${titulo}*\n${mensaje}\n\n- Dirección General`,
                                    from: twilioNumber,
                                    to: `whatsapp:+${phone}`
                                }).then(msg => console.log(`Enviado a ${phone}`))
                                  .catch(e => console.error(`Fallo a ${phone}:`, e));
                            }
                        });
                    }
                });
            }
        }

        res.redirect('/super/avisos');
    });
});

// --- ELIMINAR AVISO ---
router.get('/avisos/eliminar/:id', (req, res) => {
    conexion.query('DELETE FROM avisos WHERE id_aviso = ?', [req.params.id], err => {
        if (err) return res.status(500).send('Error al eliminar');
        res.sendStatus(200);
    });
});

module.exports = router;