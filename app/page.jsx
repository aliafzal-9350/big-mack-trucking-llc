import Image from 'next/image';
import Stage from '@/components/Stage';
import Hud from '@/components/hud/Hud';
import SmoothScroll from '@/components/SmoothScroll';
import QuoteForm from '@/components/QuoteForm';
import IsoIcon from '@/components/iso/IsoIcon';
import logo from '@/public/image/logo-transparent.png';

function Stop({ n, icon, children }) {
  return (
    <p className="stop">
      <IsoIcon name={icon} className="stop-icon" />
      <span className="stop-n">Stop {n}</span>
      <span className="stop-place">{children}</span>
    </p>
  );
}

export default function HomePage() {
  return (
    <>
      <Stage />
      <SmoothScroll />
      <Hud />

      <main id="top">
        <section className="beat hero" aria-labelledby="hero-title">
          <div className="beat-copy hero-copy" data-beat="hero">
            <h1 id="hero-title" className="hero-title">
              <span>Freight you</span> <span>can count on.</span>
            </h1>
            <p className="hero-lede">
              A 26-ft dock-high box truck with a 3,500-lb liftgate, an onboard pallet jack and a TWIC-cleared
              driver. Expedited freight across New York and New Jersey, booked directly with owner Omari Headley.
            </p>
            <div className="hero-actions">
              <a href="#book" className="button button-primary">
                Get a quote
              </a>
              <a href="tel:5165088078" className="button button-quiet">
                Call (516) 508-8078
              </a>
            </div>
            <ul className="credentials" aria-label="Operating authority">
              <li>USDOT 3843409</li>
              <li>MC 1398475</li>
              <li>TWIC certified</li>
            </ul>
          </div>
          <p className="scroll-cue" aria-hidden="true">
            <span>Scroll to follow a sample run</span>
          </p>
        </section>

        <section id="pickup" className="beat beat-right" aria-labelledby="pickup-title">
          <div className="beat-copy" data-beat="pickup">
            <Stop n={1} icon="dock">
              Pickup at JFK Air Cargo
            </Stop>
            <h2 id="pickup-title">Backs up level with the dock.</h2>
            <p>
              The floor sits at standard dock height, so pallets roll straight on from the warehouse. No ramp and no
              waiting on a forklift.
            </p>
            <dl className="specs">
              <div>
                <dt>Box</dt>
                <dd>26-ft straight box, dock-high</dd>
              </div>
              <div>
                <dt>Capacity</dt>
                <dd>Up to 12 pallets, 48 × 40</dd>
              </div>
              <div>
                <dt>Rating</dt>
                <dd>26,000 lb GVWR, non-CDL</dd>
              </div>
            </dl>
          </div>
        </section>

        <section id="transit" className="beat beat-left beat-tall" aria-labelledby="transit-title">
          <div className="beat-copy" data-beat="transit">
            <Stop n={2} icon="route">
              In transit on I-278 West
            </Stop>
            <h2 id="transit-title">Tracked from pickup to drop.</h2>
            <p>
              Continuous load tracking and one direct line. The owner drives the truck, so the person who answers
              dispatch is the person hauling your freight.
            </p>
          </div>
          <div className="beat-copy beat-copy-second" data-beat="map">
            <h3>The sample route</h3>
            <p>
              JFK Air Cargo to Port Newark by the Verrazzano-Narrows and Goethals bridges: about 36 miles, clearing the
              port gate on the way to the final drop.
            </p>
            <ul className="features">
              <li>
                <IsoIcon name="route" className="feature-icon" />
                <span>Load tracking from pickup to delivery</span>
              </li>
              <li>
                <IsoIcon name="clock" className="feature-icon" />
                <span>Dispatch answers 24/7, including nights and weekends</span>
              </li>
            </ul>
            <p className="note">The readouts on screen follow this sample run. They are an illustration, not a live feed.</p>
          </div>
        </section>

        <section id="port" className="beat beat-right" aria-labelledby="port-title">
          <div className="beat-copy" data-beat="port">
            <Stop n={3} icon="twic">
              Port Newark gate
            </Stop>
            <h2 id="port-title">Straight through the port gate.</h2>
            <p>
              An active TWIC card means unescorted access to marine terminals and bonded air cargo warehouses: no escort
              fees and no waiting for one.
            </p>
            <ul className="places">
              <li>Port Newark and Elizabeth Marine Terminal</li>
              <li>Red Hook Container Terminal, Brooklyn</li>
              <li>JFK and Newark air cargo</li>
            </ul>
          </div>
        </section>

        <section id="drop" className="beat beat-left" aria-labelledby="drop-title">
          <div className="beat-copy" data-beat="drop">
            <Stop n={4} icon="liftgate">
              Drop with no dock
            </Stop>
            <h2 id="drop-title">No dock at the other end? Still delivered.</h2>
            <p>
              The hydraulic liftgate lowers freight to street level and the onboard pallet jack moves it the rest of the
              way. Storefronts, job sites and other ground-level drops all work.
            </p>
            <ul className="kit">
              <li>
                <IsoIcon name="liftgate" className="kit-icon" />
                <span className="kit-name">Liftgate</span>
                <span className="kit-spec">3,500 lb hydraulic</span>
              </li>
              <li>
                <IsoIcon name="palletJack" className="kit-icon" />
                <span className="kit-name">Pallet jack</span>
                <span className="kit-spec">Rides onboard</span>
              </li>
              <li>
                <IsoIcon name="straps" className="kit-icon" />
                <span className="kit-name">Straps and E-track</span>
                <span className="kit-spec">Load secured</span>
              </li>
            </ul>
          </div>
        </section>

        <section id="book" className="beat beat-left beat-book" aria-labelledby="book-title">
          <div className="beat-copy book-copy" data-beat="book">
            <Stop n={5} icon="pallets">
              Your load next
            </Stop>
            <h2 id="book-title">Put your load on the truck.</h2>
            <p>Tell dispatch what&apos;s moving. Rates are confirmed by phone or email, day or night.</p>
            <QuoteForm />
            <div className="direct">
              <a href="tel:5165088078" className="direct-line">
                <IsoIcon name="phone" className="direct-icon" />
                <span className="direct-label">Dispatch, 24/7</span>
                <span className="direct-value">(516) 508-8078</span>
              </a>
              <a href="mailto:Bigmacklogisticsa1@gmail.com" className="direct-line">
                <IsoIcon name="mail" className="direct-icon" />
                <span className="direct-label">Rate confirmations and load sheets</span>
                <span className="direct-value direct-email">Bigmacklogisticsa1@gmail.com</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Image src={logo} alt="Big Mack Trucking LLC" width={72} height={72} />
            <div>
              <p className="footer-name">Big Mack Trucking LLC</p>
              <p>Expedited dock-high freight across New York and New Jersey. Principal: Omari Headley.</p>
            </div>
          </div>
          <div className="footer-cols">
            <div>
              <h2>Equipment</h2>
              <ul>
                <li>26-ft dock-high straight box</li>
                <li>3,500-lb hydraulic liftgate</li>
                <li>Onboard pallet jack</li>
                <li>Ratchet straps and E-track</li>
              </ul>
            </div>
            <div>
              <h2>Authority</h2>
              <ul>
                <li>USDOT 3843409</li>
                <li>MC 1398475</li>
                <li>26,000 lb GVWR</li>
                <li>TWIC-certified driver</li>
              </ul>
            </div>
            <div>
              <h2>Dispatch</h2>
              <ul>
                <li>
                  <a href="tel:5165088078">(516) 508-8078</a>
                </li>
                <li>
                  <a href="mailto:Bigmacklogisticsa1@gmail.com">Bigmacklogisticsa1@gmail.com</a>
                </li>
                <li>Answering 24/7</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="footer-legal">© {new Date().getFullYear()} Big Mack Trucking LLC. All rights reserved.</p>
      </footer>
    </>
  );
}
