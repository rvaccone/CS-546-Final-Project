import { Router } from 'express';
const router = Router();

// Main Route
router
	.route('/')

	.get(async (req, res) => {
		return res.status(200).render('homepage');
	});

export default router;
