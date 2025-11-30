import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Import feature routes
import authRoutes from './features/auth/auth.route';
import bookingRoutes from './features/booking/booking.route';
import documentsRoutes from './features/documents/documents.route';
import profileRoutes from './features/profile/profile.route';
import scheduleRoutes from './features/schedule/schedule.route';
import searchRoutes from './features/search/search.route';
import evaluationsRoutes from './features/evaluations/evaluations.route'; // Import new evaluations route
import databaseRoutes from './features/admin/database/database.route';

// Initialize Express app
const app: Express = express();
const port = 3001;

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable JSON body parsing

// (nhi) Global error handler - catch any unhandled errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Global Error Handler]:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// --- API Routes ---
// Connect feature routes to the main app
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/documents', documentsRoutes);
console.log('Registering /api/profile routes.');
app.use('/api/profile', profileRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/evaluations', evaluationsRoutes); // Mount new evaluations route
app.use('/api/admin/database', databaseRoutes);

// Start the server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
