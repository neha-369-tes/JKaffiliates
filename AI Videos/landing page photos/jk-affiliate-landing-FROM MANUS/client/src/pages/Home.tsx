import { useState } from 'react';
import { Header } from '@/components/Header';
import { LandingHero } from '@/components/LandingHero';
import { ScrollRevealText } from '@/components/ScrollRevealText';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

/**
 * Home Page Component
 * 
 * Design Philosophy: Luxury Fashion Editorial
 * - Full scrollable landing page
 * - Hero section with scroll-reveal text
 * - Category toggle (Women | Men)
 * - Multiple content sections
 * - Call-to-action sections
 * - Login flow integration
 */
export default function Home() {
  const [activeCategory, setActiveCategory] = useState<'women' | 'men'>('women');

  const handleCategoryChange = (category: 'women' | 'men') => {
    setActiveCategory(category);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <LandingHero onCategoryChange={handleCategoryChange} />

      {/* Shop by Category Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollRevealText variant="slideUp" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our curated collections of premium fashion items
            </p>
          </ScrollRevealText>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Dresses', 'Bags', 'Footwear', 'Accessories'].map((category, index) => (
              <ScrollRevealText
                key={category}
                variant="slideUp"
                delay={index * 0.1}
                className="group"
              >
                <div className="relative h-64 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300">
                  {/* Placeholder for category image */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-200 to-purple-100">
                    <span className="text-purple-600 font-semibold text-lg">{category}</span>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
                    <div className="w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <h3 className="text-white font-semibold text-lg">{category}</h3>
                    </div>
                  </div>
                </div>
              </ScrollRevealText>
            ))}
          </div>
        </div>
      </section>

      {/* Editor's Picks Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <ScrollRevealText variant="slideUp" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Editor's Picks
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Curated and hand-picked affordable finds from top brands
            </p>
          </ScrollRevealText>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Flare Dress', price: '₹2,690.00' },
              { name: 'Mini Dress', price: '₹1,890.00' },
              { name: 'Hand Bag', price: '₹711.00' },
              { name: 'Strappy Heels', price: '₹2,593.00' },
            ].map((product, index) => (
              <ScrollRevealText
                key={product.name}
                variant="slideUp"
                delay={index * 0.1}
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  {/* Product Image Placeholder */}
                  <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Product Image</span>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold">{product.price}</span>
                      <span className="text-gray-400 text-sm line-through">₹3,500.00</span>
                    </div>
                  </div>
                </div>
              </ScrollRevealText>
            ))}
          </div>
        </div>
      </section>

      {/* Why Shop With Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollRevealText variant="slideUp" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Shop With Us
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Helping you find the best deals, curated with care
            </p>
          </ScrollRevealText>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: 'Handpicked Deals',
                description: 'Carefully curated selection of verified deals and offers for quality and value',
              },
              {
                number: '02',
                title: 'Top Brand Partners',
                description: 'We partner with trusted brands and retailers to bring you authentic products',
              },
              {
                number: '03',
                title: 'Best Price Guarantee',
                description: 'We track prices so you always get the lowest available price on every product',
              },
            ].map((benefit, index) => (
              <ScrollRevealText
                key={benefit.number}
                variant="slideUp"
                delay={index * 0.15}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-4">{benefit.number}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </ScrollRevealText>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <ScrollRevealText variant="slideUp" className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Saving Today
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
              Browse thousands of curated deals on dresses, bags, footwear, accessories and more. All from trusted brands.
            </p>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-3"
            >
              Explore Deals
            </Button>
          </ScrollRevealText>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollRevealText variant="slideUp" className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Stay in the Loop
            </h2>
            <p className="text-gray-600 mb-8">
              Get notified about the latest deals and exclusive offers
            </p>

            {/* Newsletter Form */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-8">
                Subscribe
              </Button>
            </div>
          </ScrollRevealText>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
