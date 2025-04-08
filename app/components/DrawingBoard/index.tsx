import { useEffect, useRef } from 'react';

type Point = { x: number; y: number };
type Stroke = { color: string; points: Point[] };

type IDrawingBoard = {
	width: number;
	height: number;
	pixelationFactor?: number;
	noiseAlpha?: number;
};

const colors = [
	{ pen: 'red', css: 'bg-red-500' },
	{ pen: 'green', css: 'bg-green-500' },
	{ pen: 'blue', css: 'bg-blue-500' },
];

export const DrawingBoard = ({
	width,
	height,
	pixelationFactor = 3,
	noiseAlpha = 20,
}: IDrawingBoard) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
	const isDrawing = useRef(false);
	const penColor = useRef('red');

	const strokesRef = useRef<Stroke[]>([]);
	const currentStrokeRef = useRef<Stroke | null>(null);

	const getAdjustedCoords = (event: MouseEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return { x: 0, y: 0 };
		const rect = canvas.getBoundingClientRect();
		return {
			x: ((event.clientX - rect.left) / rect.width) * canvas.width,
			y: ((event.clientY - rect.top) / rect.height) * canvas.height,
		};
	};

	const redrawCanvas = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		strokesRef.current.forEach((stroke) => {
			if (stroke.points.length < 2) return;
			ctx.strokeStyle = stroke.color;
			ctx.lineWidth = 2;
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
			for (let i = 1; i < stroke.points.length; i++) {
				ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
			}
			ctx.stroke();
		});
	};

	const onMouseDown = (event: MouseEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		if (!(event.target instanceof Node && canvas.contains(event.target)))
			return;

		const coords = getAdjustedCoords(event);
		isDrawing.current = true;
		currentStrokeRef.current = { color: penColor.current, points: [coords] };
	};

	const onMouseMove = (event: MouseEvent) => {
		if (!isDrawing.current || !canvasRef.current) return;
		if (
			!(
				event.target instanceof Node && canvasRef.current.contains(event.target)
			)
		)
			return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const coords = getAdjustedCoords(event);
		if (currentStrokeRef.current) {
			const points = currentStrokeRef.current.points;
			const lastPoint = points[points.length - 1];
			points.push(coords);

			ctx.strokeStyle = currentStrokeRef.current.color;
			ctx.lineWidth = 2;
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.moveTo(lastPoint.x, lastPoint.y);
			ctx.lineTo(coords.x, coords.y);
			ctx.stroke();
		}
	};

	const onMouseUp = () => {
		if (isDrawing.current && currentStrokeRef.current) {
			strokesRef.current.push(currentStrokeRef.current);
			currentStrokeRef.current = null;
		}
		isDrawing.current = false;
	};

	const handleUndo = () => {
		strokesRef.current.pop();
		redrawCanvas();
	};

	useEffect(() => {
		window.addEventListener('mousedown', onMouseDown);
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);

		return () => {
			window.removeEventListener('mousedown', onMouseDown);
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		};
	}, []);

	useEffect(() => {
		const overlayCanvas = overlayCanvasRef.current;
		if (!overlayCanvas) return;
		overlayCanvas.width = width;
		overlayCanvas.height = height;
		const ctx = overlayCanvas.getContext('2d');
		if (!ctx) return;

		const generateNoise = () => {
			const imageData = ctx.createImageData(width, height);
			const buffer = new Uint32Array(imageData.data.buffer);
			for (let i = 0; i < buffer.length; i++) {
				const gray = Math.floor(Math.random() * 256);
				buffer[i] = (noiseAlpha << 24) | (gray << 16) | (gray << 8) | gray;
			}
			ctx.putImageData(imageData, 0, 0);
		};

		let animationFrameId: number;
		const updateGrain = () => {
			generateNoise();
			animationFrameId = requestAnimationFrame(updateGrain);
		};

		updateGrain();
		return () => cancelAnimationFrame(animationFrameId);
	}, [width, height, noiseAlpha]);

	const drawingWidth = Math.max(1, Math.floor(width / pixelationFactor));
	const drawingHeight = Math.max(1, Math.floor(height / pixelationFactor));

	return (
		<div className="flex flex-col">
			<div className="flex flex-row justify-between">
				<p className="pixelated-text text-xs self-center">D R A W !</p>
				<div className="flex flex-row self-end">
					{colors.map((color) => (
						<div
							key={color.pen}
							onClick={() => (penColor.current = color.pen)}
							className={`${color.css} w-6 h-6 inset-shadow-md`}
						></div>
					))}
				</div>
			</div>
			<div
				style={{ position: 'relative', width, height }}
				className="grid-background"
			>
				{/* Drawing canvas */}
				<canvas
					ref={canvasRef}
					width={drawingWidth}
					height={drawingHeight}
					style={{
						width: '100%',
						height: '100%',
						imageRendering: 'pixelated',
						position: 'absolute',
						top: 0,
						left: 0,
						zIndex: 1,
					}}
					className="inset-shadow-sm inset-shadow-black border-b-1 border-x-1"
				/>
				{/* Overlay grain canvas */}
				<canvas
					ref={overlayCanvasRef}
					width={width}
					height={height}
					style={{
						width: '100%',
						height: '100%',
						imageRendering: 'pixelated',
						position: 'absolute',
						top: 0,
						left: 0,
						zIndex: 2,
						pointerEvents: 'none',
					}}
				/>
			</div>
			<div className="flex flex-row justify-between">
				<button
					onClick={handleUndo}
					className="pixelated-text text-xs bg-base border-1 px-2 shadow-md"
				>
					undo
				</button>
				<button className="pixelated-text text-xs bg-base border-1 px-2 shadow-md">
					send
				</button>
			</div>
		</div>
	);
};
