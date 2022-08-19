const PublishedCertificatesTable = (props) => {
  return (
    <table class="table-auto border-collapse border drop-shadow my-10 mx-20">
      <thead>
        <tr>
          <th class="bg-violet-500 border text-white text-left px-8 py-4">IPFS Content ID (CID)</th>
          <th class="bg-violet-500 border text-white text-left px-8 py-4">Student</th>
          <th class="bg-violet-500 border text-white text-left px-8 py-4">Date Added</th>
          <th class="bg-violet-500 border text-white text-left px-8 py-4">View Link</th>
        </tr>
      </thead>
      <tbody>
        {props.certificates.map(certificate => {
          const certificateLink = "https://blockchain-academic-certificates.infura-ipfs.io/ipfs/" + certificate.CID;
          return (
            <tr key={certificate.CID}>
              <td class="bg-white border px-8 py-4">
                {certificate.CID}
              </td>
              <td class="bg-white border px-8 py-4">
              {certificate.studentAccount.substring(0,5)}...{certificate.studentAccount.substring(38.42)}
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
  );
}

export default PublishedCertificatesTable;