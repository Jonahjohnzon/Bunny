// app/messages/[id]/page.tsx
import MessagesPageClient from '../component/MessagesPageClient';
export default async function MessageThreadPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <MessagesPageClient activeId={id} />;
}