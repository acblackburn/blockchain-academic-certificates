import RegisterStudentForm from "../components/RegisterStudentForm";

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
        <RegisterStudentForm account={props.account} isConnected={props.isConnected} />
      </div>
    </div>
  );
}

export default Help;