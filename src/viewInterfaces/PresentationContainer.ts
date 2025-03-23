import { ViewInterface } from "@mcesystems/reflow";

export interface Input {
	title: string;
	subtitle: string;
}

export interface Events {
	clicked: () => void;
}

export interface Output {
	someOutVar: string
}

export default interface PresentationContainer extends ViewInterface<Input> { }
