'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sprout, TreePine, Coffee, Flower2, Wheat, Beaker, Droplets, Microscope, Leaf, Globe2, ChevronRight } from 'lucide-react'

interface Plant { name:string; botanical:string; origin:string; climate:string; days:number; desc:string; image?:string }

const CATEGORIES = [
  { id:'staple',name:'Staple Food',icon:<Wheat className="w-4 h-4"/>,desc:'Cereals, pulses, tubers',count:7 },
  { id:'produce',name:'Fruits & Vegetables',icon:<Sprout className="w-4 h-4"/>,desc:'Heirloom vegetables, native fruits',count:9 },
  { id:'beverages',name:'Spices & Beverages',icon:<Coffee className="w-4 h-4"/>,desc:'Herbs, spices, tea, coffee',count:8 },
  { id:'ornamental',name:'Ornamentals',icon:<Flower2 className="w-4 h-4"/>,desc:'Flowers, shade trees',count:5 },
  { id:'cover',name:'Cover & Forage',icon:<Leaf className="w-4 h-4"/>,desc:'Green manure, fodder crops',count:4 },
  { id:'fungi',name:'Fungi',icon:<TreePine className="w-4 h-4"/>,desc:'Mushrooms, mycorrhizae',count:4 },
  { id:'algae',name:'Algae',icon:<Droplets className="w-4 h-4"/>,desc:'Spirulina, bio-fertilizers',count:3 },
  { id:'microbes',name:'Microbes',icon:<Microscope className="w-4 h-4"/>,desc:'Rhizobia, PSB, Trichoderma',count:4 },
  { id:'lichens',name:'Lichens & Moss',icon:<Beaker className="w-4 h-4"/>,desc:'Bio-indicators, soil builders',count:3 },
  { id:'exotic',name:'Exotic & Rare',icon:<Globe2 className="w-4 h-4"/>,desc:'Heirloom non-GMO strains',count:6 },
]

const PLANTS: Record<string,Plant[]> = {
  staple: [
    {name:'Rice (Basmati)',botanical:'Oryza sativa',origin:'South Asia',climate:'Tropical',days:120,desc:'Aromatic long-grain rice. Thrives in flooded paddies. India produces 70% of world basmati.',image:'/plants/rice-basmati.jpg'},
    {name:'Wheat (Durum)',botanical:'Triticum durum',origin:'Fertile Crescent',climate:'Temperate',days:150,desc:'Hard wheat for semolina and pasta. Major Rabi crop in North India.',image:'/plants/wheat.jpg'},
    {name:'Maize',botanical:'Zea mays',origin:'Mesoamerica',climate:'Warm temperate',days:90,desc:'Versatile cereal for both Kharif and Rabi. Feed, food, and industrial uses.',image:'/plants/maize.jpg'},
    {name:'Pearl Millet',botanical:'Pennisetum glaucum',origin:'Sahel Africa',climate:'Arid',days:75,desc:'Drought-resistant miracle grain. High iron and protein. Rajasthani staple.',image:'/plants/pearl-millet.jpg'},
    {name:'Finger Millet',botanical:'Eleusine coracana',origin:'East Africa',climate:'Temperate',days:120,desc:'Highest calcium among cereals. Karnataka ragi mudde staple.',image:'/plants/finger-millet.jpg'},
    {name:'Pigeon Pea',botanical:'Cajanus cajan',origin:'Indian Subcontinent',climate:'Tropical',days:180,desc:'Major protein source for 1.4 billion people. India grows 80% of world supply.',image:'/plants/pigeon-pea.jpg'},
    {name:'Chickpea',botanical:'Cicer arietinum',origin:'Middle East',climate:'Temperate',days:120,desc:'Desi and Kabuli varieties. Rich protein Rabi pulse. Key ingredient in Indian cuisine.',image:'/plants/chickpea.jpg'},
  ],
  produce: [
    {name:'Heirloom Tomato',botanical:'Solanum lycopersicum',origin:'Andes',climate:'Warm temperate',days:80,desc:'Non-hybrid superior flavor. Perfect for seed saving and organic gardens.',image:'/plants/heirloom-tomato.jpg'},
    {name:'Moringa',botanical:'Moringa oleifera',origin:'India',climate:'Tropical',days:240,desc:'All parts edible — leaves, pods, flowers. Grown at JeeVan Farms Nalanda.',image:'/plants/moringa.jpg'},
    {name:'Okra (Bhindi)',botanical:'Abelmoschus esculentus',origin:'East Africa',climate:'Warm tropical',days:55,desc:'Fast-growing summer vegetable. High in fiber and antioxidants.',image:'/plants/okra.jpg'},
    {name:'Mango',botanical:'Mangifera indica',origin:'India',climate:'Tropical',days:365,desc:'King of fruits. Bihar varieties: Malda, Langra, Zardalu, Gulabkhas.',image:'/plants/mango.jpg'},
    {name:'Banana',botanical:'Musa paradisiaca',origin:'SE Asia',climate:'Tropical',days:300,desc:'Year-round crop. Bihar popular: G9 tissue culture and Malbhog.',image:'/plants/banana.jpg'},
    {name:'Papaya',botanical:'Carica papaya',origin:'Central America',climate:'Tropical',days:240,desc:'Fast fruiting. Red Lady and Pusa Dwarf varieties for Bihar climate.',image:'/plants/papaya.jpg'},
    {name:'Guava',botanical:'Psidium guajava',origin:'Central America',climate:'Subtropical',days:240,desc:'Allahabad Safeda. Year-round fruiting with high vitamin C content.',image:'/plants/guava.jpg'},
    {name:'Lemon',botanical:'Citrus limon',origin:'South Asia',climate:'Subtropical',days:365,desc:'Year-round citrus. Essential for Indian kitchens and Ayurveda.',image:'/plants/lemon.jpg'},
    {name:'Cashew',botanical:'Anacardium occidentale',origin:'Brazil',climate:'Tropical',days:1095,desc:'Nut and apple both harvestable. Thrives in coastal and tropical India.',image:'/plants/cashew.jpg'},
  ],
  beverages: [
    {name:'Turmeric',botanical:'Curcuma longa',origin:'South Asia',climate:'Tropical',days:240,desc:'Golden spice. Curcumin-rich anti-inflammatory. Erode and Nizamabad hubs.',image:'/plants/turmeric.jpg'},
    {name:'Tulsi',botanical:'Ocimum sanctum',origin:'India',climate:'Tropical',days:60,desc:'Sacred adaptogenic herb. Rama, Krishna, and Vana varieties for diverse uses.',image:'/plants/tulsi.jpg'},
    {name:'Ginger',botanical:'Zingiber officinale',origin:'SE Asia',climate:'Tropical',days:210,desc:'Major spice and medicinal rhizome. Kerala and NE India production hubs.',image:'/plants/ginger.jpg'},
    {name:'Black Pepper',botanical:'Piper nigrum',origin:'Western Ghats',climate:'Tropical wet',days:1095,desc:'King of Spices. Native to Malabar. Takes 3 years to first harvest.',image:'/plants/black-pepper.jpg'},
    {name:'Cardamom',botanical:'Elettaria cardamomum',origin:'Western Ghats',climate:'Tropical wet',days:730,desc:'Queen of Spices. Green and black varieties. Kerala and Sikkim production.',image:'/plants/cardamom.jpg'},
    {name:'Tea',botanical:'Camellia sinensis',origin:'China/India',climate:'Subtropical',days:1095,desc:'Assam and Darjeeling icons. India is 2nd largest producer globally.',image:'/plants/tea.jpg'},
    {name:'Magahi Paan',botanical:'Piper betle',origin:'Magadh, Bihar',climate:'Tropical',days:180,desc:'Heirloom betel leaf from Nalanda. Grown under shade nets (bareja system).',image:'/plants/magahi-paan.jpg'},
    {name:'Makhana',botanical:'Euryale ferox',origin:'Bihar, India',climate:'Tropical aquatic',days:300,desc:'Foxnut superfood. Bihar produces 90% of world supply. Pond-grown.',image:'/plants/makhana.jpg'},
  ],
  ornamental: [
    {name:'Marigold',botanical:'Tagetes erecta',origin:'Mexico',climate:'Warm temperate',days:60,desc:'Vibrant orange blooms. Natural pest repellent. Key Indian festival flower.',image:'/plants/marigold.jpg'},
    {name:'Jasmine',botanical:'Jasminum grandiflorum',origin:'South Asia',climate:'Tropical',days:180,desc:'Fragrant white flowers. Used in garlands, perfumes, and Ayurvedic oils.',image:'/plants/jasmine.jpg'},
    {name:'Hibiscus',botanical:'Hibiscus rosa-sinensis',origin:'East Asia',climate:'Tropical',days:90,desc:'Large colorful blooms. Medicinal tea from calyces. Year-round flowering.',image:'/plants/hibiscus.jpg'},
    {name:'Bougainvillea',botanical:'Bougainvillea spectabilis',origin:'South America',climate:'Tropical',days:120,desc:'Hardy ornamental climber. Brilliant bracts in pink, orange, white, and purple.',image:'/plants/bougainvillea.jpg'},
    {name:'Neem',botanical:'Azadirachta indica',origin:'Indian Subcontinent',climate:'Tropical',days:1095,desc:'Sacred shade tree. Natural pesticide, timber, and Ayurvedic pharmacy.',image:'/plants/neem.jpg'},
  ],
  cover: [
    {name:'Sesbania',botanical:'Sesbania aculeata',origin:'South Asia',climate:'Tropical',days:60,desc:'Fast green manure. Fixes 100kg N/ha. Grown between rice-wheat cycles.',image:'/plants/sesbania.jpg'},
    {name:'Sunhemp',botanical:'Crotalaria juncea',origin:'India',climate:'Tropical',days:90,desc:'Premier green manure. Suppresses nematodes. Fiber also used for ropes.',image:'/plants/sunhemp.jpg'},
    {name:'Alfalfa',botanical:'Medicago sativa',origin:'Middle East',climate:'Temperate',days:80,desc:'Queen of forages. Deep-rooted perennial. High protein livestock feed.',image:'/plants/alfalfa.jpg'},
    {name:'Cowpea',botanical:'Vigna unguiculata',origin:'Africa',climate:'Tropical',days:70,desc:'Dual-purpose: grain and forage. Excellent soil builder for intercropping.',image:'/plants/cowpea.jpg'},
  ],
  fungi: [
    {name:'Button Mushroom',botanical:'Agaricus bisporus',origin:'Europe',climate:'Controlled 20C',days:45,desc:'Most cultivated mushroom globally. Grown on composted straw substrate.',image:'/plants/button-mushroom.jpg'},
    {name:'Oyster Mushroom',botanical:'Pleurotus ostreatus',origin:'Temperate forests',climate:'Controlled 25C',days:30,desc:'Easy to cultivate on agri-waste. High protein. Multiple colors available.',image:'/plants/oyster-mushroom.jpg'},
    {name:'Shiitake',botanical:'Lentinula edodes',origin:'East Asia',climate:'Controlled 22C',days:90,desc:'Medicinal mushroom. Grown on hardwood logs. Rich umami flavor profile.',image:'/plants/shiitake.jpg'},
    {name:'Mycorrhizae',botanical:'Glomus spp. (AMF)',origin:'Global soils',climate:'Universal',days:0,desc:'Symbiotic root fungi. Extends plant root reach 100x. Essential for natural farming.',image:'/plants/mycorrhizae.jpg'},
  ],
  algae: [
    {name:'Spirulina',botanical:'Arthrospira platensis',origin:'Alkaline lakes',climate:'Tropical 30C',days:15,desc:'Protein superfood (60% protein). NASA astronaut food. Grown in shallow ponds.',image:'/plants/spirulina.jpg'},
    {name:'Chlorella',botanical:'Chlorella vulgaris',origin:'Freshwater',climate:'Temperate 25C',days:7,desc:'Single-cell green algae. Detoxifying superfood. Rich in chlorophyll and B12.',image:'/plants/chlorella.jpg'},
    {name:'Azolla',botanical:'Azolla pinnata',origin:'Tropical waters',climate:'Tropical 25C',days:5,desc:'Floating fern with nitrogen-fixing cyanobacteria. Free bio-fertilizer for paddies.',image:'/plants/azolla.jpg'},
  ],
  microbes: [
    {name:'Rhizobium',botanical:'Rhizobium leguminosarum',origin:'Global soils',climate:'Universal',days:0,desc:'Nitrogen-fixing bacteria in legume root nodules. Nature\'s urea factory.',image:'/plants/rhizobium.jpg'},
    {name:'PSB',botanical:'Pseudomonas/Bacillus spp.',origin:'Global soils',climate:'Universal',days:0,desc:'Phosphate-solubilizing bacteria. Unlocks soil phosphorus for plant uptake.',image:'/plants/psb.jpg'},
    {name:'Trichoderma',botanical:'Trichoderma harzianum',origin:'Global soils',climate:'Universal',days:0,desc:'Bio-fungicide. Controls root rot and wilt. Protects seedlings naturally.',image:'/plants/trichoderma.jpg'},
    {name:'Azotobacter',botanical:'Azotobacter chroococcum',origin:'Global soils',climate:'Universal',days:0,desc:'Free-living nitrogen fixer. Bio-fertilizer for cereals and vegetables.',image:'/plants/azotobacter.jpg'},
  ],
  lichens: [
    {name:'Reindeer Moss',botanical:'Cladonia rangiferina',origin:'Arctic/Tundra',climate:'Cold temperate',days:0,desc:'Caribou food source. Excellent moisture-retaining mulch for gardens.',image:'/plants/reindeer-moss.jpg'},
    {name:'Old Man\'s Beard',botanical:'Usnea barbata',origin:'Ancient forests',climate:'Humid temperate',days:0,desc:'Air-quality bio-indicator. Only grows where air is pristine. Medicinal usnic acid.',image:'/plants/usnea.jpg'},
    {name:'Sphagnum Moss',botanical:'Sphagnum palustre',origin:'Boreal wetlands',climate:'Cool humid',days:0,desc:'Holds 20x its weight in water. Natural seed starting medium and soil conditioner.',image:'/plants/sphagnum.jpg'},
  ],
  exotic: [
    {name:'Katarani Rice',botanical:'Oryza sativa (Magahi)',origin:'Nalanda, Bihar',climate:'Tropical',days:130,desc:'Magahi heirloom aromatic rice. Popcorn-like fragrance. Only 100 acres remaining.',image:'/plants/katarani-rice.jpg'},
    {name:'Desi Makhana',botanical:'Euryale ferox (wild)',origin:'Bihar wetlands',climate:'Tropical aquatic',days:330,desc:'Wild-harvested foxnut. Superior taste to cultivated. Hand-processed traditional method.',image:'/plants/makhana.jpg'},
    {name:'Black Turmeric',botanical:'Curcuma caesia',origin:'NE India',climate:'Tropical',days:270,desc:'Rare medicinal turmeric. Deep blue-black flesh. Used in Tantric rituals and potent medicine.',image:'/plants/black-turmeric.jpg'},
    {name:'Ratna Mango',botanical:'Mangifera indica (Magahi)',origin:'Nalanda, Bihar',climate:'Tropical',days:365,desc:'Forgotten Magahi mango variety. Intense sweetness. Grafted from 80-year-old mother tree.',image:'/plants/ratna-mango.jpg'},
    {name:'Joha Rice',botanical:'Oryza sativa (Assamese)',origin:'Assam, India',climate:'Tropical wet',days:140,desc:'Assamese aromatic rice. Natural insect-repellent grain. GI-tagged heritage variety.',image:'/plants/joha-rice.jpg'},
    {name:'Red Okra',botanical:'Abelmoschus esculentus (red)',origin:'West Africa',climate:'Tropical',days:60,desc:'Crimson-podded okra. Higher anthocyanin than green. Striking ornamental-edible hybrid.',image:'/plants/red-okra.jpg'},
  ],
}

export default function PlantDirectory() {
  const [selected, setSelected] = useState<string|null>(null)
  const [search, setSearch] = useState('')
  const cats = Object.keys(PLANTS)
  const selCat = selected && cats.includes(selected) ? selected : null
  const plants = selCat ? PLANTS[selCat].filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.botanical.toLowerCase().includes(search.toLowerCase())) : []
  const allPlants = cats.flatMap(c => PLANTS[c])
  const searchResults = search && !selCat ? allPlants.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.botanical.toLowerCase().includes(search.toLowerCase())) : null

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{background:'rgba(90,158,75,0.08)',border:'1px solid rgba(90,158,75,0.12)'}}><Globe2 className="w-8 h-8" style={{color:'var(--accent-green)'}}/></div>
        <h2 style={{fontFamily:'var(--font-display)'}}>Global Plant Directory</h2>
        <p className="lead max-w-xl mx-auto mt-3">50+ species across 10 categories — from staple crops to exotic heirloom varieties. Every plant has a unique image.</p>
      </div>
      <div className="relative max-w-md mx-auto mb-8"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'var(--text-muted)'}}/><input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search 50+ plants by name..." className="input" style={{paddingLeft:'2.75rem'}}/></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-8">
        {CATEGORIES.map((cat,i)=>(<motion.button key={cat.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}} onClick={()=>setSelected(selected===cat.id?null:cat.id)} className="text-left p-3.5 rounded-2xl border transition-all duration-200" style={{background:selected===cat.id?'rgba(90,158,75,0.08)':'var(--bg-surface)',borderColor:selected===cat.id?'rgba(90,158,75,0.25)':'var(--border-subtle)'}}><div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{background:'rgba(90,158,75,0.08)'}}>{cat.icon}</div><h3 className="font-medium text-xs mb-0.5">{cat.name}</h3><p className="text-[10px]" style={{color:'var(--text-muted)'}}>{cat.desc}</p><span className="text-[9px] rounded-full px-1.5 py-0.5 mt-1.5 inline-block" style={{background:'rgba(90,158,75,0.12)',color:'var(--accent-green)'}}>{cat.count} plants</span></motion.button>))}
      </div>
      <AnimatePresence>
        {(selCat || searchResults) && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} className="rounded-2xl p-5" style={{background:'var(--bg-surface)',border:'1px solid var(--border-subtle)'}}>
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{fontFamily:'var(--font-display)'}}>
              {selCat ? <>{CATEGORIES.find(c=>c.id===selCat)?.icon} {CATEGORIES.find(c=>c.id===selCat)?.name}</> : <>Search results ({searchResults?.length||0} plants)</>}
            </h3>
            {(selCat?plants:searchResults||[]).length>0?(
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(selCat?plants:searchResults||[]).map((p,i)=>(<motion.div key={p.name} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}} className="p-3.5 rounded-xl border transition-all group overflow-hidden" style={{background:'var(--bg-secondary)',borderColor:'var(--border-subtle)'}}>{p.image && <div className="w-full h-32 rounded-lg mb-3 overflow-hidden"><div className="w-full h-full bg-cover bg-center opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" style={{backgroundImage:`url(${p.image})`}}/></div>}<div className="flex items-start justify-between mb-1.5"><h3 className="font-medium text-sm">{p.name}</h3><ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" style={{color:'var(--accent-green)'}}/></div><p className="text-[10px] italic mb-2" style={{color:'var(--text-muted)'}}>{p.botanical}</p><p className="text-[11px] mb-2.5" style={{color:'var(--text-secondary)'}}>{p.desc}</p><div className="flex flex-wrap gap-1.5"><span className="px-2 py-0.5 rounded-md text-[10px]" style={{background:'var(--bg-surface)',color:'var(--text-muted)'}}>{p.origin}</span><span className="px-2 py-0.5 rounded-md text-[10px]" style={{background:'var(--bg-surface)',color:'var(--text-muted)'}}>{p.climate}</span><span className="px-2 py-0.5 rounded-md text-[10px]" style={{background:'var(--bg-surface)',color:'var(--text-muted)'}}>{p.days>0?p.days+'d':'live culture'}</span></div></motion.div>))}
              </div>
            ):(<div className="text-center py-10"><Sprout className="w-8 h-8 mx-auto mb-2 opacity-20"/><p className="text-xs" style={{color:'var(--text-muted)'}}>No plants match your search</p></div>)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
