import { ReflowReactComponentFunction } from '@mcesystems/reflow-react-display-layer';
import ComplexComponentWithPropsObserved, { LoadingState } from '../viewInterfaces/ComplexComponent.ts';

const ComplexComponent: ReflowReactComponentFunction<ComplexComponentWithPropsObserved> = (props) => {

	const { title, subtitle, sensorData, observerLoadingState } = props;

	const renderSkeleton = () => <div className={'skeleton'}>loading...</div>;

	const renderTitle = () => {
		if (!observerLoadingState.title) return null;
		if (observerLoadingState.title === 'busy') return renderSkeleton();
		return <h2>{title}</h2>;
	};

	const renderSubTitle = () => {
		if (!observerLoadingState.subtitle) return null;
		if (observerLoadingState.subtitle === 'busy') return renderSkeleton();
		return <h4>{subtitle}</h4>;
	};

	const renderSensorData = () => {
		if (!observerLoadingState.sensorData || sensorData?.length === 0) return null;
		if (observerLoadingState.settingsData === 'busy') return renderSkeleton();
		return <div className={"sernsor-data"}>{
			sensorData && sensorData.map(sensor => {
				return <div className={"sensor"}>
					<ul>
						<li>id: {sensor.id}</li>
						<li>name: {sensor.name}</li>
						<li>`value: ${sensor.value} ${sensor.units}`</li>
					</ul>
				</div>
			})
		}</div>;
	}

	return <div className="complex-component">
		{renderTitle()}
		{renderSubTitle()}
		{renderSensorData()}
	</div>;
};

export default ComplexComponent;