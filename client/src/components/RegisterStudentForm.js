import { useState, useEffect, useRef } from "react";
import Gun from "gun";

const RegisterStudentForm = (props) => {

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const firstNameRef = useRef("");
  const surnameRef = useRef("");

  const gun = Gun({peers: ['http://localhost:3001/gun']});
  const studentAccounts = gun.get('studentAccounts');

  const handleRegisterAccount = (e) => {
    e.preventDefault();
    console.log(firstName + " " + surname);
    setFirstName("");
    setSurname("");
    firstNameRef.current.value = "";
    surnameRef.current.value = "";
  }

  return (
    <form onSubmit={handleRegisterAccount} class="flex flex-col p-10 justify-center bg-white drop-shadow">
      <div class="block tracking-wide text-gray-700 text-s mx-2 mb-2">
        Adding student details for blockchain account: <strong>{props.account.substring(0,5)}...{props.account.substring(38.42)}</strong>
      </div>
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

export default RegisterStudentForm;