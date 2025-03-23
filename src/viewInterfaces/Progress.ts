import { ViewInterface } from "@mcesystems/reflow";

export interface Input {
	progress: number;
	finished: boolean;
}

export default interface ProgressView extends ViewInterface<Input> { }
