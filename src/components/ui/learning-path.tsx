"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Типы ---
export type NodeState = "completed" | "active" | "locked";

export interface PathNode {
  id: string;
  label: string;
  state: NodeState;
  /** 0-1 прогресс для активного узла (кольцо) */
  progress?: number;
}

interface LearningPathProps {
  nodes: PathNode[];
  onNodeClick: (id: string, index: number) => void;
  className?: string;
}

// --- Позиции зигзага ---
// Каждая позиция — это CSS-свойства строки и коннектора.
// Паттерн из 5 шагов, повторяется циклически.
const zigzagPattern: {
  justify: string;
  paddingLeft: string;
  paddingRight: string;
  connectorMarginLeft: string;
  connectorMarginRight: string;
  connectorAlign: string;
}[] = [
  {
    justify: "flex-end",
    paddingLeft: "0px",
    paddingRight: "24px",
    connectorMarginLeft: "auto",
    connectorMarginRight: "56px",
    connectorAlign: "flex-end",
  },
  {
    justify: "flex-end",
    paddingLeft: "0px",
    paddingRight: "72px",
    connectorMarginLeft: "auto",
    connectorMarginRight: "90px",
    connectorAlign: "flex-end",
  },
  {
    justify: "center",
    paddingLeft: "0px",
    paddingRight: "0px",
    connectorMarginLeft: "auto",
    connectorMarginRight: "auto",
    connectorAlign: "center",
  },
  {
    justify: "flex-start",
    paddingLeft: "72px",
    paddingRight: "0px",
    connectorMarginLeft: "90px",
    connectorMarginRight: "auto",
    connectorAlign: "flex-start",
  },
  {
    justify: "flex-start",
    paddingLeft: "24px",
    paddingRight: "0px",
    connectorMarginLeft: "56px",
    connectorMarginRight: "auto",
    connectorAlign: "flex-start",
  },
];

// --- Цвета ---
const COLORS = {
  blue: "#1cb0f6",
  blueShadow: "#0e86c7",
  blueGlow: "rgba(28, 176, 246, 0.25)",
  gray: "#afafaf",
  grayShadow: "#8a8a8a",
  connectorDone: "#1cb0f6",
  connectorLocked: "#e5e5e5",
};

// --- SVG прогресс-кольцо ---
function ProgressRing({ progress, size = 84 }: { progress: number; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg
      width={size}
      height={size}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 pointer-events-none"
    >
      {/* Фон кольца */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(28,176,246,0.15)"
        strokeWidth={strokeWidth}
      />
      {/* Прогресс */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={COLORS.blue}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}

// --- Узел ---
function PathNodeButton({
  node,
  index,
  onClick,
}: {
  node: PathNode;
  index: number;
  onClick: () => void;
}) {
  const isCompleted = node.state === "completed";
  const isActive = node.state === "active";
  const isLocked = node.state === "locked";

  return (
    <motion.button
      onClick={() => !isLocked && onClick()}
      disabled={isLocked}
      whileHover={!isLocked ? { scale: 1.08 } : {}}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="relative flex-shrink-0 group"
      style={{ width: 72, height: 72 }}
    >
      {/* Прогресс-кольцо для активного */}
      {isActive && node.progress !== undefined && (
        <ProgressRing progress={node.progress} />
      )}

      {/* Свечение для активного */}
      {isActive && (
        <div
          className="absolute inset-[-6px] rounded-full animate-pulse"
          style={{ boxShadow: `0 0 20px 6px ${COLORS.blueGlow}` }}
        />
      )}

      {/* Основной круг */}
      <div
        className={cn(
          "relative w-[72px] h-[72px] rounded-full flex items-center justify-center z-10 transition-all",
          isLocked ? "cursor-not-allowed" : "cursor-pointer"
        )}
        style={{
          background: isLocked
            ? COLORS.gray
            : COLORS.blue,
        }}
      >
        {/* Глянцевый блик */}
        <div className="absolute top-[4px] left-[14px] right-[14px] h-[18px] bg-white/25 rounded-full blur-[1px] pointer-events-none" />

        {/* Иконка / число */}
        {isCompleted ? (
          <Check className="w-[30px] h-[30px] text-white" strokeWidth={3} />
        ) : isLocked ? (
          <Lock className="w-[26px] h-[26px] text-white/70" />
        ) : (
          <span className="text-white font-black text-[22px] select-none">
            {index + 1}
          </span>
        )}
      </div>

      {/* Тень-эллипс ::after */}
      <div
        className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-[64px] h-[10px] rounded-[50%] z-0"
        style={{
          background: isLocked ? COLORS.grayShadow : COLORS.blueShadow,
        }}
      />

      {/* Звёзды для пройденных */}
      {isCompleted && (
        <motion.div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-[2px]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.08 + 0.3 }}
        >
          {[0, 1, 2].map(i => (
            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
        </motion.div>
      )}
    </motion.button>
  );
}



// --- Главный компонент ---
export function LearningPath({ nodes, onNodeClick, className }: LearningPathProps) {
  return (
    <div className={cn("flex flex-col items-stretch w-full max-w-md mx-auto", className)}>
      {nodes.map((node, i) => {
        const pos = zigzagPattern[i % zigzagPattern.length];
        const isLast = i === nodes.length - 1;

        return (
          <React.Fragment key={node.id}>
            {/* Строка с узлом */}
            <div
              className="flex"
              style={{
                justifyContent: pos.justify,
                paddingLeft: pos.paddingLeft,
                paddingRight: pos.paddingRight,
                marginBottom: isLast ? "0px" : "48px" // Отступ вместо коннектора
              }}
            >
              <div className="flex flex-col items-center relative">
                <PathNodeButton
                  node={node}
                  index={i}
                  onClick={() => onNodeClick(node.id, i)}
                />
                {/* Подпись */}
                <motion.p
                  className={cn(
                    "absolute top-[72px] mt-3 text-xs font-semibold text-center w-[120px] leading-tight",
                    node.state === "locked"
                      ? "text-gray-400"
                      : node.state === "completed"
                        ? "text-green-600"
                        : "text-gray-700 dark:text-gray-300"
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.08 + 0.2 }}
                >
                  {node.label}
                </motion.p>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
