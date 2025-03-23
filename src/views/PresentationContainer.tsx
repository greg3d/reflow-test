import {ReflowReactComponentFunction} from '@mcesystems/reflow-react-display-layer';
import PresentationContainerViewInterface from '../viewInterfaces/PresentationContainer';

const PresentationContainer: ReflowReactComponentFunction<PresentationContainerViewInterface, void> = ({
                                                                                                           title,
                                                                                                           subtitle,
                                                                                                           children
                                                                                                       }) => {

    return (<div className="container"><h1>{title}</h1>
        <h2>{subtitle}</h2>
        <div className="content">
            {children}
        </div>
    </div>);
};

export default PresentationContainer;
