import { ReflowReactComponentFunction } from "@mcesystems/reflow-react-display-layer";
import ProgressView from "../viewInterfaces/Progress";

const ProgressComponent: ReflowReactComponentFunction<ProgressView> = ({
	progress,
	finished,
	//done,
	//event
}) => {

	if (finished) {
		return <div className="progress">
			<div className="progress-bar" style={{ backgroundColor: "red", width: `300px` }}>DONE!</div>
		</div>
	}

	return <div className="progress">
		<div className="progress-bar" style={{ backgroundColor: "red", width: `${progress * 3}px` }}>{progress}%</div>
	</div>
}

export default ProgressComponent;