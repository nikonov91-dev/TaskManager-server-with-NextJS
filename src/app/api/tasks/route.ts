/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/auth.ts";
import { prisma } from "@/src/lib/prisma.ts";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Потрібна авторизація." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(tasks);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Потрібна авторизація." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { title, description, priority, category, dueDate } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Назва завдання є обов'язковою." }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        userId,
        title: title.trim(),
        description: description?.trim() || "",
        priority: priority || "medium",
        category: category || "other",
        dueDate: dueDate || "",
      }
    });

    return NextResponse.json(task, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
