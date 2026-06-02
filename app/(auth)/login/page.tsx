import { Suspense } from 'react';
import LoginForm from './LoginForm';
import Spinner from '@/app/UI/Spinner';

/* 
Next.js se při production buildu snaží co nejvíc stránek staticky prerenderovat (vygenerovat HTML předem). Jenže useSearchParams() závisí na aktuální URL, kterou při buildu nezná — URL existuje až v browseru konkrétního uživatele
<Suspense> říká Next.js: "tuto část stránky nevykresluj předem, počkej až ji vykreslí browser".
Netlify pak dostane jen prázdný shell, a formulář se doplní na klientu. Proto fallback={null} — dokud se formulář nenačte, nezobrazuje se nic (nebo tam můžeš dát skeleton loader).
*/
export default function LoginPage() {
    return (
        <>
            <section className="flex min-h-[70vh] items-center justify-center py-10 sm:min-h-[80vh] sm:py-16">
                <div className="w-full max-w-md">
                    <Suspense fallback={<Spinner />}>
                        <LoginForm />
                    </Suspense>
                </div>
            </section>
        </>
    );
}
