import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { TextCarousel } from "./components/TextCarousel";
import { SEOHead } from "./components/SEOHead";
import { Camera, Users, Heart, Shield, Loader2 } from "lucide-react";
import { submitToWaitlist } from "../lib/api/googleSheets";
import { isValidEmail } from "../lib/validators/validators";

export default function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (email) {
      if (isValidEmail(email)) {
        setIsLoading(true);
        const result = await submitToWaitlist(email, "hero-form");
        setIsLoading(false);
        if (result.success) {
          setSubmitted(true);
        } else {
          // Handle error (show error message to user)
          console.error(result.message);
        }
      }
    }
  };

  const carouselTexts = ["Real moments", "Real people", "Real connections"];

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MyCandid",
    applicationCategory: "SocialNetworkingApplication",
    description:
      "Authentic social media platform where you share only what you capture in the moment. Real moments, real connections.",
    operatingSystem: "iOS, Android",
  };

  return (
    <>
      <SEOHead />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Header for better semantic structure */}
        <header className="sr-only">
          <h1>MyCandid - Authentic Social Media Platform</h1>
          <p>
            Join the waitlist for the most authentic social media experience
          </p>
        </header>

        <main>
          {/* Hero Section */}
          <section
            className="relative min-h-screen flex items-center justify-center px-4 py-20"
            aria-labelledby="hero-heading"
          >
            <div className="max-w-4xl w-full">
              {/* Content */}
              <div className="space-y-8 text-center">
                <div className="space-y-6">
                  <h1
                    id="hero-heading"
                    className="text-5xl md:text-6xl font-bold text-white leading-tight"
                  >
                    MyCandid: Authentic Social Media Platform
                  </h1>

                  {/* Text Carousel */}
                  <div aria-live="polite" aria-atomic="true">
                    <TextCarousel texts={carouselTexts} />
                  </div>

                  <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                    The social media platform where authenticity isn't optional;
                    it's everything. Share only what you capture in the moment
                    with no fake content, and no curated feeds.
                  </p>
                </div>

                {/* Waitlist Form */}
                {!submitted ? (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 max-w-md mx-auto"
                    aria-label="Join waitlist form"
                  >
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        aria-label="Email address"
                        className="flex-1 h-12 text-base bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading}
                        className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          "Join Waitlist"
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-400">
                      Be among the first to reclaim social media and experience
                      authentic connections.
                    </p>
                  </form>
                ) : (
                  <div
                    className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg max-w-md mx-auto"
                    role="status"
                    aria-live="polite"
                  >
                    <p className="text-green-400 font-medium">
                      🎉 Thanks for joining! We'll be in touch soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* About Section */}
          <section
            className="py-20 px-4 bg-gray-800/50"
            aria-labelledby="about-heading"
          >
            <div className="max-w-6xl mx-auto">
              <header className="text-center mb-16">
                <h2
                  id="about-heading"
                  className="text-4xl font-bold text-white mb-4"
                >
                  Why MyCandid is Different from Other Social Media Platforms
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  We're building a platform that puts humans first.
                </p>
              </header>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                {/* Feature 1 */}
                <article className="text-center space-y-4 p-6 bg-gray-900/50 rounded-xl border border-gray-700">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full"
                    aria-hidden="true"
                  >
                    <Camera className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Capture-Only Social Media
                  </h3>
                  <p className="text-gray-400">
                    Share only what you capture directly in the app. No uploads
                    from gallery, no pre-edited content. Just authentic,
                    in-the-moment photos and videos.
                  </p>
                </article>

                {/* Feature 2 */}
                <article className="text-center space-y-4 p-6 bg-gray-900/50 rounded-xl border border-gray-700">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/10 rounded-full"
                    aria-hidden="true"
                  >
                    <Heart className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    100% Authentic Content
                  </h3>
                  <p className="text-gray-400">
                    No manipulated photos. Just real, unfiltered moments from
                    your life that create genuine connections.
                  </p>
                </article>

                {/* Feature 3 */}
                <article className="text-center space-y-4 p-6 bg-gray-900/50 rounded-xl border border-gray-700">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full"
                    aria-hidden="true"
                  >
                    <Users className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Real Human Connections
                  </h3>
                  <p className="text-gray-400">
                    Connect with friends and family through genuine, spontaneous
                    moments. Build meaningful relationships through authentic
                    sharing.
                  </p>
                </article>

                {/* Feature 4 */}
                <article className="text-center space-y-4 p-6 bg-gray-900/50 rounded-xl border border-gray-700">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-full"
                    aria-hidden="true"
                  >
                    <Shield className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Privacy-First Social Network
                  </h3>
                  <p className="text-gray-400">
                    Your moments are yours. Control who sees your content, when
                    they see it, and how long it stays visible.
                  </p>
                </article>
              </div>

              {/* Image Grid */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <article className="space-y-6">
                  <h3 className="text-3xl font-bold text-white">
                    Take Back Control of Your Social Media Life
                  </h3>
                  <p className="text-lg text-gray-300">
                    Tired of the endless scroll through generated, fake content?
                    MyCandid is different. We believe social media should bring
                    us closer together, not make us feel more distant or
                    inadequate.
                  </p>
                  <p className="text-lg text-gray-300">
                    By limiting what you can share to only what you capture in
                    the moment, we're creating a space where authenticity
                    thrives and genuine human connections flourish. No more
                    pressure to maintain a perfect online persona.
                  </p>
                </article>
                <div
                  className="grid grid-cols-2 gap-4"
                  role="img"
                  aria-label="Examples of authentic moments shared on MyCandid"
                >
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1587272252152-1cf7beb0da6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwbW9tZW50cyUyMHNtYXJ0cGhvbmUlMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NzA1MDEyNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Person capturing authentic real-time moments with smartphone camera on MyCandid social media app"
                    className="rounded-lg h-64 object-cover"
                  />
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1757700314590-0ea0f33541f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW51aW5lJTIwaHVtYW4lMjBjb25uZWN0aW9ufGVufDF8fHx8MTc3MDUwMTI0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Friends making genuine human connections and sharing authentic moments together"
                    className="rounded-lg h-64 object-cover mt-8"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section
            className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600"
            aria-labelledby="cta-heading"
          >
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2
                id="cta-heading"
                className="text-4xl md:text-5xl font-bold text-white"
              >
                Ready to Experience Real Social Media?
              </h2>
              <p className="text-xl text-blue-100">
                Join thousands on the waitlist for early access to MyCandid. Be
                part of the movement to reclaim authentic social connections.
              </p>
              {!submitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="max-w-md mx-auto"
                  aria-label="Join waitlist form"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      aria-label="Email address"
                      className="flex-1 h-12 text-base bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="h-12 px-8 bg-white text-blue-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        "Join Waitlist"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div
                  className="p-6 bg-white/20 border border-white/30 rounded-lg max-w-md mx-auto"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-white font-medium">
                    🎉 You're on the list! Check your email soon.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-12 px-4 bg-gray-950 text-gray-400">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4">
              <div>
                <p className="text-lg font-semibold text-white mb-2">
                  MyCandid
                </p>
                <p className="text-sm mb-4">
                  The Authentic Social Media Platform for Real Connections
                </p>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <p className="text-xs">
                  © 2026 MyCandid. All rights reserved. Real moments, real
                  connections, authentic social media.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
