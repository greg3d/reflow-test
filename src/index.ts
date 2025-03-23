import { Transports, Reflow } from "@mcesystems/reflow";
import { renderDisplayLayer } from "@mcesystems/reflow-react-display-layer";

import { ViewInterfacesType, viewInterfaces } from "./viewInterfaces";
import { views } from './views';
import mainFlow from "./flows/main";

const transport = new Transports.InProcTransport({});

renderDisplayLayer<ViewInterfacesType>({
	element: document.getElementById("main") as HTMLElement,
	transport,
	views,
});

const reflow = new Reflow<ViewInterfacesType>({
	transport,
	views: viewInterfaces,
});

reflow.start(mainFlow).then()