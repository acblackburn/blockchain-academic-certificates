import React from 'react';
import { useState, useEffect } from 'react';
import keccak256 from 'keccak256';

function Publish(props) {

  const [data, setData] = useState('');
  const [publishStatus, setPublishStatus] = useState(0);

  const submitData = async (e) => {
    e.preventDefault();
    fetch('/hash', {method: 'POST', body: data})
      .then((res) => {
        console.log(res);
        setData('');
        return res.json();
      });
  }

  return (
    <div class="my-20 flex justify-center w-full">
      <form onSubmit={submitData} class="w-3/5 flex flex-col justify-center bg-white shadow-md rounded px-8 py-8">
        <div class="flex justify-center">
          <label>
            <input type="text" value={data} onChange={e => setData(e.target.value)} 
            class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-indigo-600"
            placeholder="e.g. abc"
            />
          </label>
          <input type="submit" value="Publish" class="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold mx-5 py-2 px-4 rounded" />
        </div>
        {/* {verifiedStatus !== 0 &&
        <div>
        {verifiedStatus ? 
          <h2 class="flex justify-center text-xl text-green-600 font-bold mt-5">Certificate has been verified as real</h2>
          : 
          <h2 class="flex justify-center text-xl text-red-600 font-bold mt-5">Certificate has been verified as fake</h2>}
        </div>} */}
      </form>
    </div>
    
  );
}

export default Publish;