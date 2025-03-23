import {Flow, ViewInterface, ViewProxy, ViewsMapInterface} from '@mcesystems/reflow';
import {ViewInterfacesType} from '../viewInterfaces';

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

interface Task<T extends ViewInterface<any, any, any>, K extends keyof T['input']> {
    thread: () => Promise<T['input'][K]>;
    cb: (result: T['input'][K], view: ViewProxy<ViewsMapInterface, T>) => void;
}

export class Deferred<T extends ViewInterface<any, any, any>> {
    list: Partial<{ [K in keyof T['input']]: Task<T, K> }>;

    constructor() {
        this.list = {};
    }

    add<K extends keyof T['input']>(
        key: K,
        thread: () => Promise<T['input'][K]>,
        cb: (result: T['input'][K], view: ViewProxy<ViewsMapInterface, T>) => void
    ) {
        this.list[key] = {thread, cb};
    }

    getObserverLoadingState(): Record<keyof T['input'], 'idle' | 'busy'> {
        const state: Partial<Record<keyof T['input'], 'idle' | 'busy'>> = {};
        (Object.keys(this.list) as (keyof T['input'])[]).forEach(key => {
            state[key] = 'idle';
        });
        return state as Record<keyof T['input'], 'idle' | 'busy'>;
    }

    run(view: ViewProxy<ViewsMapInterface, T>) {
        Object.values(this.list).forEach(task => {
            // Убедимся, что task не undefined
            if (task) {
                task.thread().then(result => {
                    task.cb(result, view);
                });
            }
        });
    }
}


const mainFlow = <Flow<ViewInterfacesType>>(async (toolkit) => {

    const {view, views, event, step, back, backPoint, flow} = toolkit;


    const deferred = new Deferred();
    deferred.add<string>('title',
        () => new Promise((resolve) => setTimeout(() => resolve('Title 11231'), 1000)),
        (result, view) => {

        });


    const viewInstance = view(0, views.ComplexComponent, {
        observerLoadingState: {
            title: 'idle'
        }
    });

    console.log('Flow started');

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
