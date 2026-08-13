import { Router } from "express";
import { authRouter } from "./auth.routes";
import { citizenRouter } from "./citizen.routes";
import { organizationRouter } from "./organization.routes";
import { workerRouter } from "./worker.routes";
import { investorRouter } from "./investor.routes";
import { feedRouter } from "./feed.routes";
import { messagesRouter } from "./messages.routes";

/**
 * Mounts every API router under the app.
 * Touched only when adding/removing a route file — otherwise stays out of the way.
 */
const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use(feedRouter); // /api/feed
apiRouter.use(messagesRouter); // /api/messages
apiRouter.use(citizenRouter); // /api/reports, /api/reports/:id, /api/campaigns
apiRouter.use(organizationRouter); // /api/organization/*
apiRouter.use(workerRouter); // /api/jobs, /api/bids, /api/wallet
apiRouter.use(investorRouter); // /api/investor/*

export default apiRouter;
export { apiRouter };