import { useState, useEffect, useRef } from "react";
import Gun from "gun";

const RegisterStudentForm = (props) => {

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [existingStudentName, setExistingStudentName] = useState("");
  const firstNameRef = useRef("");
  const surnameRef = useRef("");

  const gun = Gun({peers: ['http://localhost:3001/gun']});
  const studentAccounts = gun.get('studentAccounts');

  useEffect(() => {
    if (props.account) {
      studentAccounts.get(props.account).on((studentName, account) => {
        if (studentName) {
          setExistingStudentName(studentName);
        }
      });
    }
  })

  const handleRegisterAccount = (e) => {
    e.preventDefault();
    console.log(firstName + " " + surname);
    studentAccounts.get(props.account).put(firstName + " " + surname);
    setFirstName("");
    setSurname("");
    firstNameRef.current.value = "";
    surnameRef.current.value = "";
  }

  return (
    <form onSubmit={handleRegisterAccount} class="flex flex-col p-10 justify-center bg-white drop-shadow">
      <FormInfoText account={props.account} existingStudentName={existingStudentName} />
      <div class="flex flex-row">
        <div class="flex flex-col mx-2">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            First Name
          </label>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} ref={firstNameRef}
            class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 focus:bg-white focus:outline-none focus:border-teal-500"
          />
        </div>
        <div class="flex flex-col mx-2">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Last Name
          </label>
          <input type="text" value={surname} onChange={e => setSurname(e.target.value)} ref={surnameRef}
            class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 focus:bg-white focus:outline-none focus:border-teal-500"
          />
        </div>
        <input type="submit" value="Submit" disabled={(firstName === "") || (surname === "") || (!props.isConnected)}
          class="shadow mt-6 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-200 focus:shadow-outline focus:outline-none text-white font-bold mx-2 py-2 px-4 rounded"
        />
      </div>
    </form>
  );
}

const FormInfoText = (props) => {
  if (props.account) {
    return (
      <div>
        <div class="block tracking-wide text-gray-700 text-s mx-2 mb-4">
          Adding student details for blockchain account: <strong>{props.account.substring(0,5)}...{props.account.substring(38.42)}</strong>
        </div>
        {props.existingStudentName !== "" &&
          <div class="block tracking-wide text-red-600 text-s mx-2 mb-6">
            This blockchain account is already registered for student name: <strong>{props.existingStudentName}</strong><br/>
            If you would like to update this name, please <strong>submit a new one.</strong>
          </div>
        }
      </div>
    );
  } else {
    return (
      <div class="block tracking-wide text-red-600 text-s mx-2 mb-6">
        No blockchain account detected. Please make sure you have MetaMask set up<br/> and then click the <strong>Connect Wallet</strong> button.
      </div>
    );
  }
}

export default RegisterStudentForm;