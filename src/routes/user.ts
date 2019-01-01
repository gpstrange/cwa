/**
 * User Routes
 */
import Router from 'express';
import * as userCtl from '../controllers/user';

const router = Router();

router.route('/login').post(userCtl.login);
router.route('/signup').post(userCtl.signUp);
router.route('/book-service').post(userCtl.bookService);
router.route('/add-car').post(userCtl.addCar);

export default router;