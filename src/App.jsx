import { useState } from "react";

const DEPTS=[{id:1,name:"المشتريات",icon:"🛒",color:"#BA7517"},{id:2,name:"المحاسبة",icon:"💰",color:"#0F6E56"},{id:3,name:"التصنيع",icon:"⚙️",color:"#185FA5"},{id:4,name:"المبيعات",icon:"📈",color:"#993556"}];

const USERS=[
  {id:1,name:"سالم المطيري",role:"مدير",dept:null,av:"سم",type:"admin",bg:"#534AB7",fg:"#EEEDFE"},
  {id:2,name:"أحمد الشمري",role:"مشتريات",dept:1,av:"أش",type:"employee",bg:"#BA7517",fg:"#FAEEDA"},
  {id:3,name:"نورة القحطاني",role:"محاسبة",dept:2,av:"نق",type:"employee",bg:"#0F6E56",fg:"#E1F5EE"},
  {id:4,name:"خالد الزهراني",role:"تصنيع",dept:3,av:"خز",type:"employee",bg:"#185FA5",fg:"#E6F1FB"},
  {id:5,name:"سارة العتيبي",role:"مبيعات",dept:4,av:"سع",type:"employee",bg:"#993556",fg:"#FBEAF0"},
  {id:6,name:"محمد العنزي",role:"عميل",dept:null,av:"مع",type:"client",bg:"#5F5E5A",fg:"#F1EFE8"}
];

const STATUSES=[
  {id:"لم تبدأ",label:"لم تبدأ",color:"#888780",bg:"#F1EFE8"},
  {id:"قيد التنفيذ",label:"قيد التنفيذ",color:"#185FA5",bg:"#E6F1FB"},
  {id:"معلقة",label:"معلقة",color:"#BA7517",bg:"#FAEEDA"},
  {id:"مؤجلة",label:"مؤجلة",color:"#993556",bg:"#FBEAF0"},
  {id:"ملغية",label:"ملغية",color:"#A32D2D",bg:"#FCEBEB"},
  {id:"مكتملة",label:"مكتملة",color:"#0F6E56",bg:"#E1F5EE"}
];

const PR_COLOR={"عاجلة":["#A32D2D","#FCEBEB"],"عالية":["#993556","#FBEAF0"],"متوسطة":["#BA7517","#FAEEDA"],"منخفضة":["#0F6E56","#E1F5EE"]};

const INIT_TICKETS=[
  {id:"TK-001",title:"طلب قماش صوف",type:"شراء",priority:"عالية",status:"قيد التنفيذ",openedBy:6,currentAssignee:2,currentDept:1,createdAt:"2026-06-04",dueDate:"2026-06-10",transfers:[],chat:[{uid:6,text:"محتاجين 200 متر قماش صوف أبيض",time:"09:00",type:"text"},{uid:2,text:"تم استلام الطلب، سأبدأ بالتسعير",time:"09:15",type:"text"},{uid:6,text:"شكراً، ننتظر",time:"09:20",type:"text"}]},
  {id:"TK-002",title:"صيانة ماكينة الخياطة",type:"صيانة",priority:"عاجلة",status:"معلقة",openedBy:4,currentAssignee:2,currentDept:1,createdAt:"2026-06-05",dueDate:"2026-06-06",transfers:[{from:4,to:2,dept:1,note:"نحتاج قطع غيار",time:"08:30"}],chat:[{uid:4,text:"الماكينة توقفت عن العمل",time:"08:20",type:"text"},{uid:4,text:"تحويل إلى المشتريات لتوفير قطع الغيار",time:"08:30",type:"transfer",to:2,toDept:1},{uid:2,text:"بنطلب القطع اليوم",time:"09:00",type:"text"}]},
  {id:"TK-003",title:"فاتورة مورد الأقمشة",type:"استفسار",priority:"متوسطة",status:"مكتملة",openedBy:2,currentAssignee:3,currentDept:2,createdAt:"2026-06-03",dueDate:"2026-06-07",transfers:[{from:2,to:3,dept:2,note:"للتدقيق المحاسبي",time:"10:00"}],chat:[{uid:2,text:"نحتاج مراجعة فاتورة رقم INV-441",time:"10:00",type:"text"},{uid:2,text:"تحويل إلى المحاسبة",time:"10:00",type:"transfer",to:3,toDept:2},{uid:3,text:"تم التدقيق والاعتماد ✓",time:"11:30",type:"text"},{uid:1,text:"تم إغلاق التذكرة — السبب: اكتملت مراجعة الفاتورة",time:"12:00",type:"close",newStatus:"مكتملة"}]},
  {id:"TK-004",title:"عرض سعر لعميل جديد",type:"استفسار",priority:"منخفضة",status:"لم تبدأ",openedBy:5,currentAssignee:5,currentDept:4,createdAt:"2026-06-05",dueDate:"2026-06-08",transfers:[],chat:[{uid:5,text:"العميل يطلب عرض سعر لـ 500 قطعة",time:"14:00",type:"text"}]}
];

function getTime(){return new Date().toTimeString().slice(0,5);}

function Badge({label,color,bg}){return<span style={{display:"inline-flex",alignItems:"center",padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:500,color,background:bg}}>{label}</span>;}

function StBadge({status}){const s=STATUSES.find(x=>x.id===status)||STATUSES[0];return<Badge label={s.label} color={s.color} bg={s.bg}/>;}

function PrBadge({priority}){const c=PR_COLOR[priority]||["#888780","#F1EFE8"];return<Badge label={priority} color={c[0]} bg={c[1]}/>;}

function Av({user,size=28}){
  if(!user)return null;
  return<div style={{width:size,height:size,borderRadius:"50%",background:user.bg,color:user.fg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size<=24?9:11,fontWeight:500,flexShrink:0}}>{user.av}</div>;
}

export default function App(){
  const [tickets,setTickets]=useState(INIT_TICKETS);
  const [currentUser,setCurrentUser]=useState(USERS[0]);
  const [page,setPage]=useState("dashboard");
  const [selectedTicket,setSelectedTicket]=useState(null);
  const [showModal,setShowModal]=useState(null); // "newTicket"|"transfer"|"status"
  const [modalData,setModalData]=useState({});

  const isAdmin=currentUser.type==="admin";
  const canChangeStatus=(tkt)=>isAdmin||currentUser.id===tkt.openedBy;

  function navTo(p){setPage(p);setSelectedTicket(null);}
  function openTicket(id){const t=tickets.find(x=>x.id===id);if(t){setSelectedTicket(t);setPage("tickets");}}

  function sendMsg(ticketId,text){
    if(!text.trim())return;
    const time=getTime();
    setTickets(prev=>prev.map(t=>t.id===ticketId?{...t,chat:[...t.chat,{uid:currentUser.id,text,time,type:"text"}]}:t));
    setSelectedTicket(prev=>prev?{...prev,chat:[...prev.chat,{uid:currentUser.id,text,time,type:"text"}]}:prev);
  }

  function doTransfer(ticketId,toUserId,toDeptId,note){
    const toUser=USERS.find(u=>u.id===toUserId);
    const toDept=DEPTS.find(d=>d.id===toDeptId);
    const time=getTime();
    const transferEntry={from:currentUser.id,to:toUserId,dept:toDeptId,note,time};
    const chatEntry={uid:currentUser.id,text:`تحويل إلى ${toUser?.name} (${toDept?.name})${note?" — "+note:""}`,time,type:"transfer"};
    setTickets(prev=>prev.map(t=>t.id===ticketId?{...t,currentAssignee:toUserId,currentDept:toDeptId,status:t.status==="لم تبدأ"?"قيد التنفيذ":t.status,transfers:[...t.transfers,transferEntry],chat:[...t.chat,chatEntry]}:t));
    setSelectedTicket(prev=>prev?{...prev,currentAssignee:toUserId,currentDept:toDeptId,transfers:[...prev.transfers,transferEntry],chat:[...prev.chat,chatEntry]}:prev);
    setShowModal(null);
  }

  function applyStatusChange(ticketId,newStatus,reason){
    const time=getTime();
    const isClosed=newStatus==="مكتملة"||newStatus==="ملغية";
    const text=`${isClosed?"تم إغلاق التذكرة":"تم تغيير الحالة إلى "+newStatus}${reason?" — "+reason:""}`;
    const chatEntry={uid:currentUser.id,text,time,type:"close",newStatus};
    setTickets(prev=>prev.map(t=>t.id===ticketId?{...t,status:newStatus,chat:[...t.chat,chatEntry]}:t));
    setSelectedTicket(prev=>prev?{...prev,status:newStatus,chat:[...prev.chat,chatEntry]}:prev);
    setShowModal(null);
  }

  function createTicket(form){
    const assignee=USERS.find(u=>u.id===form.assignedTo);
    const id="TK-"+String(tickets.length+1).padStart(3,"0");
    const now=new Date().toISOString().split("T")[0];
    const time=getTime();
    setTickets(prev=>[...prev,{...form,id,openedBy:currentUser.id,currentAssignee:form.assignedTo,currentDept:assignee?.dept||1,createdAt:now,transfers:[],chat:[{uid:currentUser.id,text:`تم فتح التذكرة: ${form.title}`,time,type:"system"}]}]);
    setShowModal(null);
  }

  const navItems=[
    {id:"dashboard",label:"الرئيسية"},
    {id:"tickets",label:"التذاكر"},
    {id:"my",label:"مهامي"},
    ...(isAdmin?[{id:"team",label:"الفريق"}]:[])
  ];

  return(
    <div dir="rtl" style={{display:"flex",height:"100vh",fontFamily:"system-ui,sans-serif",background:"#fff",color:"#111"}}>

      {/* Sidebar */}
      <div style={{width:190,background:"#f8f8f8",borderLeft:"1px solid #e5e5e5",display:"flex",flexDirection:"column",padding:"12px 8px",gap:2,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"4px 10px",marginBottom:12}}>
          <div style={{width:28,height:28,borderRadius:8,background:"#534AB7",display:"flex",alignItems:"center",justifyContent:"center",color:"#EEEDFE",fontSize:13,fontWeight:500}}>T</div>
          <span style={{fontSize:15,fontWeight:500}}>Taskly</span>
        </div>
        {navItems.map(n=>(
          <div key={n.id} onClick={()=>navTo(n.id)} style={{padding:"7px 10px",borderRadius:8,cursor:"pointer",fontSize:13,color:page===n.id?"#534AB7":"#666",background:page===n.id?"#fff":"transparent",fontWeight:page===n.id?500:400,border:page===n.id?"1px solid #e5e5e5":"1px solid transparent"}}>
            {n.label}
          </div>
        ))}
        <div style={{flex:1}}/>
        <div style={{borderTop:"1px solid #e5e5e5",paddingTop:10}}>
          <div style={{fontSize:10,color:"#aaa",padding:"0 8px",marginBottom:6}}>تبديل المستخدم</div>
          {USERS.map(u=>(
            <div key={u.id} onClick={()=>setCurrentUser(u)} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 8px",borderRadius:8,cursor:"pointer",background:currentUser.id===u.id?"#fff":"transparent"}}>
              <Av user={u} size={22}/>
              <div style={{minWidth:0}}>
                <div style={{fontSize:11,fontWeight:500,color:currentUser.id===u.id?"#534AB7":"#333",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{u.name}</div>
                <div style={{fontSize:9,color:"#aaa"}}>{u.type==="admin"?"مدير":u.type==="client"?"عميل":"موظف"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:"1px solid #e5e5e5",flexShrink:0}}>
          {selectedTicket
            ?<button onClick={()=>setSelectedTicket(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#666",display:"flex",alignItems:"center",gap:4}}>← رجوع</button>
            :<div style={{fontSize:14,fontWeight:500}}>{navItems.find(n=>n.id===page)?.label||""}</div>
          }
          {!selectedTicket&&page==="tickets"&&(
            <button onClick={()=>{setModalData({title:"",type:"شراء",priority:"متوسطة",assignedTo:2,dueDate:""});setShowModal("newTicket");}} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:8,fontSize:12,cursor:"pointer",border:"none",background:"#534AB7",color:"#EEEDFE"}}>
              + تذكرة جديدة
            </button>
          )}
        </div>

        <div style={{flex:1,overflow:"auto",padding:16}}>
          {selectedTicket
            ?<TicketDetail ticket={selectedTicket} tickets={tickets} currentUser={currentUser} canChangeStatus={canChangeStatus} onSendMsg={sendMsg} onTransfer={(id)=>{setModalData({ticketId:id,dept:1,user:2,note:""});setShowModal("transfer");}} onChangeStatus={(id)=>{setModalData({ticketId:id,status:selectedTicket.status,reason:""});setShowModal("status");}}/>
            :page==="dashboard"?<Dashboard tickets={tickets} onOpenTicket={openTicket}/>
            :page==="tickets"?<TicketsList tickets={tickets} onOpenTicket={openTicket}/>
            :page==="my"?<MyTickets tickets={tickets} currentUser={currentUser} onOpenTicket={openTicket}/>
            :page==="team"?<Team tickets={tickets}/>
            :null
          }
        </div>
      </div>

      {/* Modals */}
      {showModal&&(
        <div onClick={(e)=>{if(e.target===e.currentTarget)setShowModal(null);}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:12,padding:20,width:360,maxHeight:520,overflowY:"auto",border:"1px solid #e5e5e5"}}>
            {showModal==="newTicket"&&<NewTicketModal data={modalData} onChange={setModalData} onCreate={createTicket} onClose={()=>setShowModal(null)}/>}
            {showModal==="transfer"&&<TransferModal data={modalData} onChange={setModalData} onConfirm={doTransfer} onClose={()=>setShowModal(null)}/>}
            {showModal==="status"&&<StatusModal data={modalData} onChange={setModalData} onConfirm={applyStatusChange} onClose={()=>setShowModal(null)}/>}
          </div>
        </div>
      )}
    </div>
  );
}

function Dashboard({tickets,onOpenTicket}){
  const total=tickets.length;
  const open=tickets.filter(t=>t.status!=="مكتملة"&&t.status!=="ملغية").length;
  const done=tickets.filter(t=>t.status==="مكتملة").length;
  const urgent=tickets.filter(t=>t.priority==="عاجلة").length;
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        {[["إجمالي التذاكر",total,"#333"],["مفتوحة",open,"#185FA5"],["مكتملة",done,"#0F6E56"],["عاجلة",urgent,"#A32D2D"]].map(([label,val,color])=>(
          <div key={label} style={{background:"#f8f8f8",borderRadius:8,padding:"12px 14px"}}>
            <div style={{fontSize:11,color:"#888",marginBottom:4}}>{label}</div>
            <div style={{fontSize:22,fontWeight:500,color}}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:12,padding:14}}>
        <div style={{fontSize:13,fontWeight:500,marginBottom:10}}>آخر التذاكر</div>
        {tickets.slice().reverse().slice(0,5).map(tkt=>{
          const dept=DEPTS.find(d=>d.id===tkt.currentDept);
          const opener=USERS.find(u=>u.id===tkt.openedBy);
          return(
            <div key={tkt.id} onClick={()=>onOpenTicket(tkt.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid #f0f0f0",cursor:"pointer"}}>
              <Av user={opener} size={26}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{tkt.title}</div>
                <div style={{fontSize:10,color:"#aaa"}}>{tkt.id} · {dept?dept.icon+" "+dept.name:""}</div>
              </div>
              <StBadge status={tkt.status}/><PrBadge priority={tkt.priority}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TicketsList({tickets,onOpenTicket}){
  const groups={"لم تبدأ":[],"قيد التنفيذ":[],"معلقة":[],"مؤجلة":[],"مكتملة":[],"ملغية":[]};
  tickets.forEach(t=>{if(groups[t.status])groups[t.status].push(t);});
  const cols=[
    {label:"لم تبدأ / معلقة / مؤجلة",ids:["لم تبدأ","معلقة","مؤجلة"]},
    {label:"قيد التنفيذ",ids:["قيد التنفيذ"]},
    {label:"مكتملة / ملغية",ids:["مكتملة","ملغية"]}
  ];
  return(
    <div style={{display:"flex",gap:12,height:"calc(100vh - 80px)"}}>
      {cols.map(col=>(
        <div key={col.label} style={{flex:1,minWidth:0}}>
          <div style={{fontSize:11,fontWeight:500,color:"#888",marginBottom:8}}>{col.label}</div>
          {col.ids.flatMap(id=>groups[id]).map(tkt=>{
            const dept=DEPTS.find(d=>d.id===tkt.currentDept);
            const assignee=USERS.find(u=>u.id===tkt.currentAssignee);
            return(
              <div key={tkt.id} onClick={()=>onOpenTicket(tkt.id)} style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:8,padding:10,cursor:"pointer",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:10,color:"#aaa",fontWeight:500}}>{tkt.id}</span>
                  <PrBadge priority={tkt.priority}/>
                </div>
                <div style={{fontSize:13,fontWeight:500,marginBottom:7}}>{tkt.title}</div>
                {dept&&<div style={{fontSize:11,marginBottom:6,color:dept.color}}>{dept.icon} {dept.name}</div>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <Av user={assignee} size={22}/>
                  <StBadge status={tkt.status}/>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function TicketDetail({ticket:tkt,tickets,currentUser,canChangeStatus,onSendMsg,onTransfer,onChangeStatus}){
  const [msg,setMsg]=useState("");
  const fullTkt=tickets.find(t=>t.id===tkt.id)||tkt;
  const dept=DEPTS.find(d=>d.id===fullTkt.currentDept);
  const assignee=USERS.find(u=>u.id===fullTkt.currentAssignee);
  const opener=USERS.find(u=>u.id===fullTkt.openedBy);
  const isClosed=fullTkt.status==="مكتملة"||fullTkt.status==="ملغية";

  function handleSend(){if(msg.trim()){onSendMsg(fullTkt.id,msg);setMsg("");}}

  return(
    <div style={{display:"flex",gap:14,height:"calc(100vh - 80px)",maxHeight:530}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",background:"#fff",border:"1px solid #e5e5e5",borderRadius:12,overflow:"hidden",minWidth:0}}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid #f0f0f0",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:10,color:"#aaa",marginBottom:2}}>{fullTkt.id}</div>
              <div style={{fontSize:15,fontWeight:500}}>{fullTkt.title}</div>
            </div>
            <div style={{display:"flex",gap:6,flexShrink:0}}><StBadge status={fullTkt.status}/><PrBadge priority={fullTkt.priority}/></div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:8}}>
          {fullTkt.chat.map((m,i)=>{
            const u=USERS.find(x=>x.id===m.uid);
            const isMe=m.uid===currentUser.id;
            if(m.type==="transfer")return<div key={i} style={{background:"#EEEDFE",border:"1px solid #AFA9EC",borderRadius:6,padding:"5px 14px",fontSize:11,color:"#534AB7",textAlign:"center",alignSelf:"center"}}>↗ {m.text}</div>;
            if(m.type==="system")return<div key={i} style={{background:"#f5f5f5",borderRadius:6,padding:"4px 12px",fontSize:11,color:"#888",textAlign:"center",alignSelf:"center"}}>{m.text}</div>;
            if(m.type==="close"){const s=STATUSES.find(x=>x.id===m.newStatus);return<div key={i} style={{background:s?.bg||"#f5f5f5",border:`1px solid ${s?.color||"#aaa"}40`,borderRadius:6,padding:"5px 14px",fontSize:11,color:s?.color||"#888",textAlign:"center",alignSelf:"center"}}>{m.text}</div>;}
            return(
              <div key={i} style={{display:"flex",gap:7,flexDirection:isMe?"row-reverse":"row"}}>
                <Av user={u} size={26}/>
                <div>
                  <div style={{fontSize:10,color:"#aaa",marginBottom:2,textAlign:isMe?"left":"right"}}>{u?.name} · {m.time}</div>
                  <div style={{background:isMe?"#EEEDFE":"#f5f5f5",borderRadius:isMe?"10px 10px 2px 10px":"10px 10px 10px 2px",padding:"8px 12px",fontSize:12,color:isMe?"#26215C":"#333",maxWidth:"70%"}}>{m.text}</div>
                </div>
              </div>
            );
          })}
        </div>
        {!isClosed
          ?<div style={{padding:"10px 16px",borderTop:"1px solid #f0f0f0",display:"flex",gap:8,flexShrink:0}}>
            <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")handleSend();}} placeholder="اكتب رسالة..." style={{flex:1,background:"#f8f8f8",border:"1px solid #e5e5e5",borderRadius:6,padding:"7px 10px",fontSize:12,outline:"none",fontFamily:"inherit"}}/>
            <button onClick={handleSend} style={{background:"#534AB7",border:"none",borderRadius:6,color:"#EEEDFE",padding:"7px 14px",cursor:"pointer",fontSize:12}}>إرسال</button>
          </div>
          :<div style={{padding:"10px 16px",borderTop:"1px solid #f0f0f0",textAlign:"center",fontSize:11,color:"#aaa"}}>التذكرة {fullTkt.status} — لا يمكن إضافة رسائل</div>
        }
      </div>

      <div style={{width:220,display:"flex",flexDirection:"column",gap:10,flexShrink:0}}>
        <div style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:12,padding:14}}>
          <div style={{fontSize:12,fontWeight:500,marginBottom:10}}>الحالة الحالية</div>
          <div style={{marginBottom:10}}><StBadge status={fullTkt.status}/></div>
          {canChangeStatus(fullTkt)
            ?<button onClick={()=>onChangeStatus(fullTkt.id)} style={{width:"100%",padding:"6px 12px",borderRadius:8,fontSize:11,cursor:"pointer",border:"1px solid #e5e5e5",background:"#f8f8f8",fontFamily:"inherit"}}>تغيير الحالة</button>
            :<div style={{fontSize:11,color:"#aaa"}}>صلاحية التغيير: منشئ التذكرة والمدير فقط</div>
          }
        </div>

        <div style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:12,padding:14}}>
          <div style={{fontSize:12,fontWeight:500,marginBottom:10}}>التفاصيل</div>
          {[["فاتح التذكرة",opener?.name||"-"],["المعين الحالي",assignee?.name||"-"],["القسم",dept?dept.icon+" "+dept.name:"-"],["النوع",fullTkt.type],["الإنشاء",fullTkt.createdAt],["الاستحقاق",fullTkt.dueDate||"-"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"4px 0",borderBottom:"1px solid #f0f0f0"}}>
              <span style={{color:"#888"}}>{k}</span>
              <span style={{fontWeight:500}}>{v}</span>
            </div>
          ))}
        </div>

        {!isClosed&&<button onClick={()=>onTransfer(fullTkt.id)} style={{width:"100%",padding:"7px 12px",borderRadius:8,fontSize:12,cursor:"pointer",border:"1px solid #e5e5e5",background:"#f8f8f8",fontFamily:"inherit"}}>↗ تحويل التذكرة</button>}

        {fullTkt.transfers.length>0&&(
          <div style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:12,padding:14}}>
            <div style={{fontSize:12,fontWeight:500,marginBottom:8}}>سجل التحويلات</div>
            {fullTkt.transfers.map((tr,i)=>{
              const fromU=USERS.find(u=>u.id===tr.from);
              const toU=USERS.find(u=>u.id===tr.to);
              const toDept=DEPTS.find(d=>d.id===tr.dept);
              return(
                <div key={i} style={{fontSize:10,padding:"5px 0",borderBottom:"1px solid #f0f0f0"}}>
                  <div>{fromU?.name} ← {toU?.name}</div>
                  <div style={{color:"#aaa"}}>{toDept?.icon} {toDept?.name} · {tr.time}</div>
                  {tr.note&&<div style={{color:"#666",marginTop:2}}>{tr.note}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function MyTickets({tickets,currentUser,onOpenTicket}){
  const myTickets=tickets.filter(t=>t.currentAssignee===currentUser.id||t.openedBy===currentUser.id);
  return(
    <div style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:12,padding:14}}>
      <div style={{fontSize:13,fontWeight:500,marginBottom:12}}>تذاكري</div>
      {myTickets.length===0&&<div style={{color:"#aaa",fontSize:12}}>لا توجد تذاكر</div>}
      {myTickets.map(tkt=>{
        const dept=DEPTS.find(d=>d.id===tkt.currentDept);
        return(
          <div key={tkt.id} onClick={()=>onOpenTicket(tkt.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid #f0f0f0",cursor:"pointer"}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:500}}>{tkt.title}</div>
              <div style={{fontSize:10,color:"#aaa"}}>{tkt.id} · {dept?dept.icon+" "+dept.name:""}</div>
            </div>
            <StBadge status={tkt.status}/><PrBadge priority={tkt.priority}/>
          </div>
        );
      })}
    </div>
  );
}

function Team({tickets}){
  const employees=USERS.filter(u=>u.type==="employee");
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
      {employees.map(u=>{
        const dept=DEPTS.find(d=>d.id===u.dept);
        const myTickets=tickets.filter(t=>t.currentAssignee===u.id&&t.status!=="مكتملة"&&t.status!=="ملغية");
        return(
          <div key={u.id} style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:12,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <Av user={u} size={34}/>
              <div>
                <div style={{fontSize:13,fontWeight:500}}>{u.name}</div>
                <div style={{fontSize:11,color:dept?.color||"#888"}}>{dept?dept.icon+" "+dept.name:""}</div>
              </div>
            </div>
            <div style={{fontSize:11,color:"#888",marginBottom:6}}>التذاكر النشطة: {myTickets.length}</div>
            {myTickets.slice(0,3).map(t=><div key={t.id} style={{fontSize:11,padding:"3px 0",borderBottom:"1px solid #f0f0f0"}}>{t.title}</div>)}
          </div>
        );
      })}
    </div>
  );
}

function NewTicketModal({data,onChange,onCreate,onClose}){
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:500}}>تذكرة جديدة</div>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:16}}>×</button>
      </div>
      <div style={{marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:500,marginBottom:5}}>العنوان</div>
        <input value={data.title||""} onChange={e=>onChange({...data,title:e.target.value})} placeholder="وصف الطلب..." style={{width:"100%",background:"#f8f8f8",border:"1px solid #e5e5e5",borderRadius:6,padding:"7px 10px",fontSize:12,outline:"none",fontFamily:"inherit"}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <div>
          <div style={{fontSize:12,fontWeight:500,marginBottom:5}}>النوع</div>
          <select value={data.type||"شراء"} onChange={e=>onChange({...data,type:e.target.value})} style={{width:"100%",background:"#f8f8f8",border:"1px solid #e5e5e5",borderRadius:6,padding:"6px 10px",fontSize:12,fontFamily:"inherit"}}>
            <option>شراء</option><option>صيانة</option><option>استفسار</option>
          </select>
        </div>
        <div>
          <div style={{fontSize:12,fontWeight:500,marginBottom:5}}>الأولوية</div>
          <select value={data.priority||"متوسطة"} onChange={e=>onChange({...data,priority:e.target.value})} style={{width:"100%",background:"#f8f8f8",border:"1px solid #e5e5e5",borderRadius:6,padding:"6px 10px",fontSize:12,fontFamily:"inherit"}}>
            <option>عاجلة</option><option>عالية</option><option>متوسطة</option><option>منخفضة</option>
          </select>
        </div>
      </div>
      <div style={{marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:500,marginBottom:5}}>تعيين إلى</div>
        <select value={data.assignedTo||2} onChange={e=>onChange({...data,assignedTo:parseInt(e.target.value)})} style={{width:"100%",background:"#f8f8f8",border:"1px solid #e5e5e5",borderRadius:6,padding:"6px 10px",fontSize:12,fontFamily:"inherit"}}>
          {USERS.filter(u=>u.type==="employee").map(u=><option key={u.id} value={u.id}>{u.name} — {DEPTS.find(d=>d.id===u.dept)?.name||""}</option>)}
        </select>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:500,marginBottom:5}}>تاريخ الاستحقاق</div>
        <input type="date" value={data.dueDate||""} onChange={e=>onChange({...data,dueDate:e.target.value})} style={{width:"100%",background:"#f8f8f8",border:"1px solid #e5e5e5",borderRadius:6,padding:"6px 10px",fontSize:12,fontFamily:"inherit"}}/>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>onCreate({...data,status:"لم تبدأ"})} style={{flex:1,padding:"7px 12px",borderRadius:8,fontSize:12,cursor:"pointer",border:"none",background:"#534AB7",color:"#EEEDFE",fontFamily:"inherit"}}>إنشاء</button>
        <button onClick={onClose} style={{padding:"7px 12px",borderRadius:8,fontSize:12,cursor:"pointer",border:"1px solid #e5e5e5",background:"#f8f8f8",fontFamily:"inherit"}}>إلغاء</button>
      </div>
    </div>
  );
}

function TransferModal({data,onChange,onConfirm,onClose}){
  const deptUsers=USERS.filter(u=>u.type==="employee"&&u.dept===data.dept);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:500}}>تحويل التذكرة</div>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:16}}>×</button>
      </div>
      <div style={{marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:500,marginBottom:5}}>القسم</div>
        <select value={data.dept||1} onChange={e=>{const d=parseInt(e.target.value);const firstUser=USERS.find(u=>u.type==="employee"&&u.dept===d);onChange({...data,dept:d,user:firstUser?.id||data.user});}} style={{width:"100%",background:"#f8f8f8",border:"1px solid #e5e5e5",borderRadius:6,padding:"6px 10px",fontSize:12,fontFamily:"inherit"}}>
          {DEPTS.map(d=><option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}
        </select>
      </div>
      <div style={{marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:500,marginBottom:5}}>الموظف</div>
        <select value={data.user||""} onChange={e=>onChange({...data,user:parseInt(e.target.value)})} style={{width:"100%",background:"#f8f8f8",border:"1px solid #e5e5e5",borderRadius:6,padding:"6px 10px",fontSize:12,fontFamily:"inherit"}}>
          {deptUsers.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:500,marginBottom:5}}>ملاحظة <span style={{color:"#aaa",fontWeight:400}}>(اختياري)</span></div>
        <textarea value={data.note||""} onChange={e=>onChange({...data,note:e.target.value})} placeholder="أضف ملاحظة..." style={{width:"100%",background:"#f8f8f8",border:"1px solid #e5e5e5",borderRadius:6,padding:"7px 10px",fontSize:12,resize:"none",height:60,fontFamily:"inherit"}}/>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>onConfirm(data.ticketId,data.user,data.dept,data.note||"")} style={{flex:1,padding:"7px 12px",borderRadius:8,fontSize:12,cursor:"pointer",border:"none",background:"#534AB7",color:"#EEEDFE",fontFamily:"inherit"}}>تحويل</button>
        <button onClick={onClose} style={{padding:"7px 12px",borderRadius:8,fontSize:12,cursor:"pointer",border:"1px solid #e5e5e5",background:"#f8f8f8",fontFamily:"inherit"}}>إلغاء</button>
      </div>
    </div>
  );
}

function StatusModal({data,onChange,onConfirm,onClose}){
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:500}}>تغيير حالة التذكرة</div>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:16}}>×</button>
      </div>
      <div style={{fontSize:12,fontWeight:500,marginBottom:8}}>اختر الحالة الجديدة</div>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
        {STATUSES.map(s=>(
          <button key={s.id} onClick={()=>onChange({...data,status:s.id})} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:8,cursor:"pointer",fontSize:12,border:data.status===s.id?"1px solid #534AB7":"1px solid #e5e5e5",background:data.status===s.id?"#EEEDFE":"#f8f8f8",color:data.status===s.id?"#534AB7":"#333",fontFamily:"inherit",width:"100%",textAlign:"right"}}>
            <span style={{width:10,height:10,borderRadius:"50%",background:s.color,display:"inline-block",flexShrink:0}}></span>
            {s.label}
          </button>
        ))}
      </div>
      <div style={{fontSize:12,fontWeight:500,marginBottom:5}}>سبب التغيير <span style={{color:"#aaa",fontWeight:400}}>(اختياري)</span></div>
      <textarea value={data.reason||""} onChange={e=>onChange({...data,reason:e.target.value})} placeholder="اكتب سبب تغيير الحالة..." style={{width:"100%",background:"#f8f8f8",border:"1px solid #e5e5e5",borderRadius:6,padding:"7px 10px",fontSize:12,resize:"none",height:60,fontFamily:"inherit",marginBottom:14}}/>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>onConfirm(data.ticketId,data.status,data.reason||"")} style={{flex:1,padding:"7px 12px",borderRadius:8,fontSize:12,cursor:"pointer",border:"none",background:"#534AB7",color:"#EEEDFE",fontFamily:"inherit"}}>تأكيد التغيير</button>
        <button onClick={onClose} style={{padding:"7px 12px",borderRadius:8,fontSize:12,cursor:"pointer",border:"1px solid #e5e5e5",background:"#f8f8f8",fontFamily:"inherit"}}>إلغاء</button>
      </div>
    </div>
  );
}
