/**
 * User Routes
 */
import Router from 'express';
import * as userCtl from '../controllers/user';
import { verifyAcl } from '../middlewares/acl'; // ACL Checking middleware

const router = Router();

router.route('/login').post(userCtl.login);
router.route('/signup').post(userCtl.signUp);
// router.route('/users').get(userCtl.getUsers);
// router.route('/users/refreshToken').get(userCtl.refreshToken);
router.route('/book-service').post(userCtl.bookService);

export default router;