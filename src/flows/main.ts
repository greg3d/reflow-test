import { Flow, ViewInterface, ViewProxy, ViewsMapInterface } from '@mcesystems/reflow';
import { ViewInterfacesType } from '../viewInterfaces';
import ComplexComponent, { ISensor, LoadingState, LoadingType } from '../viewInterfaces/ComplexComponent';

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

interface AddProps<IView extends ViewInterface<any, any, any>, K extends keyof IView['input']> {
	key: K,
	condition: (() => boolean) | boolean,
	thread: () => Promise<IView['input'][K]>;
	cb: (result: IView['input'][K], viewProxy?: ViewProxy<ViewsMapInterface, IView>) => void;
}

export interface Task<IView extends ViewInterface<any, any, any>, K extends keyof IView['input']> {
	key: K;
	thread: () => Promise<IView['input'][K]>;
	cb: (result: IView['input'][K], viewProxy?: ViewProxy<ViewsMapInterface, IView>) => void;
}

export class Deferred<IView extends ViewInterface<any, any, any>> {
	private readonly tasks: Array<Task<IView, keyof IView['input']>> = [];
	private runStatus: boolean = false;
	private state: LoadingState<IView['input']> = {} as LoadingState<IView['input']>;
	private inputState: IView['input'] = {} as IView['input'];

	add<K extends keyof IView['input']>(props: AddProps<IView, K>) {
		const { condition } = props;
		if (typeof condition === 'function') {
			if (!condition()) return;
		} else {
			if (!condition) return;
		}
		this.state = { ...this.state, [props.key]: "idle" };
		this.tasks.push({
			key: props.key,
			thread: props.thread,
			cb: props.cb,
		} as Task<IView, keyof IView['input']>);
		return this;
	}

	getInitialObserverLoadingState() {
		return {
			loadingState: this.state
		};
	}

	async run({viewProxy, inputState}: {viewProxy?: ViewProxy<ViewsMapInterface, IView>, inputState?: IView['input']}) {
		if (this.runStatus) return;
		this.runStatus = true;

		const runTask = async (task: Task<IView, keyof IView['input']>) => {
			try {
				this.state = { ...this.state, [task.key]: "busy" };
				viewProxy?.update({
					loadingState: this.state
				});
				const result = await task.thread();
				this.state = { ...this.state, [task.key]: "idle" };
				viewProxy?.update({
					loadingState: this.state
				});
				console.log(`Task ${String(task.key)} finished`);
				task.cb(result, viewProxy);

			} catch (error) {
				console.error(`Error in task ${String(task.key)}:`, error);
			}
		};

		while (this.tasks.length > 0) {
			const currentTasks = [...this.tasks];
			this.tasks.length = 0;
			await Promise.allSettled(currentTasks.map(runTask));
		}

		this.runStatus = false;
	}
}

const mainFlow = <Flow<ViewInterfacesType>>(async (toolkit) => {

	const { view, views, event, step, back, backPoint, flow, externalEvent } = toolkit;
	console.log('Flow started');

	const container = view(0, views.PresentationContainer);

	const currentInput: ComplexComponent['input'] = {
		title: 'Title 11231',
		subtitle: 'Subtitle 23 23 ',
		loadingState: {
			title: "idle",
			subtitle: "idle",
		}
	}
	const deferred = new Deferred<ComplexComponent>();

	deferred.add({
		key: "title",
		condition: true,
		thread: () => new Promise<string>((resolve) => {
			setTimeout(() => {
				resolve("New Title fetched from server");
			}, 1000);
		}),
		cb: (result, viewProxy) => {
			viewProxy?.update({ "title": result });
		}
	});

	deferred.add({
		key: "subtitle",
		condition: true,
		thread: () => new Promise<string>((resolve) => {
			setTimeout(() => {
				resolve("New Subtitle fetched from server");
			}, 1200);
		}),
		cb: (result, viewProxy) => {
			viewProxy?.update({ subtitle: result });
		}
	});

	deferred.add({
		key: "sensorData",
		condition: true,
		thread: () => new Promise<ISensor[]>((resolve) => {
			setTimeout(() => {

				const sensorData: ISensor[] = [
					{
						id: "1",
						name: "Accelerometer X",
						value: 0.89,
						units: "G",
						description: "Sensor 1 description"
					}, {
						id: "2",
						name: "Accelerometer Y",
						value: 0.56,
						units: "G",
						description: "Sensor 2 description"
					}, {
						id: "3",
						name: "Accelerometer Z",
						value: 0.34,
						units: "G",
						description: "Sensor 3 description"
					}
				];
				resolve(sensorData);
			}, 3000);
		}),
		cb: (result, viewProxy) => {
			viewProxy?.update({ "sensorData": result });
		}
	});

	const viewInstance = view(0, views.ComplexComponent, currentInput, container);

	await sleep(500);

	deferred.run({ viewProxy: viewInstance });

	deferred.add({
		key: "additional",
		condition: true,
		thread: () => new Promise<Record<string, string>>((resolve) => {
			setTimeout(() => {
				resolve({ "1": "Additional info 1", "2": "Additional info 2", "3": "Additional info 3" });
			}, 3000);
		}),
		cb: (result, viewProxy) => {
			viewProxy?.update({ additional: result });
		}
	});

	//deferred.run(viewInstance);

	await new Promise(() => {
	});
});

export default mainFlow;
