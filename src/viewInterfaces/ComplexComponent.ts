import {ViewInterface} from '@mcesystems/reflow';

export interface ISensor {
    id: string;
    name: string;
    units: string;
    description: string;
    value: number;
}


export interface Input {
    title?: string;
    subtitle?: string;
    sensorData?: ISensor[];
    settingsData?: {
        string1: string
        number1: number
        string2: string
        map1: Record<string, string>
        object1: {
            id: string
            name: string
            value: number
        }
    };
}

export interface InputObserved extends Input {
    observerLoadingState: {
        [K in keyof Input]: "idle" | "busy" | undefined;
    }
}

export interface Events {
    loadClicked: () => void;
    exitClicked: () => void;
    resetClicked: () => void;
}


export default interface ComplexComponent extends ViewInterface<InputObserved, Events> {
}

