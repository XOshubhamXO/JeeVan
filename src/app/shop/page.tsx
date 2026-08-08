/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Search } from 'lucide-react'
import NewsletterSignup from '@/components/newsletter-signup'
import CartDrawer from '@/components/shop/cart-drawer'
import { useCartStore } from '@/lib/store/cart'
import { useI18n } from '@/lib/i18n'

const FALLBACK = [
  { id:'s1',name:'Moringa Sapling Pack (10 pcs)',category:'Saplings',price:'250',desc:'Healthy Moringa oleifera. Ready to plant. Grown at JeeVan Farms.',image:'/plants/moringa.jpg',badge:'Bestseller' },
  { id:'s2',name:'Neem Sapling Pack (5 pcs)',category:'Saplings',price:'180',desc:'Natural pesticide tree. Organic grown.',image:'/plants/neem.jpg' },
  { id:'s3',name:'Mango Grafted Plant (Malda)',category:'Saplings',price:'350',desc:'Premium Bihar Malda mango. Fruits in 2 years.',image:'/plants/mango.jpg',badge:'Premium' },
  { id:'s4',name:'Tulsi Seeds — Rama & Krishna',category:'Seeds',price:'60',desc:'200+ seeds. Medicinal adaptogenic herb.',image:'/plants/tulsi.jpg' },
  { id:'s5',name:'Turmeric Rhizomes (Organic)',category:'Seeds',price:'120',desc:'High curcumin variety. 1 kg pack.',image:'/plants/turmeric.jpg' },
  { id:'s6',name:'Heirloom Tomato Seeds',category:'Seeds',price:'80',desc:'Non-hybrid. Superior flavor. Seed-saving variety.',image:'/plants/heirloom-tomato.jpg',badge:'New' },
  { id:'s7',name:'Magahi Paan Sapling',category:'Saplings',price:'200',desc:'Authentic Nalanda betel leaf. Bareja-grown.',image:'/plants/magahi-paan.jpg',badge:'Heritage' },
  { id:'s8',name:'Home Composting Starter Kit',category:'Tools',price:'450',desc:'Bin + accelerator + guide. Turn waste to gold.',image:'/shop-tools-01.jpg',badge:'New' },
  { id:'s9',name:'Garden Tool Set (5 pcs)',category:'Tools',price:'680',desc:'Professional grade. Trowel, pruner, weeder, fork, spray.',image:'/shop-tools-01.jpg' },
  { id:'s10',name:'Organic Vermicompost (5 kg)',category:'Tools',price:'299',desc:'Rich earthworm compost from JeeVan farm.',image:'/nalanda-hands.jpg' },
  { id:'s11',name:'Seed Starting Kit',category:'Tools',price:'550',desc:'Tray, coco peat, labels, spray bottle. Complete.',image:'/shop-seeds-01.jpg' },
  { id:'s12',name:'Tech Consulting — Intro Session',category:'Services',price:'0',desc:'30-min consultation. Software, PC builds, startup advice.',image:'/ventures-tech.jpg',badge:'Free' },
  { id:'s13',name:'Photography Session',category:'Services',price:'1500',desc:'Professional farm/product photography. 2-hour session.',image:'/ventures-studio.jpg' },
  { id:'s14',name:'Garden Design Consultation',category:'Services',price:'500',desc:'Rooftop garden, lawn, or terrace design plan.',image:'/ventures-gardening.jpg' },
  { id:'s15',name:'Banana Tissue Culture (G9)',category:'Saplings',price:'35',desc:'Disease-free G9 banana. High yield variety.',image:'/plants/banana.jpg' },
  { id:'s16',name:'Papaya Red Lady Seeds',category:'Seeds',price:'100',desc:'High-yielding hybrid. 100 seeds per pack.',image:'/plants/papaya.jpg' },
  { id:'s17',name:'Guava Allahabad Safeda',category:'Saplings',price:'250',desc:'Year-round fruiting. Sweet white flesh.',image:'/plants/guava.jpg' },
  { id:'s18',name:'Ginger Rhizomes (1 kg)',category:'Seeds',price:'150',desc:'Organic planting rhizomes. High germination.',image:'/plants/ginger.jpg' },
  { id:'s19',name:'Oyster Mushroom Spawn',category:'Seeds',price:'200',desc:'Ready-to-grow spawn. Fruits on agri-waste.',image:'/plants/oyster-mushroom.jpg',badge:'Unique' },
  { id:'s20',name:'Lemon Plant (Kagzi)',category:'Saplings',price:'180',desc:'Year-round fruiting citrus. Grafted variety.',image:'/plants/lemon.jpg' },
]

export default function ShopPage() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const { addItem } = useCartStore()
  const { t } = useI18n()
  const [products, setProducts] = useState(FALLBACK)

  useEffect(() => {
    fetch('https://iylyhdddvpsckinpnyxw.supabase.co/rest/v1/shop_products?select=*&is_active=eq.true', {
      headers: { apikey:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bHloZGRkdnBzY2tpbnBueXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMjEyMDEsImV4cCI6MjEwMTU5NzIwMX0.SkAD08YZ_224wous50WUOi5x_BY6Nvg_BBOVf3N9XRU', Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bHloZGRkdnBzY2tpbnBueXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMjEyMDEsImV4cCI6MjEwMTU5NzIwMX0.SkAD08YZ_224wous50WUOi5x_BY6Nvg_BBOVf3N9XRU' }
    }).then(r=>r.json()).then(d=>{if(Array.isArray(d)&&d.length>0)setProducts(d.map((p:any)=>({id:p.id,name:p.name,price:p.price||'0',category:p.category||'General',desc:p.description||'',image:p.image||'/plants/moringa.jpg',badge:p.badge})))}).catch(()=>{})
  }, [])

  const CATS = ['All','Saplings','Seeds','Tools','Services']
  const filtered = products.filter(p => {
    if (category !== 'All' && p.category !== category) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.desc.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })
  const fmt = (price:string) => price === '0' ? 'Free' : '₹' + price

  return (
    <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen">
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="label tracking-[0.2em]" style={{color:'var(--accent-green)'}}>{t('shop.label')}</span>
              <h1 style={{fontFamily:'var(--font-display)'}}>{t('shop.heading')}</h1>
              <p className="lead mt-2 max-w-xl">{t('shop.subtitle')}</p>
            </div>
            <div className="hidden md:block"><CartDrawer /></div>
          </div>

          <div className="relative max-w-md mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'var(--text-muted)'}}/>
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search 20+ products..." className="input" style={{paddingLeft:'2.75rem'}}/>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATS.map(c=>(<button key={c} onClick={()=>setCategory(c)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${category===c?'bg-green-600/20 border border-green-500/30 text-green-300':'border text-white/40'}`} style={category===c?{}:{borderColor:'var(--border-subtle)'}}>{c} ({c==='All'?products.length:products.filter(p=>p.category===c).length})</button>))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p,i)=>(
              <motion.div key={p.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}} className="card overflow-hidden group hover-lift relative">
                {p.badge&&<span className="absolute top-3 left-3 z-10 badge-green text-[9px]">{p.badge}</span>}
                <div className="h-48 img-zoom"><div className="img-inner w-full h-full bg-cover bg-center" style={{backgroundImage:`url(${p.image})`,background:'var(--bg-secondary)'}}/></div>
                <div className="p-4">
                  <span className="text-[10px] uppercase tracking-wider" style={{color:'var(--text-muted)'}}>{p.category}</span>
                  <h3 className="text-sm font-semibold mt-1 mb-1">{p.name}</h3>
                  <p className="text-[11px] mb-3" style={{color:'var(--text-secondary)'}}>{p.desc?.slice(0,70)}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold" style={{color:'var(--accent-green)',fontFamily:'var(--font-display)'}}>{fmt(p.price)}</span>
                    <button onClick={()=>addItem({id:p.id,name:p.name,price:fmt(p.price),image:p.image})} className="btn-primary text-xs px-4 py-2"><ShoppingBag className="w-3.5 h-3.5"/>Add</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {filtered.length===0&&<div className="text-center py-16"><p className="text-sm" style={{color:'var(--text-muted)'}}>No products match your search.</p></div>}
        </div>
      </section>
      <section className="py-16 px-6" style={{background:'var(--bg-secondary)'}}><div className="max-w-xl mx-auto"><NewsletterSignup/></div></section>
      <footer className="py-14 px-6 text-center border-t" style={{borderColor:'var(--border-subtle)'}}>
        <p className="text-xs" style={{color:'var(--text-muted)'}}>{t('footer.short')}</p>
        <nav className="flex justify-center gap-8 mt-4">
          <a href="/" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.home')}</a>
          <a href="/blog" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.blog')}</a>
          <a href="/podcast" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>Podcast</a>
          <a href="/contact" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.contact')}</a>
        </nav>
      </footer>
    </div>
  )
}
