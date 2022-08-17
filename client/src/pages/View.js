import { useState, useEffect } from 'react';
import Gun from 'gun';
import { Link } from 'react-router-dom';

function View(props) {

  const [certificates, setCertificates] = useState([]);

  // Init connection to gunDB with relay server and get certificatesData set
  const gun = Gun({peers: ['http://localhost:3001/gun']});
  const certificatesData = gun.get('certificatesData');

  useEffect(() => {
    // Load all certificates for connected blockchain account from gunDB
    certificatesData.map(certificate => certificate.studentAccount === props.account ? certificate : undefined).once((metadata, _CID) => {
      if (metadata && !certificates.some(({CID}) => CID === _CID)) {
        setCertificates(certificates.concat(
          {
            CID: _CID,
            uploaderAccount: metadata.uploaderAccount,
            dateAdded: metadata.dateAdded
          }));  
      }
    });
  })

  return (
    <div class="flex flex-col w-full justify-center">
      <div class="mt-14 mx-20">
        <h1 class="text-4xl">Your Certificates</h1>
        <p class="pt-6">
          Listing all published certificates for blockchain account: <strong>{props.account.substring(0,5)}...{props.account.substring(38.42)}</strong>
        </p>
        <p class="pt-6">
          If you are a student and wish to register this blockchain account in order to view your certificates, 
          please visit the <Link to="help" class="text-blue-600 font-bold hover:underline">New Student</Link> section
          of the help page to register your wallet.
        </p>
      </div>
      <table class="table-auto border-collapse border drop-shadow my-14 mx-20">
        <thead>
          <tr>
            <th class="bg-teal-100 border text-left px-8 py-4">IPFS Content ID (CID)</th>
            <th class="bg-teal-100 border text-left px-8 py-4">Uploader</th>
            <th class="bg-teal-100 border text-left px-8 py-4">Date Added</th>
            <th class="bg-teal-100 border text-left px-8 py-4">View Link</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map(certificate => {
            const certificateLink = "https://blockchain-academic-certificates.infura-ipfs.io/ipfs/" + certificate.CID;
            return (
              <tr key={certificate.CID}>
                <td class="bg-white border px-8 py-4">
                  {certificate.CID}
                </td>
                <td class="bg-white border px-8 py-4">
                {certificate.uploaderAccount.substring(0,5)}...{certificate.uploaderAccount.substring(38.42)}
                </td>
                <td class="bg-white border px-8 py-4">
                  {certificate.dateAdded}
                </td>
                <td class="bg-white border px-8 py-4 text-blue-600 font-bold hover:underline">
                  <a href={certificateLink} target="_blank">IPFS Link</a>
                </td>
              </tr>
            );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default View;