import { useNavigate } from 'react-router-dom'
import '../css/AboutUsPage.css'
import Logo from '../assets/logav2-cropped.svg?react'

export default function AboutUs() {

    const navigate = useNavigate();

    const navThemeDays = () => navigate('/TemaDagar');
    const navKiosk = () => navigate('/Kiosk');
    const navContact = () => navigate('/contact');

    return <>
        <article className="aboutus-page">
            <section className="aboutus-info">
                <h1 className='font-medium text-(--font-primary) text-shadow-lg/30 pb-4'>Om Filmvisarna AB</h1>
                <h3 className='font-medium text-xl flex justify-center items-center pb-4'>Den personliga bioupplevelsen i Småstad</h3>
                <p className='pb-2'>Filmvisarna AB föddes ur en enkel dröm: att ge Småstad den bioupplevelse staden förtjänar.
                    Medan de stora biograferna blir alltmer opersonliga,
                    tror vi på den lokala närvaron.
                    Vi är den lilla biografkedjan med det stora hjärtat,
                    strategiskt placerade i hjärtat av Småstad för att erbjuda ett nära
                    och högkvalitativt alternativ för alla filmälskare.
                    Våra Salonger</p>
                <p className='pb-2'>I vår biografbyggnad hittar du två toppmoderna salonger utrustade
                    för att ge dig bästa möjliga bild och ljud.
                    Oavsett om du ser en storslagen blockbuster
                    eller en gripande indiefilm, sitter du bekvämt i
                    våra numrerade stolar
                    (som vi dessutom numrerat pedagogiskt från höger till vänster,
                    framifrån och bakåt - så att du alltid hittar rätt!).
                    Film för alla åldrar och plånböcker</p>
                <p className='pb-2'>Vi anser att kultur ska vara tillgänglig.
                    Därför har vi förmånliga priser för våra minsta
                    filmstjärnor och våra mest erfarna biobesökare:</p>
                <ul className='list-disc pl-4 pb-2'>
                    <li className=''>Vuxen: 140 kr</li>
                    <li>Pensionär: 120 kr</li>
                    <li>Barn (under 12 år): 80 kr</li>
                </ul>
                <p className='pb-2'>Hos oss behöver du inte betala i förskott.
                    Du bokar enkelt dina favoritplatser via vår hemsida,
                    får ett unikt bokningsnummer och betalar först när du
                    kommer till biografen för att hämta ut dina biljetter.
                    Teknik möter tradition</p>
                <p>Vår nya webbplats är utvecklad med fokus på dig som besökare.
                    Här kan du inte bara se trailers och läsa om aktuella filmer,
                    utan även använda vår smarta platsväljare för att boka de bästa
                    lediga stolarna åt ditt sällskap.
                    Är du osäker på något? Fråga vår digitala AI-assistent
                    som har koll på allt från popcornutbud till visningstider!</p>

            </section>
            <div className="big-logo">
                <Logo aria-label="Logotyp av Filmvisarna" />
            </div>
            <section className="side-link">
                <div className='grid items-center justify-center'>
                    <h3 className='font-medium text-2xl flex justify-center items-center pb-4'>Tema dagar:</h3>
                    <p className='pb-6'>Hos oss är varje dag en ny filmupplevelse! Vi kör olika genrer beroende på veckodag,
                        så att du alltid vet vilken typ av stämning som väntar i salongen.</p>
                    <button className='theme-days-btn'
                        onClick={navThemeDays}>Tema dagar</button>
                </div>
                <div className='grid items-center justify-center'>
                    <h3 className='font-medium text-2xl flex justify-center items-center pb-4'>Kiosk: </h3>
                    <p className='pb-6'>I vår kiosk hittar du ett varierat utbud av snacks, dryck och enklare måltider.
                        Vi strävar efter att erbjuda något för alla smaker,
                        oavsett om du är sugen på något sött, salt eller uppfriskande.</p>
                    <button className='kiosk-btn'
                        onClick={navKiosk}>Kiosk</button>
                </div>
                <div className='grid items-center justify-center'>
                    <h3 className='font-medium text-2xl flex justify-center items-center pb-4'>Kontaka oss:</h3>
                    <p className='pb-6'>Har du frågor, funderingar eller förslag? Vi finns här för att hjälpa dig.
                        Tveka inte att ta kontakt med oss via formuläret nedan eller genom våra kontaktuppgifter.</p>
                    <button className='contact-us-btn'
                        onClick={navContact}>Kontakta oss</button>
                </div>
            </section>
        </article>
    </>
}