import { PyramidDesign } from './PyramidDesign';
import { CircularDesign } from './CircularDesign';
import { TimelineDesign } from './TimeLineDesign';
// Import other designs...

const designs = [
    new PyramidDesign(),
    new CircularDesign(),
    new TimelineDesign(),
    // Add other designs...
];

export const getDesignById = (id: string) => {
    return designs.find((design) => design.id === id) || designs[0];
};

export const getDesignsByCategory = (category: string) => {
    return designs.filter((design) => design.category === category);
};

export default designs;
