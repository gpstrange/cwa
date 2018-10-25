/**
 * User Routes
 */
import Router from 'express';
import * as vendorCtl from '../controllers/vendor';
import { verifyAcl } from '../middlewares/acl'; // ACL Checking middleware

const router = Router();

router.route('/addVendor').post(vendorCtl.addVendor);
// router.route('/').post(userCtl.login);
// router.route('/users').get(userCtl.getUsers);
// router.route('/users/refreshToken').get(userCtl.refreshToken);

export default router;