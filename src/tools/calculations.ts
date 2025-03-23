
export async function* imitation() {
	for (let i = 0; i <= 100; i++) {
		await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
		yield { progress: i };
	}
}

// Async generator that approximates π using a Monte Carlo simulation.
// It yields progress updates and the current π estimate.
export async function* approximatePiGenerator(iterations: number): AsyncGenerator<{ progress: number; piEstimate: number }> {
	let insideCircle = 0;
	// Determine how often to yield progress (roughly 1% updates)
	const batchSize = Math.floor(iterations / 100) || 1;

	for (let i = 0; i < iterations; i++) {
		// Generate a random point within the unit square.
		const x = Math.random();
		const y = Math.random();
		if (x * x + y * y <= 1) {
			insideCircle++;
		}

		// Introduce a random extra load:
		// The number of extra iterations is random (0 to 4 extra steps).
		const extraIterations = Math.floor(Math.random() * 5);
		let dummy = 0;
		for (let j = 0; j < extraIterations; j++) {
			// Some arbitrary extra math to simulate variable workload.
			dummy += Math.sqrt(Math.random() * 100);
		}

		// Yield a progress update every batchSize iterations.
		if ((i + 1) % batchSize === 0) {
			const progress = ((i + 1) / iterations) * 100;
			// π ≈ 4 * (points inside circle) / (total points)
			const piEstimate = (insideCircle / (i + 1)) * 4;
			yield { progress, piEstimate };
			// Yield control to keep the event loop responsive.
			await Promise.resolve();
		}
	}

	// Final update to ensure 100% progress.
	yield { progress: 100, piEstimate: (insideCircle / iterations) * 4 };
}

// Async generator that computes the sum of squares from 1 to a given limit.
// It yields progress updates and the current partial sum.
export async function* sumOfSquaresGenerator(limit: number): AsyncGenerator<{ progress: number; partialSum: number }> {
	let sum = 0;
	// Determine batch size for progress updates.
	const batchSize = Math.floor(limit / 100) || 1;

	for (let i = 1; i <= limit; i++) {
		sum += i * i;

		// Introduce a random extra load:
		// This extra work simulates variable processing time.
		const extraIterations = Math.floor(Math.random() * 5);
		let dummy = 0;
		for (let j = 0; j < extraIterations; j++) {
			// Some arbitrary extra math operation.
			dummy += Math.cbrt(Math.random() * 100);
		}

		// Yield a progress update every batchSize iterations.
		if (i % batchSize === 0) {
			const progress = (i / limit) * 100;
			yield { progress, partialSum: sum };
			await Promise.resolve();
		}
	}

	// Final update.
	yield { progress: 100, partialSum: sum };
}