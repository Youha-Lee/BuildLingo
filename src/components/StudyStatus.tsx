import React from 'react';
import { Trophy, Target, Flame, Calendar, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function StudyStatus() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="border-none shadow-lg shadow-slate-200/50 bg-white overflow-hidden group">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">오늘의 학습량</CardTitle>
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Target className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 mb-2">12 / 20</div>
          <p className="text-xs text-slate-500 mb-4">목표 달성까지 8개 남았습니다.</p>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
              <span>Progress</span>
              <span>60%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg shadow-slate-200/50 bg-white overflow-hidden group">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">학습 연속 일수</CardTitle>
          <div className="p-2 bg-orange-50 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <Flame className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 mb-2">7 Days</div>
          <p className="text-xs text-slate-500 mb-4">일주일 연속 학습 중! 대단해요.</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-1.5 flex-1 bg-orange-500 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg shadow-slate-200/50 bg-white overflow-hidden group">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">마스터한 용어</CardTitle>
          <div className="p-2 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <Trophy className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 mb-2">156</div>
          <p className="text-xs text-slate-500 mb-4">전체 용어의 12%를 마스터했습니다.</p>
          <button className="text-xs font-bold text-blue-600 flex items-center hover:underline">
            상세 리포트 보기
            <ArrowUpRight className="w-3 h-3 ml-1" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
