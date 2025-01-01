import Hero from '~/components/landing/hero';
import Navbar from '~/components/landing/navbar';
export function Welcome() {
    return (
        <div className='flex flex-col w-full bb'>
            <Navbar/>
            <Hero/>
        </div>
    );
}
