const Help = (props) => {
  return (
    <div class="flex flex-col w-full justify-center">
      <div class="my-14 mx-20">
        <h1 class="text-4xl">Register New Student Wallet</h1>
        <p class="pt-6 font-bold">
          Please only follow these instructions if you are a student and would like to create
          an account in order to have your academic documents published by your institution and
          available to download. 
        </p>
        <ul class="list-disc pt-6">
            <li>
              Connect your MetaMask wallet using the <strong>Connect Wallet</strong> button in the top right. (If you
              need guidance, please refer to the <a class="text-blue-600 font-bold hover:underline">Setting up MetaMask</a> of the help page).
            </li>
            <li class="pt-4">
              Once your MetaMask wallet is connected, fill in your details in below to register the wallet.
            </li>
          </ul>
      </div>
      <div class="flex w-full justify-center">
        <form class="flex flex-row mx-20 p-10 justify-center bg-white drop-shadow">
          <div class="flex flex-col mx-2">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              First Name
            </label>
            <input type="text"
              class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 focus:bg-white focus:outline-none focus:border-teal-500"
            />
          </div>
          <div class="flex flex-col mx-2">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Last Name
            </label>
            <input type="text"
              class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 focus:bg-white focus:outline-none focus:border-teal-500"
            />
          </div>
          <input type="submit" value="Publish" class="shadow mt-6 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-200 focus:shadow-outline focus:outline-none text-white font-bold mx-2 py-2 px-4 rounded" />
        </form>
      </div>
    </div>
  );
}

export default Help;