'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import NewsletterSignup from '@/components/newsletter-signup'
import CartDrawer from '@/components/shop/cart-drawer'
import { useCartStore } from '@/lib/store/cart'

const PRODUCTS = [
  { id:'sapling-moringa', name:'Moringa Sapling Pack (10 pcs)', category:'Saplings', price:'₹250', desc:'10 healthy Moringa oleifera saplings. Ready to plant. Grown at JeeVan Farms, Nalanda.', image:'/plants/moringa.jpg', badge:'Bestseller' },
  { id:'sapling-neem', name:'Neem Sapling Pack (5 pcs)', category:'Saplings', price:'₹180', desc:'5 Azadirachta indica saplings. Natural pesticide tree. Hardy and drought-resistant.', image:'/plants/neem.jpg' },
  { id:'sapling-mango', name:'Mango Grafted Plant (Malda Variety)', category:'Saplings', price:'₹350', desc:'Grafted Malda mango. Fruits in 2 years. Premium Bihar variety.', image:'/plants/mango.jpg', badge:'Premium' },
  { id:'seeds-tulsi', name:'Tulsi Seeds — Rama & Krishna Mix', category:'Seeds', price:'₹60', desc:'Mix of Rama and Krishna Tulsi seeds. 200+ seeds per pack. Medicinal herb.', image:'/plants/tulsi.jpg' },
  { id:'seeds-turmeric', name:'Turmeric Rhizomes (Organic)', category:'Seeds', price:'₹120', desc:'Curcuma longa planting rhizomes. High curcumin variety. 1 kg pack.', image:'/plants/turmeric.jpg' },
  { id:'compost-kit', name:'Home Composting Starter Kit', category:'Tools', price:'₹450', desc:'Complete kit: bin, accelerator, guide. Turn kitchen waste into black gold.', image:'/causes-adira.jpg', badge:'New' },
  { id:'tool-set', name:'Essential Garden Tool Set (5 pcs)', category:'Tools', price:'₹680', desc:'Trowel, pruner, weeder, fork, spray bottle. Professional grade.', image:'/ventures-gardening.jpg' },
  { id:'consulting-intro', name:'Tech Consulting — Intro Session', category:'Services', price:'Free', desc:'30-min consultation. Software, web apps, PC builds, or startup advisory. By B.Tech CSE.', image:'/ventures-tech.jpg' },
]

const CATEGORIES = ['All','Saplings','Seeds','Tools','Services']

export default function ShopPage() {
  const [category, setCategory] = useState('All')
  const { addItem } = useCartStore()
  const filtered = PRODUCTS.filter(p => category === 'All' || p.category === category)

  return (
    <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen">
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="text-center md:text-left flex-1">
              <span className="label" style={{color:'var(--accent-green)'}}>Shop</span>
              <h1 style={{fontFamily:'var(--font-display)'}}>JeeVan Store</h1>
              <p className="lead mt-2 max-w-xl">Saplings, seeds, and tools — from our Nalanda farm. Add to cart, order via WhatsApp.</p>
            </div>
            <div className="hidden md:block"><CartDrawer /></div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  category === c ? 'bg-green-600/20 border border-green-500/30 text-green-300' : 'border text-white/40'
                }`} style={category === c ? {} : {borderColor:'var(--border-subtle)'}}>{c}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p, i) => (
              <motion.div key={p.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                className="card overflow-hidden group hover-lift relative">
                {p.badge && <span className="absolute top-3 left-3 z-10 badge-green text-[9px]">{p.badge}</span>}
                <div className="h-44 overflow-hidden hover-zoom-img">
                  <div className="bg-image w-full h-full bg-cover bg-center transition-transform duration-700" style={{backgroundImage:`url(${p.image})`}} />
                </div>
                <div className="p-4">
                  <span className="text-[10px] uppercase tracking-wider" style={{color:'var(--text-muted)'}}>{p.category}</span>
                  <h3 className="text-sm font-semibold mt-1 mb-1">{p.name}</h3>
                  <p className="text-[11px] mb-3" style={{color:'var(--text-secondary)'}}>{p.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold" style={{color:'var(--accent-green)',fontFamily:'var(--font-display)'}}>{p.price}</span>
                    <button onClick={() => addItem({ id:p.id, name:p.name, price:p.price, image:p.image })} className="btn-primary text-xs px-4 py-2">
                      <ShoppingBag className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6" style={{background:'var(--bg-secondary)'}}>
        <div className="max-w-xl mx-auto"><NewsletterSignup /></div>
      </section>

      <footer className="py-12 px-6 text-center border-t" style={{borderColor:'var(--border-subtle)'}}>
        <p className="small">JeeVan · Nalanda, Bihar · 🌱 Shubham Saurabh</p>
        <nav className="flex justify-center gap-6 mt-3" aria-label="Footer">
          <a href="/" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>Home</a>
          <a href="/blog" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>Blog</a>
          <a href="/contact" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>Contact</a>
                <a href="/pricing" className="text-xs hover:underline" style={{color:"var(--text-muted)"}}>Pricing</a>
                <a href="/blog" className="text-xs hover:underline" style={{color:"var(--text-muted)"}}>Blog</a>
                <a href="/shop" className="text-xs hover:underline" style={{color:"var(--text-muted)"}}>Shop</a>
        </nav>
      </footer>
    </div>
  )
}
