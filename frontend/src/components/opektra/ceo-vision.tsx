import Image from "next/image";
import { company } from "@/lib/opektra";
import { Reveal } from "./motion";
import "./ceo-vision.css";

export function CeoVision() {
  return (
    <section className="op-ceo-vision" aria-labelledby="ceo-vision-heading">
      <div className="op-ceo-grid">
        <Reveal className="op-ceo-portrait">
          <figure>
            <div className="op-ceo-photo">
              <Image
                src="/opektra/soumen-karmakar.png"
                alt="Soumen Karmakar in his office"
                fill
                sizes="(max-width: 460px) calc(100vw - 40px), (max-width: 900px) 420px, (max-width: 1150px) 40vw, 480px"
              />
            </div>
            <figcaption id="ceo-attribution" className="op-ceo-attribution">
              <strong>{company.owner}</strong>
              <span>Founder &amp; CEO, {company.name}</span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="op-ceo-copy">
          <Reveal>
            <p className="op-eyebrow">CEO’s vision</p>
            <h2 id="ceo-vision-heading">
              Technology should<br />
              <em>bring business together.</em>
            </h2>
          </Reveal>
          <blockquote className="op-ceo-statement" aria-describedby="ceo-attribution">
            <Reveal delay={0.05}>
              <p className="op-ceo-opening">
                My vision for Opektra is to build technology that helps businesses
                move forward with clarity and confidence. We start with real
                problems, design around people, and engineer products that
                <strong> make everyday work simpler.</strong>
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Conektra gives that vision a practical form—bringing customer
                conversations, bookings, teams, payments and operations into one
                connected workspace. Our ambition is to give business owners more
                time to serve their customers and grow their business.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p>
                As Opektra grows, our commitment remains the same: thoughtful
                design, dependable engineering and responsible automation. We want
                to create software that businesses can trust today, improve with
                experience, and build their future around.
              </p>
            </Reveal>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
