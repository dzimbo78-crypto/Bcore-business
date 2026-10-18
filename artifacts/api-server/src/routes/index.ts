import { Router, type IRouter } from "express";
import healthRouter from "./health";
import emailRouter from "./email";
import adminRouter from "./admin";
import productsRouter from "./products";
import steelEnquiriesRouter from "./steel-enquiries";

const router: IRouter = Router();

router.use(healthRouter);
router.use(emailRouter);
router.use(adminRouter);
router.use(productsRouter);
router.use(steelEnquiriesRouter);

export default router;
