'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sprout, TreePine, Coffee, Flower2, Wheat, Beaker, Droplets, Microscope, Leaf, Globe2, ChevronRight } from 'lucide-react'

interface Plant { name:string; botanical:string; origin:string; climate:string; days:number; desc:string; image?:string }

const CATEGORIES = [
  { id:'staple',name:'Staple Food Crops',icon:<Wheat className="w-5 h-5"/>,desc:'Cereals, pseudocereals, pulses, tubers',count:7 },
  { id:'produce',name:'Vegetables, Fruits & Nuts',icon:<Sprout className="w-5 h-5"/>,desc:'Heirloom vegetables, native fruits, nuts',count:10 },
  { id:'beverages',name:'Beverages, Spices & Stimulants',icon:<Coffee className="w-5 h-5"/>,desc:'Herbs, aromatic crops, indigenous teas',count:7 },
  { id:'ornamental',name:'Ornamental & Landscaping',icon:<Flower2 className="w-5 h-5"/>,desc:'Native flowers, shade trees',count:5 },
  { id:'cover',name:'Farming Support Crops',icon:<Leaf className="w-5 h-5"/>,desc:'Cover crops, green manure, forage',count:3 },
  { id:'fungi',name:'Fungi & Symbiotes',icon:<TreePine className="w-5 h-5"/>,desc:'Mycorrhizal, edible mushrooms',count:3 },
  { id:'algae',name:'Algae Producers',icon:<Droplets className="w-5 h-5"/>,desc:'Spirulina, bio-fertilizers',count:2 },
  { id:'microbes',name:'Agricultural Microbes',icon:<Microscope className="w-5 h-5"/>,desc:'Rhizobia, PSB, Trichoderma',count:3 },
  { id:'lichens',name:'Lichens & Moss',icon:<Beaker className="w-5 h-5"/>,desc:'Bio-indicators, moisture retention',count:2 },
  { id:'exotic',name:'Exotic & Rare Varieties',icon:<Globe2 className="w-5 h-5"/>,desc:'Heirloom non-GMO strains',count:5 },
]

const PLANTS: Record<string,Plant[]> = {
  staple: [
    {name:'Rice (Basmati)',botanical:'Oryza sativa',origin:'South Asia',climate:'Tropical',days:120,desc:'Aromatic long-grain rice. Thrives in flooded paddies.',image:'/plants/rice-basmati.jpg'},
    {name:'Wheat (Durum)',botanical:'Triticum durum',origin:'Fertile Crescent',climate:'Temperate',days:150,desc:'Hard wheat for semolina. Rabi crop in North India.',image:'/plants/wheat.jpg'},
    {name:'Maize',botanical:'Zea mays',origin:'Mesoamerica',climate:'Warm temperate',days:90,desc:'Versatile cereal for Kharif and Rabi.'},
    {name:'Pearl Millet',botanical:'Pennisetum glaucum',origin:'Sahel Africa',climate:'Arid',days:75,desc:'Drought-resistant. High iron, protein.',image:'/plants/pearl-millet.jpg'},
    {name:'Finger Millet',botanical:'Eleusine coracana',origin:'East Africa',climate:'Temperate',days:120,desc:'High calcium. Karnataka and Tamil Nadu staple.'},
    {name:'Pigeon Pea',botanical:'Cajanus cajan',origin:'Indian Subcontinent',climate:'Tropical',days:180,desc:'Major protein source. India: 80% of world supply.',image:'/plants/pigeon-pea.jpg'},
    {name:'Chickpea',botanical:'Cicer arietinum',origin:'Middle East',climate:'Temperate',days:120,desc:'Rabi pulse. Desi and Kabuli varieties.',image:'/plants/chickpea.jpg'},
  ],
  produce: [
    {name:'Heirloom Tomato',botanical:'Solanum lycopersicum',origin:'Andes',climate:'Warm temperate',days:80,desc:'Non-hybrid superior flavor. Seed-saving variety.'},
    {name:'Moringa',botanical:'Moringa oleifera',origin:'India',climate:'Tropical',days:240,desc:'All parts edible. Grown at JeeVan Farms, Nalanda.',image:'/plants/moringa.jpg'},
    {name:'Okra (Bhindi)',botanical:'Abelmoschus esculentus',origin:'East Africa',climate:'Warm tropical',days:55,desc:'Fast-growing summer vegetable.',image:'/plants/okra.jpg'},
    {name:'Mango',botanical:'Mangifera indica',origin:'India',climate:'Tropical',days:365,desc:'King of fruits. Bihar: Malda, Langra.',image:'/plants/mango.jpg'},
    {name:'Banana',botanical:'Musa paradisiaca',origin:'SE Asia',climate:'Tropical',days:300,desc:'Year-round crop. Bihar: G9 and Malbhog.',image:'/plants/banana.jpg'},
    {name:'Papaya',botanical:'Carica papaya',origin:'Central America',climate:'Tropical',days:240,desc:'Fast fruiting. Red Lady and Pusa Dwarf.',image:'/plants/papaya.jpg'},
    {name:'Guava',botanical:'Psidium guajava',origin:'Central America',climate:'Subtropical',days:240,desc:'Allahabad Safeda. Year-round fruiting.',image:'/plants/guava.jpg'},
  ],
  beverages: [
    {name:'Turmeric (Haldi)',botanical:'Curcuma longa',origin:'South Asia',climate:'Tropical',days:240,desc:'Golden spice. Anti-inflammatory.',image:'/plants/turmeric.jpg'},
    {name:'Tulsi',botanical:'Ocimum sanctum',origin:'India',climate:'Tropical',days:60,desc:'Sacred adaptogenic herb.',image:'/plants/tulsi.jpg'},
    {name:'Ginger',botanical:'Zingiber officinale',origin:'SE Asia',climate:'Tropical',days:210,desc:'Major spice crop.',image:'/plants/ginger.jpg'},
    {name:'Black Pepper',botanical:'Piper nigrum',origin:'Western Ghats',climate:'Tropical wet',days:1095,desc:'King of Spices.',image:'/plants/black-pepper.jpg'},
    {name:'Cardamom',botanical:'Elettaria cardamomum',origin:'Western Ghats',climate:'Tropical wet',days:730,desc:'Queen of Spices.',image:'/plants/cardamom.jpg'},
    {name:'Tea',botanical:'Camellia sinensis',origin:'China/India',climate:'Subtropical',days:1095,desc:'Assam and Darjeeling icons.',image:'/plants/tea.jpg'},
  ],
}

export default function PlantDirectory() {
  const [selected, setSelected] = useState<string|null>(null)
  const [search, setSearch] = useState('')
  const plants = selected?(PLANTS[selected]||[]):[]

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{background:'rgba(90,158,75,0.08)',border:'1px solid rgba(90,158,75,0.12)'}}>
          <Globe2 className="w-8 h-8" style={{color:'var(--accent-green)'}}/>
        </div>
        <h2 style={{fontFamily:'var(--font-display)'}}>Global Plant Directory</h2>
        <p className="lead max-w-xl mx-auto mt-3">50+ species across 10 categories — from staple crops to rare heirloom varieties</p>
      </div>

      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'var(--text-muted)'}}/>
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search plants by name..." className="input" style={{paddingLeft:'2.75rem'}}/>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-8">
        {CATEGORIES.map((cat,i)=>(
          <motion.button key={cat.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
            onClick={()=>setSelected(selected===cat.id?null:cat.id)}
            className="text-left p-3.5 rounded-2xl border transition-all duration-200"
            style={{
              background:selected===cat.id?'rgba(90,158,75,0.08)':'var(--bg-surface)',
              borderColor:selected===cat.id?'rgba(90,158,75,0.25)':'var(--border-subtle)'
            }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{background:'rgba(90,158,75,0.08)'}}>{cat.icon}</div>
            <h3 className="font-medium text-xs mb-0.5">{cat.name}</h3>
            <p className="text-[10px]" style={{color:'var(--text-muted)'}}>{cat.desc}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}
            className="rounded-2xl p-5" style={{background:'var(--bg-surface)',border:'1px solid var(--border-subtle)'}}>
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{fontFamily:'var(--font-display)'}}>
              {CATEGORIES.find(c=>c.id===selected)?.icon} {CATEGORIES.find(c=>c.id===selected)?.name}
            </h3>
            {plants.length>0?(
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {plants.map((p,i)=>(
                  <motion.div key={p.name} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                    className="p-3.5 rounded-xl border transition-all group overflow-hidden"
                    style={{background:'var(--bg-secondary)',borderColor:'var(--border-subtle)'}}>
                    {p.image && <div className="w-full h-28 rounded-lg mb-3 overflow-hidden"><div className="w-full h-full bg-cover bg-center opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500" style={{backgroundImage:`url(${p.image})`}}/></div>}
                    <div className="flex items-start justify-between mb-1.5">
                      <h3 className="font-medium text-sm">{p.name}</h3>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" style={{color:'var(--accent-green)'}}/>
                    </div>
                    <p className="text-[10px] italic mb-2" style={{color:'var(--text-muted)'}}>{p.botanical}</p>
                    <p className="text-[11px] mb-2.5" style={{color:'var(--text-secondary)'}}>{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px]" style={{background:'var(--bg-surface)',color:'var(--text-muted)'}}>{p.origin}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px]" style={{background:'var(--bg-surface)',color:'var(--text-muted)'}}>{p.climate}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px]" style={{background:'var(--bg-surface)',color:'var(--text-muted)'}}>{p.days}d</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ):(
              <div className="text-center py-10"><Sprout className="w-8 h-8 mx-auto mb-2 opacity-20"/><p className="text-xs" style={{color:'var(--text-muted)'}}>Full data loading from Supabase...</p></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
