import prisma from "@db/prisma";
import { HttpCodes } from "@enums/HttpStatusCode";
import { AppError } from "@exceptions/AppError";
import { IRole } from "@interfaces/role.interface";
import { PrismaClient } from "@prisma/client";

export class RoleService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  public async getAllRoles(): Promise<IRole[]> {
    const roles = await this.prisma.role.findMany();

    if (typeof roles !== "object" || roles.length === 0) {
      throw new AppError({
        httpCode: HttpCodes.BAD_REQUEST,
        description: "Roles not found",
      });
    }

    return roles;
  }
}
