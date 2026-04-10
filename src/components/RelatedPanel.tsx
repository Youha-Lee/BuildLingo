import React from 'react';
import { ArrowRight, Layers, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Term } from '@/src/types';
import { motion } from 'motion/react';

interface RelatedPanelProps {
  term: Term;
  onSelectTerm: (id: string) => void;
  allTerms: Term[];
}

export function RelatedPanel({ term, onSelectTerm, allTerms }: RelatedPanelProps) {
  const similarTermsData = allTerms.filter(t => term.similarTerms.includes(t.term) || term.similarTerms.includes(t.id));
  const relatedTermsData = allTerms.filter(t => term.relatedTerms.includes(t.term) || term.relatedTerms.includes(t.id));

  return (
    <div className="w-80 space-y-6 hidden xl:block">
      <Card className="border-none shadow-lg shadow-slate-200/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Layers className="w-4 h-4" />
            유사 개념 비교
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {similarTermsData.length > 0 ? (
            similarTermsData.map((st) => (
              <motion.button
                key={st.id}
                whileHover={{ x: 4 }}
                onClick={() => onSelectTerm(st.id)}
                className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{st.term}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {st.simpleExplanation}
                </p>
              </motion.button>
            ))
          ) : (
            <div className="py-8 text-center">
              <AlertCircle className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-xs text-slate-400">유사 개념 데이터가 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg shadow-slate-200/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            관련 용어 추천
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {term.relatedTerms.map((rt) => (
              <Badge 
                key={rt} 
                variant="outline" 
                className="px-3 py-1.5 rounded-lg border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-all"
              >
                {rt}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none bg-slate-900 text-white shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <CardHeader>
          <CardTitle className="text-lg font-bold">Study Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-300 leading-relaxed">
            {term.term}은(는) {term.category} 분야의 핵심 개념입니다. 
            실무에서는 특히 {term.relatedTerms[0] || '관련 공정'}과의 인터페이스 관리가 매우 중요하게 다뤄집니다.
          </p>
          <Button variant="link" className="text-blue-400 p-0 h-auto mt-4 hover:text-blue-300">
            Learn more about {term.category}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
