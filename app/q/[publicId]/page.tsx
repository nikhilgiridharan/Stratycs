import { notFound } from "next/navigation";
import { loadPublicQuote } from "@/lib/public-quote";
import { PublicQuoteClient } from "@/components/quotes/PublicQuoteClient";

export default async function PublicQuotePageQ({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;
  const data = await loadPublicQuote(publicId);
  if (!data) notFound();

  return <PublicQuoteClient initial={data} />;
}
