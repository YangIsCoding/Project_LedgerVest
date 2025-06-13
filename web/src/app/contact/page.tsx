// src/app/contact/page.tsx
import ClientOnly from '@/components/ClientOnly';
import ContactForm from './ContactForm';

export const dynamic = 'force-dynamic';   // ← 不再做 SSG，避免再度預執行前端程式

export default function ContactPage() {
  return (
    <ClientOnly>
      <ContactForm />
    </ClientOnly>
  );
}
