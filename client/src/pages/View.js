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
    <table class="table-auto">
      <thead>
        <tr>
          <th>CID</th>
          <th>Uploader</th>
          <th>View/Download Link</th>
        </tr>
      </thead>
      <tbody>
        {CIDs.map(CID => {
          const certificateLink = "https://blockchain-academic-certificates.infura-ipfs.io/ipfs/" + CID;
          return (
            <tr key={CID}>
              <td>{CID}</td>
              <td>Uploader Account</td>
              <td><a href={certificateLink}>Link</a></td>
            </tr>
          );
          })}
      </tbody>
    </table>
  );
}

export default View;