import { ReflowReactComponentFunction } from '@mcesystems/reflow-react-display-layer';
import ComplexComponentWithPropsObserved from '../viewInterfaces/ComplexComponent.ts';

const ComplexComponent: ReflowReactComponentFunction<ComplexComponentWithPropsObserved> = (props) => {

	const { title, subtitle, sensorData, loadingState, additional } = props;

	const renderSkeleton = ({ width, height }: { width?: number, height?: number } = {}) => {
		const skeletonStyle = {
			width: width ? width + "px" : "100%",
			height: height ? height + "px" : "100%",
		}
		return <div className={'skeleton my-2'} style={skeletonStyle}>loading...</div>;
	};

	console.log(loadingState);

	const renderTitle = () => {
		
		if (!loadingState.title) return null;
		if (loadingState.title === 'busy') return renderSkeleton({ height: 36 });
		if (!title) return null;
		return <h2 className="h2 my-2">{title}</h2>;
	};

	const renderSubTitle = () => {
		
		if (!loadingState.subtitle) return null;
		if (loadingState.subtitle === 'busy') return renderSkeleton({ height: 32 });
		if (!subtitle) return null;
		return <h4 className="h3 bol my-1">{subtitle}</h4>;
	};

	const renderAdditional = (id: string) => {
		
		if (!loadingState.additional) return null;
		if (loadingState.additional === 'busy') return renderSkeleton({ height: 20 });
		if (!additional) return null;
		console.log("additional", additional);
		return <p className="additional">
			{additional[id]}
		</p>;
	};
	const renderSensorData = () => {
		if (!loadingState.sensorData || sensorData?.length === 0) return null;
		if (loadingState.sensorData === 'busy') return renderSkeleton({ height: 400 });
		return <div className={"sernsor-data my-2"}>{
			sensorData && sensorData.map(sensor => {
				return <div key={sensor.id} className={"sensor"}>
					<ul>
						<li>id: {sensor.id}</li>
						<li>name: {sensor.name}</li>
						<li>{`value: ${sensor.value} ${sensor.units}`}</li>
						<li>{`description: ${sensor.description}`}</li>
						<li>{renderAdditional(sensor.id)}</li>
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