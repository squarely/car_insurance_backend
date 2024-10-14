import { Router } from 'express';
const router = Router();
import validator from '../Validators/util.validator.js';
import ClaimValidator from '../Validators/claim.validator.js';
import { getClaims, postClaim, getClaim, updateClaim, deleteClaim ,getClaimImage,updateRepairCost} from '../Controllers/claim.controllers.js';

router.get('/', getClaims)
router.post('/', ClaimValidator.createValidator, validator, postClaim)
router.get('/:id', getClaim)
router.patch('/:id', updateClaim)
router.delete('/:id', deleteClaim)

router.get('/getClaimImage/:id', getClaimImage)
router.patch('/updateRepairCost/:id', updateRepairCost)

export default router;