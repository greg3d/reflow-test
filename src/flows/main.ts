import {Flow, ViewInterface, ViewProxy, ViewsMapInterface} from '@mcesystems/reflow';
import {ViewInterfacesType} from '../viewInterfaces';
import ComplexComponent from '../viewInterfaces/ComplexComponent.ts';

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

export interface Task<T extends ViewInterface<any, any, any>, K extends keyof T['input']> {
    key: K;
    thread: () => Promise<T['input'][K]>;
    cb: (result: T['input'][K], view: ViewProxy<ViewsMapInterface, T>) => void;
}

export class Deferred<T extends ViewInterface<any, any, any>> {
    private readonly tasks: Partial<Record<keyof T['input'], Task<T, keyof T['input']>>>;
    private observerLoadingState: Record<string, 'idle' | 'busy' | undefined>;

    //private readonly view: ViewProxy<ViewsMapInterface, T>;

    constructor() {
        this.tasks = {};
        this.observerLoadingState = {};
    }

    public add<K extends keyof T['input']>(
        key: string,
        thread: () => Promise<T['input'][K]>,
        cb: (result: T['input'][K], view: ViewProxy<ViewsMapInterface, T>) => void
    ): void {
        this.tasks[key] = {key, thread, cb};
        this.observerLoadingState[key] = 'idle';
    }

    // initial view state
    getInitialObserverLoadingState() {
        return {
            observerLoadingState: this.observerLoadingState
        };
    }

    public run(view: ViewProxy<ViewsMapInterface, T>): void {
        for (const key in this.tasks) {
            const task = this.tasks[key as keyof T['input']];
            if (!task) continue;

            // update state of loading = busy
            this.observerLoadingState = {...this.observerLoadingState, [key]: 'busy'};
            view.update({ observerLoadingState: this.observerLoadingState });

            // after
            task.thread().then(result => {
                // update state of loading = idle
                this.observerLoadingState = {...this.observerLoadingState, [key]: 'idle'};
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

    const {view, views, event, step, back, backPoint, flow} = toolkit;
    console.log('Flow started');

    const deferred = new Deferred<ComplexComponent>();
    deferred.add('title',
        () => new Promise((resolve) => setTimeout(() => resolve('Title 11231'), 1000)),
        (result, view) => {
            view.update({
                title: result
            });
        });

    deferred.add('subtitle',
        () => new Promise((resolve) => setTimeout(() => resolve('Subtitl e 23 23 '), 2500)),
        (result, view) => {
            view.update({
                subtitle: result
            });
        });


    const viewInstance = view(0, views.ComplexComponent, deferred.getInitialObserverLoadingState());
    console.log(viewInstance);
    deferred.run(viewInstance);

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
