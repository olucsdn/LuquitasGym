import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { TrendingUp, Dumbbell, Calendar, Award, Filter } from 'lucide-react';
import { SYSTEM_WORKOUTS } from '../lib/workoutData';

export default function Analytics({ sessions = [] }) {
  // Lista todos os exercícios únicos do sistema
  const allExercises = useMemo(() => {
    const map = new Map();
    SYSTEM_WORKOUTS.forEach(w => {
      w.exercises.forEach(ex => {
        if (!map.has(ex.name)) {
          map.set(ex.name, ex);
        }
      });
    });
    return Array.from(map.values());
  }, []);

  const [selectedExerciseName, setSelectedExerciseName] = useState(
    allExercises[0]?.name || 'Puxada frontal com triângulo (pegada neutra)'
  );

  // Evolução de Carga Máxima por Sessão para o exercício selecionado
  const maxWeightData = useMemo(() => {
    if (!sessions || sessions.length === 0) return [];

    // Ordena do mais antigo para o mais recente
    const sorted = [...sessions].sort((a, b) => new Date(a.completed_at) - new Date(b.completed_at));

    const points = [];
    sorted.forEach((sess) => {
      const dateLabel = new Date(sess.completed_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const logs = (sess.set_logs || []).filter(
        (l) => {
          // Acha o nome do exercício
          const exObj = allExercises.find(e => e.id === l.exercise_id);
          return (exObj?.name === selectedExerciseName || l.exercise_name === selectedExerciseName) && l.completed;
        }
      );

      if (logs.length > 0) {
        const maxWeight = Math.max(...logs.map(l => Number(l.weight_kg) || 0));
        const maxReps = Math.max(...logs.map(l => Number(l.reps) || 0));
        const volume = logs.reduce((acc, l) => acc + ((Number(l.weight_kg) || 0) * (Number(l.reps) || 0)), 0);

        points.push({
          date: dateLabel,
          maxWeight,
          maxReps,
          volume
        });
      }
    });

    return points;
  }, [sessions, selectedExerciseName, allExercises]);

  // Volume Total por Sessão (todas as sessões)
  const volumeHistoryData = useMemo(() => {
    if (!sessions || sessions.length === 0) return [];
    const sorted = [...sessions].sort((a, b) => new Date(a.completed_at) - new Date(b.completed_at));

    return sorted.map((sess) => {
      const dateLabel = new Date(sess.completed_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const totalVol = (sess.set_logs || []).reduce((acc, l) => {
        return acc + ((Number(l.weight_kg) || 0) * (Number(l.reps) || 0));
      }, 0);

      return {
        date: dateLabel,
        volume: totalVol
      };
    });
  }, [sessions]);

  // Métricas gerais
  const totalVolumeAllTime = useMemo(() => {
    return sessions.reduce((acc, s) => {
      return acc + (s.set_logs || []).reduce((sum, l) => sum + ((Number(l.weight_kg) || 0) * (Number(l.reps) || 0)), 0);
    }, 0);
  }, [sessions]);

  const maxWeightPr = useMemo(() => {
    if (maxWeightData.length === 0) return 0;
    return Math.max(...maxWeightData.map(d => d.maxWeight));
  }, [maxWeightData]);

  return (
    <div className="max-w-4xl w-full mx-auto space-y-4 sm:space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-[#18181C] border border-[#2A2A32] rounded-2xl p-4 sm:p-6">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <TrendingUp size={22} className="text-[#10B981]" />
            Evolução de Cargas & Volume
          </h1>
          <p className="text-xs text-gym-muted mt-1">
            Rastreamento de sobrecarga progressiva e tonelagem total movimentada.
          </p>
        </div>

        {/* Seletor de Exercício Responsivo com Truncate */}
        <div className="flex items-center gap-2 w-full sm:w-auto max-w-full">
          <Filter size={16} className="text-gym-muted shrink-0" />
          <select
            value={selectedExerciseName}
            onChange={(e) => setSelectedExerciseName(e.target.value)}
            className="flex-1 sm:w-72 md:w-80 max-w-[calc(100vw-80px)] sm:max-w-xs truncate bg-[#0F0F12] border border-[#2A2A32] text-white text-xs font-bold rounded-xl px-3 py-2.5 outline-none focus:border-[#10B981]"
          >
            {allExercises.map((ex) => (
              <option key={ex.name} value={ex.name} className="bg-[#18181C] text-white">
                {ex.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards de KPIs Rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#18181C] border border-[#2A2A32] rounded-xl p-4">
          <div className="flex items-center gap-2 text-gym-muted text-xs mb-1">
            <Calendar size={14} /> Treinos Concluídos
          </div>
          <div className="text-2xl font-black text-white">{sessions.length}</div>
        </div>

        <div className="bg-[#18181C] border border-[#2A2A32] rounded-xl p-4">
          <div className="flex items-center gap-2 text-[#F97316] text-xs mb-1">
            <Award size={14} /> Recorde (PR) no Alvo
          </div>
          <div className="text-2xl font-black text-white">
            {maxWeightPr} <span className="text-xs font-normal text-gym-muted">kg</span>
          </div>
        </div>

        <div className="bg-[#18181C] border border-[#2A2A32] rounded-xl p-4">
          <div className="flex items-center gap-2 text-[#10B981] text-xs mb-1">
            <Dumbbell size={14} /> Tonelagem Total
          </div>
          <div className="text-2xl font-black text-white">
            {Math.round(totalVolumeAllTime / 1000)} <span className="text-xs font-normal text-gym-muted">toneladas</span>
          </div>
        </div>

        <div className="bg-[#18181C] border border-[#2A2A32] rounded-xl p-4">
          <div className="flex items-center gap-2 text-gym-muted text-xs mb-1">
            <TrendingUp size={14} /> Exercício Ativo
          </div>
          <div className="text-xs font-bold text-white truncate" title={selectedExerciseName}>
            {selectedExerciseName}
          </div>
        </div>
      </div>

      {/* Gráfico 1: Evolução de Carga Máxima (kg) */}
      <div className="bg-[#18181C] border border-[#2A2A32] rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span>Progressão de Carga Máxima (kg)</span>
          <span className="text-xs font-semibold text-[#10B981] truncate max-w-full sm:max-w-[280px]" title={selectedExerciseName}>
            {selectedExerciseName}
          </span>
        </h2>
        <p className="text-xs text-gym-muted mb-4">Carga mais alta levantada em cada treino registrado.</p>

        {maxWeightData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={maxWeightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A32" />
                <XAxis dataKey="date" stroke="#A1A1AA" fontSize={11} />
                <YAxis stroke="#A1A1AA" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F0F12', borderColor: '#2A2A32', borderRadius: '12px' }}
                  labelStyle={{ color: '#F4F4F5', fontWeight: 'bold' }}
                />
                <Line
                  type="monotone"
                  dataKey="maxWeight"
                  name="Carga (kg)"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 5 }}
                  activeDot={{ r: 8, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-44 flex flex-col items-center justify-center border border-dashed border-[#2A2A32] rounded-xl text-gym-muted text-xs">
            <Dumbbell size={28} className="mb-2 opacity-40" />
            Nenhuma série registrada ainda para este exercício. Conclua seu primeiro treino!
          </div>
        )}
      </div>

      {/* Gráfico 2: Volume Total por Sessão */}
      <div className="bg-[#18181C] border border-[#2A2A32] rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-1">Volume Total de Treino (kg acumulados)</h2>
        <p className="text-xs text-gym-muted mb-4">Somatório de (Séries × Reps × Peso) por dia treinado.</p>

        {volumeHistoryData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A32" />
                <XAxis dataKey="date" stroke="#A1A1AA" fontSize={11} />
                <YAxis stroke="#A1A1AA" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F0F12', borderColor: '#2A2A32', borderRadius: '12px' }}
                  labelStyle={{ color: '#F4F4F5', fontWeight: 'bold' }}
                />
                <Bar dataKey="volume" name="Volume Total (kg)" fill="#F97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-44 flex flex-col items-center justify-center border border-dashed border-[#2A2A32] rounded-xl text-gym-muted text-xs">
            <TrendingUp size={28} className="mb-2 opacity-40" />
            Os gráficos de volume serão preenchidos conforme você registrar os treinos.
          </div>
        )}
      </div>
    </div>
  );
}
