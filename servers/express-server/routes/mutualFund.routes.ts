import { Router, type IRouter } from "express";
import * as controller from "../controller/mutualFund.controller.js";
import { verifyUserAuth } from "controller/user.controller.js";

const mutualFundRouter: IRouter = Router();
mutualFundRouter.use(verifyUserAuth);
mutualFundRouter.post("/recommendations", controller.getRecommendations);
mutualFundRouter.get("/analytics", controller.getAnalytics);
mutualFundRouter.get("/filters", controller.getFilters);
mutualFundRouter.get("/all", controller.getAllFunds);
mutualFundRouter.get("/:id", controller.getFundDetails);

export { mutualFundRouter };
