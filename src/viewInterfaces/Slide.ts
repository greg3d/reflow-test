import { ViewInterface } from "@mcesystems/reflow";

export interface Input {
	title: string;
	content: string;
	timeout: number;
}

export interface Events {
	clicked: {
		coords: {
			x: number;
			y: number;
		};
	};
}

export default interface Slide extends ViewInterface<Input, Events> { }

