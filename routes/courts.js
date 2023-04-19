import { Router } from 'express';
const router = Router();
import { reviewData } from '../data/index.js';


// POST - Create a new review for a court
router.post('/courts/:courtID/reviews', async (req, res) => {
    const { courtID } = req.params;
    const { name, rating, comment } = req.body;

    try {
        const newReview = await reviewData.create(courtID, name, rating, comment);
        res.status(201).json(newReview);
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

// DELETE - Remove a review on a court
router.delete('/reviews/:reviewId', async (req, res) => {
    const { reviewId } = req.params;

    try {
        const removedReview = await reviewData.remove(reviewId);
        res.status(200).json(removedReview);
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

export default router;
