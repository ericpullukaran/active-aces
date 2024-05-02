"use client";

import { Container } from "./Container";

function formatDate(dateString: string) {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function ArticleLayout({
  article,
  children,
}: {
  article: {
    title: string;
    description: string;
    author: string;
    date: string;
    slug: string;
  };
  children: React.ReactNode;
}) {
  return (
    <Container className="bg-card pt-16 lg:pt-32">
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl">
          <article>
            <header className="flex flex-col">
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                {article.title}
              </h1>
              <time
                dateTime={article.date}
                className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
              >
                <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                <span className="ml-3">{formatDate(article.date)}</span>
              </time>
            </header>
            <div className="prose dark:prose-invert mt-8" data-mdx-content>
              {children}
            </div>
          </article>
        </div>
      </div>
    </Container>
  );
}
