import { z } from "zod";
import { Prisma } from "@prisma/client";

export const amenitiesSchema = z.record(z.string(), z.boolean());

export type Property = Prisma.PropertyGetPayload<{
  include: {
    address: true;
    operational: true;
    rules: true;
    host: true;
  };
}>;
