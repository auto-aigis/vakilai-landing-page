"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Scale,
  FileText,
  Search,
  Languages,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Shield,
  Zap,
  BookOpen,
  ChevronRight,
} from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

interface Testimonial {
  name: string;
  location: string;
  role: string;
  text: string;
  rating: number;
}

const features: Feature[] = [
  {
    icon: <Languages className="w-6 h-6 text-amber-500" />,
    title: "Multilingual Summaries",
    description:
      "Get court judgment summaries in English, Telugu, and Hindi. Understand complex rulings in the language you think in.",
    badge: "Telugu & Hindi",
  },
  {
    icon: <Search className="w-6 h-6 text-amber-500" />,
    title: "Precedent Discovery",
    description:
      "Instantly surface relevant Indian case law from Supreme Court, High Courts, and Tribunals. Never miss a critical precedent again.",
    badge: "Indian Databases",
  },
  {
    icon: <FileText className="w-6 h-6 text-amber-500" />,
    title: "Auto-Draft Legal Documents",
    description:
      "Generate standard legal notices, petitions, and applications in minutes. Edit and finalize — skip the blank page entirely.",
    badge: "Save 4+ Hours",
  },
  {
    icon: <BookOpen className="w-6 h-6 text-amber-500" />,
    title: "Case File Ingestion",
    description:
      "Upload PDFs, scanned documents, or paste text. VakilAI parses and organizes your case files automatically.",
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-500" />,
    title: "Plain Language Explanations",
    description:
      "Complex legal jargon translated into clear, actionable summaries. Explain proceedings to clients with confidence.",
  },
  {
    icon: <Shield className="w-6 h-6 text-amber-500" />,
    title: "Secure & Private",
    description:
      "Your case data stays encrypted and private. Built to meet Indian data protection standards for legal professionals.",
  },
];

const steps: Step[] = [
  {
    number: "01",
    title: "Upload Your Case Files",
    description:
      "Upload court judgments, FIRs, contracts, or any legal document in PDF or text format.",
  },
  {
    number: "02",
    title: "AI Analysis in Seconds",
    description:
      "VakilAI extracts key facts, identifies legal issues, and retrieves matching precedents from Indian case law.",
  },
  {
    number: "03",
    title: "Get Summaries & Drafts",
    description:
      "Receive plain-language summaries in your preferred language and auto-generated document drafts ready to edit.",
  },
  {
    number: "04",
    title: "Win More Cases, Faster",
    description:
      "Cut research time from 5 hours to 30 minutes. Serve more clients and grow your practice.",
  },
];

const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    description: "Perfect for solo advocates just getting started with AI.",
    features: [
      "25 document analyses/month",
      "English summaries only",
      "Basic precedent search",
      "5 document drafts/month",
      "Email support",
    ],
    highlighted: false,
    cta: "Start Free Trial",
  },
  {
    name: "Professional",
    price: "₹2,499",
    period: "/month",
    description: "The complete toolkit for serious independent advocates.",
    features: [
      "Unlimited document analyses",
      "English + Telugu + Hindi",
      "Advanced precedent retrieval",
      "Unlimited document drafts",
      "Priority support",
      "Case timeline generator",
      "Client-ready summaries",
    ],
    highlighted: true,
    cta: "Start Free Trial",
  },
  {
    name: "Office",
    price: "₹5,999",
    period: "/month",
    description: "For small offices with 2–3 advocates and shared workflows.",
    features: [
      "Everything in Professional",
      "Up to 3 user seats",
      "Shared case library",
      "Team collaboration tools",
      "Dedicated onboarding call",
      "Custom document templates",
    ],
    highlighted: false,
    cta: "Contact Sales",
  },
];

const testimonials: Testimonial[] = [
  {
    name: "Adv. Ramesh Naidu",
    location: "Vijayawada, AP",
    role: "Criminal Advocate, 12 years",
    text: "I was spending 4 hours every night on research. VakilAI gives me Telugu summaries I can read on my phone. My juniors save 3 hours a day now.",
    rating: 5,
  },
  {
    name: "Adv. Sunita Deshmukh",
    location: "Aurangabad, Maharashtra",
    role: "Family Law Specialist",
    text: "The precedent search is incredible. It found a 2019 Bombay HC judgment I had completely missed. That single result won my client\u2019s case.",
    rating: 5,
  },
  {
    name: "Adv. Venkateswara Rao",
    location: "Hyderabad, Telangana",
    role: "Civil Litigation Advocate",
    text: "Auto-drafting legal notices saves me 2 hours per case. The Hindi and Telugu support is something no other tool offers at this price.",
    rating: 5,
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Scale className="w-7 h-7 text-amber-500" />
              <span className="text-xl font-bold text-gray-900">VakilAI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                Start Free Trial
              </Button>
            </div>
            <div className="md:hidden">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                Try Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-gray-950 via-gray-900 to-amber-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/20">
              Built for Indian Advocates in Tier 2 & 3 Cities
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              AI Legal Research{" "}
              <span className="text-amber-400">in Telugu, Hindi</span>
              {" & English"}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-4 leading-relaxed">
              VakilAI helps solo and small Indian advocates cut research time from 5 hours to 30
              minutes. Summarize judgments, find precedents, and draft legal notices — without a
              law firm budget.
            </p>
            <p className="text-base text-amber-400/80 mb-10 font-medium">
              Serving advocates in Telangana, Andhra Pradesh & Maharashtra
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-base font-semibold"
              >
                Start 14-Day Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white px-8 py-6 text-base"
              >
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Setup in 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-xs text-gray-500 font-mono">VakilAI Dashboard</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900/80 rounded-xl p-4 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-amber-400 font-medium">Case Summary (Telugu)</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-700 rounded w-full" />
                    <div className="h-2 bg-gray-700 rounded w-4/5" />
                    <div className="h-2 bg-gray-700 rounded w-3/4" />
                    <div className="h-2 bg-amber-500/30 rounded w-full" />
                    <div className="h-2 bg-amber-500/30 rounded w-5/6" />
                  </div>
                </div>
                <div className="bg-gray-900/80 rounded-xl p-4 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-blue-400 font-medium">Precedents Found</span>
                  </div>
                  <div className="space-y-2">
                    {["SC 2022 - Relevant", "HC AP 2021", "HC TS 2020"].map((item) => (
                      <div key={item} className="flex items-center gap-2 bg-gray-800 rounded p-2">
                        <ChevronRight className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        <span className="text-xs text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-900/80 rounded-xl p-4 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">Time Saved Today</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">4.5 hrs</div>
                  <div className="text-xs text-gray-400">vs manual research</div>
                  <div className="mt-3 bg-green-500/20 rounded-lg p-2">
                    <div className="text-xs text-green-400 font-medium">Draft ready in 2 min</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Strip */}
      <section className="bg-amber-50 py-12 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">3–5 hrs</div>
              <div className="text-gray-700 font-medium">Daily manual research by solo advocates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">30 min</div>
              <div className="text-gray-700 font-medium">Research time with VakilAI</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">0</div>
              <div className="text-gray-700 font-medium">Affordable AI tools in Telugu/Hindi before this</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything a Solo Advocate Needs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Designed specifically for independent practitioners in Telangana, AP, and Maharashtra
              — not Big Law.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      {feature.icon}
                    </div>
                    {feature.badge && (
                      <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 mt-3">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Language Tabs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Read Judgments in Your Language
            </h2>
            <p className="text-gray-600">
              The same Supreme Court judgment — instantly understood in the language you prefer.
            </p>
          </div>
          <Tabs defaultValue="english" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="english">English</TabsTrigger>
              <TabsTrigger value="telugu">Telugu</TabsTrigger>
              <TabsTrigger value="hindi">Hindi</TabsTrigger>
            </TabsList>
            <TabsContent value="english">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-blue-100 text-blue-700 border-0">Auto-generated Summary</Badge>
                    <span className="text-xs text-gray-400">SC Civil Appeal 2023</span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">
                    The Supreme Court held that in matters of property dispute arising from unregistered
                    sale agreements, the plaintiff must establish part performance under Section 53A of
                    the Transfer of Property Act. The court reaffirmed that possession alone is
                    insufficient without proof of continuous, open occupation and readiness to perform
                    the contractual obligations.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs">Key: Section 53A TPA</Badge>
                    <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">Property Law</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="telugu">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-amber-100 text-amber-700 border-0">స్వయంచాలక సారాంశం</Badge>
                    <span className="text-xs text-gray-400">SC Civil Appeal 2023</span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">
                    సుప్రీంకోర్టు నిర్ణయించింది: నమోదు కాని అమ్మకపు ఒప్పందాల నుండి ఉత్పన్నమయ్యే ఆస్తి
                    వివాదాల విషయంలో, వాది ట్రాన్స్‌ఫర్ ఆఫ్ ప్రాపర్టీ యాక్ట్ సెక్షన్ 53A కింద పాక్షిక
                    నిర్వహణను నిరూపించాలి. స్వాధీనం మాత్రమే సరిపోదు — నిరంతర, బహిరంగ ఆక్రమణ మరియు
                    ఒప్పంద బాధ్యతలను నెరవేర్చడానికి సంసిద్ధత అవసరం.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs">కీలకం: సెక్షన్ 53A TPA</Badge>
                    <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">ఆస్తి చట్టం</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="hindi">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-orange-100 text-orange-700 border-0">स्वतः सारांश</Badge>
                    <span className="text-xs text-gray-400">SC Civil Appeal 2023</span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">
                    सर्वोच्च न्यायालय ने निर्णय दिया: अपंजीकृत बिक्री समझौतों से उत्पन्न संपत्ति विवादों में
                    वादी को संपत्ति हस्तांतरण अधिनियम की धारा 53A के अंतर्गत आंशिक निष्पादन साबित करना
                    होगा। केवल कब्जा पर्याप्त नहीं है — निरंतर, खुला कब्जा और अनुबंध दायित्वों को पूरा
                    करने की तत्परता आवश्यक है।
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs">मुख्य: धारा 53A TPA</Badge>
                    <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">संपत्ति कानून</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              From Upload to Insight in Minutes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No technical setup. No training required. Just upload your document and let VakilAI do
              the research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="bg-gray-50 rounded-2xl p-6 h-full border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all">
                  <div className="text-4xl font-bold text-amber-200 mb-4">{step.number}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-6 h-6 text-amber-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
              Advocate Stories
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Trusted by Advocates Across South India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="bg-gray-900 border-gray-800 hover:border-amber-500/30 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">{testimonial.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                      <Scale className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-gray-500 text-xs">{testimonial.role}</div>
                      <div className="text-amber-400 text-xs">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Priced for Independent Advocates
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No enterprise contracts. No hidden fees. Cancel anytime. Start with a 14-day free
              trial on any plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.highlighted
                    ? "border-amber-400 shadow-xl shadow-amber-100 scale-105"
                    : "border-gray-200"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-amber-500 text-white border-0 px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            All prices in Indian Rupees (INR). GST applicable. Annual plans available with 2 months
            free.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-amber-500 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Reclaim Your Day?
          </h2>
          <p className="text-xl text-amber-100 mb-10 max-w-2xl mx-auto">
            Join hundreds of advocates in Telangana, AP, and Maharashtra who have already cut their
            research time by 90%.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-0 text-gray-900 placeholder:text-gray-400 h-12 flex-1"
                required
              />
              <Button
                type="submit"
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white h-12 px-6 whitespace-nowrap"
              >
                Start Free Trial
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-3 bg-white/20 rounded-xl p-6 max-w-md mx-auto">
              <CheckCircle className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-lg">
                {"You're on the list! We'll be in touch shortly."}
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-amber-100 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Support in Telugu & Hindi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-amber-500" />
              <span className="text-lg font-bold text-white">VakilAI</span>
              <span className="text-gray-500 text-sm ml-2">
                AI legal research for Indian advocates
              </span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-600 text-sm">
            <p>
              {"\u00A9 2024 VakilAI. Built for advocates in Telangana, Andhra Pradesh & Maharashtra."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}