import { useState, useRef } from "react";

const DEFAULT_DEPTS=[{id:1,name:"المشتريات",icon:"🛒",color:"#B87B0A"},{id:2,name:"المحاسبة",icon:"💰",color:"#0F6E56"},{id:3,name:"التصنيع",icon:"⚙️",color:"#185FA5"},{id:4,name:"المبيعات",icon:"📈",color:"#993556"}];
const DEFAULT_USERS=[{id:1,name:"سالم المطيري",role:"مدير",dept:null,av:"سم",type:"admin",bg:"#534AB7",fg:"#EEEDFE"},{id:2,name:"أحمد الشمري",role:"مشتريات",dept:1,av:"أش",type:"employee",bg:"#B87B0A",fg:"#FAEEDA"},{id:3,name:"نورة القحطاني",role:"محاسبة",dept:2,av:"نق",type:"employee",bg:"#0F6E56",fg:"#E1F5EE"},{id:4,name:"خالد الزهراني",role:"تصنيع",dept:3,av:"خز",type:"employee",bg:"#185FA5",fg:"#E6F1FB"},{id:5,name:"سارة العتيبي",role:"مبيعات",dept:4,av:"سع",type:"employee",bg:"#993556",fg:"#FBEAF0"},{id:6,name:"شركة النسيج",role:"عميل",dept:null,av:"عم",type:"client",bg:"#5F5E5A",fg:"#F1EFE8"}];
const PR_COLOR={"عاجلة":"#E24B4A","عالية":"#BA7517","متوسطة":"#185FA5","منخفضة":"#3B6D11"};
const ST_COLOR={"لم تبدأ":"#5F5E5A","قيد التنفيذ":"#BA7517","مكتملة":"#0F6E56"};
const DEPT_COLORS=["#B87B0A","#0F6E56","#185FA5","#993556","#534AB7","#7C3D8F","#C0392B","#1A6B5A"];
const DEPT_ICONS=["🛒","💰","⚙️","📈","📦","🔧","📋","🏭","💼","🎯"];
const AV_COLORS=["#534AB7","#B87B0A","#0F6E56","#185FA5","#993556","#7C3D8F","#C0392B","#1A6B5A"];

const INIT_TICKETS=[
  {id:"TK-001",title:"شراء قماش قطني",type:"شراء",priority:"عالية",status:"قيد التنفيذ",openedBy:2,currentDept:2,currentAssignee:3,createdAt:"2026-05-20",dueDate:"2026-06-10",transfers:[{from:2,to:3,dept:2,note:"محتاج اعتماد ميزانية",time:"09:30"}],chat:[{uid:2,text:"نحتاج 500 متر قماش قطني درجة أولى",time:"09:00",type:"msg"},{uid:2,text:"تحويل إلى نورة القحطاني (المحاسبة) — محتاج اعتماد ميزانية",time:"09:30",type:"transfer"},{uid:3,text:"جاري مراجعة الميزانية",time:"10:30",type:"msg"}]},
  {id:"TK-002",title:"صيانة ماكينة الخياطة",type:"صيانة",priority:"عاجلة",status:"لم تبدأ",openedBy:4,currentDept:3,currentAssignee:4,createdAt:"2026-05-22",dueDate:"2026-05-30",transfers:[],chat:[{uid:4,text:"الماكينة رقم 3 تحتاج صيانة عاجلة",time:"08:00",type:"msg"}]},
  {id:"TK-003",title:"استفسار عميل",type:"استفسار",priority:"متوسطة",status:"قيد التنفيذ",openedBy:6,currentDept:4,currentAssignee:5,createdAt:"2026-05-23",dueDate:"2026-06-01",transfers:[],chat:[{uid:6,text:"متى يكون الطلب جاهز؟",time:"11:00",type:"msg"},{uid:5,text:"نتوقع الجاهزية خلال أسبوع",time:"11:45",type:"msg"}]},
  {id:"TK-004",title:"توريد أقمشة صيفية",type:"شراء",priority:"منخفضة",status:"مكتملة",openedBy:2,currentDept:1,currentAssignee:2,createdAt:"2026-05-10",dueDate:"2026-05-25",transfers:[],chat:[{uid:2,text:"تم استلام البضاعة بالكامل",time:"14:00",type:"msg"}]}
];
const INIT_TASKS=[{id:1,uid:2,title:"مراجعة عروض الأسعار",done:false,priority:"عالية"},{id:2,uid:2,title:"إرسال تقرير المشتريات",done:true,priority:"متوسطة"},{id:3,uid:3,title:"مراجعة كشف الحسابات",done:false,priority:"عالية"},{id:4,uid:4,title:"جدولة صيانة الماكينات",done:false,priority:"منخفضة"}];

function initials(name){return name.trim().split(" ").map(w=>w[0]).join("").slice(0,2);}
function Av({user,size=28}){return(<div style={{width:size,height:size,borderRadius:"50%",background:user.bg,color:user.fg,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:Math.round(size*0.38),flexShrink:0}}>{user.av}</div>);}
function Badge({label,color}){return(<span style={{display:"inline-flex",alignItems:"center",padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:color+"20",color,whiteSpace:"nowrap"}}>{label}</span>);}

export default function App(){
  const [currentUser,setCurrentUser]=useState(DEFAULT_USERS[0]);
  const [page,setPage]=useState("dashboard");
  const [tickets,setTickets]=useState(INIT_TICKETS);
  const [depts,setDepts]=useState(DEFAULT_DEPTS);
  const [users,setUsers]=useState(DEFAULT_USERS);
  const [personalTasks,setPersonalTasks]=useState(INIT_TASKS);
  const [selectedTicket,setSelectedTicket]=useState(null);
  const [empTab,setEmpTab]=useState("tickets");
  const [settingsTab,setSettingsTab]=useState("depts");
  const [chatMsg,setChatMsg]=useState("");
  const [newTaskText,setNewTaskText]=useState("");
  const [showModal,setShowModal]=useState(false);
  const [showTransfer,setShowTransfer]=useState(false);
  const [transferDept,setTransferDept]=useState(1);
  const [transferUser,setTransferUser]=useState(2);
  const [transferNote,setTransferNote]=useState("");
  const [form,setForm]=useState({title:"",type:"شراء",priority:"متوسطة",assignedTo:2,dueDate:""});
  // Settings forms
  const [newDept,setNewDept]=useState({name:"",icon:"📦",color:"#534AB7"});
  const [newUser,setNewUser]=useState({name:"",dept:1,type:"employee"});
  const [editDept,setEditDept]=useState(null);
  const [editUser,setEditUser]=useState(null);
  const fileRef=useRef();

  const isAdmin=currentUser.type==="admin";
  const isClient=currentUser.type==="client";
  const visible=isAdmin?tickets:isClient?tickets.filter(t=>t.openedBy===currentUser.id):tickets.filter(t=>t.openedBy===currentUser.id||t.currentAssignee===currentUser.id||t.currentDept===currentUser.dept);

  function navTo(p){setPage(p);setSelectedTicket(null);}
  function switchUser(u){setCurrentUser(u);setSelectedTicket(null);setPage("dashboard");}

  function sendChat(){
    if(!chatMsg.trim()||!selectedTicket)return;
    const now=new Date();const time=`${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
    const updated=tickets.map(t=>t.id===selectedTicket.id?{...t,chat:[...t.chat,{uid:currentUser.id,text:chatMsg,time,type:"msg"}]}:t);
    setTickets(updated);setSelectedTicket(updated.find(t=>t.id===selectedTicket.id));setChatMsg("");
  }

  function sendFile(e){
    const file=e.target.files[0];if(!file||!selectedTicket)return;
    const now=new Date();const time=`${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
    const isImg=file.type.startsWith("image/");
    const reader=new FileReader();
    reader.onload=ev=>{
      const updated=tickets.map(t=>t.id===selectedTicket.id?{...t,chat:[...t.chat,{uid:currentUser.id,text:file.name,time,type:isImg?"image":"file",data:ev.target.result}]}:t);
      setTickets(updated);setSelectedTicket(updated.find(t=>t.id===selectedTicket.id));
    };reader.readAsDataURL(file);e.target.value="";
  }

  function doTransfer(){
    if(!selectedTicket)return;
    const now=new Date();const time=`${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
    const toUser=users.find(u=>u.id===transferUser);const toDept=depts.find(d=>d.id===transferDept);
    const updated=tickets.map(t=>t.id===selectedTicket.id?{...t,currentAssignee:transferUser,currentDept:transferDept,status:"قيد التنفيذ",transfers:[...t.transfers,{from:currentUser.id,to:transferUser,dept:transferDept,note:transferNote,time}],chat:[...t.chat,{uid:currentUser.id,text:`تحويل إلى ${toUser?.name} (${toDept?.name})${transferNote?` — ${transferNote}`:""}`,time,type:"transfer"}]}:t);
    setTickets(updated);setSelectedTicket(updated.find(t=>t.id===selectedTicket.id));
    setShowTransfer(false);setTransferNote("");
  }

  function closeTicket(){
    if(!selectedTicket)return;
    const now=new Date();const time=`${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
    const updated=tickets.map(t=>t.id===selectedTicket.id?{...t,status:"مكتملة",chat:[...t.chat,{uid:currentUser.id,text:"تم إغلاق التذكرة ✓",time,type:"system"}]}:t);
    setTickets(updated);setSelectedTicket(updated.find(t=>t.id===selectedTicket.id));
  }

  function createTicket(){
    if(!form.title.trim())return;
    const id="TK-"+String(tickets.length+1).padStart(3,"0");
    const now=new Date();const time=now.toTimeString().slice(0,5);const date=now.toISOString().split("T")[0];
    const assignee=users.find(u=>u.id===form.assignedTo);
    setTickets([...tickets,{...form,id,openedBy:currentUser.id,currentDept:assignee?.dept||currentUser.dept,currentAssignee:form.assignedTo,createdAt:date,transfers:[],chat:[{uid:currentUser.id,text:`تم فتح التذكرة: ${form.title}`,time,type:"system"}]}]);
    setShowModal(false);setForm({title:"",type:"شراء",priority:"متوسطة",assignedTo:2,dueDate:""});
  }

  // Settings - Depts
  function addDept(){
    if(!newDept.name.trim())return;
    const id=Math.max(...depts.map(d=>d.id),0)+1;
    setDepts([...depts,{...newDept,id}]);setNewDept({name:"",icon:"📦",color:"#534AB7"});
  }
  function deleteDept(id){if(users.some(u=>u.dept===id)){alert("لا يمكن حذف قسم فيه موظفين");return;}setDepts(depts.filter(d=>d.id!==id));}
  function saveEditDept(){setDepts(depts.map(d=>d.id===editDept.id?editDept:d));setEditDept(null);}

  // Settings - Users
  function addUser(){
    if(!newUser.name.trim())return;
    const id=Math.max(...users.map(u=>u.id),0)+1;
    const dept=depts.find(d=>d.id===newUser.dept);
    const colorIdx=(id-1)%AV_COLORS.length;
    const av=initials(newUser.name);
    setUsers([...users,{id,name:newUser.name,role:dept?.name||"موظف",dept:newUser.type==="employee"?newUser.dept:null,av,type:newUser.type,bg:AV_COLORS[colorIdx],fg:"#fff"}]);
    setNewUser({name:"",dept:1,type:"employee"});
  }
  function deleteUser(id){if(id===currentUser.id){alert("لا يمكن حذف المستخدم الحالي");return;}setUsers(users.filter(u=>u.id!==id));}
  function saveEditUser(){
    const dept=depts.find(d=>d.id===editUser.dept);
    setUsers(users.map(u=>u.id===editUser.id?{...editUser,role:editUser.type==="employee"?dept?.name||"موظف":editUser.role,av:initials(editUser.name)}:u));
    setEditUser(null);
  }

  function toggleTask(id){setPersonalTasks(personalTasks.map(t=>t.id===id?{...t,done:!t.done}:t));}
  function addTask(){if(!newTaskText.trim())return;setPersonalTasks([...personalTasks,{id:Date.now(),uid:currentUser.id,title:newTaskText.trim(),done:false,priority:"متوسطة"}]);setNewTaskText("");}

  const navItems=[{id:"dashboard",icon:"🏠",label:"الرئيسية"},{id:"tickets",icon:"🎫",label:"التذاكر"},...(!isClient?[{id:"my",icon:"✅",label:"مهامي"}]:[]),...(isAdmin?[{id:"team",icon:"👥",label:"الفريق"},{id:"settings",icon:"⚙️",label:"الإعدادات"}]:[])];
  const stats=[{l:"إجمالي التذاكر",v:visible.length,c:"#534AB7"},{l:"قيد التنفيذ",v:visible.filter(t=>t.status==="قيد التنفيذ").length,c:"#BA7517"},{l:"مكتملة",v:visible.filter(t=>t.status==="مكتملة").length,c:"#0F6E56"},{l:"عاجلة",v:visible.filter(t=>t.priority==="عاجلة").length,c:"#E24B4A"}];
  const topTitle=selectedTicket?`← ${selectedTicket.id}`:{dashboard:"لوحة التحكم",tickets:"التذاكر",my:"مهامي",team:"الفريق",settings:"الإعدادات"}[page];
  const canAct=selectedTicket&&!isClient&&(isAdmin||selectedTicket.currentAssignee===currentUser.id);

  return(
    <div style={{display:"flex",height:"100vh",width:"100vw",background:"#0a0a0f",color:"#e2e8f0",fontFamily:"'Cairo',sans-serif",direction:"rtl",position:"relative"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#3f3f46;border-radius:4px}.nav-btn{display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:10px;cursor:pointer;font-size:13px;color:#a1a1aa;transition:all .15s;border:none;background:transparent;font-family:'Cairo',sans-serif;width:100%;text-align:right}.nav-btn:hover{background:#18181b;color:#e2e8f0}.nav-btn.active{background:#1e1e2e;color:#a5b4fc}.card{background:#13131a;border:1px solid #27272a;border-radius:14px}.kan-card{background:#13131a;border:1px solid #27272a;border-radius:10px;padding:12px;cursor:pointer;margin-bottom:8px;transition:border-color .15s}.kan-card:hover{border-color:#6366f1}.btn{cursor:pointer;border:none;font-family:'Cairo',sans-serif;transition:all .15s;font-weight:700;border-radius:8px}.btn:hover{filter:brightness(1.1)}.btn-primary{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:8px 16px;font-size:13px}.btn-ghost{background:#1e1e24;color:#a1a1aa;padding:8px 14px;font-size:13px}.btn-danger{background:#3a1a1a;color:#ef4444;padding:6px 10px;font-size:12px}.ticket-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #1e1e24;cursor:pointer}.ticket-row:hover{opacity:.8}.ticket-row:last-child{border-bottom:none}.form-inp{background:#1a1a22;border:1px solid #27272a;border-radius:8px;padding:8px 12px;font-size:13px;color:#e2e8f0;font-family:'Cairo',sans-serif;outline:none;width:100%}.form-inp:focus{border-color:#6366f1}.tab-btn{padding:5px 14px;border-radius:8px;font-size:12px;cursor:pointer;border:1px solid #27272a;background:transparent;color:#71717a;font-family:'Cairo',sans-serif;transition:all .15s}.tab-btn.active{background:#1e1e3e;color:#a5b4fc;border-color:#6366f130}.task-check{width:18px;height:18px;border-radius:4px;border:1.5px solid #52525b;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}.task-check.done{background:#534AB7;border-color:#534AB7;color:#fff;font-size:11px}.settings-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #1e1e24}.settings-row:last-child{border-bottom:none}`}</style>

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
          {users.map(u=><div key={u.id} onClick={()=>switchUser(u)} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 8px",borderRadius:8,cursor:"pointer",background:currentUser.id===u.id?"#18181b":"transparent"}}>
            <Av user={u} size={24}/><div style={{minWidth:0}}><div style={{fontSize:11,fontWeight:700,color:currentUser.id===u.id?"#a5b4fc":"#a1a1aa",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{u.name.split(" ")[0]}</div><div style={{fontSize:9,color:"#52525b"}}>{u.role}</div></div>
          </div>)}
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:"#0d0d14",borderBottom:"1px solid #1e1e24",padding:"0 22px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{fontSize:15,fontWeight:800}}>{topTitle}</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {(page==="tickets"||page==="dashboard")&&!isClient&&!selectedTicket&&<button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ تذكرة جديدة</button>}
            {canAct&&selectedTicket?.status!=="مكتملة"&&<>
              <button className="btn btn-ghost" style={{fontSize:12}} onClick={()=>setShowTransfer(true)}>↗ تحويل</button>
              <button className="btn btn-danger" style={{fontSize:12}} onClick={closeTicket}>✓ إغلاق</button>
            </>}
            <div style={{display:"flex",alignItems:"center",gap:8,background:"#13131a",border:"1px solid #27272a",borderRadius:10,padding:"6px 10px"}}>
              <Av user={currentUser} size={26}/><div style={{fontSize:12,fontWeight:700}}>{currentUser.name.split(" ")[0]}</div>
            </div>
          </div>
        </div>

        <div style={{flex:1,overflow:"auto",padding:22}}>

          {/* DASHBOARD */}
          {page==="dashboard"&&<div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
              {stats.map(s=><div key={s.l} className="card" style={{padding:"14px 18px"}}><div style={{fontSize:11,color:"#71717a",marginBottom:4}}>{s.l}</div><div style={{fontSize:32,fontWeight:900,color:s.c}}>{s.v}</div></div>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div className="card" style={{padding:18}}>
                <div style={{fontWeight:800,marginBottom:14,fontSize:14}}>آخر التذاكر</div>
                {visible.slice(0,4).map(t=>{const op=users.find(u=>u.id===t.openedBy);return op?(<div key={t.id} className="ticket-row" onClick={()=>{setSelectedTicket(t);setPage("tickets");}}>
                  <Av user={op} size={30}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.title}</div><div style={{fontSize:10,color:"#52525b"}}>{t.id} · {t.createdAt}</div></div><Badge label={t.status} color={ST_COLOR[t.status]}/>
                </div>):null;})}
              </div>
              <div className="card" style={{padding:18}}>
                <div style={{fontWeight:800,marginBottom:14,fontSize:14}}>الأقسام</div>
                {depts.map(d=>{const cnt=tickets.filter(t=>t.currentDept===d.id).length;const emp=users.filter(u=>u.dept===d.id&&u.type==="employee").length;return(<div key={d.id} style={{marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,fontWeight:600}}>{d.icon} {d.name}</div><div style={{fontSize:10,color:"#52525b",marginTop:2}}>{emp} موظف · {cnt} تذكرة</div></div><div style={{width:8,height:8,borderRadius:"50%",background:d.color}}/></div>);})}
              </div>
            </div>
          </div>}

          {/* TICKETS */}
          {page==="tickets"&&!selectedTicket&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
            {["لم تبدأ","قيد التنفيذ","مكتملة"].map(st=>{const cols=visible.filter(t=>t.status===st);return(<div key={st}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}><div style={{width:8,height:8,borderRadius:"50%",background:ST_COLOR[st]}}/><span style={{fontWeight:800,fontSize:13}}>{st}</span><span style={{fontSize:11,color:"#71717a",background:"#18181b",padding:"1px 7px",borderRadius:10}}>{cols.length}</span></div>
              {cols.map(t=>{const op=users.find(u=>u.id===t.openedBy);const as=users.find(u=>u.id===t.currentAssignee);const dept=depts.find(d=>d.id===t.currentDept);return op?(<div key={t.id} className="kan-card" onClick={()=>setSelectedTicket(t)}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:10,color:"#52525b",fontWeight:700}}>{t.id}</span><Badge label={t.priority} color={PR_COLOR[t.priority]}/></div>
                <div style={{fontWeight:700,fontSize:13,marginBottom:8}}>{t.title}</div>
                {dept&&<div style={{fontSize:11,color:dept.color,marginBottom:8}}>{dept.icon} {dept.name}</div>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",gap:4}}><Av user={op} size={22}/>{as&&as.id!==op.id&&<Av user={as} size={22}/>}</div><span style={{fontSize:10,color:"#52525b"}}>{t.dueDate}</span></div>
              </div>):null;})}
            </div>);})}
          </div>}

          {/* TICKET DETAIL */}
          {page==="tickets"&&selectedTicket&&(()=>{
            const t=selectedTicket;const op=users.find(u=>u.id===t.openedBy);const as=users.find(u=>u.id===t.currentAssignee);const dept=depts.find(d=>d.id===t.currentDept);
            return(<div>
              <button className="btn btn-ghost" onClick={()=>setSelectedTicket(null)} style={{marginBottom:14}}>← رجوع</button>
              <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:14}}>
                <div className="card" style={{display:"flex",flexDirection:"column",height:520}}>
                  <div style={{padding:"14px 18px",borderBottom:"1px solid #1e1e24"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div><div style={{fontSize:10,color:"#52525b",marginBottom:3}}>{t.id}</div><div style={{fontWeight:800,fontSize:16}}>{t.title}</div></div>
                      <div style={{display:"flex",gap:6}}><Badge label={t.status} color={ST_COLOR[t.status]}/><Badge label={t.priority} color={PR_COLOR[t.priority]}/></div>
                    </div>
                  </div>
                  <div style={{flex:1,overflow:"auto",padding:"14px 18px",display:"flex",flexDirection:"column",gap:10}}>
                    {t.chat.map((msg,i)=>{
                      const u=users.find(x=>x.id===msg.uid);const isMe=msg.uid===currentUser.id;
                      if(msg.type==="transfer")return(<div key={i} style={{display:"flex",justifyContent:"center"}}><div style={{background:"#1e1e3e",border:"1px solid #6366f130",borderRadius:8,padding:"6px 14px",fontSize:11,color:"#a5b4fc",textAlign:"center"}}>↗ {msg.text}</div></div>);
                      if(msg.type==="system")return(<div key={i} style={{display:"flex",justifyContent:"center"}}><div style={{background:"#1a1a22",borderRadius:8,padding:"4px 12px",fontSize:11,color:"#52525b"}}>{msg.text}</div></div>);
                      if(!u)return null;
                      return(<div key={i} style={{display:"flex",gap:8,flexDirection:isMe?"row-reverse":"row"}}>
                        <Av user={u} size={30}/>
                        <div style={{maxWidth:"70%"}}>
                          <div style={{fontSize:10,color:"#52525b",marginBottom:3,textAlign:isMe?"left":"right"}}>{u.name} · {msg.time}</div>
                          {msg.type==="image"?<img src={msg.data} alt={msg.text} style={{maxWidth:"100%",borderRadius:8,border:"1px solid #27272a"}}/>
                          :msg.type==="file"?<div style={{background:isMe?"#1e1e3e":"#1a1a22",border:`1px solid ${isMe?"#6366f130":"#27272a"}`,padding:"8px 12px",borderRadius:10,fontSize:12,display:"flex",alignItems:"center",gap:8}}>📎 {msg.text}</div>
                          :<div style={{background:isMe?"#1e1e3e":"#1a1a22",border:`1px solid ${isMe?"#6366f130":"#27272a"}`,padding:"8px 12px",borderRadius:10,fontSize:12,lineHeight:1.6}}>{msg.text}</div>}
                        </div>
                      </div>);
                    })}
                  </div>
                  <div style={{padding:"10px 14px",borderTop:"1px solid #1e1e24",display:"flex",gap:8,alignItems:"center"}}>
                    <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" style={{display:"none"}} onChange={sendFile}/>
                    <button className="btn btn-ghost" style={{padding:"7px 10px"}} onClick={()=>fileRef.current?.click()}>📎</button>
                    <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="اكتب رسالة..." className="form-inp" style={{flex:1}}/>
                    <button className="btn btn-primary" onClick={sendChat} style={{padding:"8px 14px"}}>إرسال</button>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div className="card" style={{padding:14}}>
                    <div style={{fontWeight:800,marginBottom:12,fontSize:13}}>الحالة الحالية</div>
                    {as&&<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><Av user={as} size={36}/><div><div style={{fontSize:11,color:"#71717a"}}>المسؤول الحالي</div><div style={{fontSize:13,fontWeight:600}}>{as.name}</div>{dept&&<div style={{fontSize:11,color:dept.color,marginTop:2}}>{dept.icon} {dept.name}</div>}</div></div>}
                    {op&&<div style={{display:"flex",alignItems:"center",gap:10}}><Av user={op} size={36}/><div><div style={{fontSize:11,color:"#71717a"}}>فاتح التذكرة</div><div style={{fontSize:13,fontWeight:600}}>{op.name}</div></div></div>}
                  </div>
                  {t.transfers.length>0&&<div className="card" style={{padding:14}}>
                    <div style={{fontWeight:800,marginBottom:12,fontSize:13}}>سجل التحويلات</div>
                    {t.transfers.map((tr,i)=>{const fromU=users.find(u=>u.id===tr.from);const toU=users.find(u=>u.id===tr.to);const toDept=depts.find(d=>d.id===tr.dept);return(<div key={i} style={{marginBottom:10,paddingBottom:10,borderBottom:i<t.transfers.length-1?"1px solid #1e1e24":"none"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>{fromU&&<Av user={fromU} size={20}/>}<span style={{fontSize:11,color:"#71717a"}}>→</span>{toU&&<Av user={toU} size={20}/>}<span style={{fontSize:11,fontWeight:600}}>{toU?.name}</span></div>
                      {toDept&&<div style={{fontSize:10,color:toDept.color}}>{toDept.icon} {toDept.name}</div>}
                      {tr.note&&<div style={{fontSize:11,color:"#a1a1aa",marginTop:3}}>"{tr.note}"</div>}
                      <div style={{fontSize:10,color:"#52525b",marginTop:2}}>{tr.time}</div>
                    </div>);})}
                  </div>}
                  <div className="card" style={{padding:14}}>
                    <div style={{fontWeight:800,marginBottom:12,fontSize:13}}>التفاصيل</div>
                    {[["النوع",t.type],["تاريخ الإنشاء",t.createdAt],["الاستحقاق",t.dueDate||"—"]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"5px 0",borderBottom:"1px solid #1e1e24"}}><span style={{color:"#71717a"}}>{k}</span><span style={{fontWeight:600}}>{v}</span></div>)}
                  </div>
                </div>
              </div>
            </div>);
          })()}

          {/* MY */}
          {page==="my"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div className="card" style={{padding:18}}>
              <div style={{display:"flex",gap:6,marginBottom:14}}>
                {[["tickets","🎫 تذاكري"],["personal","✅ مهام شخصية"]].map(([id,lbl])=><button key={id} className={`tab-btn${empTab===id?" active":""}`} onClick={()=>setEmpTab(id)}>{lbl}</button>)}
              </div>
              {empTab==="tickets"&&visible.filter(t=>t.currentAssignee===currentUser.id).map(t=><div key={t.id} className="ticket-row" onClick={()=>{setSelectedTicket(t);setPage("tickets");}}>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{t.title}</div><div style={{fontSize:10,color:"#52525b"}}>{t.id}</div></div><Badge label={t.status} color={ST_COLOR[t.status]}/>
              </div>)}
              {empTab==="personal"&&<div>
                {personalTasks.filter(t=>t.uid===currentUser.id).map(t=><div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid #1e1e24"}}>
                  <div className={`task-check${t.done?" done":""}`} onClick={()=>toggleTask(t.id)}>{t.done?"✓":""}</div>
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
              {[{l:"تذاكر مفتوحة",v:visible.filter(t=>t.currentAssignee===currentUser.id&&t.status!=="مكتملة").length,c:"#BA7517"},{l:"تذاكر مكتملة",v:visible.filter(t=>t.currentAssignee===currentUser.id&&t.status==="مكتملة").length,c:"#0F6E56"},{l:"مهام شخصية",v:personalTasks.filter(t=>t.uid===currentUser.id&&!t.done).length,c:"#6366f1"}].map(s=><div key={s.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #1e1e24"}}><span style={{fontSize:13,color:"#a1a1aa"}}>{s.l}</span><span style={{fontSize:26,fontWeight:900,color:s.c}}>{s.v}</span></div>)}
            </div>
          </div>}

          {/* TEAM */}
          {page==="team"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
            {users.filter(u=>u.type==="employee").map(u=>{const my=tickets.filter(t=>t.currentAssignee===u.id);const done=my.filter(t=>t.status==="مكتملة").length;const pct=my.length?Math.round(done/my.length*100):0;const dept=depts.find(d=>d.id===u.dept);return(<div key={u.id} className="card" style={{padding:18}}>
              <div style={{display:"flex",gap:12,marginBottom:14}}><Av user={u} size={44}/><div><div style={{fontWeight:800}}>{u.name}</div><div style={{fontSize:12,color:dept?.color||"#71717a",marginTop:2}}>{dept?.icon} {dept?.name}</div></div></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:"#71717a"}}>الإنجاز</span><span style={{fontWeight:700,color:"#a5b4fc"}}>{pct}%</span></div>
              <div style={{height:5,background:"#1e1e24",borderRadius:3,marginBottom:12}}><div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:3}}/></div>
              <div style={{display:"flex",gap:6}}>{["لم تبدأ","قيد التنفيذ","مكتملة"].map(s=>{const cnt=my.filter(t=>t.status===s).length;return(<div key={s} style={{flex:1,background:"#1a1a22",borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontSize:18,fontWeight:900,color:ST_COLOR[s]}}>{cnt}</div><div style={{fontSize:9,color:"#52525b",marginTop:2}}>{s}</div></div>);})}</div>
            </div>);})}
          </div>}

          {/* SETTINGS */}
          {page==="settings"&&<div>
            <div style={{display:"flex",gap:6,marginBottom:20}}>
              {[["depts","🏢 الأقسام"],["users","👤 الموظفين"]].map(([id,lbl])=><button key={id} className={`tab-btn${settingsTab===id?" active":""}`} onClick={()=>setSettingsTab(id)} style={{fontSize:13,padding:"7px 18px"}}>{lbl}</button>)}
            </div>

            {settingsTab==="depts"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div className="card" style={{padding:20}}>
                <div style={{fontWeight:800,marginBottom:16,fontSize:14}}>الأقسام الحالية</div>
                {depts.map(d=>(<div key={d.id} className="settings-row">
                  {editDept?.id===d.id?<div style={{flex:1,display:"flex",gap:8,flexWrap:"wrap"}}>
                    <input className="form-inp" value={editDept.name} onChange={e=>setEditDept({...editDept,name:e.target.value})} style={{flex:1,minWidth:100}}/>
                    <select className="form-inp" value={editDept.icon} onChange={e=>setEditDept({...editDept,icon:e.target.value})} style={{width:70}}>{DEPT_ICONS.map(ic=><option key={ic}>{ic}</option>)}</select>
                    <select className="form-inp" value={editDept.color} onChange={e=>setEditDept({...editDept,color:e.target.value})} style={{width:100}}>{DEPT_COLORS.map(c=><option key={c} value={c} style={{background:c}}>{c}</option>)}</select>
                    <button className="btn btn-primary" onClick={saveEditDept} style={{padding:"6px 12px",fontSize:12}}>حفظ</button>
                    <button className="btn btn-ghost" onClick={()=>setEditDept(null)} style={{padding:"6px 10px",fontSize:12}}>إلغاء</button>
                  </div>:<>
                    <div style={{width:36,height:36,borderRadius:8,background:d.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{d.icon}</div>
                    <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{d.name}</div><div style={{fontSize:11,color:"#52525b"}}>{users.filter(u=>u.dept===d.id).length} موظف</div></div>
                    <button className="btn btn-ghost" onClick={()=>setEditDept({...d})} style={{padding:"5px 10px",fontSize:12}}>تعديل</button>
                    <button className="btn btn-danger" onClick={()=>deleteDept(d.id)} style={{padding:"5px 10px"}}>حذف</button>
                  </>}
                </div>))}
              </div>
              <div className="card" style={{padding:20}}>
                <div style={{fontWeight:800,marginBottom:16,fontSize:14}}>إضافة قسم جديد</div>
                <div style={{marginBottom:12}}><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>اسم القسم</div><input className="form-inp" placeholder="مثال: المستودع" value={newDept.name} onChange={e=>setNewDept({...newDept,name:e.target.value})}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                  <div><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>الأيقونة</div><select className="form-inp" value={newDept.icon} onChange={e=>setNewDept({...newDept,icon:e.target.value})}>{DEPT_ICONS.map(ic=><option key={ic}>{ic}</option>)}</select></div>
                  <div><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>اللون</div><select className="form-inp" value={newDept.color} onChange={e=>setNewDept({...newDept,color:e.target.value})}>{DEPT_COLORS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                </div>
                <button className="btn btn-primary" onClick={addDept} style={{width:"100%"}}>+ إضافة القسم</button>
              </div>
            </div>}

            {settingsTab==="users"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div className="card" style={{padding:20}}>
                <div style={{fontWeight:800,marginBottom:16,fontSize:14}}>المستخدمون الحاليون</div>
                {users.map(u=>(<div key={u.id} className="settings-row">
                  {editUser?.id===u.id?<div style={{flex:1,display:"flex",gap:8,flexWrap:"wrap"}}>
                    <input className="form-inp" value={editUser.name} onChange={e=>setEditUser({...editUser,name:e.target.value})} style={{flex:1,minWidth:120}} placeholder="الاسم"/>
                    <select className="form-inp" value={editUser.type} onChange={e=>setEditUser({...editUser,type:e.target.value})} style={{width:100}}><option value="admin">مدير</option><option value="employee">موظف</option><option value="client">عميل</option></select>
                    {editUser.type==="employee"&&<select className="form-inp" value={editUser.dept} onChange={e=>setEditUser({...editUser,dept:parseInt(e.target.value)})} style={{width:130}}>{depts.map(d=><option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}</select>}
                    <button className="btn btn-primary" onClick={saveEditUser} style={{padding:"6px 12px",fontSize:12}}>حفظ</button>
                    <button className="btn btn-ghost" onClick={()=>setEditUser(null)} style={{padding:"6px 10px",fontSize:12}}>إلغاء</button>
                  </div>:<>
                    <Av user={u} size={36}/>
                    <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{u.name}</div><div style={{fontSize:11,color:"#52525b"}}>{u.role} · {u.type==="admin"?"مدير":u.type==="client"?"عميل":"موظف"}</div></div>
                    <button className="btn btn-ghost" onClick={()=>setEditUser({...u})} style={{padding:"5px 10px",fontSize:12}}>تعديل</button>
                    {u.id!==1&&<button className="btn btn-danger" onClick={()=>deleteUser(u.id)}>حذف</button>}
                  </>}
                </div>))}
              </div>
              <div className="card" style={{padding:20}}>
                <div style={{fontWeight:800,marginBottom:16,fontSize:14}}>إضافة مستخدم جديد</div>
                <div style={{marginBottom:12}}><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>الاسم الكامل</div><input className="form-inp" placeholder="مثال: محمد العمري" value={newUser.name} onChange={e=>setNewUser({...newUser,name:e.target.value})}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  <div><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>النوع</div><select className="form-inp" value={newUser.type} onChange={e=>setNewUser({...newUser,type:e.target.value})}><option value="employee">موظف</option><option value="admin">مدير</option><option value="client">عميل</option></select></div>
                  {newUser.type==="employee"&&<div><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>القسم</div><select className="form-inp" value={newUser.dept} onChange={e=>setNewUser({...newUser,dept:parseInt(e.target.value)})}>{depts.map(d=><option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}</select></div>}
                </div>
                <button className="btn btn-primary" onClick={addUser} style={{width:"100%"}}>+ إضافة المستخدم</button>
              </div>
            </div>}
          </div>}
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransfer&&<div onClick={()=>setShowTransfer(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}}>
        <div onClick={e=>e.stopPropagation()} style={{background:"#13131a",border:"1px solid #27272a",borderRadius:16,padding:24,width:360}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontWeight:800,fontSize:16}}>تحويل التذكرة</div><button className="btn btn-ghost" onClick={()=>setShowTransfer(false)} style={{padding:"4px 8px"}}>✕</button></div>
          <div style={{marginBottom:12}}><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>القسم</div>
            <select className="form-inp" value={transferDept} onChange={e=>{const did=parseInt(e.target.value);setTransferDept(did);const first=users.find(u=>u.dept===did&&u.type==="employee");if(first)setTransferUser(first.id);}}>
              {depts.map(d=><option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}
            </select>
          </div>
          <div style={{marginBottom:12}}><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>الموظف</div>
            <select className="form-inp" value={transferUser} onChange={e=>setTransferUser(parseInt(e.target.value))}>
              {users.filter(u=>u.type==="employee"&&u.dept===transferDept).map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div style={{marginBottom:18}}><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>ملاحظة (اختياري)</div>
            <textarea className="form-inp" rows={3} placeholder="سبب التحويل..." value={transferNote} onChange={e=>setTransferNote(e.target.value)} style={{resize:"none"}}/>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-ghost" onClick={()=>setShowTransfer(false)} style={{flex:1}}>إلغاء</button>
            <button className="btn btn-primary" onClick={doTransfer} style={{flex:2}}>↗ تحويل</button>
          </div>
        </div>
      </div>}

      {/* New Ticket Modal */}
      {showModal&&<div onClick={()=>setShowModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}}>
        <div onClick={e=>e.stopPropagation()} style={{background:"#13131a",border:"1px solid #27272a",borderRadius:16,padding:24,width:400,maxHeight:"90vh",overflow:"auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontWeight:800,fontSize:16}}>تذكرة جديدة</div><button className="btn btn-ghost" onClick={()=>setShowModal(false)} style={{padding:"4px 8px"}}>✕</button></div>
          <div style={{marginBottom:12}}><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>العنوان *</div><input className="form-inp" placeholder="عنوان التذكرة..." value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>النوع</div><select className="form-inp" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>شراء</option><option>صيانة</option><option>استفسار</option><option>أخرى</option></select></div>
            <div><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>الأولوية</div><select className="form-inp" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>عاجلة</option><option>عالية</option><option>متوسطة</option><option>منخفضة</option></select></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
            <div><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>المسؤول</div><select className="form-inp" value={form.assignedTo} onChange={e=>setForm({...form,assignedTo:parseInt(e.target.value)})}>{users.filter(u=>u.type==="employee").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
            <div><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>الاستحقاق</div><input type="date" className="form-inp" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/></div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-ghost" onClick={()=>setShowModal(false)} style={{flex:1}}>إلغاء</button>
            <button className="btn btn-primary" onClick={createTicket} style={{flex:2}}>✓ إنشاء التذكرة</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
