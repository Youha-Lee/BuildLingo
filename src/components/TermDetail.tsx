import React, { useState } from 'react';
import { Sparkles, Star, Share2, Copy, Bookmark, Info, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Term, ExplanationMode } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';

interface TermDetailProps {
  term: Term;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
  onGenerateAI: (term: string) => void;
  isGeneratingAI: boolean;
  aiExplanation: string | null;
}

export function TermDetail({ 
  term, 
  isFavorite, 
  toggleFavorite, 
  onGenerateAI, 
  isGeneratingAI,
  aiExplanation 
}: TermDetailProps) {
  const [mode, setMode] = useState<ExplanationMode>('undergraduate');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="h-2 bg-blue-600" />
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="secondary" className="mb-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">
                  {term.category}
                </Badge>
                <CardTitle className="text-4xl font-bold tracking-tight text-slate-900 flex items-baseline gap-3">
                  {term.term}
                  <span className="text-xl font-medium text-slate-400">{term.korean}</span>
                </CardTitle>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => toggleFavorite(term.id)}
                  className={isFavorite ? "text-yellow-500 border-yellow-200 bg-yellow-50" : "text-slate-400"}
                >
                  <Star className={isFavorite ? "fill-current" : ""} />
                </Button>
                <Button variant="outline" size="icon" className="text-slate-400">
                  <Share2 />
                </Button>
              </div>
            </div>
            <CardDescription className="text-lg text-slate-600 mt-4 leading-relaxed">
              {term.definition}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center gap-2 mb-3 text-blue-600">
                <Info className="w-5 h-5" />
                <h3 className="font-bold">한 줄 요약</h3>
              </div>
              <p className="text-slate-700 text-lg leading-relaxed">
                {term.simpleExplanation}
              </p>
            </div>

            <Tabs defaultValue="undergraduate" onValueChange={(v) => setMode(v as ExplanationMode)} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Contextual Explanations</h3>
                <TabsList className="bg-slate-100/50 p-1">
                  <TabsTrigger value="undergraduate" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">학부생</TabsTrigger>
                  <TabsTrigger value="graduate" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">대학원생</TabsTrigger>
                  <TabsTrigger value="practical" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">실무자</TabsTrigger>
                  <TabsTrigger value="academic" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">연구자</TabsTrigger>
                </TabsList>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="undergraduate" className="mt-0">
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-700 leading-relaxed text-lg">{term.undergraduateExplanation}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="graduate" className="mt-0">
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-700 leading-relaxed text-lg">{term.graduateExplanation}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="practical" className="mt-0">
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-700 leading-relaxed text-lg">{term.practicalExplanation}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="academic" className="mt-0">
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-700 leading-relaxed text-lg">{term.academicExplanation}</p>
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Example Usage</h3>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Sentence
                </Button>
              </div>
              <div className="p-6 bg-slate-900 rounded-2xl text-slate-100 font-mono text-sm leading-relaxed relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <p className="relative z-10">"{term.exampleSentence}"</p>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={() => onGenerateAI(term.term)}
                disabled={isGeneratingAI}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {isGeneratingAI ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    AI가 심층 분석 중...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5" />
                    AI 심층 설명 및 최신 트렌드 생성하기
                  </div>
                )}
              </Button>

              {aiExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-6 bg-indigo-50 rounded-2xl border border-indigo-100"
                >
                  <div className="flex items-center gap-2 mb-4 text-indigo-700">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="font-bold">AI Insights</h3>
                  </div>
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {aiExplanation}
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
