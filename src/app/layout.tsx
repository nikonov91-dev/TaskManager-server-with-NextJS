/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Metadata } from 'next';
import '../index.css';
import { Providers } from '@/src/components/Providers.tsx';

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Повнофункціональний менеджер завдань із захищеною авторизацією та базою даних PostgreSQL.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className="h-full">
      <body className="h-full bg-[#fafafc]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
