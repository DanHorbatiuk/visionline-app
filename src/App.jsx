import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, Target, Users, BookOpen, Settings, LogOut, Bell, User, 
  Menu, X, CheckCircle, Clock, ChevronRight, TrendingUp, AlertCircle, 
  Plus, Search, FileText, Trash2, Edit, Shield, Lock, Eye, Activity, 
  Server, Database, HardDrive, Award, Zap, Briefcase, GraduationCap,
  MapPin, Globe, Github, Linkedin, Mail, Phone, Camera, Save, PlayCircle, 
  CheckSquare, Sparkles, ArrowRight, Book, MonitorPlay, Code, Filter,
  MoreVertical, AlertTriangle, Terminal, Trophy, Heart, MessageSquare, Download, Star,
  Send, Paperclip, Bot, Smile, Crown, UserCog, Key, UserPlus, PieChart as PieChartIcon, List,
  ClipboardList, Users2
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';

// --- GENERIC HELPERS & MOCK GENERATORS ---

const generateCurriculum = (topic) => {
  const base = [
    { id: 1, title: `Вступ до ${topic}`, type: 'video', duration: '45 хв', completed: false },
    { id: 2, title: 'Основні концепції', type: 'article', duration: '15 хв', completed: false },
    { id: 3, title: 'Налаштування оточення', type: 'practice', duration: '30 хв', completed: false },
    { id: 4, title: 'Перший проект', type: 'code', duration: '1 год', completed: false },
    { id: 5, title: 'Робота з даними', type: 'video', duration: '50 хв', completed: false },
    { id: 6, title: 'Контроль версій', type: 'article', duration: '20 хв', completed: false },
    { id: 7, title: 'Фінальний тест', type: 'practice', duration: '45 хв', completed: false },
  ];
  return base;
};

// --- MOCK DATA ---

const USERS = [
  { 
    id: 1, email: "student@test.com", password: "123", role: "student", name: "Олег Студент", 
    title: "Junior Java Developer", bio: "Прагну створювати надійний Enterprise софт.",
    location: "Київ, Україна", phone: "+380 63 000 00 00",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oleg", 
    lastLogin: "Зараз", mentorId: 2, progress: 45, 
    notifications: { email: true, push: true, news: false }
  },
  { 
    id: 2, email: "mentor@test.com", password: "123", role: "mentor", name: "Марія Ментор", 
    title: "Senior Software Engineer", bio: "5+ років досвіду. Викладаю Java & Architecture.",
    location: "Львів, Україна", phone: "+380 97 111 22 33",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", 
    lastLogin: "Сьогодні, 09:15",
    notifications: { email: true, push: true, news: true }
  },
  { 
    id: 3, email: "admin@test.com", password: "123", role: "admin", name: "Петро Адмін", 
    title: "Lead DevOps", bio: "Забезпечую стабільність VisionLine.",
    location: "Remote", phone: "+380 50 999 88 77",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Petro", 
    lastLogin: "Вчора",
    notifications: { email: true, push: false, news: true }
  },
  {
    id: 4, email: "student2@test.com", password: "123", role: "student", name: "Анна Новачок",
    title: "Frontend Trainee", location: "Одеса", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
    lastLogin: "2 дні тому", mentorId: 2, progress: 15
  }
];

const INITIAL_MATERIALS = [
  { id: 201, type: "video", title: "React for Beginners", author: "NetNinja", tags: ["Frontend", "React"], addedBy: 2, saved: false },
  { id: 202, type: "book", title: "You Don't Know JS", author: "Kyle Simpson", tags: ["JS", "Advanced"], addedBy: 2, saved: true },
  { id: 203, type: "article", title: "Clean Code Principles", author: "Robert Martin", tags: ["General", "Best Practices"], addedBy: 3, saved: false },
  { id: 204, type: "video", title: "System Design Interview", author: "Alex Xu", tags: ["Backend", "Architecture"], addedBy: 2, saved: false },
  { id: 205, type: "article", title: "Effective Java", author: "Joshua Bloch", tags: ["Java", "Best Practices"], addedBy: 2, saved: true },
];

const INITIAL_GOALS = [
  {
    id: 101, title: "Стати Java Developer", status: "active", progress: 33, deadline: "2024-12-31",
    description: "Комплексна програма для вивчення Java Core та Spring Framework.",
    roadmap: [
        { id: 1, title: 'Вступ до Java', type: 'video', duration: '45 хв', completed: true },
        { id: 2, title: 'Змінні та типи даних', type: 'article', duration: '15 хв', completed: true },
        { id: 3, title: 'Цикли та умовні оператори', type: 'code', duration: '1 год', completed: false },
        { id: 4, title: 'ООП принципи', type: 'video', duration: '1.5 год', completed: false },
    ]
  },
  {
    id: 102, title: "Основи Git", status: "completed", progress: 100, deadline: "2024-10-15",
    description: "Базові команди та робота з GitHub.",
    roadmap: [
        { id: 1, title: 'Вступ', type: 'video', duration: '10 хв', completed: true },
        { id: 2, title: 'Commits & Push', type: 'code', duration: '30 хв', completed: true },
    ]
  }
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "Система", message: "Ваш план навчання по 'Java' оновлено.", date: "10:00", read: false },
  { id: 2, title: "Ментор", message: "Марія перевірила ваше домашнє завдання.", date: "Вчора", read: true },
];

const SYSTEM_LOGS = [
    { id: 1, time: "10:45:22", type: "INFO", user: "student@test.com", action: "Login successful" },
    { id: 2, time: "10:48:05", type: "WARN", user: "system", action: "API Latency > 200ms" },
    { id: 3, time: "11:05:10", type: "INFO", user: "mentor@test.com", action: "Added resource #204" },
    { id: 4, time: "11:15:00", type: "ERROR", user: "admin@test.com", action: "Database backup failed" },
    { id: 5, time: "11:20:33", type: "INFO", user: "student@test.com", action: "Completed goal #102" },
];

// Analytics Data
const ACTIVITY_DATA = [
  { name: 'Пн', hours: 2.5, tasks: 3 }, { name: 'Вт', hours: 4.0, tasks: 5 }, { name: 'Ср', hours: 1.5, tasks: 2 }, 
  { name: 'Чт', hours: 5.0, tasks: 8 }, { name: 'Пт', hours: 3.5, tasks: 4 }, { name: 'Сб', hours: 6.0, tasks: 7 }, { name: 'Нд', hours: 2.0, tasks: 1 },
];

const MENTOR_GROUP_DATA = [
  { name: 'Java Basics', students: 12, avgScore: 85 },
  { name: 'Advanced Java', students: 8, avgScore: 72 },
  { name: 'Spring Boot', students: 5, avgScore: 90 },
];

const SKILLS_DATA = [
    { subject: 'Java Core', A: 120, fullMark: 150 },
    { subject: 'Spring', A: 98, fullMark: 150 },
    { subject: 'SQL', A: 86, fullMark: 150 },
    { subject: 'Git', A: 99, fullMark: 150 },
    { subject: 'Algorithms', A: 85, fullMark: 150 },
    { subject: 'Testing', A: 65, fullMark: 150 },
];

const COURSE_DISTRIBUTION = [
    { name: 'Java', value: 45 },
    { name: 'Frontend', value: 25 },
    { name: 'CS Basics', value: 20 },
    { name: 'Soft Skills', value: 10 },
];

const RECENT_ACTIVITY = [
    { id: 1, action: "Завершено урок 'Вступ до Java'", time: "2 години тому", icon: CheckCircle, color: "text-green-500" },
    { id: 2, action: "Додано нову ціль 'SQL Master'", time: "Вчора", icon: Target, color: "text-blue-500" },
    { id: 3, action: "Коментар від ментора", time: "Вчора", icon: MessageSquare, color: "text-indigo-500" },
];

const LEADERBOARD_DATA = [
    { id: 1, name: "Анна Новачок", points: 1250, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna" },
    { id: 2, name: "Олег Студент", points: 980, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oleg" },
    { id: 3, name: "Іван Кодер", points: 850, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan" },
];

const INITIAL_CHATS = [
    {
        id: 'chat_1_2',
        participants: [1, 2], // Oleg & Maria
        messages: [
            { id: 1, senderId: 2, text: "Привіт, Олеге! Як просувається вивчення Java?", time: "10:00" },
            { id: 2, senderId: 1, text: "Привіт! Все добре, закінчую модуль по ООП.", time: "10:05" },
            { id: 3, senderId: 2, text: "Чудово. Якщо будуть питання по поліморфізму - пиши.", time: "10:07" }
        ]
    }
];

const ROLES = [
    { value: 'student', label: 'Студент' },
    { value: 'mentor', label: 'Ментор' },
    { value: 'admin', label: 'Адмін' },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'];

// --- UI COMPONENTS ---

const Card = ({ children, className = "", title, titleIcon: Icon, action, noPadding = false }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 ${className}`}>
    {(title || Icon) && (
      <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-50">
        <div className="flex items-center gap-3">
            {Icon && <div className="p-2 bg-slate-50 text-blue-600 rounded-xl"><Icon size={20} /></div>}
            {title && <h3 className="font-bold text-slate-800 text-lg tracking-tight">{title}</h3>}
        </div>
        {action}
      </div>
    )}
    <div className={noPadding ? "" : "p-6"}>{children}</div>
  </div>
);

const Button = ({ children, variant = "primary", onClick, className = "", type = "button", disabled = false, icon: Icon }) => {
  const baseStyle = "px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 text-sm";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-transparent hover:border-red-200",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
  };
  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {Icon && <Icon size={18}/>} {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={20}/></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};

// --- PAGES ---

// 1. LOGIN
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) onLogin(user); else alert('Невірні дані');
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white relative flex-col justify-between p-12 overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><Target className="text-white w-6 h-6" /></div>
               <span className="text-2xl font-bold tracking-tight">VisionLine</span>
            </div>
            <h1 className="text-5xl font-extrabold leading-tight mb-6">Платформа<br/><span className="text-blue-400">твого росту</span></h1>
            <p className="text-slate-400 text-lg max-w-md">Єдина екосистема для студентів, менторів та адміністраторів.</p>
         </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 bg-slate-50/50">
         <div className="max-w-md w-full mx-auto">
             <h2 className="text-3xl font-bold text-slate-900 mb-8">Вхід в систему</h2>
             <form onSubmit={handleLogin} className="space-y-6">
                <div><label className="block text-sm font-semibold mb-2 text-slate-700">Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="email@test.com"/></div>
                <div><label className="block text-sm font-semibold mb-2 text-slate-700">Пароль</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••"/></div>
                <Button type="submit" className="w-full py-4 text-base shadow-xl">Увійти</Button>
             </form>
             <div className="mt-8 grid grid-cols-3 gap-3">
                {['student', 'mentor', 'admin'].map(role => (
                    <button key={role} onClick={()=>{setEmail(`${role}@test.com`); setPassword('123')}} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-xs capitalize font-bold text-slate-600">{role}</button>
                ))}
             </div>
         </div>
      </div>
    </div>
  );
};

// 2. CHAT PAGE
const ChatPage = ({ user, openChatWithId }) => {
    const [chats, setChats] = useState(INITIAL_CHATS);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (openChatWithId) {
            let existingChat = chats.find(c => c.participants.includes(user.id) && c.participants.includes(openChatWithId));
            if (existingChat) {
                setSelectedChatId(existingChat.id);
            } else {
                const newChat = { id: `chat_${user.id}_${openChatWithId}`, participants: [user.id, openChatWithId], messages: [] };
                setChats(prev => [...prev, newChat]);
                setSelectedChatId(newChat.id);
            }
        }
    }, [openChatWithId]);

    const userChats = chats.filter(chat => chat.participants.includes(user.id));
    const selectedChat = chats.find(c => c.id === selectedChatId);
    
    const getOtherParticipant = (chat) => {
        const otherId = chat.participants.find(id => id !== user.id);
        return USERS.find(u => u.id === otherId) || { name: "Користувач", avatar: "" }; 
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChatId) return;
        const updatedChat = { ...selectedChat, messages: [...selectedChat.messages, { id: Date.now(), senderId: user.id, text: newMessage, time: "Now" }] };
        setChats(chats.map(c => c.id === selectedChatId ? updatedChat : c));
        setNewMessage("");
    };

    useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [selectedChat?.messages]);

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6 animate-in fade-in">
            <div className="w-full md:w-1/3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b bg-slate-50/50"><h2 className="font-bold text-lg">Чати</h2></div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {userChats.length > 0 ? userChats.map(chat => {
                        const other = getOtherParticipant(chat);
                        return (
                            <div key={chat.id} onClick={() => setSelectedChatId(chat.id)} className={`p-4 flex gap-3 items-center cursor-pointer border-b last:border-0 ${selectedChatId === chat.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                                <img src={other.avatar} className="w-10 h-10 rounded-full bg-slate-100"/>
                                <div className="flex-1 overflow-hidden"><h3 className="font-bold text-sm">{other.name}</h3><p className="text-xs text-slate-500 truncate">{chat.messages[chat.messages.length-1]?.text || "Новий чат"}</p></div>
                            </div>
                        )
                    }) : <div className="p-8 text-center text-slate-400">Немає активних чатів</div>}
                </div>
            </div>
            <div className="hidden md:flex flex-col w-2/3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {selectedChat ? (
                    <>
                        <div className="p-4 border-b flex items-center gap-3 bg-slate-50/30"><img src={getOtherParticipant(selectedChat).avatar} className="w-10 h-10 rounded-full"/><h3 className="font-bold">{getOtherParticipant(selectedChat).name}</h3></div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                            {selectedChat.messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.senderId===user.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.senderId===user.id ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border rounded-tl-none'}`}>{msg.text}</div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-3"><input className="flex-1 border rounded-xl px-4 py-2" value={newMessage} onChange={e=>setNewMessage(e.target.value)} placeholder="Повідомлення..."/><button type="submit" className="p-2 bg-blue-600 text-white rounded-xl"><Send size={18}/></button></form>
                    </>
                ) : <div className="flex-1 flex items-center justify-center text-slate-400">Виберіть чат</div>}
            </div>
        </div>
    );
};

// 3. STUDENT PROGRESS
const StudentProgressPage = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
             <h1 className="text-2xl font-bold text-slate-900">Детальна Аналітика</h1>
             <div className="flex gap-2"><Button variant="secondary" className="text-xs">Експорт PDF</Button></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none shadow-lg shadow-blue-500/20">
                <div className="text-blue-100 mb-1 font-medium">Загальний прогрес</div>
                <div className="text-4xl font-bold">45%</div>
                <div className="text-xs text-blue-100 mt-2 opacity-80">Поточна ціль</div>
            </Card>
            <Card>
                <div className="text-slate-500 mb-1 font-medium">Вивчено годин</div>
                <div className="text-4xl font-bold text-slate-800">128</div>
                <div className="text-xs text-green-500 mt-2 font-bold flex items-center gap-1"><TrendingUp size={12}/> +12г цього тижня</div>
            </Card>
            <Card>
                <div className="text-slate-500 mb-1 font-medium">Завдань здано</div>
                <div className="text-4xl font-bold text-slate-800">42</div>
                <div className="text-xs text-slate-400 mt-2">8 на перевірці</div>
            </Card>
            <Card>
                <div className="text-slate-500 mb-1 font-medium">Середній бал</div>
                <div className="text-4xl font-bold text-slate-800">9.2</div>
                <div className="text-xs text-slate-400 mt-2">З 10 можливих</div>
            </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2" title="Динаміка навчання" titleIcon={Activity}>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ACTIVITY_DATA}>
                            <defs>
                                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                            <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}/>
                            <Area type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card title="Карта компетенцій" titleIcon={Radar}>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={SKILLS_DATA}>
                            <PolarGrid stroke="#e2e8f0"/>
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false}/>
                            <Radar name="Student" dataKey="A" stroke="#8884d8" strokeWidth={2} fill="#8884d8" fillOpacity={0.5}/>
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
            <Card title="Розподіл часу" titleIcon={PieChartIcon}>
                <div className="h-64 flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={COURSE_DISTRIBUTION} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {COURSE_DISTRIBUTION.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="lg:col-span-2" title="Історія активності" titleIcon={List}>
                <div className="space-y-4">
                    {RECENT_ACTIVITY.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-slate-50">
                            <div className={`p-2 rounded-full bg-slate-100 ${item.color}`}><item.icon size={20}/></div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-800">{item.action}</p>
                                <p className="text-xs text-slate-500">{item.time}</p>
                            </div>
                            <Button variant="ghost" className="text-xs">Деталі</Button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    </div>
);

// 4. LIBRARY (SMART & FILTERABLE)
const LibraryPage = ({ user }) => {
    const [materials, setMaterials] = useState(INITIAL_MATERIALS);
    const [filter, setFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({ title: '', type: 'video', author: '', tags: '' });

    const filteredMaterials = materials.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(filter.toLowerCase()) || m.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()));
        const matchesType = typeFilter === 'all' || m.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const toggleSave = (id) => setMaterials(materials.map(m => m.id === id ? { ...m, saved: !m.saved } : m));
    const handleAdd = () => {
        if(!newItem.title) return;
        const tagsArray = newItem.tags.split(',').map(t => t.trim()).filter(Boolean);
        setMaterials([...materials, { ...newItem, id: Date.now(), tags: tagsArray, addedBy: user.id, saved: false }]);
        setShowModal(false); setNewItem({ title: '', type: 'video', author: '', tags: '' });
    };

    const canEdit = user.role === 'mentor' || user.role === 'admin';

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Бібліотека знань</h1>
                    <p className="text-slate-500">База навчальних матеріалів для вашого розвитку.</p>
                </div>
                {canEdit && <Button onClick={() => setShowModal(true)} icon={Plus}>Додати матеріал</Button>}
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <input className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" placeholder="Пошук за назвою або тегом..." value={filter} onChange={e=>setFilter(e.target.value)}/>
                    <Search className="absolute left-3 top-3 text-slate-400" size={18}/>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {['all', 'video', 'book', 'article'].map(type => (
                        <button key={type} onClick={() => setTypeFilter(type)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize whitespace-nowrap ${typeFilter === type ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                            {type === 'all' ? 'Всі' : type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map(item => (
                    <Card key={item.id} className="flex flex-col gap-4 relative group hover:border-blue-300 hover:-translate-y-1">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-slate-50 text-blue-600 rounded-xl flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                                {item.type === 'video' ? <MonitorPlay size={20}/> : item.type === 'book' ? <Book size={20}/> : <FileText size={20}/>}
                            </div>
                            <button onClick={() => toggleSave(item.id)} className={`transition-colors ${item.saved ? 'text-red-500 fill-red-500' : 'text-slate-300 hover:text-red-400'}`}><Heart size={20}/></button>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                            <p className="text-sm text-slate-500 mb-3">{item.author}</p>
                            <div className="flex gap-2 flex-wrap">
                                {item.tags.map(t => <span key={t} className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg text-slate-600 border border-slate-200 font-medium">#{t}</span>)}
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-xs text-slate-400 capitalize">{item.type}</span>
                            <div className="flex gap-2">
                                {canEdit && <button className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>}
                                <Button variant="secondary" className="text-xs py-1 px-3 h-auto">Відкрити</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Додати матеріал">
                <div className="space-y-4">
                    <input className="w-full border p-3 rounded-xl bg-slate-50" placeholder="Назва..." value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})}/>
                    <input className="w-full border p-3 rounded-xl bg-slate-50" placeholder="Автор..." value={newItem.author} onChange={e => setNewItem({...newItem, author: e.target.value})}/>
                    <input className="w-full border p-3 rounded-xl bg-slate-50" placeholder="Теги (через кому)..." value={newItem.tags} onChange={e => setNewItem({...newItem, tags: e.target.value})}/>
                    <select className="w-full border p-3 rounded-xl bg-slate-50" value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value})}>
                        <option value="video">Відео</option><option value="book">Книга</option><option value="article">Стаття</option>
                    </select>
                    <Button onClick={handleAdd} className="w-full">Зберегти</Button>
                </div>
            </Modal>
        </div>
    );
};

// 5. ADMIN SYSTEM PAGE
const AdminSystemPage = () => (
    <div className="space-y-6 animate-in fade-in">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Shield className="text-blue-600"/> Системний Моніторинг</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-green-500"><div className="text-3xl font-bold text-slate-800">99.9%</div><div className="text-xs text-slate-500 font-medium">System Uptime</div></Card>
            <Card className="border-l-4 border-l-blue-500"><div className="text-3xl font-bold text-slate-800">45ms</div><div className="text-xs text-slate-500 font-medium">API Latency</div></Card>
            <Card className="border-l-4 border-l-orange-500"><div className="text-3xl font-bold text-slate-800">1.2GB</div><div className="text-xs text-slate-500 font-medium">Memory Usage</div></Card>
            <Card className="border-l-4 border-l-purple-500"><div className="text-3xl font-bold text-slate-800">3</div><div className="text-xs text-slate-500 font-medium">Active Nodes</div></Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2" title="Навантаження Сервера" titleIcon={Activity}>
                 <div className="h-64 flex items-end justify-between gap-1 mt-4 px-2 bg-slate-50 rounded-xl border border-slate-100 pt-4">
                    {[30, 45, 35, 50, 70, 65, 55, 40, 30, 45, 60, 80, 50, 40, 30, 55, 45, 60, 70, 50].map((h, i) => (
                        <div key={i} className="w-full bg-blue-200 hover:bg-blue-500 rounded-t-sm transition-all duration-300 relative group" style={{height: `${h}%`}}>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-[10px] px-1 rounded">{h}%</div>
                        </div>
                    ))}
                </div>
            </Card>
            
            <Card title="Системні Логи" titleIcon={Terminal} noPadding>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {SYSTEM_LOGS.map(log => (
                        <div key={log.id} className="p-3 border-b border-slate-50 text-xs hover:bg-slate-50 transition-colors cursor-default font-mono">
                            <div className="flex justify-between mb-1">
                                <span className={`font-bold ${log.type === 'ERROR' ? 'text-red-600' : log.type === 'WARN' ? 'text-orange-600' : 'text-blue-600'}`}>[{log.type}]</span>
                                <span className="text-slate-400">{log.time}</span>
                            </div>
                            <div className="text-slate-700">{log.action}</div>
                            <div className="text-slate-400 mt-1 flex items-center gap-1"><User size={10}/> {log.user}</div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    </div>
);

// 6. USERS PAGE (ADMIN FULL CONTROL)
const UsersPage = ({ currentUser, navigate, onStartChat }) => {
    const [search, setSearch] = useState('');
    const [usersList, setUsersList] = useState(USERS);

    const filteredUsers = usersList.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search));

    const handleRoleChange = (userId, newRole) => {
        // Only Admin can change roles
        if (currentUser.role === 'admin') {
             setUsersList(usersList.map(u => u.id === userId ? { ...u, role: newRole } : u));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Керування Користувачами</h1>
                <div className="flex gap-2">
                    <input className="border border-slate-200 p-2.5 rounded-xl text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Пошук..." value={search} onChange={e=>setSearch(e.target.value)}/>
                    {currentUser.role === 'admin' && <Button icon={UserPlus}>Додати</Button>}
                </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-xs">
                        <tr><th className="p-4">Користувач</th><th className="p-4">Роль</th><th className="p-4">Статус</th><th className="p-4 text-right">Дії</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={u.avatar} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200"/>
                                    <div><div className="font-bold text-slate-800">{u.name}</div><div className="text-xs text-slate-500">{u.email}</div></div>
                                </td>
                                <td className="p-4">
                                    {currentUser.role === 'admin' && u.id !== currentUser.id ? (
                                        <select 
                                            value={u.role} 
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                            className="bg-slate-100 border border-slate-200 rounded px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                        >
                                            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                        </select>
                                    ) : (
                                        <span className="px-2 py-1 rounded text-xs capitalize font-bold bg-slate-100 text-slate-600">{u.role.replace('_', ' ')}</span>
                                    )}
                                </td>
                                <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Active</span></td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {currentUser.id !== u.id && (
                                            <button onClick={() => onStartChat(u.id)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors" title="Написати"><MessageSquare size={18}/></button>
                                        )}
                                        
                                        {currentUser.role === 'admin' && (
                                            <>
                                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500" title="Редагувати"><Edit size={18}/></button>
                                                <button className="p-2 hover:bg-red-50 rounded-lg text-red-500" title="Блокувати"><Lock size={18}/></button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// 7. PROFILE
const ExtendedProfilePage = ({ user, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({...user});

    const handleSave = () => { onUpdate({...formData}); setIsEditing(false); alert("Профіль оновлено!"); };
    const handlePref = (field) => setFormData(p => ({...p, notifications: {...p.notifications, [field]: !p.notifications?.[field]}}));

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <Card className="w-full md:w-1/3 text-center">
                    <div className="relative inline-block mb-4">
                        <img src={formData.avatar} className="w-32 h-32 rounded-full border-4 border-slate-50 shadow-md mx-auto"/>
                        <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-sm border-2 border-white"><Camera size={16}/></button>
                    </div>
                    <h2 className="text-xl font-bold">{formData.name}</h2>
                    <p className="text-slate-500 text-sm mb-4">{formData.title}</p>
                    <div className="space-y-3 text-left border-t pt-4">
                        <div className="flex gap-3 text-sm text-slate-600"><Mail size={16}/> {formData.email}</div>
                        <div className="flex gap-3 text-sm text-slate-600"><MapPin size={16}/> {formData.location}</div>
                    </div>
                </Card>

                <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex border-b border-slate-100">
                        {[{id:'personal', label:'Дані', icon:User}, {id:'prefs', label:'Налаштування', icon:Settings}].map(t => (
                            <button key={t.id} onClick={()=>setActiveTab(t.id)} className={`flex-1 py-4 text-sm font-medium flex gap-2 justify-center transition-colors ${activeTab===t.id?'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50':'text-slate-500 hover:bg-slate-50'}`}><t.icon size={16}/> {t.label}</button>
                        ))}
                    </div>
                    <div className="p-6">
                        {activeTab === 'personal' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold">Основна інформація</h3>
                                    {!isEditing ? <Button variant="ghost" onClick={()=>setIsEditing(true)} icon={Edit}>Редагувати</Button> : <div className="flex gap-2"><Button variant="ghost" onClick={()=>setIsEditing(false)}>Скасувати</Button><Button onClick={handleSave} icon={Save}>Зберегти</Button></div>}
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div><label className="text-xs font-bold text-slate-500">ІМ'Я</label><input disabled={!isEditing} className="w-full border p-2.5 rounded-lg mt-1 disabled:bg-slate-50 border-slate-200" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})}/></div>
                                    <div><label className="text-xs font-bold text-slate-500">БІОГРАФІЯ</label><textarea disabled={!isEditing} rows="3" className="w-full border p-2.5 rounded-lg mt-1 disabled:bg-slate-50 border-slate-200" value={formData.bio} onChange={e=>setFormData({...formData, bio: e.target.value})}/></div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'prefs' && (
                            <div className="space-y-4">
                                <h3 className="font-bold">Сповіщення</h3>
                                <div className="space-y-4">
                                    <label className="flex justify-between items-center cursor-pointer p-3 border rounded-xl hover:bg-slate-50 transition-colors"><span className="text-slate-700">Email розсилка</span><input type="checkbox" checked={!!formData.notifications?.email} onChange={()=>handlePref('email')} className="w-5 h-5 text-blue-600 rounded"/></label>
                                    <label className="flex justify-between items-center cursor-pointer p-3 border rounded-xl hover:bg-slate-50 transition-colors"><span className="text-slate-700">Push сповіщення</span><input type="checkbox" checked={!!formData.notifications?.push} onChange={()=>handlePref('push')} className="w-5 h-5 text-blue-600 rounded"/></label>
                                </div>
                                <Button onClick={handleSave} className="w-full mt-6">Зберегти налаштування</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 8. GOALS
const GoalCurriculumPage = ({ goal, onBack, onUpdateProgress }) => {
    const handleToggleTask = (taskId) => {
        const updatedRoadmap = goal.roadmap.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task);
        const completedCount = updatedRoadmap.filter(t => t.completed).length;
        const newProgress = Math.round((completedCount / updatedRoadmap.length) * 100);
        onUpdateProgress(goal.id, updatedRoadmap, newProgress);
    };

    const isFinished = goal.progress === 100;

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"><ChevronRight className="rotate-180" size={20}/> Назад до цілей</button>
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Target size={120}/></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-slate-900">{goal.title}</h1>
                        <p className="text-slate-500 max-w-2xl">{goal.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className={`text-4xl font-bold ${isFinished ? 'text-green-600' : 'text-blue-600'}`}>{goal.progress}%</span>
                        {isFinished && <Button variant="success" icon={Download} onClick={()=>alert("Сертифікат завантажено!")}>Сертифікат</Button>}
                    </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 mt-6 overflow-hidden"><div className={`h-3 rounded-full transition-all duration-1000 ${isFinished ? 'bg-green-500' : 'bg-blue-600'}`} style={{width: `${goal.progress}%`}}></div></div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 flex justify-between">
                    <span>План навчання</span>
                    <span className="text-xs text-slate-500 font-normal">{goal.roadmap.filter(t=>t.completed).length} / {goal.roadmap.length} виконано</span>
                </div>
                {goal.roadmap.map((task) => (
                    <div key={task.id} className={`p-5 border-b last:border-0 flex items-center gap-4 hover:bg-slate-50 transition-colors ${task.completed ? 'bg-green-50/30' : ''}`}>
                        <button onClick={() => handleToggleTask(task.id)} className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-blue-400'}`}>{task.completed && <CheckCircle size={14}/>}</button>
                        <div className={`p-2.5 rounded-lg ${task.completed ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>{task.type === 'video' ? <MonitorPlay size={20}/> : task.type === 'code' ? <Code size={20}/> : <FileText size={20}/>}</div>
                        <div className="flex-1">
                            <h4 className={`font-semibold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</h4>
                            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                <span className="capitalize bg-slate-100 px-1.5 rounded">{task.type}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Clock size={12}/> {task.duration}</span>
                            </div>
                        </div>
                        {!task.completed && <Button variant="secondary" className="text-xs py-1.5 px-3 h-auto">Старт</Button>}
                    </div>
                ))}
            </div>
        </div>
    );
};

const StudentGoalsPage = ({ navigate }) => {
    const [goals, setGoals] = useState(INITIAL_GOALS);
    const [viewDetailId, setViewDetailId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleCreateGoal = () => {
        if (!newTitle) return;
        setIsGenerating(true);
        setTimeout(() => {
            const roadmap = generateCurriculum(newTitle);
            const newGoal = { id: Date.now(), title: newTitle, status: 'active', progress: 0, deadline: '2025-06-01', description: `План: ${newTitle}`, roadmap: roadmap };
            setGoals([...goals, newGoal]);
            setIsGenerating(false); setShowModal(false); setNewTitle(''); setViewDetailId(newGoal.id);
        }, 2000);
    };

    if (viewDetailId) return <GoalCurriculumPage goal={goals.find(g => g.id === viewDetailId)} onBack={() => setViewDetailId(null)} onUpdateProgress={(id, map, prog) => setGoals(goals.map(g => g.id === id ? { ...g, roadmap: map, progress: prog } : g))} />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><h1 className="text-2xl font-bold text-slate-900">Мої цілі</h1><Button onClick={() => setShowModal(true)} icon={Plus}>Нова ціль</Button></div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {goals.map(goal => (
                    <div key={goal.id} onClick={() => setViewDetailId(goal.id)} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${goal.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                        <div className="flex justify-between mb-4"><div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Target size={24}/></div><ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors"/></div>
                        <h3 className="font-bold text-xl mb-2 text-slate-800">{goal.title}</h3>
                        <p className="text-sm text-slate-500 mb-6 line-clamp-2">{goal.description}</p>
                        <div className="w-full bg-slate-100 rounded-full h-2 mt-auto"><div className={`h-2 rounded-full ${goal.progress===100?'bg-green-500':'bg-blue-600'}`} style={{ width: `${goal.progress}%` }}></div></div>
                        <p className="text-xs text-slate-400 mt-2 font-medium">{goal.progress}% завершено</p>
                    </div>
                ))}
            </div>
            <Modal isOpen={showModal} onClose={() => !isGenerating && setShowModal(false)} title="Нова ціль">
                {!isGenerating ? (
                    <div className="space-y-4">
                        <input className="w-full border p-3 rounded-xl bg-slate-50" placeholder="Напр: Вивчити Python..." value={newTitle} onChange={e => setNewTitle(e.target.value)}/>
                        <p className="text-sm text-slate-500">Штучний інтелект створить для вас структуру курсу та підбере матеріали.</p>
                        <Button onClick={handleCreateGoal} className="w-full" icon={Sparkles}>Згенерувати курс</Button>
                    </div>
                ) : (
                    <div className="py-10 text-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="font-bold text-slate-700">AI будує навчальний план...</p></div>
                )}
            </Modal>
        </div>
    );
};

// 9. DASHBOARD (PERSONALIZED)
const DashboardPage = ({ user, navigate, notifications }) => {
    // STUDENT
    if (user.role === 'student') {
        return (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">Привіт, {user.name.split(' ')[0]}! 🚀</h1>
                        <p className="text-blue-100 text-lg">Твій шлях до успіху починається тут.</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card noPadding className="p-5 text-center"><Target className="mx-auto text-blue-500 mb-2"/><div className="font-bold text-2xl">2</div><div className="text-xs text-slate-500 uppercase font-bold">Цілі</div></Card>
                    <Card noPadding className="p-5 text-center"><CheckCircle className="mx-auto text-green-500 mb-2"/><div className="font-bold text-2xl">12</div><div className="text-xs text-slate-500 uppercase font-bold">Завершено</div></Card>
                    <Card noPadding className="p-5 text-center"><Clock className="mx-auto text-orange-500 mb-2"/><div className="font-bold text-2xl">24г</div><div className="text-xs text-slate-500 uppercase font-bold">Час</div></Card>
                    <Card noPadding className="p-5 text-center"><Award className="mx-auto text-purple-500 mb-2"/><div className="font-bold text-2xl">450</div><div className="text-xs text-slate-500 uppercase font-bold">XP</div></Card>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2" title="Активність" titleIcon={Activity}>
                        <div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={ACTIVITY_DATA}><Area type="monotone" dataKey="hours" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1}/></AreaChart></ResponsiveContainer></div>
                    </Card>
                    <Card title="Лідерборд" titleIcon={Trophy}>
                        <div className="space-y-4">
                            {LEADERBOARD_DATA.map((u, i) => (
                                <div key={u.id} className="flex items-center gap-3 border-b last:border-0 pb-2 last:pb-0 border-slate-50">
                                    <div className={`w-6 text-center font-bold ${i===0?'text-yellow-500':i===1?'text-slate-400':'text-orange-700'}`}>{i+1}</div>
                                    <img src={u.avatar} className="w-8 h-8 rounded-full bg-slate-100"/>
                                    <div className="flex-1 text-sm font-medium">{u.name}</div>
                                    <div className="text-xs font-bold text-indigo-600">{u.points}</div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    // ADMIN (SYSTEM ADMIN)
    if (user.role === 'admin') {
        return (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3"><Shield className="text-blue-400"/> Панель Адміністратора</h1>
                        <p className="text-slate-300 text-lg">Система працює стабільно. Всі сервіси онлайн.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-l-4 border-l-blue-500"><div className="text-sm text-slate-500">Всього користувачів</div><div className="text-3xl font-bold text-slate-800">{USERS.length}</div></Card>
                    <Card className="border-l-4 border-l-green-500"><div className="text-sm text-slate-500">Активні сесії</div><div className="text-3xl font-bold text-slate-800">24</div></Card>
                    <Card className="border-l-4 border-l-purple-500"><div className="text-sm text-slate-500">Нових за 24г</div><div className="text-3xl font-bold text-slate-800">+5</div></Card>
                    <Card className="border-l-4 border-l-orange-500"><div className="text-sm text-slate-500">Звернень в саппорт</div><div className="text-3xl font-bold text-slate-800">3</div></Card>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2" title="Навантаження" titleIcon={Server}>
                        <div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={ACTIVITY_DATA}><Area type="monotone" dataKey="tasks" stroke="#10B981" fill="#10B981" fillOpacity={0.1}/></AreaChart></ResponsiveContainer></div>
                    </Card>
                    <Card title="Логи безпеки" titleIcon={Terminal} noPadding>
                        <div className="max-h-64 overflow-y-auto">
                            {SYSTEM_LOGS.map(log => (
                                <div key={log.id} className="p-3 border-b border-slate-50 text-xs hover:bg-slate-50">
                                    <span className={`font-bold mr-2 ${log.type==='ERROR'?'text-red-600':log.type==='WARN'?'text-orange-600':'text-blue-600'}`}>{log.type}</span>
                                    <span className="text-slate-600">{log.action}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    // MENTOR
    if (user.role === 'mentor') {
        return (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Кабінет Ментора 🎓</h1>
                        <p className="text-indigo-100 text-lg">Сьогодні ваші студенти були активні.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-l-4 border-l-indigo-500"><div className="text-sm text-slate-500">Мої студенти</div><div className="text-3xl font-bold text-slate-800">15</div></Card>
                    <Card className="border-l-4 border-l-green-500"><div className="text-sm text-slate-500">Завдань на перевірку</div><div className="text-3xl font-bold text-slate-800">4</div></Card>
                    <Card className="border-l-4 border-l-orange-500"><div className="text-sm text-slate-500">Нових питань</div><div className="text-3xl font-bold text-slate-800">2</div></Card>
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                    <Card title="Успішність групи" titleIcon={PieChartIcon}>
                        <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={MENTOR_GROUP_DATA}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" /><YAxis /><RechartsTooltip cursor={{fill: 'transparent'}} /><Bar dataKey="avgScore" fill="#6366F1" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
                    </Card>
                    <Card title="Останні активності" titleIcon={Clock}>
                        <div className="space-y-3">
                            <div className="p-3 bg-slate-50 rounded text-sm border-l-4 border-blue-500"><b>Олег Студент</b> завершив "Java Basics"</div>
                            <div className="p-3 bg-slate-50 rounded text-sm border-l-4 border-green-500"><b>Анна Новачок</b> додала коментар до завдання</div>
                            <div className="p-3 bg-slate-50 rounded text-sm border-l-4 border-purple-500"><b>Іван Кодер</b> почав новий курс</div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return <div>Loading...</div>;
};

// --- MAIN APP ---

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('landing');
  const [chatRecipient, setChatRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    const stored = localStorage.getItem('visionline_v7_2_user');
    if (stored) { setUser(JSON.parse(stored)); setView('dashboard'); }
    setLoading(false);
  }, []);

  const login = (u) => { setUser(u); localStorage.setItem('visionline_v7_2_user', JSON.stringify(u)); setView('dashboard'); };
  const logout = () => { setUser(null); localStorage.removeItem('visionline_v7_2_user'); setView('landing'); };
  const updateProfile = (newData) => { const u = {...user, ...newData}; setUser(u); localStorage.setItem('visionline_v7_2_user', JSON.stringify(u)); };
  const navigate = (v) => setView(v);
  const startChat = (id) => { setChatRecipient(id); setView('chat'); };

  const DashboardLayoutImpl = ({ children }) => {
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
      const closeDropdown = () => { if (showNotifications) setShowNotifications(false); };
      if (showNotifications) document.addEventListener('click', closeDropdown);
      return () => document.removeEventListener('click', closeDropdown);
    }, [showNotifications]);

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const menuItems = useMemo(() => {
        const common = [{ id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard }];
        if (user?.role === 'student') return [...common, { id: 'goals', label: 'Курси', icon: Book }, { id: 'progress', label: 'Прогрес', icon: TrendingUp }, { id: 'chat', label: 'Чат', icon: MessageSquare }, { id: 'library', label: 'Бібліотека', icon: BookOpen }, { id: 'profile', label: 'Профіль', icon: User }];
        if (user?.role === 'mentor') return [...common, { id: 'users', label: 'Студенти', icon: Users }, { id: 'chat', label: 'Чат', icon: MessageSquare }, { id: 'library', label: 'Бібліотека', icon: BookOpen }, { id: 'profile', label: 'Профіль', icon: User }];
        if (user?.role === 'admin') return [...common, { id: 'users', label: 'Користувачі', icon: Users }, { id: 'chat', label: 'Чат', icon: MessageSquare }, { id: 'library', label: 'Контент', icon: BookOpen }, { id: 'admin_system', label: 'Система', icon: Server }, { id: 'profile', label: 'Профіль', icon: User }];
        return common;
    }, [user]);

    return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-600">
       <aside className="hidden md:flex flex-col w-72 bg-white/80 backdrop-blur-md border-r border-slate-200 fixed h-full z-20 shadow-sm">
          <div className="p-8 pb-6 flex items-center gap-3 text-slate-900"><div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Target size={20} strokeWidth={3}/></div><span className="text-xl font-extrabold tracking-tight">VisionLine</span></div>
          <nav className="flex-1 px-4 space-y-2 py-4">
             {menuItems.map(item => (
                 <button key={item.id} onClick={()=>navigate(item.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium duration-300 ${view === item.id ? 'bg-blue-50 text-blue-700 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                     <item.icon size={20} className={view === item.id ? 'text-blue-600' : 'text-slate-400'}/> {item.label}
                 </button>
             ))}
          </nav>
          <div className="p-6 border-t border-slate-100">
             <div className="bg-slate-50 rounded-xl p-3 mb-4 flex items-center gap-3">
                 <img src={user.avatar} className="w-8 h-8 rounded-full bg-white"/>
                 <div className="overflow-hidden"><div className="font-bold text-xs text-slate-900 truncate">{user.name}</div><div className="text-[10px] text-slate-500 uppercase">{user.role}</div></div>
             </div>
             <button onClick={logout} className="flex items-center gap-3 px-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors"><LogOut size={16}/> Вийти</button>
          </div>
       </aside>
       <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
           <header className="bg-white/70 backdrop-blur-xl h-20 px-8 flex items-center justify-between sticky top-0 z-30 border-b border-slate-200/50">
               <h2 className="text-xl font-bold text-slate-800 capitalize">{view.replace('_', ' ')}</h2>
               <div className="flex items-center gap-4 relative">
                   <button onClick={(e) => {e.stopPropagation(); setShowNotifications(!showNotifications);}} className="relative p-2 text-slate-400 hover:bg-white hover:shadow-sm rounded-full transition-all">
                        <Bell size={20}/>
                        {notifications.some(n => !n.read) && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>}
                   </button>
                   {showNotifications && (
                       <div onClick={(e) => e.stopPropagation()} className="absolute top-12 right-0 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                           <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50"><h3 className="font-bold text-slate-800">Сповіщення</h3><button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline font-medium">Всі прочитані</button></div>
                           <div className="max-h-64 overflow-y-auto custom-scrollbar">
                               {notifications.length > 0 ? notifications.map((n) => (<div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}><div className="flex gap-3"><div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-slate-300'}`}></div><div><p className={`text-sm ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{n.title}</p><p className="text-xs text-slate-500 mt-1">{n.message}</p></div></div></div>)) : <div className="p-8 text-center text-slate-500 text-sm">Немає нових сповіщень</div>}
                           </div>
                       </div>
                   )}
               </div>
           </header>
           <main className="p-8 max-w-7xl mx-auto w-full flex-1">{children}</main>
       </div>
    </div>
  )};

  if (loading) return null;
  if (!user) return <LoginPage onLogin={login} navigate={navigate} />;

  return (
    <DashboardLayoutImpl>
        {view === 'dashboard' && <DashboardPage user={user} navigate={navigate} notifications={notifications}/>}
        {view === 'chat' && <ChatPage user={user} openChatWithId={chatRecipient}/>}
        {view === 'users' && <UsersPage currentUser={user} navigate={navigate} onStartChat={startChat}/>}
        {view === 'goals' && <StudentGoalsPage navigate={navigate}/>}
        {view === 'progress' && <StudentProgressPage/>}
        {view === 'library' && <LibraryPage user={user}/>}
        {view === 'admin_system' && <AdminSystemPage/>}
        {view === 'profile' && <ExtendedProfilePage user={user} onUpdate={updateProfile}/>}
    </DashboardLayoutImpl>
  );
};

export default App;