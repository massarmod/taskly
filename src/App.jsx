import { useState } from "react";

const DEPTS=[{id:1,name:"المشتريات",icon:"🛒",color:"#B87B0A"},{id:2,name:"المحاسبة",icon:"💰",color:"#0F6E56"},{id:3,name:"التصنيع",icon:"⚙️",color:"#185FA5"},{id:4,name:"المبيعات",icon:"📈",color:"#993556"}];
const USERS=[{id:1,name:"سالم المطيري",role:"مدير",dept:null,av:"سم",type:"admin",bg:"#534AB7",fg:"#EEEDFE"},{id:2,name:"أحمد الشمري",role:"مشتريات",dept:1,av:"أش",type:"employee",bg:"#B87B0A",fg:"#FAEEDA"},{id:3,name:"نورة القحطاني",role:"محاسبة",dept:2,av:"نق",type:"employee",bg:"#0F6E56",fg:"#E1F5EE"},{id:4,name:"خالد الزهراني",role:"تصنيع",dept:3,av:"خز",type:"employee",bg:"#185FA5",fg:"#E6F1FB"},{id:5,name:"سارة العتيبي",role:"مبيعات",dept:4,av:"سع",type:"employee",bg:"#993556",fg:"#FBEAF0"},{id:6,name:"شركة النسيج",role:"عميل",dept:null,av:"عم",type:"client",bg:"#5F5E5A",fg:"#F1EFE8"}];
const WF={شراء:[{step:1,dept:1,label:"طلب الشراء",action:"إرسال للمحاسبة"},{step:2,dept:2,label:"اعتماد الميزانية",action:"إرسال للمشتريات"},{step:3,dept:1,label:"تنفيذ الشراء",action:"إرسال للمخزن"},{step:4,dept:3,label:"استلام البضاعة",action:"إغلاق التذكرة"}],صيانة:[{step:1,dept:3,label:"طلب الصيانة",action:"إرسال للمشتريات"},{step:2,dept:1,label:"توفير القطع",action:"إرسال للتصنيع"},{step:3,dept:3,label:"تنفيذ الصيانة",action:"إغلاق التذكرة"}]};
const PR_COLOR={"عاجلة":"#E24B4A","عالية":"#BA7517","متوسطة":"#185FA5","منخفضة":"#3B6D11"};
const ST_COLOR={"لم تبدأ":"#5F5E5A","قيد التنفيذ":"#BA7517","مكتملة":"#0F6E56"};
const INIT_TICKETS=[
  {id:"TK-001",title:"شراء قماش قطني",type:"شراء",priority:"عالية",status:"قيد التنفيذ",openedBy:2,assignedTo:2,dept:1,currentStep:2,createdAt:"2026-05-20",dueDate:"2026-06-10",orderId:"ORD-101",chat:[{uid:2,text:"نحتاج 500 متر قماش قطني درجة أولى",time:"09:00"},{uid:3,text:"تم استلام الطلب، جاري مراجعة الميزانية",time:"10:30"}]},
  {id:"TK-002",title:"صيانة ماكينة الخياطة",type:"صيانة",priority:"عاجلة",status:"لم تبدأ",openedBy:4,assignedTo:4,dept:3,currentStep:1,createdAt:"2026-05-22",dueDate:"2026-05-30",orderId:null,chat:[{uid:4,text:"الماكينة رقم 3 تحتاج صيانة عاجلة",time:"08:00"}]},
  {id:"TK-003",title:"استفسار عن طلب #ORD-101",type:"استفسار",priority:"متوسطة",status:"قيد التنفيذ",openedBy:6,assignedTo:5,dept:4,currentStep:1,createdAt:"2026-05-23",dueDate:"2026-06-01",orderId:"ORD-101",chat:[{uid:6,text:"متى يكون الطلب جاهز؟",time:"11:00"},{uid:5,text:"نتوقع الجاهزية خلال أسبوع",time:"11:45"}]},
  {id:"TK-004",title:"توريد أقمشة صيفية",type:"شراء",priority:"منخفضة",status:"مكتملة",openedBy:2,assignedTo:2,dept:1,currentStep:4,createdAt:"2026-05-10",dueDate:"2026-05-25",orderId:"ORD-099",chat:[{uid:2,text:"تم استلام البضاعة بالكامل",time:"14:00"}]}
];
const INIT_ORDERS=[{id:"ORD-101",title:"قماش قطني - الدفعة الثانية",status:"قيد التنفيذ",client:"شركة النسيج"},{id:"ORD-099",title:"أقمشة صيفية متنوعة",status:"مكتمل",client:"شركة النسيج"},{id:"ORD-102",title:"خامات خريفية",status:"جديد",client:"شركة النسيج"}];
const INIT_TASKS=[{id:1,uid:2,title:"مراجعة عروض الأسعار",done:false,priority:"عالية"},{id:2,uid:2,title:"إرسال تقرير المشتريات",done:true,priority:"متوسطة"},{id:3,uid:3,title:"مراجعة كشف الحسابات",done:false,priority:"عالية"},{id:4,uid:4,title:"جدولة صيانة الماكينات",done:false,priority:"منخفضة"}];

function Av({user,size=28}){return(<div style={{width:size,height:size,borderRadius:"50%",background:user.bg,color:user.fg,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:Math.round(size*0.38),flexShrink:0}}>{user.av}</div>);}
function Badge({label,color}){return(<span style={{display:"inline-flex",alignItems:"center",padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:color+"20",color,whiteSpace:"nowrap"}}>{label}</span>);}

export default function App(){
  const [currentUser,setCurrentUser]=useState(USERS[0]);
  const [page,setPage]=useState("dashboard");
  const [tickets,setTickets]=useState(INIT_TICKETS);
  const [orders]=useState(INIT_ORDERS);
  const [personalTasks,setPersonalTasks]=useState(INIT_TASKS);
  const [selectedTicket,setSelectedTicket]=useState(null);
  const [selectedOrder,setSelectedOrder]=useState(null);
  const [empTab,setEmpTab]=useState("tickets");
  const [chatMsg,setChatMsg]=useState("");
  const [newTaskText,setNewTaskText]=useState("");
  const [showModal,setShowModal]=useState(false);
  const [pendingOrder,setPendingOrder]=useState(null);
  const [form,setForm]=useState({title:"",type:"شراء",priority:"متوسطة",assignedTo:2,dueDate:""});

  const isAdmin=currentUser.type==="admin";
  const isClient=currentUser.type==="client";
  const visible=isAdmin?tickets:isClient?tickets.filter(t=>t.openedBy===currentUser.id):tickets.filter(t=>t.openedBy===currentUser.id||t.assignedTo===currentUser.id||t.dept===currentUser.dept);

  function navTo(p){setPage(p);setSelectedTicket(null);setSelectedOrder(null);}
  function switchUser(u){setCurrentUser(u);setSelectedTicket(null);setSelectedOrder(null);setPage("dashboard");}

  function sendChat(){
    if(!chatMsg.trim()||!selectedTicket)return;
    const now=new Date();const time=`${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
    const updated=tickets.map(t=>t.id===selectedTicket.id?{...t,chat:[...t.chat,{uid:currentUser.id,text:chatMsg,time}]}:t);
    setTickets(updated);setSelectedTicket(updated.find(t=>t.id===selectedTicket.id));setChatMsg("");
  }

  function advanceWF(ticket){
    const wf=WF[ticket.type];if(!wf)return;
    const next=ticket.currentStep+1;const last=next>wf.length;
    const updated=tickets.map(t=>t.id===ticket.id?{...t,currentStep:last?wf.length:next,status:last?"مكتملة":"قيد التنفيذ"}:t);
    setTickets(updated);setSelectedTicket(updated.find(t=>t.id===ticket.id));
  }

  function createTicket(){
    if(!form.title.trim())return;
    const wf=WF[form.type];const id="TK-"+String(tickets.length+1).padStart(3,"0");
    const now=new Date().toISOString().split("T")[0];
    const time=new Date().toTimeString().slice(0,5);
    setTickets([...tickets,{...form,id,openedBy:currentUser.id,dept:wf?wf[0].dept:currentUser.dept,currentStep:1,status:"لم تبدأ",createdAt:now,orderId:pendingOrder||null,chat:[{uid:currentUser.id,text:`تم فتح التذكرة: ${form.title}`,time}]}]);
    setShowModal(false);setPendingOrder(null);setForm({title:"",type:"شراء",priority:"متوسطة",assignedTo:2,dueDate:""});
  }

  function toggleTask(id){setPersonalTasks(personalTasks.map(t=>t.id===id?{...t,done:!t.done}:t));}
  function addTask(){if(!newTaskText.trim())return;setPersonalTasks([...personalTasks,{id:Date.now(),uid:currentUser.id,title:newTaskText.trim(),done:false,priority:"متوسطة"}]);setNewTaskText("");}

  const navItems=[{id:"dashboard",icon:"🏠",label:"الرئيسية"},{id:"tickets",icon:"🎫",label:"التذاكر"},...(isAdmin?[{id:"orders",icon:"📦",label:"الطلبات"}]:[]),...(!isClient?[{id:"my",icon:"✅",label:"مهامي"}]:[]),...(isAdmin?[{id:"team",icon:"👥",label:"الفريق"}]:[])];
  const stats=[{l:"إجمالي التذاكر",v:visible.length,c:"#534AB7"},{l:"قيد التنفيذ",v:visible.filter(t=>t.status==="قيد التنفيذ").length,c:"#BA7517"},{l:"مكتملة",v:visible.filter(t=>t.status==="مكتملة").length,c:"#0F6E56"},{l:"عاجلة",v:visible.filter(t=>t.priority==="عاجلة").length,c:"#E24B4A"}];

  const topTitle=selectedTicket?`← ${selectedTicket.id}`:selectedOrder?`← ${selectedOrder.id}`:{dashboard:"لوحة التحكم",tickets:"التذاكر",orders:"الطلبات",my:"مهامي",team:"الفريق"}[page];

  return(
    <div style={{display:"flex",height:"100vh",background:"#0a0a0f",color:"#e2e8f0",fontFamily:"'Cairo',sans-serif",direction:"rtl",position:"relative"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#3f3f46;border-radius:4px}.nav-btn{display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:10px;cursor:pointer;font-size:13px;color:#a1a1aa;transition:all .15s;border:none;background:transparent;font-family:'Cairo',sans-serif;width:100%;text-align:right}.nav-btn:hover{background:#18181b;color:#e2e8f0}.nav-btn.active{background:#1e1e2e;color:#a5b4fc}.card{background:#13131a;border:1px solid #27272a;border-radius:14px;transition:border-color .15s}.card:hover{border-color:#3f3f46}.kan-card{background:#13131a;border:1px solid #27272a;border-radius:10px;padding:12px;cursor:pointer;margin-bottom:8px;transition:border-color .15s}.kan-card:hover{border-color:#6366f1}.btn{cursor:pointer;border:none;font-family:'Cairo',sans-serif;transition:all .15s;font-weight:700;border-radius:8px}.btn:hover{filter:brightness(1.1)}.btn-primary{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:8px 16px;font-size:13px}.btn-ghost{background:#1e1e24;color:#a1a1aa;padding:8px 14px;font-size:13px}.ticket-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #1e1e24;cursor:pointer}.ticket-row:hover{opacity:.8}.ticket-row:last-child{border-bottom:none}.form-inp{background:#1a1a22;border:1px solid #27272a;border-radius:8px;padding:8px 12px;font-size:13px;color:#e2e8f0;font-family:'Cairo',sans-serif;outline:none;width:100%}.form-inp:focus{border-color:#6366f1}.step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}.tab-btn{padding:5px 14px;border-radius:8px;font-size:12px;cursor:pointer;border:1px solid #27272a;background:transparent;color:#71717a;font-family:'Cairo',sans-serif;transition:all .15s}.tab-btn.active{background:#1e1e3e;color:#a5b4fc;border-color:#6366f130}`}</style>

      {/* Sidebar */}
      <div style={{width:200,background:"#0d0d14",borderLeft:"1px solid #1e1e24",display:"flex",flexDirection:"column",padding:"12px 8px",gap:2,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",marginBottom:14}}>
          <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:15}}>T</div>
          <span style={{fontWeight:900,fontSize:18,background:"linear-gradient(135deg,#a5b4fc,#c4b5fd)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Taskly</span>
        </div>
        {navItems.map(n=><button key={n.id} className={`nav-btn${page===n.id?" active":""}`} onClick={()=>navTo(n.id)}><span>{n.icon}</span><span>{n.label}</span></button>)}
        <div style={{flex:1}}/>
        <div style={{borderTop:"1px solid #1e1e24",paddingTop:12}}>
          <div style={{fontSize:10,color:"#52525b",marginBottom:8,paddingRight:4}}>تبديل المستخدم</div>
          {USERS.map(u=><div key={u.id} onClick={()=>switchUser(u)} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 8px",borderRadius:8,cursor:"pointer",background:currentUser.id===u.id?"#18181b":"transparent"}}>
            <Av user={u} size={24}/><div style={{minWidth:0}}><div style={{fontSize:11,fontWeight:700,color:currentUser.id===u.id?"#a5b4fc":"#a1a1aa",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{u.name.split(" ")[0]}</div><div style={{fontSize:9,color:"#52525b"}}>{u.role}</div></div>
          </div>)}
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Topbar */}
        <div style={{background:"#0d0d14",borderBottom:"1px solid #1e1e24",padding:"0 22px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{fontSize:15,fontWeight:800}}>{topTitle}</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {(page==="tickets"||page==="dashboard")&&!isClient&&!selectedTicket&&<button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ تذكرة جديدة</button>}
            <div style={{display:"flex",alignItems:"center",gap:8,background:"#13131a",border:"1px solid #27272a",borderRadius:10,padding:"6px 10px"}}>
              <Av user={currentUser} size={26}/><div style={{fontSize:12,fontWeight:700}}>{currentUser.name.split(" ")[0]}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1,overflow:"auto",padding:22}}>

          {/* DASHBOARD */}
          {page==="dashboard"&&<div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
              {stats.map(s=><div key={s.l} className="card" style={{padding:"14px 18px"}}><div style={{fontSize:11,color:"#71717a",marginBottom:4}}>{s.l}</div><div style={{fontSize:32,fontWeight:900,color:s.c}}>{s.v}</div></div>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div className="card" style={{padding:18}}>
                <div style={{fontWeight:800,marginBottom:14,fontSize:14}}>آخر التذاكر</div>
                {visible.slice(0,4).map(t=>{const op=USERS.find(u=>u.id===t.openedBy);return(<div key={t.id} className="ticket-row" onClick={()=>{setSelectedTicket(t);setPage("tickets");}}>
                  <Av user={op} size={30}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.title}</div><div style={{fontSize:10,color:"#52525b"}}>{t.id} · {t.createdAt}</div></div><Badge label={t.status} color={ST_COLOR[t.status]}/>
                </div>);})}
              </div>
              <div className="card" style={{padding:18}}>
                <div style={{fontWeight:800,marginBottom:14,fontSize:14}}>الأقسام</div>
                {DEPTS.map(d=>{const cnt=tickets.filter(t=>t.dept===d.id).length;const done=tickets.filter(t=>t.dept===d.id&&t.status==="مكتملة").length;const pct=cnt?Math.round(done/cnt*100):0;return(<div key={d.id} style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span>{d.icon} {d.name}</span><span style={{fontWeight:700,color:d.color}}>{pct}%</span></div><div style={{height:5,background:"#1e1e24",borderRadius:3}}><div style={{height:"100%",width:`${pct}%`,background:d.color,borderRadius:3,transition:"width .3s"}}/></div></div>);})}
              </div>
            </div>
          </div>}

          {/* TICKETS KANBAN */}
          {page==="tickets"&&!selectedTicket&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
            {["لم تبدأ","قيد التنفيذ","مكتملة"].map(st=>{const cols=visible.filter(t=>t.status===st);return(<div key={st}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}><div style={{width:8,height:8,borderRadius:"50%",background:ST_COLOR[st]}}/><span style={{fontWeight:800,fontSize:13}}>{st}</span><span style={{fontSize:11,color:"#71717a",background:"#18181b",padding:"1px 7px",borderRadius:10}}>{cols.length}</span></div>
              {cols.map(t=>{const wf=WF[t.type];const op=USERS.find(u=>u.id===t.openedBy);const as=USERS.find(u=>u.id===t.assignedTo);return(<div key={t.id} className="kan-card" onClick={()=>setSelectedTicket(t)}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:10,color:"#52525b",fontWeight:700}}>{t.id}</span><Badge label={t.priority} color={PR_COLOR[t.priority]}/></div>
                <div style={{fontWeight:700,fontSize:13,marginBottom:6}}>{t.title}</div>
                {wf&&<div style={{display:"flex",gap:3,marginBottom:8}}>{wf.map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<t.currentStep-1?"#6366f1":i===t.currentStep-1?"#8b5cf6":"#27272a"}}/>)}</div>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex"}}><Av user={op} size={22}/>{as&&as.id!==op?.id&&<Av user={as} size={22}/>}</div><span style={{fontSize:10,color:"#52525b"}}>{t.dueDate}</span></div>
              </div>);})}
            </div>);})}
          </div>}

          {/* TICKET DETAIL */}
          {page==="tickets"&&selectedTicket&&(()=>{const t=selectedTicket;const wf=WF[t.type];const op=USERS.find(u=>u.id===t.openedBy);const as=USERS.find(u=>u.id===t.assignedTo);const canAdv=!isClient&&t.status!=="مكتملة"&&wf&&(isAdmin||t.assignedTo===currentUser.id);const curStep=wf?.[t.currentStep-1];
            return(<div>
              <button className="btn btn-ghost" onClick={()=>setSelectedTicket(null)} style={{marginBottom:14}}>← رجوع</button>
              <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:14}}>
                <div className="card" style={{display:"flex",flexDirection:"column",height:500}}>
                  <div style={{padding:"14px 18px",borderBottom:"1px solid #1e1e24"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div><div style={{fontSize:10,color:"#52525b",marginBottom:3}}>{t.id}</div><div style={{fontWeight:800,fontSize:16}}>{t.title}</div></div>
                      <div style={{display:"flex",gap:6}}><Badge label={t.status} color={ST_COLOR[t.status]}/><Badge label={t.priority} color={PR_COLOR[t.priority]}/></div>
                    </div>
                  </div>
                  <div style={{flex:1,overflow:"auto",padding:"14px 18px",display:"flex",flexDirection:"column",gap:10}}>
                    {t.chat.map((msg,i)=>{const u=USERS.find(x=>x.id===msg.uid);const isMe=msg.uid===currentUser.id;return(<div key={i} style={{display:"flex",gap:8,flexDirection:isMe?"row-reverse":"row"}}>
                      <Av user={u} size={30}/><div style={{maxWidth:"70%"}}><div style={{fontSize:10,color:"#52525b",marginBottom:3,textAlign:isMe?"left":"right"}}>{u?.name} · {msg.time}</div><div style={{background:isMe?"#1e1e3e":"#1a1a22",border:`1px solid ${isMe?"#6366f130":"#27272a"}`,padding:"8px 12px",borderRadius:10,fontSize:12,lineHeight:1.6}}>{msg.text}</div></div>
                    </div>);})}
                  </div>
                  <div style={{padding:"10px 14px",borderTop:"1px solid #1e1e24",display:"flex",gap:8}}>
                    <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="اكتب رسالة..." className="form-inp" style={{flex:1}}/>
                    <button className="btn btn-primary" onClick={sendChat} style={{padding:"8px 14px"}}>إرسال</button>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div className="card" style={{padding:14}}>
                    <div style={{fontWeight:800,marginBottom:12,fontSize:13}}>المعنيون</div>
                    {[[op,"فاتح التذكرة"],[as,"المسؤول"]].map(([u,lbl])=>u&&(<div key={lbl} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><Av user={u} size={36}/><div><div style={{fontSize:11,color:"#71717a"}}>{lbl}</div><div style={{fontSize:13,fontWeight:600}}>{u.name}</div></div></div>))}
                  </div>
                  {wf&&<div className="card" style={{padding:14}}>
                    <div style={{fontWeight:800,marginBottom:12,fontSize:13}}>سير العمل</div>
                    {wf.map((s,i)=>{const isDone=i<t.currentStep-1;const isAct=i===t.currentStep-1;const d=DEPTS.find(d=>d.id===s.dept);return(<div key={i} style={{display:"flex",gap:10,marginBottom:i<wf.length-1?0:0}}>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}><div className="step-dot" style={{background:isDone?"#10b981":isAct?"#6366f1":"#1e1e24",color:isDone||isAct?"#fff":"#71717a"}}>{isDone?"✓":i+1}</div>{i<wf.length-1&&<div style={{width:2,flex:1,minHeight:16,background:"#27272a",margin:"3px auto"}}/>}</div>
                      <div style={{paddingBottom:16}}><div style={{fontSize:12,fontWeight:600,color:isAct?"#a5b4fc":"#e2e8f0"}}>{s.label}</div><div style={{fontSize:10,color:"#52525b",marginTop:2}}>{d?.icon} {d?.name}</div></div>
                    </div>);})}
                    {canAdv&&curStep&&<button className="btn btn-primary" onClick={()=>advanceWF(t)} style={{width:"100%",marginTop:6}}>{t.currentStep>=wf.length?"✓ إغلاق التذكرة":`→ ${curStep.action}`}</button>}
                  </div>}
                  <div className="card" style={{padding:14}}>
                    <div style={{fontWeight:800,marginBottom:12,fontSize:13}}>التفاصيل</div>
                    {[["النوع",t.type],["تاريخ الإنشاء",t.createdAt],["الاستحقاق",t.dueDate||"—"],["رقم الطلب",t.orderId||"—"]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"5px 0",borderBottom:"1px solid #1e1e24"}}><span style={{color:"#71717a"}}>{k}</span><span style={{fontWeight:600}}>{v}</span></div>)}
                  </div>
                </div>
              </div>
            </div>);
          })()}

          {/* ORDERS */}
          {page==="orders"&&!selectedOrder&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
            {orders.map(o=>{const rel=tickets.filter(t=>t.orderId===o.id);const sc=o.status==="مكتمل"?"#0F6E56":o.status==="جديد"?"#185FA5":"#BA7517";return(<div key={o.id} className="card" onClick={()=>setSelectedOrder(o)} style={{padding:16,cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:12,fontWeight:700,color:"#6366f1"}}>{o.id}</span><Badge label={o.status} color={sc}/></div>
              <div style={{fontWeight:700,marginBottom:4}}>{o.title}</div>
              <div style={{fontSize:12,color:"#71717a",marginBottom:12}}>{o.client}</div>
              <div style={{fontSize:11,color:"#52525b",borderTop:"1px solid #1e1e24",paddingTop:8}}>🎫 {rel.length} تذكرة مرتبطة</div>
            </div>);})}
          </div>}

          {page==="orders"&&selectedOrder&&<div>
            <button className="btn btn-ghost" onClick={()=>setSelectedOrder(null)} style={{marginBottom:14}}>← رجوع</button>
            <div style={{fontWeight:900,fontSize:18,marginBottom:4}}>{selectedOrder.title}</div>
            <div style={{fontSize:12,color:"#71717a",marginBottom:20}}>{selectedOrder.id} · {selectedOrder.client}</div>
            <div style={{fontWeight:800,marginBottom:12}}>التذاكر المرتبطة</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {tickets.filter(t=>t.orderId===selectedOrder.id).map(t=><div key={t.id} className="kan-card" onClick={()=>{setSelectedTicket(t);setPage("tickets");}} style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1}}><div style={{fontSize:10,color:"#52525b"}}>{t.id}</div><div style={{fontWeight:600}}>{t.title}</div></div>
                <Badge label={t.status} color={ST_COLOR[t.status]}/><Badge label={t.priority} color={PR_COLOR[t.priority]}/>
              </div>)}
              <button className="btn btn-primary" style={{width:"fit-content",marginTop:6}} onClick={()=>{setPendingOrder(selectedOrder.id);setShowModal(true);}}>+ إضافة تذكرة</button>
            </div>
          </div>}

          {/* MY TASKS */}
          {page==="my"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div className="card" style={{padding:18}}>
              <div style={{display:"flex",gap:6,marginBottom:14}}>
                {[["tickets","🎫 تذاكري"],["personal","✅ مهام شخصية"]].map(([id,lbl])=><button key={id} className={`tab-btn${empTab===id?" active":""}`} onClick={()=>setEmpTab(id)}>{lbl}</button>)}
              </div>
              {empTab==="tickets"&&visible.filter(t=>t.assignedTo===currentUser.id).map(t=><div key={t.id} className="ticket-row" onClick={()=>{setSelectedTicket(t);setPage("tickets");}}>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{t.title}</div><div style={{fontSize:10,color:"#52525b"}}>{t.id}</div></div><Badge label={t.status} color={ST_COLOR[t.status]}/>
              </div>)}
              {empTab==="personal"&&<div>
                {personalTasks.filter(t=>t.uid===currentUser.id).map(t=><div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid #1e1e24"}}>
                  <div onClick={()=>toggleTask(t.id)} style={{width:20,height:20,borderRadius:5,border:`2px solid ${t.done?"#6366f1":"#52525b"}`,background:t.done?"#6366f1":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:11}}>{t.done?"✓":""}</div>
                  <span style={{flex:1,fontSize:13,color:t.done?"#52525b":"#e2e8f0",textDecoration:t.done?"line-through":"none"}}>{t.title}</span>
                  <Badge label={t.priority} color={PR_COLOR[t.priority]}/>
                </div>)}
                <div style={{display:"flex",gap:8,marginTop:12}}>
                  <input value={newTaskText} onChange={e=>setNewTaskText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTask()} placeholder="أضف مهمة..." className="form-inp" style={{flex:1}}/>
                  <button className="btn btn-primary" onClick={addTask}>+</button>
                </div>
              </div>}
            </div>
            <div className="card" style={{padding:18}}>
              <div style={{fontWeight:800,marginBottom:16,fontSize:14}}>إحصائياتي</div>
              {[{l:"تذاكر مفتوحة",v:visible.filter(t=>t.assignedTo===currentUser.id&&t.status!=="مكتملة").length,c:"#BA7517"},{l:"تذاكر مكتملة",v:visible.filter(t=>t.assignedTo===currentUser.id&&t.status==="مكتملة").length,c:"#0F6E56"},{l:"مهام شخصية",v:personalTasks.filter(t=>t.uid===currentUser.id&&!t.done).length,c:"#6366f1"}].map(s=><div key={s.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #1e1e24"}}><span style={{fontSize:13,color:"#a1a1aa"}}>{s.l}</span><span style={{fontSize:26,fontWeight:900,color:s.c}}>{s.v}</span></div>)}
            </div>
          </div>}

          {/* TEAM */}
          {page==="team"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
            {USERS.filter(u=>u.type==="employee").map(u=>{const my=tickets.filter(t=>t.assignedTo===u.id);const done=my.filter(t=>t.status==="مكتملة").length;const pct=my.length?Math.round(done/my.length*100):0;const dept=DEPTS.find(d=>d.id===u.dept);return(<div key={u.id} className="card" style={{padding:18}}>
              <div style={{display:"flex",gap:12,marginBottom:14}}><Av user={u} size={44}/><div><div style={{fontWeight:800}}>{u.name}</div><div style={{fontSize:12,color:dept?.color||"#71717a",marginTop:2}}>{dept?.icon} {dept?.name}</div></div></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:"#71717a"}}>الإنجاز</span><span style={{fontWeight:700,color:"#a5b4fc"}}>{pct}%</span></div>
              <div style={{height:5,background:"#1e1e24",borderRadius:3,marginBottom:12}}><div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:3}}/></div>
              <div style={{display:"flex",gap:6}}>{["لم تبدأ","قيد التنفيذ","مكتملة"].map(s=>{const cnt=my.filter(t=>t.status===s).length;return(<div key={s} style={{flex:1,background:"#1a1a22",borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontSize:18,fontWeight:900,color:ST_COLOR[s]}}>{cnt}</div><div style={{fontSize:9,color:"#52525b",marginTop:2}}>{s}</div></div>);})}</div>
            </div>);})}
          </div>}
        </div>
      </div>

      {/* Modal */}
      {showModal&&<div onClick={()=>{setShowModal(false);setPendingOrder(null);}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}}>
        <div onClick={e=>e.stopPropagation()} style={{background:"#13131a",border:"1px solid #27272a",borderRadius:16,padding:24,width:400,maxHeight:"90vh",overflow:"auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontWeight:800,fontSize:16}}>تذكرة جديدة</div><button className="btn btn-ghost" onClick={()=>{setShowModal(false);setPendingOrder(null);}} style={{padding:"4px 8px"}}>✕</button></div>
          <div style={{marginBottom:12}}><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>العنوان *</div><input className="form-inp" placeholder="عنوان التذكرة..." value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>النوع</div><select className="form-inp" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>شراء</option><option>صيانة</option><option>استفسار</option><option>أخرى</option></select></div>
            <div><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>الأولوية</div><select className="form-inp" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>عاجلة</option><option>عالية</option><option>متوسطة</option><option>منخفضة</option></select></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>المسؤول</div><select className="form-inp" value={form.assignedTo} onChange={e=>setForm({...form,assignedTo:parseInt(e.target.value)})}>{USERS.filter(u=>u.type==="employee").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
            <div><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>الاستحقاق</div><input type="date" className="form-inp" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/></div>
          </div>
          {pendingOrder&&<div style={{fontSize:12,color:"#6366f1",background:"#1e1e3e",padding:"8px 12px",borderRadius:8,marginBottom:12}}>🔗 مرتبطة بـ {pendingOrder}</div>}
          <div style={{display:"flex",gap:10,marginTop:4}}>
            <button className="btn btn-ghost" onClick={()=>{setShowModal(false);setPendingOrder(null);}} style={{flex:1}}>إلغاء</button>
            <button className="btn btn-primary" onClick={createTicket} style={{flex:2}}>✓ إنشاء التذكرة</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
