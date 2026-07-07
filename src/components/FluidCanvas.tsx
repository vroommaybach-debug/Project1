import React, { useEffect, useRef } from 'react';

export const FluidCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Create wave fluid-simulation parameters
    let time = 0;
    
    // Grid of vectors representing raw oil surface
    const gridCols = Math.ceil(width / 40);
    const gridRows = Math.ceil(height / 40);
    
    // Fluid oil bubbles/droplets
    const droplets = Array.from({ length: 15 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 80 + 120,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      // Color matching earth tones: terracotta (#C87A53), olive (#4A533C), soft beige/cream, gold (#D4AF37)
      color: [
        'rgba(200, 122, 83, 0.15)',  // terracotta
        'rgba(74, 83, 60, 0.12)',    // olive
        'rgba(212, 175, 55, 0.10)',   // gold
        'rgba(241, 236, 228, 0.25)',  // beige
      ][i % 4]
    }));

    const render = () => {
      // Ease mouse coordinates
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Clear with soft cream background
      ctx.fillStyle = '#FAF7F2';
      ctx.fillRect(0, 0, width, height);

      time += 0.002;

      // Draw beautiful luxury fluid oil droplets
      droplets.forEach(drop => {
        // Distort drop movement with mouse attraction/repulsion vector
        const dx = mouseRef.current.x - drop.x;
        const dy = mouseRef.current.y - drop.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 350) {
          // Push droplet gently
          const force = (350 - dist) / 350;
          drop.vx -= (dx / dist) * force * 0.15;
          drop.vy -= (dy / dist) * force * 0.15;
        }

        // Apply friction and speed limit
        drop.vx *= 0.98;
        drop.vy *= 0.98;
        
        drop.x += drop.vx;
        drop.y += drop.vy;

        // Wall collisions (bounce gently)
        if (drop.x < -drop.size) drop.x = width + drop.size;
        if (drop.x > width + drop.size) drop.x = -drop.size;
        if (drop.y < -drop.size) drop.y = height + drop.size;
        if (drop.y > height + drop.size) drop.y = -drop.size;

        // Render soft blurred organic oil drop
        const grad = ctx.createRadialGradient(drop.x, drop.y, 0, drop.x, drop.y, drop.size);
        grad.addColorStop(0, drop.color);
        grad.addColorStop(0.5, drop.color.replace('0.', '0.05'));
        grad.addColorStop(1, 'rgba(250, 247, 242, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw ultra-fine vector lines to simulate WebGL liquid mesh/flow lines
      ctx.strokeStyle = 'rgba(74, 83, 60, 0.03)';
      ctx.lineWidth = 1;
      
      const stepX = 50;
      const stepY = 50;
      for (let x = 0; x < width; x += stepX) {
        for (let y = 0; y < height; y += stepY) {
          // Calculate distortion vector based on mouse and time sine wave
          const dx = x - mouseRef.current.x;
          const dy = y - mouseRef.current.y;
          const dDist = Math.hypot(dx, dy) || 1;
          const mouseFactor = Math.min(100 / dDist, 2.5);

          const angle = Math.sin(x * 0.005 + time) * Math.cos(y * 0.005 + time) * Math.PI * 2 + (dx / dDist) * mouseFactor;
          const length = 12 + Math.sin(time + x + y) * 4;

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
          ctx.stroke();
        }
      }

      // Add a subtle vignette gradient overlay to elevate luxury look
      const vignette = ctx.createRadialGradient(width/2, height/2, width/4, width/2, height/2, width);
      vignette.addColorStop(0, 'rgba(250, 247, 242, 0)');
      vignette.addColorStop(1, 'rgba(28, 28, 28, 0.03)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="fluid-organic-canvas"
      className="absolute inset-0 w-full h-full block pointer-events-none opacity-80"
    />
  );
};
