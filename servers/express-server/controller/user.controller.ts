import { prisma } from "@repo/prisma/db";
import { BadRequest } from "controller/error/error.badRequest.controller.js";
import { OkResponseStrategy } from "controller/response/response.ok.controller.js";
import type { Request, NextFunction, Response } from "express";
import { ModifiedRequest } from "helper/iHelper.js";
import { catchAsync } from "utils/catchAsyncFunc.js";
import { env } from "@repo/zod-schemas/environment/environments.z.js";
import { decode } from "next-auth/jwt";

const userAuthController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, firstName, lastName, id, avatarURL } = req.body;

    if (!email || !id) {
      return next(
        new BadRequest().handleResponse(res, {
          info: "Email and ID are required",
        })
      );
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        avatarURL: avatarURL || null,
      },
      create: {
        id,
        email,
        firstName: firstName || "",
        lastName: lastName || null,
        avatarURL: avatarURL || null,
      },
    });

    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        balance: 0,
        lockedAmount: 0,
      },
    });

    new OkResponseStrategy().handleResponse(res, { user } );
  }
);

const verifyUserAuth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const sessionToken =
      req.cookies["next-auth.session-token"] ||
      req.cookies["__Secure-next-auth.session-token"];

    if (!sessionToken) {
      return next(
        new BadRequest().handleResponse(res, {
          info: "Authentication required",
        })
      );
    }

    const decoded = await decode({
      token: sessionToken,
      secret: env.JWT_SECRET,
    });

    if (!decoded || !decoded.id) {
      return next(
        new BadRequest().handleResponse(res, {
          info: "Invalid session token",
        })
      );
    }

    (req as ModifiedRequest).user = {
      id: decoded.id as string,
    };

    next();
  }
);

export { userAuthController, verifyUserAuth };
