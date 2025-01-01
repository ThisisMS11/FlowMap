import { PyramidDesign } from './PyramidDesign';
import { PyramidDesign2 } from './PyramidDesign2';
import { CircularDesign } from './CircularDesign';
import { TimelineDesign } from './TimeLineDesign';
import { CircularDesign2 } from './Circular2Design';
import { GearDesign } from './GearDesign';
// Import other designs...

const designs = [
    new PyramidDesign2(),
    new CircularDesign2(),
    new TimelineDesign(),
    new GearDesign(),
    // Add other designs...
];

export const getDesignById = (id: string) => {
    return designs.find((design) => design.id === id) || designs[0];
};

export const getDesignsByCategory = (category: string) => {
    return designs.filter((design) => design.category === category);
};

export default designs;
