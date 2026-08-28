import e from "express";
import { Deletecv, getCvById, getMyCv ,uploadCVController} from "../controllers/cvControllers.js";
import { uploadCV } from "../middlewares/pdfparse.middleware.js";

const cvRouter = e.Router();


cvRouter.get("/", getMyCv);
cvRouter.get("/:id", getCvById);
cvRouter.delete("/:id", Deletecv);
cvRouter.post("/upload" ,uploadCV.single("cv"),uploadCVController)

export default cvRouter;
