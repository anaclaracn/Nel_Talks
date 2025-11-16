// //Essa rota manda o prompt pro Nélia
// import express from 'express';
// import { callAPI } from '../utils/fetchHelper.js';
// import dotenv from 'dotenv';
// dotenv.config();

// const router = express.Router();

// router.post('/', async (req, res) => {
//   try {
//         const { message } = req.body;
//         const response = await callAPI(`${process.env.NELIA_SERVICE_URL}/analyze`, { message });
//         res.json(response);
//   } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Erro ao comunicar com Nélia' });
//   }
// });
// export default router;
