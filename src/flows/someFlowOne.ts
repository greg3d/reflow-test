import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "../viewInterfaces";

type FlowInput = Record<never, never>;
type FlowOutput = void;


const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

const flow: Flow<ViewInterfacesType, FlowInput, FlowOutput, {}, {}, {}> = async (toolkit) => {

	const { view, views, event, step, back, backPoint } = toolkit

	backPoint("start");
	await sleep(2000);

	backPoint("end");

}

export default flow;