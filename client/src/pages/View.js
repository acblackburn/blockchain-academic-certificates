import { useState, useEffect } from 'react';
import Gun from 'gun';

function View(props) {

  const [CIDs, setCIDs] = useState([]);

  // Init connection to gunDB with relay server and get certificatesData set
  const gun = Gun({peers: ['http://localhost:3001/gun']});
  const certificatesData = gun.get('certificatesData');

  useEffect(() => {
    // Load all certificate CIDs from gunDB
    certificatesData.map().once((node, CID) => {
      if (node && !CIDs.includes(CID)) {
        setCIDs(CIDs.concat(CID));  
      }
    });
  })

  return (
    <div class="flex flex-col w-full justify-center">
      <table class="table-auto border-collapse border drop-shadow my-8 mx-8">
        <thead>
          <tr>
            <th class="bg-teal-100 border text-left px-8 py-4">IPFS Content ID (CID)</th>
            <th class="bg-teal-100 border text-left px-8 py-4">Uploader</th>
            <th class="bg-teal-100 border text-left px-8 py-4">View Link</th>
          </tr>
        </thead>
        <tbody>
          {CIDs.map(CID => {
            const certificateLink = "https://blockchain-academic-certificates.infura-ipfs.io/ipfs/" + CID;
            return (
              <tr key={CID}>
                <td class="bg-white border px-8 py-4">{CID}</td>
                <td class="bg-white border px-8 py-4">Uploader Account</td>
                <td class="bg-white border px-8 py-4 text-blue-600 font-bold hover:underline"><a href={certificateLink}>IPFS Link</a></td>
              </tr>
            );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default View;