// PURPOSE: the numbers for the dashboard Home page (orders, rating, earnings / spending). Different for worker and employer.
import { Router } from 'express';
import { currentUser, requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { employerStats, workerStats } from '../services/stats.service';

const router = Router();
router.use(requireAuth, requireRole('EMPLOYER', 'WORKER'));

router.get('/summary', async (req, res) => {
  const user = currentUser(req);
  res.json(user.role === 'WORKER' ? await workerStats(user) : await employerStats(user));
});

export default router;
