/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import NewsletterSignup from '@/components/newsletter-signup'
import CartDrawer from '@/components/shop/cart-drawer'
import { useCartStore } from '@/lib/store/cart'
import { useI18n } from '@/lib/i18n'

const FALLBACK = [
  { id:'sapling-moringa', name:'Moringa Sapling (10 pcs)', category:'Saplings', price:'250', desc:'Healthy Moringa saplings from JeeVan Farms, Nalanda.', image:'/plants/moringa.jpg', badge:'Bestseller' },
  { id:'sapling-neem', name:'Neem Sapling (5 pcs)', category:'Saplings', price:'180', desc:'Natural pesticide tree. Drought-resistant.', image:'/plants/neem.jpg' },
  { id:'seeds-tulsi', name:'Tulsi Seeds Mix', category:'Seeds', price:'60', desc:'Rama and Krishna Tulsi. 200+ seeds.', image:'/plants/tulsi.jpg' },
  { id:'compost-kit', name:'Composting Starter Kit', category:'Tools', price:'450', desc:'Complete kit with bin and guide.', image:'/causes-adira.jpg', badge:'New' },
  { id:'tool-set', name:'Garden Tool Set (5 pcs)', category:'Tools', price:'680', desc:'Professional grade tools.', image:'/ventures-gardening.jpg' },
  { id:'consulting', name:'Tech Consulting Intro', category:'Services', price:'0', desc:'30-min consultation by B.Tech CSE.', image:'/ventures-tech.jpg' },
]

export default function ShopPage() {
  const [category, setCategory] = useState('All')
  const { addItem } = useCartStore()
  const { t } = useI18n()
  const [products, setProducts] = useState(FALLBACK)

  useEffect(() => {
    fetch('https://iylyhdddvpsckinpnyxw.supabase.co/rest/v1/shop_products?select=*&is_active=eq.true&order=created_at.desc', {
      headers: { apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bHloZGRkdnBzY2tpbnBueXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMjEyMDEsImV4cCI6MjEwMTU5NzIwMX0.SkAD08YZ_224wous50WUOi5x_BY6Nvg_BBOVf3N9XRU', Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bHloZGRkdnBzY2tpbnBueXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMjEyMDEsImV4cCI6MjEwMTU5NzIwMX0.SkAD08YZ_224wous50WUOi5x_BY6Nvg_BBOVf3N9XRU' }
    }).then(r=>r.json()).then(d=>{if(Array.isArray(d)&&d.length>0)setProducts(d.map((p:any)=>({id:p.id,name:p.name,price:p.price||'0',category:p.category||'General',desc:p.description||'',image:p.image||'/plants/moringa.jpg',badge:p.badge||undefined})))}).catch(()=>{})
  }, [])

  const CATS = ['All','Saplings','Seeds','Tools','Services']
  const filtered = products.filter(p => category === 'All' || p.category === category)
  const fmt = (p:any) => p.price === '0' ? 'Free' : '₹' + p.price

  return (
    <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen">
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="text-center md:text-left flex-1">
              <span className="label" style={{color:'var(--accent-green)'}}>{t('shop.label')}</span>
              <h1 style={{fontFamily:'var(--font-display)'}}>{t('shop.heading')}</h1>
              <p className="lead mt-2 max-w-xl">{t('shop.subtitle')}</p>
            </div>
            <div className="hidden md:block"><CartDrawer /></div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CATS.map(c=>(<button key={c} onClick={()=>setCategory(c)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${category===c?'bg-green-600/20 border border-green-500/30 text-green-300':'border text-white/40'}`} style={category===c?{}:{borderColor:'var(--border-subtle)'}}>{c}</button>))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p,i)=>(
              <motion.div key={p.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} className="card overflow-hidden group hover-lift relative">
                {p.badge&&<span className="absolute top-3 left-3 z-10 badge-green text-[9px]">{p.badge}</span>}
                <div className="h-44 overflow-hidden hover-zoom-img"><div className="bg-image w-full h-full bg-cover bg-center transition-transform duration-700" style={{backgroundImage:`url(${p.image})`}}/></div>
                <div className="p-4">
                  <span className="text-[10px] uppercase tracking-wider" style={{color:'var(--text-muted)'}}>{p.category}</span>
                  <h3 className="text-sm font-semibold mt-1 mb-1">{p.name}</h3>
                  <p className="text-[11px] mb-3" style={{color:'var(--text-secondary)'}}>{p.desc?.slice(0,80)}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold" style={{color:'var(--accent-green)',fontFamily:'var(--font-display)'}}>{fmt(p)}</span>
                    <button onClick={()=>addItem({id:p.id,name:p.name,price:fmt(p),image:p.image})} className="btn-primary text-xs px-4 py-2"><ShoppingBag className="w-3.5 h-3.5"/>Add</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-6" style={{background:'var(--bg-secondary)'}}><div className="max-w-xl mx-auto"><NewsletterSignup/></div></section>
      <footer className="py-12 px-6 text-center border-t" style={{borderColor:'var(--border-subtle)'}}>
        <p className="small">{t('footer.short')}</p>
        <nav className="flex justify-center gap-6 mt-3">
          <a href="/" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.home')}</a>
          <a href="/blog" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.blog')}</a>
          <a href="/contact" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.contact')}</a>
        </nav>
      </footer>
    </div>
  )
}
