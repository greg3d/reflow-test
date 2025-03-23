import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "../viewInterfaces";

import { imitation } from "../tools/calculations";

type FlowInput = Record<never, never>;
type FlowOutput = void;
interface FlowState {
	count: number;
}

type FlowEvents = {
	timeout: {};
}

//const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

interface ChildFlowEvents {
	progress: {
		percent: number
	},
	finished: true
}

const childFlow = <Flow<ViewInterfacesType, void, void, {}, {}, ChildFlowEvents>>(async ({ event, on }) => {
	const progress = await imitation();
	for await (const p of progress) {
		event("progress", {
			percent: p.progress
		})
	}
	event("finished", true)
});

const mainFlow = <Flow<ViewInterfacesType>>(async (toolkit) => {

	const { view, views, event, step, back, backPoint, flow } = toolkit

	console.log("Flow started");
	const child1 = flow(childFlow)
	const child2 = flow(childFlow)
	const view1 = view(0, views.ProgressComponent, {
		progress: 0,
		finished: false
	})



	child1.on("progress", ({ percent }) => {
		view1.update({ progress: percent })
		console.log("Progress of task 1: ", percent);

	})
	child2.on("progress", ({ percent }) => {
		view1.update({ progress: percent })
		console.log("Progress of task 2: ", percent);

	})
	child1.on("finished", async (finished) => {
		view(0, views.ProgressComponent, {
			progress: 100,
			finished
		})
	})
	child2.on("finished", async (finished) => {
		view(1, views.ProgressComponent, {
			progress: 100,
			finished
		})
	})

	await new Promise(() => { });
})

export default mainFlow;
