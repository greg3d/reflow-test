import PresentationContainer from './PresentationContainer';
import ProgressView from './Progress';
import Slide from './Slide';
import ComplexComponent from './ComplexComponent.ts';

export const viewInterfaces = {
    Slide: <Slide>{},
    PresentationContainer: <PresentationContainer>{},
    ProgressComponent: <ProgressView>{},
    ComplexComponent: <ComplexComponent>{}
};

export type ViewInterfacesType = typeof viewInterfaces;
