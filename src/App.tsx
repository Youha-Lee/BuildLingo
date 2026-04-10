import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TermDetail } from './components/TermDetail';
import { RelatedPanel } from './components/RelatedPanel';
import { StudyStatus } from './components/StudyStatus';
import { TERMS } from './data';
import { Term, SearchHistory } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Search as SearchIcon, BookOpen, LayoutDashboard } from 'lucide-react';
import { generateDeepExplanation } from './services/geminiService';
import { TooltipProvider } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});

  // Filter terms based on search query
  const filteredTerms = useMemo(() => {
    if (!searchQuery) return [];
    const lowerQuery = searchQuery.toLowerCase();
    return TERMS.filter(
      (t) =>
        t.term.toLowerCase().includes(lowerQuery) ||
        t.korean.includes(lowerQuery) ||
        t.category.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const selectedTerm = useMemo(() => {
    return TERMS.find((t) => t.id === selectedTermId) || null;
  }, [selectedTermId]);

  const favoriteTerms = useMemo(() => {
    return TERMS.filter((t) => favorites.includes(t.id));
  }, [favorites]);

  const recentTerms = useMemo(() => {
    const termIds = Array.from(new Set(history.map((h) => h.termId))).slice(0, 10);
    return TERMS.filter((t) => termIds.includes(t.id));
  }, [history]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleSelectTerm = (id: string) => {
    setSelectedTermId(id);
    setSearchQuery('');
    setActiveTab('search');
    
    // Add to history
    setHistory((prev) => [
      { id: Math.random().toString(36).substr(2, 9), termId: id, timestamp: Date.now() },
      ...prev.filter(h => h.termId !== id)
    ].slice(0, 20));
  };

  const handleGenerateAI = async (term: string) => {
    if (!selectedTermId) return;
    setIsGeneratingAI(true);
    const explanation = await generateDeepExplanation(term);
    setAiExplanations(prev => ({ ...prev, [selectedTermId]: explanation }));
    setIsGeneratingAI(false);
  };

  // Initial view
  useEffect(() => {
    if (!selectedTermId && TERMS.length > 0) {
      // setSelectedTermId(TERMS[0].id);
    }
  }, []);

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          
          <main className="flex-1 overflow-hidden flex">
            <ScrollArea className="flex-1">
              <div className="p-8 max-w-5xl mx-auto w-full">
                
                {/* Search Results Overlay */}
                <AnimatePresence>
                  {searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute inset-x-0 top-0 z-20 p-8 bg-slate-50/95 backdrop-blur-sm min-h-full"
                    >
                      <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-bold flex items-center gap-2">
                            <SearchIcon className="w-6 h-6 text-blue-600" />
                            "{searchQuery}" 검색 결과
                          </h2>
                          <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 font-medium">닫기</button>
                        </div>
                        
                        {filteredTerms.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredTerms.map((term) => (
                              <Card 
                                key={term.id} 
                                className="group cursor-pointer hover:border-blue-300 hover:shadow-md transition-all border-slate-200"
                                onClick={() => handleSelectTerm(term.id)}
                              >
                                <CardContent className="p-5">
                                  <div className="flex justify-between items-start mb-2">
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                      {term.category}
                                    </Badge>
                                  </div>
                                  <h3 className="text-xl font-bold mb-1 group-hover:text-blue-600 transition-colors">{term.term}</h3>
                                  <p className="text-sm text-slate-500 mb-3">{term.korean}</p>
                                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{term.simpleExplanation}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <SearchIcon className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-medium">검색 결과가 없습니다.</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {activeTab === 'home' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, Youha!</h1>
                        <p className="text-slate-500 mt-1">오늘도 건설 전문가를 향해 한 걸음 더 나아가볼까요?</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Current Date</p>
                        <p className="text-lg font-bold text-slate-900">April 10, 2026</p>
                      </div>
                    </div>

                    <StudyStatus />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <section>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-bold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            최근 학습한 용어
                          </h2>
                          <button onClick={() => setActiveTab('recent')} className="text-sm font-bold text-blue-600 hover:underline">전체보기</button>
                        </div>
                        <div className="space-y-3">
                          {recentTerms.length > 0 ? (
                            recentTerms.slice(0, 4).map(term => (
                              <div 
                                key={term.id}
                                onClick={() => handleSelectTerm(term.id)}
                                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm cursor-pointer transition-all group"
                              >
                                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                  <BookOpen className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{term.term}</h3>
                                  <p className="text-xs text-slate-500">{term.korean}</p>
                                </div>
                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-slate-200">
                                  {term.category}
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
                              <p className="text-sm text-slate-400">최근 학습 기록이 없습니다.</p>
                            </div>
                          )}
                        </div>
                      </section>

                      <section>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-bold flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            즐겨찾기
                          </h2>
                          <button onClick={() => setActiveTab('favorites')} className="text-sm font-bold text-blue-600 hover:underline">전체보기</button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {favoriteTerms.length > 0 ? (
                            favoriteTerms.slice(0, 4).map(term => (
                              <div 
                                key={term.id}
                                onClick={() => handleSelectTerm(term.id)}
                                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm cursor-pointer transition-all group"
                              >
                                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-500">
                                  <Star className="w-5 h-5 fill-current" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{term.term}</h3>
                                  <p className="text-xs text-slate-500">{term.korean}</p>
                                </div>
                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-slate-200">
                                  {term.category}
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
                              <p className="text-sm text-slate-400">즐겨찾기한 용어가 없습니다.</p>
                            </div>
                          )}
                        </div>
                      </section>
                    </div>

                    <section>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-indigo-600" />
                        추천 학습 용어
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {TERMS.slice(0, 3).map(term => (
                          <Card 
                            key={term.id}
                            className="border-none shadow-md hover:shadow-lg transition-all cursor-pointer group"
                            onClick={() => handleSelectTerm(term.id)}
                          >
                            <CardContent className="p-6">
                              <Badge className="mb-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none">
                                {term.category}
                              </Badge>
                              <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{term.term}</h3>
                              <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{term.simpleExplanation}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === 'search' && (
                  <div className="space-y-6">
                    {selectedTerm ? (
                      <TermDetail 
                        term={selectedTerm} 
                        isFavorite={favorites.includes(selectedTerm.id)}
                        toggleFavorite={toggleFavorite}
                        onGenerateAI={handleGenerateAI}
                        isGeneratingAI={isGeneratingAI}
                        aiExplanation={aiExplanations[selectedTerm.id] || null}
                      />
                    ) : (
                      <div className="py-40 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <SearchIcon className="w-10 h-10 text-blue-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">학습할 용어를 검색해보세요</h2>
                        <p className="text-slate-500">상단 검색창에 용어를 입력하거나 추천 용어를 선택하세요.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'favorites' && (
                  <div className="space-y-6">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Favorites</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favoriteTerms.map(term => (
                        <Card 
                          key={term.id}
                          className="cursor-pointer hover:border-blue-300 transition-all"
                          onClick={() => handleSelectTerm(term.id)}
                        >
                          <CardContent className="p-5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-500">
                              <Star className="w-6 h-6 fill-current" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg">{term.term}</h3>
                              <p className="text-sm text-slate-500">{term.korean}</p>
                            </div>
                            <Badge variant="secondary">{term.category}</Badge>
                          </CardContent>
                        </Card>
                      ))}
                      {favoriteTerms.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                          <p className="text-slate-400">즐겨찾기한 용어가 없습니다.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'recent' && (
                  <div className="space-y-6">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Recent History</h1>
                    <div className="space-y-3">
                      {recentTerms.map(term => (
                        <div 
                          key={term.id}
                          onClick={() => handleSelectTerm(term.id)}
                          className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md cursor-pointer transition-all group"
                        >
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <Clock className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{term.term}</h3>
                            <p className="text-sm text-slate-500">{term.korean}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">{term.category}</Badge>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last viewed</p>
                          </div>
                        </div>
                      ))}
                      {recentTerms.length === 0 && (
                        <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                          <p className="text-slate-400">최근 학습 기록이 없습니다.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'status' && (
                  <div className="space-y-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Study Status</h1>
                    <StudyStatus />
                    <Card className="border-none shadow-lg">
                      <CardContent className="p-8">
                        <h3 className="text-xl font-bold mb-6">분야별 학습 진척도</h3>
                        <div className="space-y-6">
                          {[
                            { label: 'BIM / Digital Construction', progress: 45, color: 'bg-blue-600' },
                            { label: 'Construction Management', progress: 72, color: 'bg-indigo-600' },
                            { label: 'Structural Engineering', progress: 28, color: 'bg-slate-800' },
                            { label: 'Building Materials', progress: 60, color: 'bg-green-600' },
                          ].map(item => (
                            <div key={item.label} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-slate-700">{item.label}</span>
                                <span className="text-sm font-bold text-slate-900">{item.progress}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.progress}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

              </div>
            </ScrollArea>

            {activeTab === 'search' && selectedTerm && (
              <ScrollArea className="border-l bg-white/50">
                <div className="p-8">
                  <RelatedPanel 
                    term={selectedTerm} 
                    onSelectTerm={handleSelectTerm}
                    allTerms={TERMS}
                  />
                </div>
              </ScrollArea>
            )}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
