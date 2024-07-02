import React, { useEffect, useState } from 'react'
import '../styles/about.css';
import '../styles/general.css';


function About() {

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className={`about-page poiret-one fade-in2 ${visible ? 'visible' : ''}`} aria-label='Our About Page'>

      <section aria-label='Our reason for starting!'>
        <h3 >Passion for Healthy Hair (Established in 2024)</h3>

        <p>At Harry's Hair Oils, we believe everyone deserves to have healthy, beautiful hair. That's why we craft high-quality, natural hair oils designed to nourish, protect, and enhance your hair's natural shine.</p>
      </section>

      <section aria-label='Our story!'>
        <h3 >Our Story</h3>
        <p>Founded in 2024, Harry's Hair Oils started with a simple mission: to provide effective hair care solutions that are free from harsh chemicals and artificial ingredients.</p>
      </section>

      <section aria-label='Our Commitment!'>
        <h3>Our Commitment</h3>
        <p>We use only the finest natural ingredients in our hair oils, ensuring they are gentle enough for all hair types. Our commitment to quality extends beyond our products; we strive to provide exceptional customer service and a positive shopping experience.</p>
      </section>

      <section aria-label='Why Choose Us?'>
        <h3>Why Choose Harry's Hair Oils?</h3>
        <p>Natural Ingredients: We use only the finest natural oils to nourish and protect your hair.</p>
        <p>Effective Results: Our hair oils are formulated to address a variety of hair concerns, from dryness and frizz to breakage and split ends.</p>
        <p>Something for Everyone: We offer a variety of hair oils to suit different hair types and needs.</p>
        <p>Customer Satisfaction: We are committed to providing exceptional customer service and a positive shopping experience.</p>
        <p>Experience the Harry's Hair Oils Difference</p>
        <p>We invite you to explore our collection of natural hair oils and discover the difference they can make for your hair. With Harry's Hair Oils, you can achieve healthy, beautiful hair that shines from the inside out.</p>
      </section>

    </div>
  )
}

export default About
