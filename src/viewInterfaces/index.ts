
import PresentationContainer from "./PresentationContainer";
import ProgressView from "./Progress";
import Slide from "./Slide";

export const viewInterfaces = {
	Slide: <Slide>{},
	PresentationContainer: <PresentationContainer>{},
	ProgressComponent: <ProgressView>{},
}

export type ViewInterfacesType = typeof viewInterfaces;
