/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/auth.ts";
import { prisma } from "@/src/lib/prisma.ts";

type RouteParams = { id: string };

export async function PUT(
  req: Request,
  context: { params: Promise<RouteParams> | RouteParams }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Потрібна авторизація." }, { status: 401 });
  }

  const userId = (session.user as any).id;
  
  // Adaptive resolution for standard and async Next.js dynamic params
  const resolvedParams = 'then' in context.params ? await context.params : context.params;
  const taskId = resolvedParams.id;

  try {
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId }
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Завдання не знайдено або доступ заборонено." }, { status: 404 });
    }

    const body = await req.json();
    
    const updates: any = {};
    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.description !== undefined) updates.description = body.description?.trim() || "";
    if (body.completed !== undefined) updates.completed = body.completed;
    if (body.priority !== undefined) updates.priority = body.priority;
    if (body.category !== undefined) updates.category = body.category;
    if (body.dueDate !== undefined) updates.dueDate = body.dueDate;

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updates
    });

    return NextResponse.json(task);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<RouteParams> | RouteParams }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Потрібна авторизація." }, { status: 401 });
  }

  const userId = (session.user as any).id;
  
  // Adaptive resolution for standard and async Next.js dynamic params
  const resolvedParams = 'then' in context.params ? await context.params : context.params;
  const taskId = resolvedParams.id;

  try {
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId }
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Завдання не знайдено або доступ заборонено." }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id: taskId }
    });

    return NextResponse.json({ success: true, message: "Завдання успішно видалено." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
