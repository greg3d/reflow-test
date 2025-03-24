import { Flow, ViewInterface, ViewProxy, ViewsMapInterface } from '@mcesystems/reflow';
import { ViewInterfacesType } from '../viewInterfaces';
import ComplexComponent from '../viewInterfaces/ComplexComponent.ts';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

/*
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
});*/

export interface Task<T extends ViewInterface<any, any, any>, ViewMap extends ViewsMapInterface> {
	key: keyof T['input'];
	thread: () => Promise<T['input'][keyof T['input']]>;
	cb: (result: T['input'][keyof T['input']], view: ViewProxy<ViewMap, ViewMap[keyof ViewMap]>) => void;
}

interface AddProps<T> {
	key: string,
	condition: () => boolean | boolean,
	thread: () => Promise<T>,
	cb: (result: T) => void
}

export interface Task2<IView extends ViewInterface<any, any, any>> {
	key: string,
	thread: () => Promise<Omit<IView['input'][keyof IView['input']], "loadingState">>,
	cb: (result: Omit<IView['input'][keyof IView['input']], "loadingState">) => void
}
export class Deferred2<IView extends ViewInterface<any, any, any>> {
	private readonly tasks: Task2<IView>[] = [];

	add(props: AddProps<IView['input'][keyof IView['input']]>) {
		const { condition } = props;
		if (typeof condition === 'function') {
			if (!condition()) return;
		} else {
			if (!condition) return;
		}
		this.tasks.push({
			key: props.key,
			thread: props.thread,
			cb: props.cb
		});
		return this;
	}
}

export class Deferred<T extends ViewInterface<any, any, any>, ViewMap extends ViewsMapInterface> {
	// key of Tasks should be string...    // keyof T['input'] extends string ? keyof T['input'] : never 
	private readonly tasks: Record<keyof T['input'], Task<T, ViewMap>>;
	private observerLoadingState: Record<keyof T['input'], 'idle' | 'busy' | undefined>;

	//private readonly view: ViewProxy<ViewsMapInterface, T>;

	constructor() {
		this.tasks = {} as typeof this.tasks;
		this.observerLoadingState = {} as typeof this.observerLoadingState;
	}

	public add(
		key: keyof T['input'],
		thread: () => Promise<T['input'][keyof T['input']]>,
		cb: (result: T['input'][keyof T['input']], view: ViewProxy<ViewMap, ViewMap[keyof ViewMap]>) => void
	): void {
		this.tasks[key] = { key, thread, cb };
		this.observerLoadingState = { ...this.observerLoadingState, [key]: 'idle' };
	}

	// initial view state
	getInitialObserverLoadingState() {
		return {
			observerLoadingState: this.observerLoadingState
		};
	}

	public run(view: ViewProxy<ViewMap, ViewMap[keyof ViewMap]>): void {
		for (const key in this.tasks) {
			const task = this.tasks[key as keyof T['input']];
			if (!task) continue;

			// update state of loading = busy
			this.observerLoadingState = { ...this.observerLoadingState, [key]: 'busy' };
			view.update({ observerLoadingState: this.observerLoadingState });

			// after
			task.thread().then(result => {
				// update state of loading = idle
				this.observerLoadingState = { ...this.observerLoadingState, [key]: 'idle' };
				view.update({ observerLoadingState: this.observerLoadingState });
				// user's callback with view
				task.cb(result, view);
			}).catch(error => {
				console.error(error);
			});
		}
	}
}


const mainFlow = <Flow<ViewInterfacesType>>(async (toolkit) => {

	const { view, views, event, step, back, backPoint, flow, externalEvent } = toolkit;
	console.log('Flow started');


	const viewInstance = view(0, views.ComplexComponent, {
		title: 'Title 11231',
		subtitle: 'Subtitle 23 23 '
	});

	viewInstance

	externalEvent("someEvent", {
		title: 'Title 3453435',
	})

	await sleep(1500);


	console.log(viewInstance);

	//await viewInstance;

	/*
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
	}) */

	await new Promise(() => {
	});
});

export default mainFlow;
