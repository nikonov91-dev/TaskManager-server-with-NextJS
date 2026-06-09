/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import NextAuth from "next-auth";
import { authOptions } from "@/src/lib/auth.ts";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
