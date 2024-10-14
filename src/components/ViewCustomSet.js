import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewCustomSet = () => {
    const { setId } = useParams();
    const navigate = useNavigate();
    const [customSet, setCustomSet] = useState(null);

    // Fetch the custom set from localStorage when the component mounts
    useEffect(() => {
        const savedSets = JSON.parse(localStorage.getItem('customLegoSets')) || [];
        const foundSet = savedSets.find(set => set.id === setId);
        setCustomSet(foundSet);
    }, [setId]);

    // Function to remove a part from the custom set
    const handleRemovePart = (partsElementToRemove) => {
        const updatedParts = customSet.partsArr.filter(partsItem => partsItem.element_id !== partsElementToRemove);
        const updatedSet = { ...customSet, partsArr: updatedParts };

        // Update localStorage with the new set
        const savedSets = JSON.parse(localStorage.getItem('customLegoSets')) || [];
        const updatedSets = savedSets.map(set => set.id === setId ? updatedSet : set);
        localStorage.setItem('customLegoSets', JSON.stringify(updatedSets));

        // Update state to re-render with the updated parts
        setCustomSet(updatedSet);
    };

    // Function to delete the entire custom set
    const handleDeleteSet = () => {
        const savedSets = JSON.parse(localStorage.getItem('customLegoSets')) || [];
        const updatedSets = savedSets.filter(set => set.id !== setId);
        localStorage.setItem('customLegoSets', JSON.stringify(updatedSets));
        navigate('/'); // Redirect back to the main page after deletion
    };

    if (!customSet) {
        return <p className="text-center text-red-500">Custom set not found.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-5 flex justify-center items-start">
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">{customSet.name}</h1>

                <ul className="grid grid-cols-3 gap-6">
                    {customSet.partsArr.map((partItem, index) => (
                        <li key={index} className="border p-4 rounded-md bg-white flex flex-col items-center">
                            <img src={partItem.part.part_img_url} alt={partItem.part.name} className="w-24 h-24 object-cover mb-4" />
                            <span className="text-center font-semibold">{partItem.part.name}</span>
                            <span className="text-center text-gray-500">Part Num: {partItem.part.part_num}</span>
                            <button
                                onClick={() => handleRemovePart(partItem.element_id)}
                                className="mt-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
                            >
                                Remove Part
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Delete entire set button */}
                <button
                    onClick={handleDeleteSet}
                    className="mt-8 w-full bg-red-600 text-white px-5 py-3 rounded-md hover:bg-red-700 transition duration-200"
                >
                    Delete Custom Set
                </button>
            </div>
        </div>
    );
};

export default ViewCustomSet;
