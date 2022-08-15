import { Link } from "react-router-dom";


const Home = (props) => {
  return (
    <main class="flex w-full">
      <div class ="flex flex-col w-2/3">
        <div class="h-96 p-12 border-b-2">
          <h1 class="text-4xl">Are You an Employer?</h1>
          <p class="pt-8">
            If you're an employer looking to verify the validity of an applicants certificates, please:
          </p>
          <ul class="list-disc pt-6">
            <li class="pb-4">
              Connect your MetaMask wallet using the <strong>Connect Wallet</strong> button in the top right. (If you
              need guidance, please refer to the <a class="text-blue-600 font-bold hover:underline">Setting up MetaMask</a> of the help page).
            </li>
            <li>
              Simply head over to the <Link to="verify" class="text-blue-600 font-bold hover:underline">Verify</Link> section of this application to
              upload the provided document and verify!
            </li>
          </ul>
        </div>
        <div class="h-96 p-12 border-b-2">
          <h1 class="text-4xl">Are You a Student?</h1>
          <p class="pt-8">
            If you're already set up, visit the <Link to="verify" class="text-blue-600 font-bold hover:underline">View</Link> section to see and/or
            download all of your published certificates.
          </p>
          <p class="pt-6">
            Otherwise, please see the <a class="text-blue-600 font-bold hover:underline">New Student</a> section of the help page to register your wallet.
          </p>
        </div>
        <div class="h-96 p-12">
          <h1 class="text-4xl">Are You an Institution?</h1>
          <p class="pt-8">
            If you're an employer looking to verify the validity of an applicants certificates, please:
          </p>
          <ul class="list-disc pt-6">
            <li class="pb-4">
              Connect your MetaMask wallet using the <strong>Connect Wallet</strong> button in the top right. (If you
              need guidance, please refer to the <a class="text-blue-600 font-bold hover:underline">Setting up MetaMask</a> of the help page).
            </li>
            <li>
              Simply head over to the <Link to="verify" class="text-blue-600 font-bold hover:underline">Verify</Link> section of this application to
              upload the provided document and verify!
            </li>
          </ul>
        </div>
      </div>
      <div class="flex flex-col bg-black w-1/3">
        <div class="px-12 py-20">
          <h1 class="text-3xl text-white">Tamper Proof Academic Documents</h1>
          <div class="pt-4">
            <p class="text-white">
              Instantly verify student documents such as degree certificates or transcripts without
              the need for a middleman and without the need to wait for slow, manual validation.
            </p>
          </div> 
        </div>
        <div class="px-12 py-20">
          <h1 class="text-3xl text-white">Secured by the Blockchain</h1>
          <div class="pt-4">
            <p class="text-white">
              Instantly verify student documents such as degree certificates or transcripts without
              the need for a middleman and without the need to wait for slow, manual verification.
            </p>
          </div>
        </div>
        <div class="px-12 py-20">
          <h1 class="text-3xl text-white">Secured by the Blockchain</h1>
          <div class="pt-4">
            <p class="text-white">
              Instantly verify student documents such as degree certificates or transcripts without
              the need for a middleman and without the need to wait for slow, manual verification.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;