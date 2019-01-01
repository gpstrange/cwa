/**
 * User Routes
 */
import Router from 'express';
import * as vendorCtl from '../controllers/vendor';
import { verifyAcl } from '../middlewares/acl'; // ACL Checking middleware

const router = Router();

router.route('/addVendor').post(vendorCtl.addVendor);
router.route('/getVendors').post(vendorCtl.getVendors);
router.route('/editVendor').post(vendorCtl.editVendor);
router.route('/getNearbyVendor').post(vendorCtl.getNearbyVendors);

export default router;