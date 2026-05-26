'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  BookOpen, 
  Flame, 
  Scale, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Info, 
  Droplet, 
  Activity, 
  RefreshCw, 
  AlertTriangle, 
  UserCheck, 
  FileText,
  ChevronDown,
  Utensils,
  Lightbulb,
  HelpCircle,
  XCircle,
  ShieldAlert,
  Target,
  TrendingUp,
  Ban
} from 'lucide-react';

import { useAppStore } from '@/lib/store';
import { generatePlan, calculateFirstMealTime } from '@/lib/plan';
import { 
  elapsedHours, 
  currentStage, 
  progressPct, 
  formatHM, 
  newSession, 
  FASTING_STAGES 
} from '@/lib/fasting';
import { GUIDES, getMealPlan, getDailyTip, FAQ_ITEMS } from '@/lib/content';
import { PROTOCOL_RULES, OBJECTIVE_STATEMENT, SAFETY_WARNING, getMotivationMessage, getDayConfiguration } from '@/lib/protocol';
import type { UserProfile, FastingSession, DayLog } from '@/lib/types';

export default function Home() {
  const { state, update, reset, hydrated } = useAppStore();
  const [screen, setScreen] = useState<'welcome' | 'onboarding' | 'home'>('welcome');
  const [activeTab, setActiveTab] = useState<'plano' | 'jejum' | 'acompanhamento' | 'conteudos'>('plano');
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showMealPlan, setShowMealPlan] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [contentFilter, setContentFilter] = useState<'todos' | 'guia' | 'ciencia' | 'nutricao'>('todos');
  const [showProtocolRules, setShowProtocolRules] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  // Relógio do cronômetro
  const [now, setNow] = useState<Date>(new Date());

  // Efeito para sincronizar a tela ativa com base no estado hidratado e curar estados incompletos
  useEffect(() => {
    if (hydrated) {
      if (state.profile) {
        if (!state.plan || !Array.isArray(state.plan.dailySchedule) || !Array.isArray(state.dayLogs) || state.dayLogs.length === 0) {
          try {
            const plan = generatePlan(state.profile);
            const initialLogs: DayLog[] = [];
            for (let i = 0; i < plan.duration; i++) {
              const d = new Date();
              d.setDate(d.getDate() + i);
              const dStr = d.toISOString().split('T')[0];
              initialLogs.push({
                date: dStr,
                fastCompleted: false,
              });
            }
            update({
              plan,
              dayLogs: initialLogs,
            });
            setScreen('home');
          } catch (e) {
            reset();
            setScreen('welcome');
          }
        } else {
          setScreen('home');
        }
      } else {
        setScreen('welcome');
      }
    }
  }, [hydrated, state.profile, state.plan, state.dayLogs, update, reset]);

  // Intervalo do cronômetro rodando a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- CONTROLE DE LOGIN LOCAL ---
  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleStartWelcome = () => {
    let hasError = false;

    if (!nameInput.trim()) {
      setNameError('Por favor, nos diga como quer ser chamada.');
      hasError = true;
    } else {
      setNameError('');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.trim()) {
      setEmailError('Por favor, insira o seu e-mail.');
      hasError = true;
    } else if (!emailRegex.test(emailInput.trim())) {
      setEmailError('Por favor, insira um e-mail válido.');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (hasError) return;

    setScreen('onboarding');
  };

  // --- CONTROLE DO ONBOARDING MULTI-STEP ---
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [onboardingProfile, setOnboardingProfile] = useState<Partial<UserProfile>>({
    weightGoal: '2-4',
    fastingExperience: 'nunca',
    morningHunger: 'sim',
    lastMealTime: 20,
  });

  const updateOnboardingProfile = (patch: Partial<UserProfile>) => {
    setOnboardingProfile(prev => ({ ...prev, ...patch }));
  };

  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      // Salva e gera o plano
      const fullProfile: UserProfile = {
        name: nameInput.trim(),
        email: emailInput.trim(),
        weightGoal: onboardingProfile.weightGoal || '2-4',
        fastingExperience: onboardingProfile.fastingExperience || 'nunca',
        morningHunger: onboardingProfile.morningHunger || 'sim',
        lastMealTime: onboardingProfile.lastMealTime || 20,
        createdAt: new Date().toISOString(),
      };

      const plan = generatePlan(fullProfile);
      
      // Cria logs iniciais de dias do plano vazios
      const initialLogs: DayLog[] = [];
      for (let i = 0; i < plan.duration; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const dStr = d.toISOString().split('T')[0];
        initialLogs.push({
          date: dStr,
          fastCompleted: false,
        });
      }

      update({
        profile: fullProfile,
        plan,
        dayLogs: initialLogs,
        currentFast: null,
        fastHistory: [],
        finalPhaseChoice: null,
      });
      setScreen('home');
      setActiveTab('plano');
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      setScreen('welcome');
    }
  };

  // --- ABA: PLANO ---
  const profile = state.profile;
  const plan = state.plan;

  // --- ABA: JEJUM ---
  const currentFast = state.currentFast;
  const [customTargetHours, setCustomTargetHours] = useState<number>(16);

  // Inicializa o seletor de horas de jejum com o valor do protocolo progressivo do dia
  useEffect(() => {
    if (plan && !currentFast && state.dayLogs.length > 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      const dayIndex = state.dayLogs.findIndex(l => l.date === todayStr);
      const currentDay = dayIndex >= 0 ? dayIndex + 1 : 1;
      const todayPhase = getDayConfiguration(currentDay, plan, state.finalPhaseChoice);
      setCustomTargetHours(todayPhase.hours);
    }
  }, [plan, currentFast, state.dayLogs, state.finalPhaseChoice]);

  const handleStartFast = () => {
    if (!plan) return;
    const session = newSession(customTargetHours);
    update({ currentFast: session });
  };

  const handleEndFast = () => {
    if (!currentFast) return;
    
    const hoursDone = elapsedHours(currentFast, now);
    const targetMet = hoursDone >= currentFast.targetHours;
    const endedSession: FastingSession = {
      ...currentFast,
      endISO: new Date().toISOString(),
    };

    const newHistory = [endedSession, ...state.fastHistory];
    
    // Atualiza o dia de hoje no log
    const todayStr = new Date().toISOString().split('T')[0];
    const newLogs = state.dayLogs.map(log => {
      if (log.date === todayStr) {
        return {
          ...log,
          fastCompleted: log.fastCompleted || targetMet,
        };
      }
      return log;
    });

    update({
      currentFast: null,
      fastHistory: newHistory,
      dayLogs: newLogs,
    });
  };

  // --- ABA: ACOMPANHAMENTO ---
  const [checkinWeight, setCheckinWeight] = useState<string>('');
  const [checkinNote, setCheckinNote] = useState<string>('');
  const [checkinSuccess, setCheckinSuccess] = useState(false);

  // Carrega dados de hoje se já existirem
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLog = state.dayLogs.find(l => l.date === todayStr);
    if (todayLog) {
      setCheckinWeight(todayLog.weightKg ? String(todayLog.weightKg) : '');
      setCheckinNote(todayLog.note || '');
    }
  }, [state.dayLogs, activeTab]);

  const handleSaveCheckin = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newLogs = state.dayLogs.map(log => {
      if (log.date === todayStr) {
        return {
          ...log,
          weightKg: checkinWeight ? Number(checkinWeight) : undefined,
          note: checkinNote || undefined,
        };
      }
      return log;
    });

    update({ dayLogs: newLogs });
    setCheckinSuccess(true);
    setTimeout(() => setCheckinSuccess(false), 3000);
  };

  // Calcula Streak 🔥
  const getStreak = (): number => {
    let streak = 0;
    const sortedLogs = [...state.dayLogs].sort((a, b) => b.date.localeCompare(a.date));
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Filtra logs até o dia de hoje
    const logsUntilToday = sortedLogs.filter(l => l.date <= todayStr);
    
    for (const log of logsUntilToday) {
      if (log.fastCompleted) {
        streak++;
      } else {
        // Se for hoje e ainda não completou, ignora a quebra de streak para que não comece zerado
        if (log.date === todayStr) continue;
        break;
      }
    }
    return streak;
  };

  // Renderizador simples de Gráfico de Peso SVG
  const renderWeightGraph = () => {
    const logsWithWeight = state.dayLogs
      .filter(l => l.weightKg !== undefined && l.weightKg > 0)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (logsWithWeight.length < 2) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-white border border-[#E8D5D9] rounded-2xl h-44 text-center">
          <Scale className="w-8 h-8 text-brandMuted mb-2 opacity-65" />
          <p className="text-sm font-sans text-brandMuted px-4">
            Registre seu peso por pelo menos 2 dias no check-in diário para ver seu gráfico de evolução pessoal.
          </p>
        </div>
      );
    }

    const weights = logsWithWeight.map(l => l.weightKg as number);
    const minW = Math.min(...weights) - 1;
    const maxW = Math.max(...weights) + 1;
    const rangeW = maxW - minW || 1;

    const width = 350;
    const height = 120;
    const padding = 20;

    const points = logsWithWeight.map((log, idx) => {
      const x = padding + (idx / (logsWithWeight.length - 1)) * (width - 2 * padding);
      const y = height - padding - (((log.weightKg as number) - minW) / rangeW) * (height - 2 * padding);
      return { x, y, weight: log.weightKg, date: log.date };
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
      <div className="bg-white border border-[#E8D5D9] rounded-2xl p-4 shadow-premium">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-xs font-sans text-brandMuted">Histórico de Peso (kg)</span>
          <span className="text-xs font-sans text-brandRose font-bold">
            Meta de Redução: {plan?.weightGoal === '2-4' ? '2 a 4 kg' : plan?.weightGoal === '5-7' ? '5 a 7 kg' : plan?.weightGoal === '8-10' ? '8 a 10 kg' : 'Mais de 10 kg'}
          </span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Fundo da Área */}
          <path d={areaD} fill="url(#grad-graph)" opacity="0.15" />
          {/* Linha Principal */}
          <path d={pathD} fill="none" stroke="var(--rose)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Grade simples horizontal */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#E8D5D9" strokeWidth="1" strokeDasharray="4" />
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#E8D5D9" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
          
          {/* Pontos */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="4" fill="var(--wine)" stroke="#FFFFFF" strokeWidth="1.5" />
              {/* Tooltip de texto em posições alternadas para não sobrepor */}
              <text 
                x={p.x} 
                y={p.y - 8} 
                textAnchor="middle" 
                fontSize="9" 
                fontWeight="bold" 
                fill="var(--dark)"
                className="font-sans"
              >
                {p.weight}k
              </text>
            </g>
          ))}
          
          {/* Gradients */}
          <defs>
            <linearGradient id="grad-graph" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--rose)" />
              <stop offset="100%" stopColor="var(--cream)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  // --- REINICIAR DADOS ---
  const handleResetData = () => {
    reset();
    setScreen('welcome');
    setNameInput('');
    setEmailInput('');
    setStep(1);
    setShowResetConfirm(false);
  };

  // Se não estiver hidratado ainda, mostra tela de carregamento neutra e premium
  if (!hydrated) {
    return (
      <div className="w-full max-w-[430px] mx-auto min-h-screen bg-[#FBF7F4] flex flex-col items-center justify-center border-x border-[#E8D5D9]">
        <div className="text-center animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brandGold to-brandRose flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-brandWine tracking-wide">FemReset</h2>
          <p className="text-xs font-sans text-brandMuted mt-1">Carregando seus dados com segurança...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-[#FBF7F4] flex flex-col shadow-[0_0_50px_-12px_rgba(160,53,90,0.15)] relative overflow-hidden border-x border-[#E8D5D9]">
      
      {/* 1. TELA DE WELCOME */}
      {screen === 'welcome' && (
        <div className="flex-1 flex flex-col justify-between p-6">
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brandGold to-brandRose flex items-center justify-center mb-6 shadow-premium">
              <Activity className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-serif font-bold text-brandWine tracking-tight text-center">
              FemReset
            </h1>
            <p className="text-sm font-sans text-brandGold font-bold tracking-widest uppercase mt-1">
              O jejum que entende o seu corpo
            </p>
            
            <p className="text-base text-brandMuted text-center mt-6 leading-relaxed max-w-xs font-sans">
              Vamos criar seu protocolo personalizado para mulheres de 39 anos ou mais. Leva menos de 2 minutos.
            </p>
            
            <div className="w-full mt-6 max-w-sm space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-brandMuted uppercase tracking-wider mb-2 px-1 font-sans">
                  Seu E-mail de Acesso
                </label>
                <input
                  id="email"
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="Ex: nome@email.com"
                  className="w-full px-5 py-4 rounded-full border-2 border-[#E8D5D9] bg-white text-brandDark focus:outline-none focus:border-brandRose transition-all duration-300 shadow-sm font-sans"
                />
                {emailError && (
                  <p className="text-xs text-brandRose font-semibold mt-2 px-2 flex items-center font-sans">
                    <Info className="w-3.5 h-3.5 mr-1" />
                    {emailError}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="name" className="block text-xs font-bold text-brandMuted uppercase tracking-wider mb-2 px-1 font-sans">
                  Como você quer ser chamada?
                </label>
                <input
                  id="name"
                  type="text"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  placeholder="Ex: Maria"
                  className="w-full px-5 py-4 rounded-full border-2 border-[#E8D5D9] bg-white text-brandDark focus:outline-none focus:border-brandRose transition-all duration-300 shadow-sm font-sans"
                />
                {nameError && (
                  <p className="text-xs text-brandRose font-semibold mt-2 px-2 flex items-center font-sans">
                    <Info className="w-3.5 h-3.5 mr-1" />
                    {nameError}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={handleStartWelcome}
              className="w-full btn-premium py-4 text-center font-sans font-bold text-base hover:scale-[1.01] duration-300"
            >
              COMEÇAR
            </button>
            
            <p className="text-[10px] text-brandMuted text-center italic leading-normal px-4 font-sans">
              O FemReset é um aplicativo focado em bem-estar e hábitos saudáveis. Não substitui orientação médica ou nutricional profissional.
            </p>
          </div>
        </div>
      )}

      {/* 2. TELA DE ONBOARDING */}
      {screen === 'onboarding' && (
        <div className="flex-1 flex flex-col justify-between p-6">
          {/* Header de progresso */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-sans font-bold text-brandMuted uppercase tracking-wider">
                Passo {step} de {totalSteps}
              </span>
              <span className="text-[11px] font-sans font-bold text-brandRose uppercase tracking-wider">
                {Math.round((step / totalSteps) * 100)}% Concluído
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#E8D5D9] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brandGold to-brandRose transition-all duration-500 ease-out"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Área de conteúdo do onboarding com animação */}
          <div className="flex-1 flex flex-col justify-center my-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="flex-col flex"
              >
                {/* STEP 1: QUANTOS QUILOS VOCÊ DESEJA PERDER */}
                {step === 1 && (
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-brandWine mb-2 leading-tight">
                      Quantos quilos você deseja perder?
                    </h2>
                    <p className="text-sm font-sans text-brandMuted mb-6 leading-relaxed">
                      Sua meta pessoal guiará a duração ideal e o foco do seu protocolo personalizado.
                    </p>
                    <div className="flex flex-col gap-3">
                      {([
                        { key: '2-4', label: 'De 2 a 4 kg', desc: 'Protocolo leve focado em definição e bem-estar (21 dias).' },
                        { key: '5-7', label: 'De 5 a 7 kg', desc: 'Evolução constante com foco em emagrecimento moderado (28 dias).' },
                        { key: '8-10', label: 'De 8 a 10 kg', desc: 'Consolidação avançada para resultados sólidos (35 dias).' },
                        { key: '10+', label: 'Mais de 10 kg', desc: 'Ciclos intensivos de queima e adaptação segura (42 dias).' }
                      ] as const).map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => updateOnboardingProfile({ weightGoal: opt.key })}
                          className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-sans transition-all duration-300 flex flex-col gap-1 ${
                            onboardingProfile.weightGoal === opt.key
                              ? 'border-brandRose bg-[#FDF0F4] shadow-sm'
                              : 'border-[#E8D5D9] bg-white hover:border-brandRose/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-brandWine">{opt.label}</span>
                            {onboardingProfile.weightGoal === opt.key && (
                              <span className="w-5 h-5 rounded-full bg-brandRose flex items-center justify-center shrink-0">
                                <Check className="w-3.5 h-3.5 text-white" />
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-brandMuted leading-relaxed">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: EXPERIÊNCIA ANTERIOR */}
                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-brandWine mb-2 leading-tight">
                      Você já fez jejum intermitente antes?
                    </h2>
                    <p className="text-sm font-sans text-brandMuted mb-6 leading-relaxed">
                      Sua experiência ajuda a ditar as horas iniciais recomendadas e a velocidade de progressão.
                    </p>
                    <div className="flex flex-col gap-3">
                      {([
                        { key: 'nunca', label: 'Nunca fiz', desc: 'Quero começar do jeito mais seguro e no meu próprio ritmo.' },
                        { key: 'tentou', label: 'Já tentei algumas vezes', desc: 'Conheço o básico e consigo tolerar alguns períodos sem comer.' },
                        { key: 'experiente', label: 'Já tenho experiência', desc: 'Pratico ou já pratiquei com frequência e me adapto muito bem.' }
                      ] as const).map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => updateOnboardingProfile({ fastingExperience: opt.key })}
                          className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-sans transition-all duration-300 flex flex-col gap-1 ${
                            onboardingProfile.fastingExperience === opt.key
                              ? 'border-brandRose bg-[#FDF0F4] shadow-sm'
                              : 'border-[#E8D5D9] bg-white hover:border-brandRose/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-brandWine">{opt.label}</span>
                            {onboardingProfile.fastingExperience === opt.key && (
                              <span className="w-5 h-5 rounded-full bg-brandRose flex items-center justify-center shrink-0">
                                <Check className="w-3.5 h-3.5 text-white" />
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-brandMuted leading-relaxed">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: FOME PELA MANHÃ */}
                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-brandWine mb-2 leading-tight">
                      Você sente muita fome pela manhã?
                    </h2>
                    <p className="text-sm font-sans text-brandMuted mb-6 leading-relaxed">
                      Isso é crucial para definirmos se sua janela de alimentação deve começar mais cedo ou mais tarde.
                    </p>
                    <div className="flex flex-col gap-3">
                      {([
                        { key: 'sim', label: 'Sim, sinto muita fome', desc: 'Acordo com bastante apetite e sinto necessidade de comer logo.' },
                        { key: 'as_vezes', label: 'Às vezes sinto', desc: 'Alguns dias sinto fome, em outros consigo aguentar bem.' },
                        { key: 'nao', label: 'Não, quase nunca sinto', desc: 'Prefiro apenas um café/chá e comer mais próximo ao almoço.' }
                      ] as const).map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => updateOnboardingProfile({ morningHunger: opt.key })}
                          className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-sans transition-all duration-300 flex flex-col gap-1 ${
                            onboardingProfile.morningHunger === opt.key
                              ? 'border-brandRose bg-[#FDF0F4] shadow-sm'
                              : 'border-[#E8D5D9] bg-white hover:border-brandRose/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-brandWine">{opt.label}</span>
                            {onboardingProfile.morningHunger === opt.key && (
                              <span className="w-5 h-5 rounded-full bg-brandRose flex items-center justify-center shrink-0">
                                <Check className="w-3.5 h-3.5 text-white" />
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-brandMuted leading-relaxed">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 4: HORÁRIO DA ÚLTIMA REFEIÇÃO */}
                {step === 4 && (
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-brandWine mb-2 leading-tight">
                      Qual horário costuma fazer sua última refeição?
                    </h2>
                    <p className="text-sm font-sans text-brandMuted mb-6 leading-relaxed">
                      Sua primeira refeição do dia seguinte será calculada automaticamente com base nesta escolha.
                    </p>
                    <div className="flex flex-col gap-3">
                      {([18, 19, 20, 21] as const).map((time) => (
                        <button
                          key={time}
                          onClick={() => updateOnboardingProfile({ lastMealTime: time })}
                          className={`w-full text-left px-6 py-4 rounded-2xl border-2 font-sans font-bold text-sm transition-all duration-300 flex items-center justify-between ${
                            onboardingProfile.lastMealTime === time
                              ? 'border-brandRose bg-[#FDF0F4] text-brandRose shadow-sm font-bold'
                              : 'border-[#E8D5D9] bg-white text-brandDark hover:border-brandRose/50'
                          }`}
                        >
                          <span>{time}h</span>
                          {onboardingProfile.lastMealTime === time && (
                            <span className="w-5 h-5 rounded-full bg-brandRose flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    {/* Disclaiming card */}
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 items-start shadow-sm">
                      <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 animate-pulse" />
                      <p className="text-[10px] font-sans text-amber-950 leading-relaxed">
                        {SAFETY_WARNING}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Botões de navegação inferior */}
          <div className="flex gap-4 pt-4 border-t border-[#E8D5D9]">
            <button
              onClick={handlePrevStep}
              className="flex-1 px-6 py-3.5 rounded-full border-2 border-[#E8D5D9] bg-white font-sans font-bold text-sm text-brandMuted hover:bg-[#FBF7F4] flex items-center justify-center gap-1.5 duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
            <button
              onClick={handleNextStep}
              className="flex-1 py-3.5 rounded-full btn-premium font-sans font-bold text-sm flex items-center justify-center gap-1.5 duration-200"
            >
              {step === totalSteps ? 'Finalizar' : 'Continuar'}
              {step < totalSteps && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* 3. TELA DE HOME (APP PRINCIPAL) */}
      {screen === 'home' && profile && plan && (
        <div className="flex-1 flex flex-col justify-between min-h-screen">
          
          {/* Header Principal */}
          <header className="px-6 py-4 bg-white border-b border-[#E8D5D9] flex justify-between items-center shadow-sm z-10">
            <div>
              <span className="text-[10px] font-sans font-bold tracking-widest text-brandGold uppercase">FemReset</span>
              <h2 className="text-xl font-serif font-bold text-brandWine tracking-tight">Olá, {profile.name} 💜</h2>
            </div>
            
            {/* Botão de reset de dados discreto no cabeçalho */}
            <button 
              onClick={() => setShowResetConfirm(true)} 
              title="Reiniciar dados do app"
              className="w-8 h-8 rounded-full bg-brandCream hover:bg-[#F2C4CE]/40 flex items-center justify-center text-brandMuted hover:text-brandRose transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </header>

          {/* Área de Visualização Principal do Tab ativo */}
          <main className="flex-1 overflow-y-auto p-5 pb-24 space-y-6">
            
            {/* POPUP DE CONFIRMAÇÃO DE RESET */}
            {showResetConfirm && (
              <div className="fixed inset-0 bg-brandDark/40 flex items-center justify-center p-6 z-50 animate-fade-in backdrop-blur-sm">
                <div className="bg-white border border-[#E8D5D9] rounded-3xl p-6 max-w-xs w-full shadow-2xl flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#FDF0F4] flex items-center justify-center mb-3">
                    <AlertTriangle className="w-6 h-6 text-brandRose animate-bounce" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-brandWine mb-1">Apagar seus dados?</h3>
                  <p className="text-xs font-sans text-brandMuted mb-5">
                    Isso removerá permanentemente o perfil de <strong>{profile.email}</strong>, seu histórico de jejuns e todo o seu acompanhamento de {plan.duration} dias.
                  </p>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 py-2.5 rounded-full border border-[#E8D5D9] text-xs font-sans font-bold text-brandMuted hover:bg-[#FBF7F4]"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleResetData}
                      className="flex-1 py-2.5 rounded-full bg-brandRose text-xs font-sans font-bold text-white shadow-md hover:bg-brandWine"
                    >
                      Sim, Apagar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* AVISOS DE SEGURANÇA E CONSELHO MÉDICO */}
            {activeTab === 'plano' && (
              <div className="p-4 rounded-2xl border border-brandNotice bg-amber-50 text-amber-900 flex gap-3 shadow-sm">
                <div className="shrink-0 mt-0.5">
                  <Info className="w-5 h-5 text-brandNotice" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm mb-1">
                    Aviso Importante
                  </h4>
                  <p className="text-xs font-sans leading-relaxed opacity-90">{SAFETY_WARNING}</p>
                </div>
              </div>
            )}

            {/* TAB-1: PLANO (PROTOCOLO PROGRESSIVO 21 DIAS) */}
            {activeTab === 'plano' && (
              <div className="space-y-6">
                
                {/* Dica Diária */}
                {(() => {
                  const dailyTip = getDailyTip(state.dayLogs);
                  if (!dailyTip) return null;
                  return (
                    <div className="bg-gradient-to-r from-[#FFF9FA] to-[#FFF0F4] border border-brandBlush/60 rounded-2xl p-4.5 shadow-sm flex gap-3.5 items-start relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-16 h-16 rounded-full bg-brandRose/5 -translate-y-4 translate-x-4 shrink-0" />
                      <div className="w-9 h-9 rounded-full bg-brandBlush/40 flex items-center justify-center text-brandRose shrink-0">
                        <Lightbulb className="w-5 h-5 text-brandRose" />
                      </div>
                      <div className="flex-1 space-y-0.5 z-10">
                        <span className="text-[10px] font-sans font-bold tracking-widest text-brandRose uppercase block">Dica de Hoje</span>
                        <p className="text-xs font-sans text-brandMuted leading-relaxed">{dailyTip.text}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* PROTOCOLO PROGRESSIVO — Card do dia atual */}
                {(() => {
                  const todayStr = new Date().toISOString().split('T')[0];
                  const dayIndex = state.dayLogs.findIndex(l => l.date === todayStr);
                  const currentDay = dayIndex >= 0 ? dayIndex + 1 : 1;
                  const todayPhase = getDayConfiguration(currentDay, plan, state.finalPhaseChoice);
                  const calculatedFirstMeal = calculateFirstMealTime(plan.lastMealTime, todayPhase.hours);
                  const motivation = getMotivationMessage(todayPhase.hours);

                  return (
                    <>
                      {/* Hero Card — Fase de Hoje */}
                      <div className="relative overflow-hidden bg-gradient-to-tr from-brandRose to-brandWine text-white rounded-3xl p-6 shadow-premium">
                        <div className="absolute right-[-10px] top-[-10px] w-24 h-24 rounded-full bg-white/5" />
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-sans font-bold tracking-widest bg-white/20 px-2.5 py-1 rounded-full uppercase">
                            {plan.name}
                          </span>
                          <span className="text-[10px] font-sans font-bold bg-brandGold/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Dia {currentDay} de {plan.duration}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl font-serif font-bold mt-4 mb-0.5 leading-tight">
                          Jejum de {todayPhase.hours} horas
                        </h3>
                        <p className="text-[11px] font-sans opacity-80 mb-4">
                          {todayPhase.phaseName}
                        </p>

                        <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4 mt-1">
                          <div>
                            <span className="text-[10px] font-sans text-white/70 block uppercase tracking-wider">Jejum Recompensa</span>
                            <span className="text-2xl font-serif font-bold">{todayPhase.hours}h</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-sans text-white/70 block uppercase tracking-wider">Janela Alimentar</span>
                            <span className="text-2xl font-serif font-bold">{todayPhase.eatingHours}h</span>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-white/10 rounded-xl border border-white/15 space-y-2">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-brandGold shrink-0" />
                            <span className="text-xs font-sans font-semibold">Janela Calculada</span>
                          </div>
                          <div className="text-[11px] font-sans text-white/80 leading-relaxed pl-6 space-y-1">
                            <p>Última refeição ontem: <strong>{plan.lastMealTime}h</strong></p>
                            <p>Primeira refeição hoje: <strong>{calculatedFirstMeal}</strong></p>
                          </div>
                        </div>
                      </div>

                      {/* Orientação Motivacional da Fase */}
                      <div className="bg-gradient-to-r from-[#FFF9FA] to-[#FFF0F4] border border-brandBlush/60 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-brandRose" />
                          <h4 className="font-serif font-bold text-brandWine text-sm">Mensagem Motivacional</h4>
                        </div>
                        <p className="text-xs font-sans text-brandMuted leading-relaxed italic font-semibold text-brandWine">
                          &ldquo;{motivation}&rdquo;
                        </p>
                      </div>

                      {/* Escolha Final / Ajuste de Intensidade de 18h se aplicável */}
                      {todayPhase.isOptional18hAllowed && (
                        <div className="premium-card p-5 space-y-4 border-2 border-brandGold/50">
                          <div className="flex items-center gap-2 pb-2 border-b border-[#E8D5D9]">
                            <Activity className="w-5 h-5 text-brandGold animate-pulse" />
                            <h4 className="font-serif font-bold text-brandWine text-base">Ajuste de Intensidade</h4>
                          </div>
                          <p className="text-xs font-sans text-brandMuted leading-relaxed">
                            Você chegou à fase de manutenção avançada! Como você já tem experiência com jejum intermitente, pode optar por manter o protocolo em **16h** ou subir a intensidade para **18h** para maximizar os resultados.
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => update({ finalPhaseChoice: '16' })}
                              className={`flex-1 py-2.5 rounded-full border text-xs font-sans font-bold transition-all ${
                                state.finalPhaseChoice === '16' || !state.finalPhaseChoice
                                  ? 'bg-brandRose text-white border-brandRose shadow-md'
                                  : 'bg-white border-[#E8D5D9] text-brandMuted hover:bg-[#FBF7F4]'
                              }`}
                            >
                              Manter 16h
                            </button>
                            <button
                              onClick={() => update({ finalPhaseChoice: '18' })}
                              className={`flex-1 py-2.5 rounded-full border text-xs font-sans font-bold transition-all ${
                                state.finalPhaseChoice === '18'
                                  ? 'bg-brandRose text-white border-brandRose shadow-md'
                                  : 'bg-white border-[#E8D5D9] text-brandMuted hover:bg-[#FBF7F4]'
                              }`}
                            >
                              Subir para 18h 🔥
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}

                {/* Tabela / Timeline Dinâmica do Protocolo */}
                <div className="premium-card p-5 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E8D5D9]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-brandRose" />
                      <h4 className="font-serif font-bold text-brandWine text-base">Cronograma do Protocolo</h4>
                    </div>
                    <button 
                      onClick={() => setShowTimeline(!showTimeline)}
                      className="text-xs font-sans font-bold text-brandRose hover:underline flex items-center gap-1"
                    >
                      {showTimeline ? 'Recolher' : 'Ver Completo'}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showTimeline ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  <p className="text-xs font-sans text-brandMuted leading-relaxed">
                    {OBJECTIVE_STATEMENT}
                  </p>

                  {showTimeline && (
                    <div className="space-y-2 pt-2 animate-fade-in max-h-[300px] overflow-y-auto pr-1">
                      {/* Table Header */}
                      <div className="grid grid-cols-4 gap-2 px-2 py-2 bg-brandWine/5 rounded-xl sticky top-0 bg-white">
                        <span className="text-[9px] font-sans font-bold text-brandWine uppercase tracking-wider">Dia</span>
                        <span className="text-[9px] font-sans font-bold text-brandWine uppercase tracking-wider">Jejum</span>
                        <span className="text-[9px] font-sans font-bold text-brandWine uppercase tracking-wider">Janela</span>
                        <span className="text-[9px] font-sans font-bold text-brandWine uppercase tracking-wider">Fase</span>
                      </div>
                      {/* Rows */}
                      {(() => {
                        const todayStr = new Date().toISOString().split('T')[0];
                        const dayIdx = state.dayLogs.findIndex(l => l.date === todayStr);
                        const currentDay = dayIdx >= 0 ? dayIdx + 1 : 1;
                        
                        return plan.dailySchedule.map((sched) => {
                          const isActive = currentDay === sched.day;
                          // Aplica escolha 18h temporariamente na tabela para visualização
                          let displayHours = sched.hours;
                          if (sched.isOptional18hAllowed && state.finalPhaseChoice) {
                            displayHours = Number(state.finalPhaseChoice);
                          }
                          return (
                            <div key={sched.day} className={`grid grid-cols-4 gap-2 px-2 py-2 rounded-xl text-[11px] font-sans transition-all items-center ${
                              isActive ? 'bg-[#FDF0F4] border border-brandRose/30 font-bold text-brandWine scale-[1.01] shadow-sm' : 'border border-transparent text-brandMuted'
                            }`}>
                              <span>Dia {sched.day}</span>
                              <span>{displayHours}h</span>
                              <span>{24 - displayHours}h</span>
                              <span className="leading-tight truncate">{sched.phaseName}</span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>

                {/* Regras do Protocolo */}
                <div className="premium-card p-5 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E8D5D9]">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-brandRose" />
                      <h4 className="font-serif font-bold text-brandWine text-base">Regras do Protocolo</h4>
                    </div>
                    <button 
                      onClick={() => setShowProtocolRules(!showProtocolRules)}
                      className="text-xs font-sans font-bold text-brandRose hover:underline flex items-center gap-1"
                    >
                      {showProtocolRules ? 'Recolher' : 'Ver Regras'}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showProtocolRules ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {showProtocolRules && (
                    <div className="space-y-5 pt-2 animate-fade-in">
                      {/* Durante o Jejum */}
                      <div className="space-y-3">
                        <h5 className="text-xs font-serif font-bold text-brandWine">⏱️ Durante o Jejum</h5>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="border border-brandSuccess/25 bg-[#F0FDF4]/30 rounded-2xl p-4 space-y-2">
                            <h6 className="text-[11px] font-sans font-bold text-brandSuccess flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" /> Permitido
                            </h6>
                            <ul className="space-y-1.5 pl-1">
                              {PROTOCOL_RULES.duringFasting.allowed.map((item, i) => (
                                <li key={i} className="text-xs font-sans text-brandDark flex gap-1.5 items-start leading-relaxed">
                                  <span className="text-brandSuccess shrink-0 mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="border border-brandRose/25 bg-[#FDF0F4]/30 rounded-2xl p-4 space-y-2">
                            <h6 className="text-[11px] font-sans font-bold text-brandRose flex items-center gap-1.5">
                              <Ban className="w-3.5 h-3.5" /> Evitar Estritamente
                            </h6>
                            <ul className="space-y-1.5 pl-1">
                              {PROTOCOL_RULES.duringFasting.avoid.map((item, i) => (
                                <li key={i} className="text-xs font-sans text-brandDark flex gap-1.5 items-start leading-relaxed">
                                  <span className="text-brandRose shrink-0 mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Na Janela Alimentar */}
                      <div className="space-y-3">
                        <h5 className="text-xs font-serif font-bold text-brandWine">🍽️ Na Janela Alimentar</h5>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="border border-brandSuccess/25 bg-[#F0FDF4]/30 rounded-2xl p-4 space-y-2">
                            <h6 className="text-[11px] font-sans font-bold text-brandSuccess flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" /> Priorizar
                            </h6>
                            <ul className="space-y-1.5 pl-1">
                              {PROTOCOL_RULES.duringWindow.prioritize.map((item, i) => (
                                <li key={i} className="text-xs font-sans text-brandDark flex gap-1.5 items-start leading-relaxed">
                                  <span className="text-brandSuccess shrink-0 mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="border border-brandRose/25 bg-[#FDF0F4]/30 rounded-2xl p-4 space-y-2">
                            <h6 className="text-[11px] font-sans font-bold text-brandRose flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5" /> Evitar
                            </h6>
                            <ul className="space-y-1.5 pl-1">
                              {PROTOCOL_RULES.duringWindow.avoid.map((item, i) => (
                                <li key={i} className="text-xs font-sans text-brandDark flex gap-1.5 items-start leading-relaxed">
                                  <span className="text-brandRose shrink-0 mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bloco de Plano Alimentar Sugerido */}
                {(() => {
                  const todayStr = new Date().toISOString().split('T')[0];
                  const dayIndex = state.dayLogs.findIndex(l => l.date === todayStr);
                  const currentDay = dayIndex >= 0 ? dayIndex + 1 : 1;
                  const todayPhase = getDayConfiguration(currentDay, plan, state.finalPhaseChoice);
                  const protocolKey = todayPhase.hours === 12 ? '12:12' : todayPhase.hours === 14 ? '14:10' : '16:8';
                  const mealPlan = getMealPlan(protocolKey);
                  if (!mealPlan) return null;
                  return (
                    <div className="premium-card p-5 space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-[#E8D5D9]">
                        <div className="flex items-center gap-2">
                          <Utensils className="w-5 h-5 text-brandRose" />
                          <h4 className="font-serif font-bold text-brandWine text-base">Plano Alimentar Sugerido</h4>
                        </div>
                        <button 
                          onClick={() => setShowMealPlan(!showMealPlan)}
                          className="text-xs font-sans font-bold text-brandRose hover:underline flex items-center gap-1"
                        >
                          {showMealPlan ? 'Recolher' : 'Ver Completo'}
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showMealPlan ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      
                      <p className="text-xs font-sans text-brandMuted leading-relaxed">
                        {mealPlan.description}
                      </p>

                      {showMealPlan && (
                        <div className="space-y-5 pt-3 animate-fade-in">
                          <div className="space-y-4">
                            {mealPlan.meals.map((meal, mIdx) => (
                              <div key={mIdx} className="bg-[#FFFDFE] border border-[#E8D5D9]/40 rounded-2xl p-4 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-serif font-bold text-brandWine">{meal.label}</span>
                                  <span className="text-[10px] font-sans font-bold tracking-wider bg-brandBlush/50 text-brandRose px-2 py-0.5 rounded-full">{meal.time}</span>
                                </div>
                                <ul className="space-y-1.5 pl-1.5">
                                  {meal.suggestions.map((sug, sIdx) => (
                                    <li key={sIdx} className="text-xs font-sans text-brandDark flex gap-2 items-start leading-relaxed">
                                      <span className="text-brandRose shrink-0 mt-1">•</span>
                                      <span>{sug}</span>
                                    </li>
                                  ))}
                                </ul>
                                {meal.tip && (
                                  <div className="text-[10px] font-sans text-brandMuted italic bg-[#FBF7F4]/60 p-2.5 rounded-xl border border-[#E8D5D9]/30 flex gap-1.5 items-start">
                                    <Info className="w-3.5 h-3.5 text-brandGold shrink-0 mt-0.5" />
                                    <span>{meal.tip}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 gap-4 pt-2">
                            <div className="border border-brandSuccess/25 bg-[#F0FDF4]/30 rounded-2xl p-4 space-y-2">
                              <h5 className="text-xs font-serif font-bold text-brandSuccess flex items-center gap-1.5">
                                <Check className="w-4 h-4" /> Ideias de Lanches Saudáveis
                              </h5>
                              <ul className="space-y-1.5 pl-1">
                                {mealPlan.snackIdeas.map((snack, sIdx) => (
                                  <li key={sIdx} className="text-xs font-sans text-brandDark flex gap-1.5 items-start leading-relaxed">
                                    <span className="text-brandSuccess shrink-0 mt-1">•</span>
                                    <span>{snack}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="border border-brandRose/25 bg-[#FDF0F4]/30 rounded-2xl p-4 space-y-2">
                              <h5 className="text-xs font-serif font-bold text-brandRose flex items-center gap-1.5">
                                <XCircle className="w-4 h-4" /> Alimentos a Evitar
                              </h5>
                              <ul className="space-y-1.5 pl-1">
                                {mealPlan.avoidList.map((avoid, aIdx) => (
                                  <li key={aIdx} className="text-xs font-sans text-brandDark flex gap-1.5 items-start leading-relaxed">
                                    <span className="text-brandRose shrink-0 mt-1">•</span>
                                    <span>{avoid}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Orientação Alimentar */}
                <div className="premium-card p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#E8D5D9]">
                    <UserCheck className="w-5 h-5 text-brandRose" />
                    <h4 className="font-serif font-bold text-brandWine text-base">Orientações de Alimentação</h4>
                  </div>
                  <ul className="space-y-3">
                    {(() => {
                      const mealGuidance = [
                        'Priorize proteínas, vegetais e gorduras boas nas refeições da janela alimentar.',
                        'Evite ultraprocessados e açúcar refinado — eles dificultam o resultado.',
                        'Coma até se sentir satisfeita, sem exageros e sem pular refeições da janela.',
                      ];
                      return mealGuidance.map((guide, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs font-sans text-brandDark leading-relaxed">
                          <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-brandBlush/40 flex items-center justify-center text-brandRose font-bold">
                            ✓
                          </span>
                          <span>{guide}</span>
                        </li>
                      ));
                    })()}
                  </ul>
                </div>

                {/* Hidratação */}
                <div className="bg-white border border-[#E8D5D9] rounded-2xl p-5 shadow-premium flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#FDF0F4] flex items-center justify-center text-brandRose shrink-0">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-brandWine text-sm mb-1">Dica de Hidratação</h4>
                    <p className="text-xs font-sans text-brandMuted leading-relaxed">
                      Durante o jejum, beba água, café ou chá sem açúcar à vontade. A hidratação reduz a fome e melhora a disposição.
                    </p>
                  </div>
                </div>

                {/* Informações da Meta */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-[#E8D5D9] rounded-2xl p-4 shadow-sm flex flex-col justify-center items-center text-center">
                    <span className="text-[9px] font-sans text-brandMuted uppercase tracking-wider font-bold mb-1">Meta</span>
                    <span className="text-sm font-serif font-bold text-brandWine leading-tight">
                      Perder {plan.weightGoal === '2-4' ? '2 a 4 kg' : plan.weightGoal === '5-7' ? '5 a 7 kg' : plan.weightGoal === '8-10' ? '8 a 10 kg' : 'Mais de 10 kg'}
                    </span>
                  </div>
                  <button 
                    onClick={() => setActiveTab('acompanhamento')}
                    className="bg-white border border-[#E8D5D9] hover:border-brandRose rounded-2xl p-4 shadow-sm flex flex-col justify-center items-center text-center group transition-colors duration-300"
                  >
                    <span className="text-[9px] font-sans text-brandMuted uppercase tracking-wider font-bold mb-1">Duração Total</span>
                    <span className="text-xl font-serif font-bold text-brandRose group-hover:scale-105 duration-300">{plan.duration} dias</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB-2: CRONÔMETRO DE JEJUM */}
            {activeTab === 'jejum' && (
              <div className="space-y-6">
                {/* CRONÔMETRO ATIVO OU INATIVO */}
                <div className="bg-white border border-[#E8D5D9] rounded-3xl p-6 shadow-premium flex flex-col items-center relative">
                  
                  {/* Estado: SEM JEJUM ATIVO */}
                  {!currentFast ? (
                    <div className="w-full flex flex-col items-center py-6">
                      <span className="text-[10px] font-sans font-bold tracking-widest text-brandGold uppercase mb-4">
                        Novo Jejum
                      </span>
                      
                      {/* Botão de Iniciar Circular Premium */}
                      <button
                        onClick={handleStartFast}
                        className="w-48 h-48 rounded-full bg-gradient-to-tr from-brandGold via-brandRose to-brandWine p-1.5 shadow-[0_15px_30px_-5px_rgba(160,53,90,0.3)] hover:scale-[1.01] duration-300 relative group flex items-center justify-center"
                      >
                        <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                          <Clock className="w-8 h-8 text-brandRose group-hover:scale-110 duration-300" />
                          <span className="text-xs font-sans font-bold text-brandWine mt-1 uppercase tracking-widest">
                            Iniciar Jejum
                          </span>
                        </div>
                      </button>

                      {/* Seletor de Horas Alvo */}
                      <div className="mt-8 w-full max-w-xs px-4">
                        <div className="flex justify-between items-center mb-2 px-1">
                          <span className="text-xs font-sans font-bold text-brandMuted">Meta do jejum:</span>
                          <span className="text-sm font-serif font-bold text-brandWine">{customTargetHours} horas</span>
                        </div>
                        <input
                          type="range"
                          min="12"
                          max="24"
                          step="1"
                          value={customTargetHours}
                          onChange={(e) => setCustomTargetHours(Number(e.target.value))}
                          className="w-full accent-brandRose h-1.5 bg-[#E8D5D9] rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-sans text-brandMuted mt-1 px-1">
                          <span>12 horas</span>
                          <span>18 horas</span>
                          <span>24 horas</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Estado: COM JEJUM ATIVO */
                    <div className="w-full flex flex-col items-center py-4">
                      
                      {/* Círculo do Cronômetro Animado SVG */}
                      <div className="relative w-56 h-56 flex items-center justify-center">
                        
                        {/* SVG de progresso circular */}
                        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {/* Círculo de Fundo */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="44" 
                            fill="transparent" 
                            stroke="#FBF7F4" 
                            strokeWidth="5" 
                          />
                          {/* Círculo Ativo */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="44" 
                            fill="transparent" 
                            stroke="url(#grad-ring)" 
                            strokeWidth="5.5" 
                            strokeDasharray={276.4}
                            strokeDashoffset={276.4 - (276.4 * progressPct(currentFast, now)) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-linear"
                          />
                          
                          {/* Gradiente do Anel */}
                          <defs>
                            <linearGradient id="grad-ring" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="var(--gold)" />
                              <stop offset="100%" stopColor="var(--rose)" />
                            </linearGradient>
                          </defs>
                        </svg>

                        {/* Conteúdo no centro do anel */}
                        <div className="flex flex-col items-center text-center z-10">
                          <span className="text-[10px] font-sans text-brandMuted uppercase tracking-widest font-bold">Decorrendo</span>
                          <span className="text-3xl font-serif font-bold text-brandWine tracking-tight mt-1">
                            {formatHM(elapsedHours(currentFast, now))}
                          </span>
                          <span className="text-[9px] font-sans bg-brandBlush/50 text-brandRose px-2 py-0.5 rounded-full mt-2 font-bold uppercase tracking-wider">
                            Meta: {currentFast.targetHours}h
                          </span>
                        </div>
                      </div>

                      {/* Estágio metabólico atual com animação de fade suave */}
                      <div className="mt-8 text-center px-4 max-w-sm">
                        <span className="text-[9px] font-sans font-bold tracking-widest text-brandGold uppercase block mb-1">
                          Estágio Metabólico
                        </span>
                        <h4 className="font-serif font-bold text-brandWine text-base transition-colors duration-500">
                          {currentStage(elapsedHours(currentFast, now)).label}
                        </h4>
                        <p className="text-xs font-sans text-brandMuted leading-relaxed mt-1 transition-all duration-500">
                          {currentStage(elapsedHours(currentFast, now)).desc}
                        </p>
                      </div>

                      {/* Botão de Encerrar Jejum */}
                      <button
                        onClick={handleEndFast}
                        className="mt-8 px-8 py-3.5 bg-brandRose hover:bg-brandWine text-white font-sans font-bold text-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] duration-300"
                      >
                        ENCERRAR JEJUM
                      </button>
                    </div>
                  )}
                </div>

                {/* ESTÁGIOS METABÓLICOS DE JEJUM — GUIA INFORMATIVO */}
                <div className="premium-card p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#E8D5D9]">
                    <Activity className="w-5 h-5 text-brandRose" />
                    <h4 className="font-serif font-bold text-brandWine text-base">O que acontece com o corpo?</h4>
                  </div>
                  <div className="relative pl-3 border-l border-[#E8D5D9] space-y-5">
                    {FASTING_STAGES.map((stg, index) => {
                      const isReached = currentFast && elapsedHours(currentFast, now) >= stg.fromHours;
                      return (
                        <div key={index} className="relative">
                          {/* Indicador no eixo temporal */}
                          <div className={`absolute left-[-17px] top-1.5 w-2 h-2 rounded-full border-2 bg-white ${
                            isReached ? 'border-brandRose bg-brandRose shadow-sm scale-125' : 'border-[#E8D5D9]'
                          }`} />
                          
                          <div className="flex justify-between items-center mb-0.5">
                            <span className={`text-xs font-bold font-sans ${isReached ? 'text-brandRose' : 'text-brandWine'}`}>
                              {stg.label}
                            </span>
                            <span className="text-[10px] font-sans text-brandGold font-bold">
                              {stg.fromHours === 0 ? 'Imediato' : `+${stg.fromHours}h`}
                            </span>
                          </div>
                          <p className="text-xs font-sans text-brandMuted leading-relaxed">{stg.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* HISTÓRICO DE JEJUNS */}
                <div className="premium-card p-5 space-y-3">
                  <h4 className="font-serif font-bold text-brandWine text-base">Últimos Jejuns Concluídos</h4>
                  
                  {state.fastHistory.length === 0 ? (
                    <p className="text-xs font-sans text-brandMuted italic py-2">Nenhum jejum registrado ainda.</p>
                  ) : (
                    <div className="divide-y divide-[#E8D5D9]">
                      {state.fastHistory.slice(0, 3).map((hist) => {
                        const dateObj = new Date(hist.startISO);
                        const hoursCompleted = elapsedHours(hist);
                        const isMet = hoursCompleted >= hist.targetHours;
                        return (
                          <div key={hist.id} className="py-2.5 flex justify-between items-center text-xs">
                            <div>
                              <span className="font-sans font-bold text-brandWine block">
                                Jejum de {hist.targetHours}h
                              </span>
                              <span className="text-[10px] font-sans text-brandMuted">
                                {dateObj.toLocaleDateString('pt-BR')} às {dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className={`font-serif font-bold block ${isMet ? 'text-brandSuccess' : 'text-brandMuted'}`}>
                                {formatHM(hoursCompleted)}
                              </span>
                              <span className="text-[9px] font-sans font-bold uppercase tracking-wider opacity-75">
                                {isMet ? 'Concluído ✓' : 'Incompleto'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB-3: ACOMPANHAMENTO DE {plan.duration} DIAS */}
            {activeTab === 'acompanhamento' && (
              <div className="space-y-6">
                
                {/* Streak e Progresso de Dias */}
                <div className="bg-gradient-to-tr from-brandRose to-brandWine text-white rounded-3xl p-5 shadow-premium flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-sans font-bold bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Ritmo e Consistência
                    </span>
                    <h3 className="text-xl font-serif font-bold pt-1">Streak Concluído</h3>
                    <p className="text-[11px] font-sans text-white/80">Continue firme na meta de {plan.duration} dias.</p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-white/10 px-4 py-3 rounded-2xl border border-white/15">
                    <Flame className="w-8 h-8 text-brandGold animate-pulse shrink-0" />
                    <div className="text-center">
                      <span className="text-2xl font-serif font-bold block leading-none">{getStreak()}</span>
                      <span className="text-[8px] font-sans uppercase tracking-wider font-bold">Dias 🔥</span>
                    </div>
                  </div>
                </div>

                {/* Grade de {plan.duration} Dias */}
                <div className="premium-card p-5 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E8D5D9]">
                    <h4 className="font-serif font-bold text-brandWine text-base">Progresso {plan.duration} Dias</h4>
                    <span className="text-[11px] font-sans text-brandMuted">
                      {state.dayLogs.filter(l => l.fastCompleted).length} de {plan.duration} concluídos
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2.5 py-1">
                    {state.dayLogs.map((day, idx) => {
                      const todayStr = new Date().toISOString().split('T')[0];
                      const isToday = day.date === todayStr;
                      return (
                        <div key={day.date} className="flex flex-col items-center">
                          <div className={`w-9 h-9 rounded-full font-sans text-xs font-bold flex items-center justify-center transition-all ${
                            day.fastCompleted
                              ? 'bg-brandSuccess text-white'
                              : isToday
                              ? 'border-2 border-brandRose bg-[#FDF0F4] text-brandRose scale-105 shadow-sm'
                              : 'bg-brandCream border border-[#E8D5D9] text-brandMuted'
                          }`}>
                            {day.fastCompleted ? '✓' : idx + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Check-in Diário */}
                <div className="premium-card p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#E8D5D9]">
                    <Scale className="w-5 h-5 text-brandRose" />
                    <h4 className="font-serif font-bold text-brandWine text-base">Check-in de Hoje</h4>
                  </div>
                  
                  <div className="space-y-3.5">
                    <div>
                      <label htmlFor="weight" className="block text-[11px] font-sans font-bold text-brandMuted uppercase tracking-wider mb-1 px-1">
                        Peso de Hoje (opcional)
                      </label>
                      <div className="relative">
                        <input
                          id="weight"
                          type="number"
                          step="0.1"
                          value={checkinWeight}
                          onChange={(e) => setCheckinWeight(e.target.value)}
                          placeholder="Ex: 71.5"
                          className="w-full px-4 py-3 rounded-full border border-[#E8D5D9] bg-white text-brandDark focus:outline-none focus:border-brandRose font-sans text-xs"
                        />
                        <span className="absolute right-4 top-3 text-xs font-sans text-brandMuted">kg</span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="notes" className="block text-[11px] font-sans font-bold text-brandMuted uppercase tracking-wider mb-1 px-1">
                        Notas e Sentimentos (opcional)
                      </label>
                      <textarea
                        id="notes"
                        rows={2}
                        value={checkinNote}
                        onChange={(e) => setCheckinNote(e.target.value)}
                        placeholder="Ex: Senti muita disposição à tarde e bebi bastante chá."
                        className="w-full px-4 py-3 rounded-2xl border border-[#E8D5D9] bg-white text-brandDark focus:outline-none focus:border-brandRose font-sans text-xs resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSaveCheckin}
                      className="w-full py-3 bg-brandRose hover:bg-brandWine text-white font-sans font-bold text-xs rounded-full shadow-md transition-colors"
                    >
                      Salvar Check-in
                    </button>

                    {checkinSuccess && (
                      <div className="p-2.5 bg-[#F0FDF4] border border-brandSuccess/25 text-brandSuccess rounded-xl font-sans text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-pulse">
                        <Check className="w-4 h-4" />
                        Check-in registrado com sucesso!
                      </div>
                    )}
                  </div>
                </div>

                {/* Gráfico da evolução do peso */}
                {renderWeightGraph()}
              </div>
            )}

            {/* TAB-4: CONTEÚDOS E GUIAS BÔNUS */}
            {activeTab === 'conteudos' && (
              <div className="space-y-6">
                
                {/* Lendo um Guia Ativo */}
                {activeGuideId ? (
                  <div className="space-y-5 bg-white border border-[#E8D5D9] rounded-3xl p-5 shadow-premium">
                    
                    {/* Botão Voltar */}
                    <button
                      onClick={() => setActiveGuideId(null)}
                      className="text-xs font-sans font-bold text-brandRose uppercase tracking-wider flex items-center gap-1 hover:text-brandWine transition-colors duration-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Voltar aos Guias
                    </button>

                    {/* Detalhes do Guia */}
                    {(() => {
                      const guide = GUIDES.find(g => g.id === activeGuideId);
                      if (!guide) return null;
                      return (
                        <article className="space-y-6">
                          <div>
                            <span className="text-[10px] font-sans font-bold tracking-widest text-brandGold uppercase block">
                              {guide.category === 'ciencia' ? 'Ciência e Teoria' : guide.category === 'nutricao' ? 'Nutrição e Compras' : 'Guia Bônus'}
                            </span>
                            <h2 className="text-2xl font-serif font-bold text-brandWine tracking-tight mt-1">{guide.title}</h2>
                            <p className="text-xs font-sans text-brandMuted italic mt-0.5">{guide.subtitle}</p>
                          </div>

                          <div className="space-y-5 divide-y divide-[#E8D5D9]/70">
                            {guide.sections.map((sec, sIdx) => (
                              <section key={sIdx} className={`space-y-2 ${sIdx > 0 ? 'pt-4' : ''}`}>
                                <h3 className="font-serif font-bold text-brandWine text-sm flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-brandBlush/40 text-brandRose text-[10px] font-sans font-bold flex items-center justify-center">
                                    {sIdx + 1}
                                  </span>
                                  {sec.heading}
                                </h3>
                                <div className="text-xs font-sans text-brandMuted leading-relaxed pl-7 whitespace-pre-line">
                                  {sec.body}
                                </div>
                              </section>
                            ))}
                          </div>
                        </article>
                      );
                    })()}
                  </div>
                ) : (
                  /* Lista de Guias e FAQ */
                  <div className="space-y-8 animate-fade-in">
                    
                    {/* Header */}
                    <div>
                      <span className="text-[10px] font-sans font-bold tracking-widest text-brandGold uppercase block">Biblioteca Integrada</span>
                      <h3 className="text-2xl font-serif font-bold text-brandWine leading-tight mt-0.5">Sua Biblioteca de Saúde</h3>
                      <p className="text-xs font-sans text-brandMuted leading-relaxed mt-1">
                        Aprenda a ciência, nutrição e mentalidade para potencializar seu acompanhamento de {plan.duration} dias.
                      </p>
                    </div>

                    {/* Filtros de Categoria */}
                    <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
                      {([
                        { id: 'todos', label: 'Todos' },
                        { id: 'guia', label: 'Guias Práticos' },
                        { id: 'ciencia', label: 'Ciência 40+' },
                        { id: 'nutricao', label: 'Alimentação' },
                      ] as const).map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setContentFilter(cat.id)}
                          className={`px-4 py-2 rounded-full font-sans text-xs font-bold transition-all duration-300 border whitespace-nowrap shrink-0 ${
                            contentFilter === cat.id
                              ? 'bg-brandRose border-brandRose text-white shadow-sm'
                              : 'bg-white border-[#E8D5D9] text-brandMuted hover:border-brandRose/50'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Lista de Guias Filtrada */}
                    <div className="space-y-3.5">
                      {(() => {
                        const filteredGuides = GUIDES.filter(
                          (g) => contentFilter === 'todos' || g.category === contentFilter
                        );
                        if (filteredGuides.length === 0) {
                          return (
                            <p className="text-xs font-sans text-brandMuted text-center py-6">
                              Nenhum guia encontrado nesta categoria.
                            </p>
                          );
                        }
                        return filteredGuides.map((guide) => (
                          <button
                            key={guide.id}
                            onClick={() => setActiveGuideId(guide.id)}
                            className="w-full text-left bg-white border border-[#E8D5D9] rounded-2xl p-4 shadow-sm hover:shadow-premium hover:border-brandRose duration-300 transition-all flex justify-between items-center gap-4 group"
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{guide.icon}</span>
                                <span className="text-[9px] font-sans font-bold tracking-widest text-brandGold uppercase">
                                  {guide.category === 'ciencia' ? 'Ciência' : guide.category === 'nutricao' ? 'Nutrição' : 'Prático'}
                                </span>
                              </div>
                              <h4 className="font-serif font-bold text-brandWine text-base group-hover:text-brandRose duration-200 mt-1">
                                {guide.title}
                              </h4>
                              <p className="text-xs font-sans text-brandMuted leading-snug line-clamp-2">
                                {guide.subtitle}
                              </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-brandCream text-brandRose flex items-center justify-center shrink-0 group-hover:bg-brandRose group-hover:text-white duration-300 shadow-sm">
                              <ChevronRight className="w-4.5 h-4.5" />
                            </div>
                          </button>
                        ));
                      })()}
                    </div>

                    {/* Seção FAQ */}
                    <div className="pt-6 border-t border-[#E8D5D9]/70 space-y-4">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-brandRose" />
                        <h4 className="font-serif font-bold text-brandWine text-lg">Perguntas Frequentes</h4>
                      </div>
                      <p className="text-xs font-sans text-brandMuted leading-relaxed">
                        Tire suas dúvidas sobre o jejum intermitente e entenda o funcionamento científico.
                      </p>

                      <div className="space-y-3 pt-2">
                        {FAQ_ITEMS.map((faq, index) => {
                          const isOpen = openFaqIndex === index;
                          return (
                            <div 
                              key={index}
                              className="bg-white border border-[#E8D5D9] rounded-2xl overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300"
                            >
                              <button
                                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 text-brandWine hover:text-brandRose transition-colors duration-200"
                              >
                                <span className="font-serif font-bold text-sm leading-snug">{faq.question}</span>
                                <ChevronDown 
                                  className={`w-4 h-4 text-brandMuted transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-brandRose' : ''}`}
                                />
                              </button>
                              
                              {isOpen && (
                                <div className="px-5 pb-5 pt-1 border-t border-[#E8D5D9]/30 text-xs font-sans text-brandMuted leading-relaxed animate-fade-in">
                                  {faq.answer}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}
          </main>

          {/* Barra de Navegação Inferior */}
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#E8D5D9] grid grid-cols-4 py-2 px-1 z-30 shadow-[0_-5px_20px_-10px_rgba(160,53,90,0.1)]">
            <button
              onClick={() => { setActiveTab('plano'); setActiveGuideId(null); }}
              className={`flex flex-col items-center gap-1 py-1.5 rounded-xl font-sans text-[10px] font-bold ${
                activeTab === 'plano' ? 'text-brandRose' : 'text-brandMuted hover:text-brandRose/70'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Plano</span>
            </button>
            
            <button
              onClick={() => { setActiveTab('jejum'); setActiveGuideId(null); }}
              className={`flex flex-col items-center gap-1 py-1.5 rounded-xl font-sans text-[10px] font-bold ${
                activeTab === 'jejum' ? 'text-brandRose' : 'text-brandMuted hover:text-brandRose/70'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span>Jejum</span>
            </button>

            <button
              onClick={() => { setActiveTab('acompanhamento'); setActiveGuideId(null); }}
              className={`flex flex-col items-center gap-1 py-1.5 rounded-xl font-sans text-[10px] font-bold ${
                activeTab === 'acompanhamento' ? 'text-brandRose' : 'text-brandMuted hover:text-brandRose/70'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Progresso</span>
            </button>

            <button
              onClick={() => { setActiveTab('conteudos'); }}
              className={`flex flex-col items-center gap-1 py-1.5 rounded-xl font-sans text-[10px] font-bold ${
                activeTab === 'conteudos' ? 'text-brandRose' : 'text-brandMuted hover:text-brandRose/70'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Guias</span>
            </button>
          </nav>

        </div>
      )}

    </div>
  );
}
