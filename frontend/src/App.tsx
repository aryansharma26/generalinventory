import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CSSProperties, Dispatch, SetStateAction } from "react";
import { apiUrl } from "./api";

type View = "Overview" | "Point of sale" | "Products" | "Inventory" | "People" | "Reports";
type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  unit: string;
  accent: string;
};
type CartLine = Product & { qty: number };

const seedProducts: Product[] = [
  { id: 1, name: "Aashirvaad Atta", sku: "GR-1008", category: "Grains", price: 310, cost: 274, stock: 42, unit: "5 kg", accent: "#e9a84c" },
  { id: 2, name: "Tata Salt", sku: "GR-1012", category: "Essentials", price: 28, cost: 23, stock: 8, unit: "1 kg", accent: "#5d91e7" },
  { id: 3, name: "Fortune Sunflower Oil", sku: "GR-1021", category: "Cooking", price: 158, cost: 143, stock: 17, unit: "1 L", accent: "#eac848" },
  { id: 4, name: "Amul Taaza Milk", sku: "GR-1034", category: "Dairy", price: 58, cost: 52, stock: 6, unit: "1 L", accent: "#56a9dc" },
  { id: 5, name: "Brooke Bond Red Label", sku: "GR-1041", category: "Beverages", price: 275, cost: 244, stock: 24, unit: "500 g", accent: "#d7554e" },
  { id: 6, name: "Surf Excel Matic", sku: "GR-1057", category: "Household", price: 245, cost: 218, stock: 0, unit: "1 kg", accent: "#3e8fd4" },
  { id: 7, name: "Parle-G Biscuits", sku: "GR-1063", category: "Snacks", price: 10, cost: 8, stock: 126, unit: "79 g", accent: "#db7054" },
  { id: 8, name: "Lizol Citrus", sku: "GR-1072", category: "Household", price: 225, cost: 199, stock: 31, unit: "1 L", accent: "#639757" },
];

const navItems: { label: View; glyph: string }[] = [
  { label: "Overview", glyph: "⌂" },
  { label: "Point of sale", glyph: "⌁" },
  { label: "Products", glyph: "□" },
  { label: "Inventory", glyph: "≡" },
  { label: "People", glyph: "♙" },
  { label: "Reports", glyph: "↗" },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

function ProductMark({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <span className={`product-mark ${large ? "large" : ""}`} style={{ "--mark": product.accent } as CSSProperties}>
      {product.name.split(" ").slice(0, 2).map((word) => word[0]).join("")}
    </span>
  );
}

function Overview({ onNavigate }: { onNavigate: (view: View) => void }) {
  const chart = [32, 42, 36, 54, 48, 62, 57, 69, 64, 82, 75, 91, 84, 98];
  return (
    <>
      <header className="page-head">
        <div><p className="eyebrow">Saturday, 25 July</p><h1>Good evening, Aryan</h1><p>Here’s what’s happening at General Store today.</p></div>
        <button className="primary" onClick={() => onNavigate("Point of sale")}><span>＋</span> New sale</button>
      </header>
      <section className="metrics">
        <article className="metric featured"><div className="metric-top"><span>Today’s sales</span><span className="icon-badge">₹</span></div><strong>₹24,680</strong><div className="metric-foot"><b>↑ 12.5%</b><span>vs yesterday</span></div></article>
        <article className="metric"><div className="metric-top"><span>Gross profit</span><span className="icon-badge violet">↗</span></div><strong>₹6,240</strong><div className="metric-foot"><b>↑ 8.2%</b><span>25.3% margin</span></div></article>
        <article className="metric"><div className="metric-top"><span>Transactions</span><span className="icon-badge blue">↔</span></div><strong>148</strong><div className="metric-foot"><b>↑ 6.4%</b><span>₹167 avg. bill</span></div></article>
        <article className="metric warning"><div className="metric-top"><span>Stock alerts</span><span className="icon-badge amber">!</span></div><strong>14</strong><div className="metric-foot"><b>6 critical</b><span>8 running low</span></div></article>
      </section>
      <section className="dashboard-grid">
        <article className="panel sales-chart">
          <div className="panel-head"><div><h2>Sales pulse</h2><p>Revenue over the last 14 days</p></div><button className="ghost">14 days⌄</button></div>
          <div className="chart-area">
            <div className="axis"><span>₹30k</span><span>₹20k</span><span>₹10k</span><span>₹0</span></div>
            <div className="bars">{chart.map((h, i) => <span key={i} className={i === chart.length - 1 ? "active" : ""} style={{ height: `${h}%` }}><i>{i === 13 ? "₹24.7k" : ""}</i></span>)}</div>
          </div>
          <div className="chart-labels"><span>12 Jul</span><span>16 Jul</span><span>20 Jul</span><span>Today</span></div>
        </article>
        <article className="panel stock-panel">
          <div className="panel-head"><div><h2>Needs attention</h2><p>Stock running below reorder level</p></div><button className="text-button" onClick={() => onNavigate("Inventory")}>View all →</button></div>
          <div className="attention-list">
            {seedProducts.filter((p) => p.stock < 18).slice(0, 4).map((product) => <div className="attention" key={product.id}><ProductMark product={product}/><div><b>{product.name}</b><span>{product.sku} · {product.unit}</span></div><div className={product.stock === 0 ? "stock zero" : "stock"}>{product.stock === 0 ? "Out" : `${product.stock} left`}</div></div>)}
          </div>
        </article>
      </section>
      <section className="bottom-grid">
        <article className="panel">
          <div className="panel-head"><div><h2>Recent transactions</h2><p>Latest activity across all counters</p></div><button className="text-button">See history →</button></div>
          <div className="transaction-list">
            {[["#INV-2841","Walk-in customer","₹1,284","Cash","2 min"],["#INV-2840","Neha Sharma","₹842","UPI","8 min"],["#INV-2839","Walk-in customer","₹2,110","Card","14 min"],["#INV-2838","Rahul Verma","₹465","UPI","21 min"]].map((r)=><div className="transaction" key={r[0]}><span className="receipt">⌑</span><div><b>{r[0]}</b><span>{r[1]}</span></div><strong>{r[2]}</strong><span className={`pay-tag ${r[3].toLowerCase()}`}>{r[3]}</span><time>{r[4]}</time></div>)}
          </div>
        </article>
        <article className="panel team-card">
          <div className="panel-head"><div><h2>Team today</h2><p>8 of 10 staff checked in</p></div><button className="text-button" onClick={() => onNavigate("People")}>Manage →</button></div>
          <div className="attendance-ring"><div><strong>80%</strong><span>present</span></div></div>
          <div className="team-stats"><span><b>8</b> Present</span><span><b>1</b> On leave</span><span><b>1</b> Absent</span></div>
        </article>
      </section>
    </>
  );
}

function Products({ products, setProducts }: { products: Product[]; setProducts: Dispatch<SetStateAction<Product[]>> }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = products.filter((p) => `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
  const addProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Product = { id: Date.now(), name: String(data.get("name")), sku: String(data.get("sku")), category: String(data.get("category")), price: Number(data.get("price")), cost: Number(data.get("cost")), stock: Number(data.get("stock")), unit: String(data.get("unit")), accent: "#6f4ef2" };
    setProducts((current) => [next, ...current]);
    setOpen(false);
    try { await fetch(apiUrl("/api/products"), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(next) }); } catch {}
  };
  return (
    <>
      <header className="page-head"><div><p className="eyebrow">Catalogue</p><h1>Products</h1><p>Manage pricing, stock and product details.</p></div><button className="primary" onClick={() => setOpen(true)}>＋ Add product</button></header>
      <div className="toolbar"><label className="search-field"><span>⌕</span><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search products, SKU or category"/></label><button className="ghost">All categories⌄</button><button className="ghost">⇩ Export</button></div>
      <article className="panel table-panel">
        <div className="table-title"><h2>All products</h2><span>{filtered.length} products</span></div>
        <div className="product-table">
          <div className="tr th"><span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Status</span><span></span></div>
          {filtered.map((product)=><div className="tr" key={product.id}><div className="product-cell"><ProductMark product={product}/><div><b>{product.name}</b><small>{product.sku} · {product.unit}</small></div></div><span>{product.category}</span><b>{money(product.price)}</b><span>{product.stock} units</span><span><i className={`status ${product.stock === 0 ? "danger" : product.stock < 10 ? "low" : "healthy"}`}>{product.stock === 0 ? "Out of stock" : product.stock < 10 ? "Low stock" : "In stock"}</i></span><button className="dots">•••</button></div>)}
        </div>
      </article>
      {open && <div className="modal-backdrop" onMouseDown={()=>setOpen(false)}><form className="modal" onSubmit={addProduct} onMouseDown={(e)=>e.stopPropagation()}><div className="modal-head"><div><p className="eyebrow">New catalogue item</p><h2>Add a product</h2></div><button type="button" onClick={()=>setOpen(false)}>×</button></div><div className="form-grid"><label className="wide">Product name<input name="name" required placeholder="e.g. India Gate Basmati Rice"/></label><label>SKU<input name="sku" required placeholder="GR-1080"/></label><label>Category<select name="category"><option>Essentials</option><option>Grains</option><option>Cooking</option><option>Dairy</option><option>Snacks</option><option>Household</option></select></label><label>Selling price<input name="price" type="number" min="1" required placeholder="0"/></label><label>Purchase price<input name="cost" type="number" min="0" required placeholder="0"/></label><label>Opening stock<input name="stock" type="number" min="0" required placeholder="0"/></label><label>Unit<input name="unit" required placeholder="1 kg"/></label></div><div className="modal-actions"><button type="button" className="ghost" onClick={()=>setOpen(false)}>Cancel</button><button className="primary">Save product</button></div></form></div>}
    </>
  );
}

function POS({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [search, setSearch] = useState("");
  const [paid, setPaid] = useState(false);
  const add = (p: Product) => setCart((lines) => lines.some((l)=>l.id===p.id) ? lines.map((l)=>l.id===p.id ? {...l, qty:l.qty+1}:l) : [...lines,{...p,qty:1}]);
  const total = cart.reduce((sum, line)=>sum+line.price*line.qty,0);
  return (
    <>
      <header className="page-head pos-head"><div><p className="eyebrow">Counter 01 · Shift open</p><h1>Point of sale</h1></div><div className="live-pill"><i/> Ready for sale</div></header>
      <section className="pos-layout">
        <div>
          <label className="search-field product-search"><span>⌕</span><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Scan barcode or search products…"/><kbd>F2</kbd></label>
          <div className="quick-filters"><button className="selected">All items</button>{["Essentials","Dairy","Snacks","Household"].map(x=><button key={x}>{x}</button>)}</div>
          <div className="product-grid">{products.filter(p=>p.stock>0 && `${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase())).map(p=><button className="product-card" key={p.id} onClick={()=>add(p)}><ProductMark product={p} large/><b>{p.name}</b><span>{p.unit} · {p.stock} in stock</span><strong>{money(p.price)}</strong><i>＋</i></button>)}</div>
        </div>
        <aside className="cart">
          <div className="cart-head"><div><p className="eyebrow">Current order</p><h2>Cart <span>{cart.reduce((s,l)=>s+l.qty,0)}</span></h2></div><button onClick={()=>setCart([])}>Clear</button></div>
          <button className="customer-row"><span className="avatar small">＋</span><div><b>Add customer</b><small>Earn & redeem loyalty points</small></div><i>›</i></button>
          <div className="cart-lines">{cart.length === 0 ? <div className="empty-cart"><span>⌁</span><b>Your cart is empty</b><p>Scan a barcode or select an item to begin.</p></div> : cart.map(line=><div className="cart-line" key={line.id}><ProductMark product={line}/><div><b>{line.name}</b><span>{money(line.price)} · {line.unit}</span><div className="stepper"><button onClick={()=>setCart(c=>c.flatMap(x=>x.id===line.id ? x.qty===1?[]:[{...x,qty:x.qty-1}]:[x]))}>−</button><b>{line.qty}</b><button onClick={()=>add(line)}>＋</button></div></div><strong>{money(line.price*line.qty)}</strong></div>)}</div>
          <div className="totals"><div><span>Subtotal</span><b>{money(total)}</b></div><div><span>Tax (included)</span><b>{money(total*0.05)}</b></div><div className="grand"><span>Total</span><strong>{money(total)}</strong></div><button disabled={!cart.length} className="checkout" onClick={async()=>{setPaid(true);try{await fetch(apiUrl("/api/sales"),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({lines:cart,paymentMethod:"cash"})})}catch{}}}>Charge {money(total)} <span>→</span></button></div>
        </aside>
      </section>
      {paid && <div className="modal-backdrop"><div className="success-modal"><span>✓</span><h2>Payment complete</h2><p>Invoice #INV-2842 has been recorded.</p><strong>{money(total)}</strong><button className="primary" onClick={()=>{setCart([]);setPaid(false)}}>Start next sale</button></div></div>}
    </>
  );
}

function Inventory({ products }: { products: Product[] }) {
  const total = products.reduce((s,p)=>s+p.stock*p.cost,0);
  return <><header className="page-head"><div><p className="eyebrow">Stock control</p><h1>Inventory</h1><p>Track movement, valuation and replenishment.</p></div><button className="primary">＋ Stock adjustment</button></header><section className="metrics compact"><article className="metric"><span>Inventory value</span><strong>{money(total)}</strong><small>At purchase price</small></article><article className="metric"><span>Total units</span><strong>{products.reduce((s,p)=>s+p.stock,0)}</strong><small>Across {products.length} SKUs</small></article><article className="metric warning"><span>Reorder now</span><strong>{products.filter(p=>p.stock<10).length}</strong><small>Below threshold</small></article></section><article className="panel table-panel"><div className="panel-head"><div><h2>Stock levels</h2><p>Live quantity and reorder health</p></div><button className="ghost">Warehouse: Main⌄</button></div><div className="inventory-list">{products.map(p=><div key={p.id}><ProductMark product={p}/><div><b>{p.name}</b><span>{p.sku} · {p.category}</span></div><div className="progress"><i style={{width:`${Math.min(100,p.stock)}%`}}/><span>Reorder at 10</span></div><strong>{p.stock} <small>units</small></strong><button className="ghost small-button">Adjust</button></div>)}</div></article></>;
}

function People() {
  const people = [["Priya Kapoor","Manager","Present","09:02"],["Rohit Singh","Cashier","Present","08:54"],["Meera Nair","Cashier","Present","09:08"],["Amit Das","Store staff","On leave","—"],["Sana Khan","Store staff","Present","08:58"],["Vikram Rao","Stock manager","Absent","—"]];
  return <><header className="page-head"><div><p className="eyebrow">Team & attendance</p><h1>People</h1><p>Manage your team, shifts and payroll.</p></div><button className="primary">＋ Add employee</button></header><section className="metrics compact"><article className="metric"><span>Total employees</span><strong>10</strong><small>9 active, 1 inactive</small></article><article className="metric"><span>Present today</span><strong>8</strong><small>Average check-in 09:01</small></article><article className="metric"><span>July payroll</span><strong>₹1.84L</strong><small>Due in 6 days</small></article></section><article className="panel table-panel"><div className="panel-head"><div><h2>Today’s attendance</h2><p>Saturday, 25 July</p></div><button className="ghost">View month</button></div><div className="people-list">{people.map((p,i)=><div key={p[0]}><span className={`avatar person-${i}`}>{p[0].split(" ").map(n=>n[0]).join("")}</span><div><b>{p[0]}</b><span>{p[1]}</span></div><i className={`status ${p[2]==="Present"?"healthy":p[2]==="Absent"?"danger":"low"}`}>{p[2]}</i><span>Check-in <b>{p[3]}</b></span><button className="dots">•••</button></div>)}</div></article></>;
}

function Reports() {
  const rows=[["Jul 2026","₹6,42,810","₹1,61,400","25.1%"],["Jun 2026","₹5,98,240","₹1,42,160","23.8%"],["May 2026","₹5,76,930","₹1,39,520","24.2%"],["Apr 2026","₹5,21,480","₹1,20,810","23.2%"]];
  return <><header className="page-head"><div><p className="eyebrow">Business intelligence</p><h1>Reports</h1><p>Understand performance and make better decisions.</p></div><button className="primary">⇩ Export report</button></header><section className="report-cards">{[["Sales report","Daily, monthly and category performance","₹6.43L","July revenue"],["Profit & loss","Revenue, cost and operating margin","₹1.61L","Net profit"],["Inventory report","Valuation, turnover and ageing","₹1.42L","Stock value"],["Expense report","Track recurring and variable costs","₹48.2k","July expenses"]].map((r,i)=><article className={`report-card tone-${i}`} key={r[0]}><span>{["↗","₹","≡","↓"][i]}</span><h3>{r[0]}</h3><p>{r[1]}</p><strong>{r[2]}</strong><small>{r[3]}</small><button>Open report →</button></article>)}</section><article className="panel table-panel"><div className="panel-head"><div><h2>Monthly performance</h2><p>Revenue and gross profit trend</p></div><button className="ghost">This year⌄</button></div><div className="simple-table"><div><b>Period</b><b>Net sales</b><b>Gross profit</b><b>Margin</b></div>{rows.map(r=><div key={r[0]}>{r.map((x,i)=><span key={x} className={i===3?"positive":""}>{x}</span>)}</div>)}</div></article></>;
}

export default function Home() {
  const [view, setView] = useState<View>("Overview");
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [navOpen, setNavOpen] = useState(false);
  const [notice, setNotice] = useState(true);
  useEffect(() => { document.title = `${view} · Slate Inventory`; }, [view]);
  useEffect(() => {
    fetch(apiUrl("/api/products")).then((response) => response.json()).then((data: { products?: Product[] }) => {
      if (data.products?.length) setProducts(data.products);
    }).catch(() => {});
  }, []);
  const content = useMemo(() => {
    if (view === "Overview") return <Overview onNavigate={setView}/>;
    if (view === "Point of sale") return <POS products={products}/>;
    if (view === "Products") return <Products products={products} setProducts={setProducts}/>;
    if (view === "Inventory") return <Inventory products={products}/>;
    if (view === "People") return <People/>;
    return <Reports/>;
  }, [view, products]);
  return (
    <div className="app-shell">
      <aside className={`sidebar ${navOpen ? "open" : ""}`}>
        <div className="brand"><span>GS</span><div><b>General Store</b><small>Inventory OS</small></div></div>
        <nav>{navItems.map((item)=><button key={item.label} className={view===item.label?"active":""} onClick={()=>{setView(item.label);setNavOpen(false)}}><span>{item.glyph}</span>{item.label}{item.label==="Inventory"&&<i>6</i>}</button>)}</nav>
        <div className="nav-section"><span>MANAGEMENT</span>{["Purchases","Suppliers","Expenses"].map((x,i)=><button key={x}><span>{["⇣","♧","₹"][i]}</span>{x}</button>)}</div>
        <div className="sidebar-bottom"><button><span>⚙</span>Settings</button><button><span>?</span>Help centre</button><div className="profile"><span className="avatar">AK</span><div><b>Aryan Kumar</b><small>Owner</small></div><button>⋮</button></div></div>
      </aside>
      <main>
        <div className="topbar"><button className="menu" onClick={()=>setNavOpen(!navOpen)}>☰</button><label className="global-search"><span>⌕</span><input placeholder="Search anything…"/><kbd>⌘ K</kbd></label><div className="top-actions"><button title="Notifications">♢<i/></button><span/><div className="store-status"><i/> Store open</div></div></div>
        <div className="content">{notice && <div className="notice"><span>✦</span><p><b>Smart reorder is ready.</b> 6 items may run out this week based on recent sales.</p><button onClick={()=>setView("Inventory")}>Review stock</button><button className="notice-close" onClick={()=>setNotice(false)}>×</button></div>}{content}<footer><span>Slate Inventory</span><p>All systems operational · Last synced just now</p></footer></div>
      </main>
      {navOpen && <button className="scrim" onClick={()=>setNavOpen(false)} aria-label="Close menu"/>}
    </div>
  );
}
