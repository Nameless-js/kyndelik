"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if device supports hover interactions (desktop)
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mediaQuery.matches) return;

    Promise.resolve().then(() => {
      setVisible(true);
    });

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[role="button"]') ||
        target.classList.contains("cursor-pointer");
      
      setHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Smooth lagging effect for the glow ring
  useEffect(() => {
    let animationFrameId: number;

    const updateGlowPosition = () => {
      setGlowPos((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        // Adjust the multiplier for more/less inertia
        return {
          x: prev.x + dx * 0.16,
          y: prev.y + dy * 0.16,
        };
      });
      animationFrameId = requestAnimationFrame(updateGlowPosition);
    };

    animationFrameId = requestAnimationFrame(updateGlowPosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!visible) return null;

  return (
    <>
      <div
        className={`cursor-glow ${hovered ? "hovering" : ""}`}
        style={{
          left: `${glowPos.x}px`,
          top: `${glowPos.y}px`,
        }}
      />
      <div
        className="cursor-dot"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
}
