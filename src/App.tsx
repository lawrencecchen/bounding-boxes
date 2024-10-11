import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
	const [image, setImage] = useState<string | null>(null);
	const [x, setX] = useState(50);
	const [y, setY] = useState(50);
	const [coordInput, setCoordInput] = useState("");
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => setImage(e.target?.result as string);
			reader.readAsDataURL(file);
		}
	};

	const handleCoordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCoordInput(e.target.value);
	};

	const parseAndSetCoords = () => {
		const coordRegex = /^\s*\(?(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)?\s*$/;
		const match = coordInput.match(coordRegex);
		if (match) {
			const newX = Math.min(100, Math.max(0, parseFloat(match[1])));
			const newY = Math.min(100, Math.max(0, parseFloat(match[2])));
			setX(newX);
			setY(newY);
			setCoordInput(`${newX},${newY}`); // Update input to show clamped values
		}
	};

	useEffect(() => {
		if (image && canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
			const img = new Image();
			img.onload = () => {
				canvas.width = img.width;
				canvas.height = img.height;
				ctx?.drawImage(img, 0, 0);
				drawBoundingBox(ctx, x, y);
			};
			img.src = image;
		}
	}, [image, x, y]);

	const drawBoundingBox = (
		ctx: CanvasRenderingContext2D | null,
		x: number,
		y: number
	) => {
		if (ctx) {
			const width = ctx.canvas.width;
			const height = ctx.canvas.height;
			ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Red with 50% opacity
			ctx.beginPath();
			ctx.arc(width * (x / 100), height * (y / 100), 10, 0, 2 * Math.PI);
			ctx.fill();
		}
	};

	return (
		<>
			<div className="App">
				<input type="file" accept="image/*" onChange={handleImageUpload} />
				<div>
					<label>
						X (%):{" "}
						<input
							type="number"
							value={x}
							onChange={(e) => setX(Number(e.target.value))}
							min="0"
							max="100"
						/>
					</label>
					<label>
						Y (%):{" "}
						<input
							type="number"
							value={y}
							onChange={(e) => setY(Number(e.target.value))}
							min="0"
							max="100"
						/>
					</label>
					<label>
						Paste coordinates:
						<input
							type="text"
							value={coordInput}
							onChange={handleCoordInput}
							placeholder="e.g., (50,50) or 50,50"
						/>
						<button onClick={parseAndSetCoords}>Set</button>
					</label>
				</div>
				{image && (
					<canvas
						ref={canvasRef}
						style={{ maxWidth: "100%", height: "auto" }}
					/>
				)}
			</div>
		</>
	);
}

export default App;
