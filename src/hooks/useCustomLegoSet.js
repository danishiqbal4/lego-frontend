import { useState } from 'react';

const useCustomLegoSet = (initialParts = []) => {
    const [customParts, setCustomParts] = useState([]);

    const addCustomPart = (part) => {
        // console.log(part)
        if (!customParts.includes(part)) {
            // setCustomParts([...customParts, part]);
            setCustomParts(prevData => [...prevData, part]);
        }
    };

    const removeCustomPart = (partItem) => {
        console.log(customParts)
        console.log(partItem)
        setCustomParts(customParts.filter((part) => partItem !== part));
    };

    const isPartAdded = (partItem) => {
        // console.log(customParts)
        // console.log(part)
        // console.log(customParts.includes(part))
        // return customParts.includes(partItem);
        const isPartInCustomParts = customParts.some(
            (existingPart) => existingPart.element_id === partItem.element_id
        );
        return isPartInCustomParts
    };

    return {
        customParts,
        setCustomParts,
        addCustomPart,
        removeCustomPart,
        isPartAdded,
    };
};

export default useCustomLegoSet;
