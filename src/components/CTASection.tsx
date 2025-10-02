'use client';

import Link from 'next/link';

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export default function CTASection({ title, description, buttonText, buttonHref }: CTASectionProps) {

  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2>{title}</h2>
          <p>{description}</p>
          <Link href={buttonHref} className="btn btn-primary btn-large">
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
