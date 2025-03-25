import { ReflowReactComponentFunction } from '@mcesystems/reflow-react-display-layer';
import PresentationContainerViewInterface from '../viewInterfaces/PresentationContainer';

import '../styles/index.css';

const PresentationContainer: ReflowReactComponentFunction<PresentationContainerViewInterface, void> = ({children}) => {

	return (<div className="grid grid-rows-[auto_1fr_auto]">
	
		<header className="bg-red-500 p-4">App</header>
		
		<div className="container mx-auto grid grid-cols-1 xl:grid-cols-[200px_minmax(0px,_1fr)_200px]">

		  <aside className="sticky top-0 col-span-1 hidden h-screen bg-yellow-500 p-4 xl:block">(sidebar)</aside>
	
		  <main className="col-span-1 space-y-4 p-4 content">
			{children}
		  </main>

		  <aside className="sticky top-0 col-span-1 hidden h-screen bg-green-500 p-4 xl:block">(sidebar)</aside>
		</div>

		<footer className="bg-blue-500 p-4"></footer>
	  </div>);
};

export default PresentationContainer;
