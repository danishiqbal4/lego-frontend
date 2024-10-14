import React, { useState, useEffect } from 'react';
import useLegoSet from '../hooks/useLegoSet';
import useCustomLegoSet from '../hooks/useCustomLegoSet';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';

const LegoSet = () => {
    const [setId, setSetId] = useState('');
    const [customSetName, setCustomSetName] = useState('');
    const [selectedSetId, setSelectedSetId] = useState(null);
    const { legoParts, loading, error, fetchLegoSet, fetchLegoSetByUrl, pagination } = useLegoSet(setId);
    const { customParts, setCustomParts, addCustomPart, removeCustomPart, isPartAdded } = useCustomLegoSet(legoParts);
    const [savedCustomSets, setSavedCustomSets] = useState([]);

    useEffect(() => {
        const savedSets = JSON.parse(localStorage.getItem('customLegoSets')) || [];
        setSavedCustomSets(savedSets);
    }, []);

    const saveCustomSet = () => {
        // alert(selectedSetId)
        if (!selectedSetId && !customSetName) {
            alert("Please enter a name for your custom set.");
            return;
        }

        if(!selectedSetId) {
            const existingSetNameExist = savedCustomSets.findIndex(set => set.name.toLowerCase() === customSetName.toLowerCase());

            if (existingSetNameExist !== -1) {
                alert("This Name already exists. Please enter a unique name for your custom set.");
                return;
            }
        }


        const newSetId = selectedSetId ? selectedSetId : uuidv4();
        const newCustomSet = {
            id: newSetId,
            name: customSetName,
            partsArr: customParts,
        };

        // Update or Add the new custom set
        let updatedSets = [];
        const existingSetIndex = savedCustomSets.findIndex(set => set.id === selectedSetId);

        if (existingSetIndex !== -1) {
            // Update the existing set with new parts
            updatedSets = [...savedCustomSets];
            updatedSets[existingSetIndex].partsArr = customParts;
        } else {
            // Add a new custom set
            updatedSets = [...savedCustomSets, newCustomSet];
        }

        localStorage.setItem('customLegoSets', JSON.stringify(updatedSets));
        setSavedCustomSets(updatedSets);

        alert("Custom set saved!");
        setCustomSetName('');
        setCustomParts([]);
        setSelectedSetId(null)
    };

    const onHandleUpdate = (setId) => {
        console.log(setId)
        setSelectedSetId(setId)

        if(setId !== "") {
            const savedSets = JSON.parse(localStorage.getItem('customLegoSets')) || [];
            const foundSet = savedSets.find(set => set.id === setId);
            console.log(foundSet, "foundSetfoundSet")
            setCustomParts(foundSet.partsArr);
        } else {
            setCustomParts([]);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-5 flex flex-col justify-start items-center w-11/12 mx-auto">
            {/* Saved Custom Sets */}
            {
                savedCustomSets.length > 0 && 
                <div className="w-full bg-white rounded-lg shadow-lg p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Saved Custom Sets:</h2>
                    <ul className="grid grid-cols-4 gap-4">
                        {savedCustomSets.map(set => (
                            <li key={set.id} className="flex justify-between items-center p-4 bg-gray-200 rounded-md">
                                {set.name}
                                <Link to={`/view/set/${set.id}`} className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition duration-200 text-sm">View Set</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            }

            <div className="flex w-full">
                <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg p-8 mr-8">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">LEGO Set Customizer</h1>

                    {/* Input for fetching LEGO set */}
                    <div className="flex mb-4 justify-center">
                        <input
                            type="text"
                            value={setId}
                            onChange={(e) => setSetId(e.target.value)}
                            placeholder="Enter LEGO Set ID. Eg: 10327-1, 0241357594-1"
                            className="w-full border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:border-blue-500"
                        />
                        <button
                            onClick={() => { fetchLegoSet(); }}
                            className="ml-4 bg-blue-500 text-white px-5 py-3 rounded-md hover:bg-blue-600 transition duration-200 w-48"
                        >
                            Fetch Set Parts
                        </button>
                    </div>

                    {/* Loading and error handling */}
                    {loading && <p className="text-center text-blue-500 font-semibold">Loading...</p>}
                    {error && <p className="text-center text-red-500 font-semibold">{error}</p>}

                    {
                        savedCustomSets.length > 0 &&
                        <div className="mb-4">
                            <label className="block mb-2 text-gray-700">Add parts to an existing or a New custom set:</label>
                            <select
                                value={selectedSetId || ''}
                                onChange={(e) => onHandleUpdate(e.target.value)}
                                className="w-full border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:border-green-500"
                            >
                                <option value="">New</option>
                                {savedCustomSets.map(set => (
                                    <option key={set.id} value={set.id}>{set.name}</option>
                                ))}
                            </select>
                        </div>
                    }

                    {/* LEGO Parts listing */}
                    <div className="grid gap-6">
                        <div className="bg-gray-50 p-4 rounded-md">
                            <h2 className="text-xl font-bold text-gray-700 mb-4">Parts in Set {setId}:</h2>
                            {legoParts.length > 0 ? (
                                <>
                                    <ul className="grid grid-cols-4 gap-4">
                                        {legoParts.map((partItem, i) => (
                                            <li key={i} className="border p-4 rounded-md bg-white flex flex-col items-center">
                                                <img src={partItem.part.part_img_url} alt={partItem.part.name} className="w-24 h-24 object-cover mb-4" />
                                                <span className="text-center font-semibold">{partItem.part.name}</span>
                                                <span className="text-center text-gray-500">Quantity: {partItem.quantity}</span>
                                                <span className="text-center text-gray-500">Part Num: {partItem.part.part_num}</span>
                                                {isPartAdded(partItem) ? (
                                                    <button onClick={() => removeCustomPart(partItem)} className="mt-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200 max-w-[114px]">
                                                        Remove Part
                                                    </button>
                                                ) : (
                                                    <button onClick={() => addCustomPart(partItem)} className="mt-4 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-200 max-w-[114px] w-full">
                                                        Add Part
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex justify-between mt-6">
                                        <button onClick={() => pagination.next && fetchLegoSetByUrl(pagination.next)} disabled={!pagination.next} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                                            More
                                        </button>
                                    </div>
                                </>
                            ) : <p className="text-center text-gray-500">No parts available for this set.</p>}
                        </div>
                    </div>
                </div>

                {/* Custom Parts */}
                <div className="w-full max-w-[370px] bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Custom Set:</h2>
                    {customParts.length > 0 ? (
                        <>
                            <ul className="grid grid-cols-1 gap-4">
                                {customParts.map((partItem, index) => (
                                    <li key={index} className="flex justify-start items-center border p-4 rounded-md bg-white font-semibold">
                                        <img src={partItem.part.part_img_url} alt={partItem.part.name} className="w-10 h-10 object-cover mr-2" />
                                        <span>{partItem.part.name}</span>
                                    </li>
                                ))}
                            </ul>

                            {
                                selectedSetId == "" || selectedSetId == null ?
                                <div className="mt-8">
                                    <input
                                        type="text"
                                        value={customSetName}
                                        onChange={(e) => setCustomSetName(e.target.value)}
                                        placeholder="Enter Custom Set Name"
                                        className="w-full border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:border-green-500"
                                    />
                                </div>
                                : <></>
                            }

                            <button onClick={saveCustomSet} className="w-full mt-8 text-white px-5 py-3 rounded-md transition duration-200 bg-purple-500 hover:bg-purple-600">
                                Save Customized Set
                            </button>
                        </>
                    ) : <p className="text-center text-gray-500">No custom parts added.</p>}
                </div>
            </div>
        </div>
    );
};

export default LegoSet;
