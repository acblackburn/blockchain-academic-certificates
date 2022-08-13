import { useState, useEffect, useRef } from 'react';
import Gun from 'gun';
import keccak256 from 'keccak256';
const Hash = require('ipfs-only-hash');

function GunTest(props) {

  const [file, setFile] = useState(null);
  const [CIDs, setCIDs] = useState([]);
  const fileInputRef = useRef("");

  const gun = Gun({peers: ['http://localhost:3001/gun']});
  const gunItems = gun.get('items');

  useEffect(() => {
    // Get items from gun and add new items to items array in state
    gunItems.map().on((node, CID) => {
      if (node && !CIDs.includes(CID)) {
        setCIDs(CIDs.concat(CID));
      }
    });
  })

  const retrieveFile = (e) => {
    e.preventDefault();
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(Buffer(reader.result));
    }
  }

  const addNewCID = async (e) => {
    e.preventDefault();
    try {
      const fileCID = await Hash.of(file);
      const newItem = gun.get(fileCID).put({studentAccout: "exampleStudentAccount", uploaderAccount: "exampleUploaderAccount"});
      gunItems.set(newItem);
      setFile(null);
      fileInputRef.current.value = "";
    } catch (error) {
      console.log(error.message);
      return;
    }
  }

  // Set key to null and remove from items array in state
  const removeCID = async (e) => {
    try {
      const fileCID = await Hash.of(file);
      gunItems.get(fileCID).put(null);
      setCIDs(CIDs.filter(CID => CID !== fileCID));
      setFile(null);
      fileInputRef.current.value = "";
    } catch (error) {
      console.log(error);
      return;
    }
  }

  return (
    <div>
      <form class="w-3/5 flex flex-col justify-center bg-white shadow-md rounded px-8 py-8">
        <div class="flex justify-center">
          <input type="file" onChange={retrieveFile} ref={fileInputRef}
          class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-indigo-600"
          />
          <input type="button" onClick={addNewCID} value="Add" class="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold mx-5 py-2 px-4 rounded" />
          <input type="button" onClick={removeCID} value="Delete" class="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold mx-5 py-2 px-4 rounded" />
        </div>
      </form>
      <ul>
        {CIDs.map((CID, i) => {
          return <li key={i}>{CID}</li>;
        })}
      </ul>
    </div>
  );
};

export default GunTest;