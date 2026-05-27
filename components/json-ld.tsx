export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Zainul Mutaqin',
    url: 'https://zainulmutaqin.com',
    email: 'akuzainul176@gmail.com',
    jobTitle: 'Full-Stack Developer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jakarta',
      addressCountry: 'Indonesia',
    },
    sameAs: [
      'https://github.com/Zainul342',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
