'use client'

import React from 'react'
import { Check, Sprout, Wrench, Monitor, Camera, ArrowRight } from 'lucide-react'
import NewsletterSignup from '@/components/newsletter-signup'
import { useI18n } from '@/lib/i18n'

export default function PricingPage() {
  const { t } = useI18n()

  const PLANS = [
    { name:t('venture.nursery'), icon:<Sprout className="w-6 h-6"/>, color:'var(--accent-green)', items:['10 Moringa saplings','5 Neem saplings','3 Mango grafts','2 Papaya plants','Free planting guide','WhatsApp support','Delivery across India'], price:'Starts at ₹250' },
    { name:t('venture.gardening'), icon:<Wrench className="w-6 h-6"/>, color:'var(--accent-gold)', items:['Rooftop garden setup','Living lawn design','Composting system','Tool rental','Soil testing','Monthly maintenance','2 site visits'], price:'Custom quote' },
    { name:t('venture.tech'), icon:<Monitor className="w-6 h-6"/>, color:'var(--accent-sage)', items:['Web app development','Mobile app development','PC build architecture','Startup infrastructure','Code review','Technical documentation','Flexible hours'], price:'Custom quote' },
    { name:t('venture.studio'), icon:<Camera className="w-6 h-6"/>, color:'#8a5a9e', items:['Photography session','Video production','Content creation','Event coverage','Drone shots','Post-production','Raw files included'], price:'Starts at ₹1,500' },
  ]

  return (
    <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen">
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="label" style={{color:'var(--accent-green)'}}>{t('pricing.label')}</span>
            <h1 style={{fontFamily:'var(--font-display)'}}>{t('pricing.heading')}</h1>
            <p className="lead mt-3 max-w-xl mx-auto">{t('pricing.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map(plan => (
              <div key={plan.name} className="card p-6 flex flex-col hover-lift">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{background:'rgba(90,158,75,0.1)',color:plan.color}}>{plan.icon}</div>
                <h3 className="text-lg mb-1" style={{fontFamily:'var(--font-display)'}}>{plan.name}</h3>
                <p className="text-lg font-bold mb-4" style={{color:'var(--accent-green)'}}>{plan.price}</p>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs" style={{color:'var(--text-secondary)'}}>
                      <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{color:'var(--accent-green)'}} />{item}
                    </li>
                  ))}
                </ul>
                <a href="/contact" className="btn-secondary w-full justify-center text-xs">{t('pricing.cta')} <ArrowRight className="w-3.5 h-3.5" /></a>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-6" style={{background:'var(--bg-secondary)'}}><div className="max-w-xl mx-auto"><NewsletterSignup /></div></section>
    </div>
  )
}
