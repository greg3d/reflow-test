import { ReflowReactComponentFunction } from "@mcesystems/reflow-react-display-layer";
import SlideViewInterface from "../viewInterfaces/Slide";

const Slide: ReflowReactComponentFunction<SlideViewInterface> = ({
	title,
	content,
	children,
	done,
	event
}) => {

	return <div className="slide">
		<h2>{title}</h2>
		<p>{content}</p>
		{children}
		<button onClick={(e) => event("clicked", { coords: { x: e.clientX, y: e.clientY } })}>Click me</button>
		<button onClick={() => done()}>Kill flow with Done</button>
	</div>
}

export default Slide;