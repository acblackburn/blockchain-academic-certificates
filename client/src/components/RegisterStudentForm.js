const RegisterStudentForm = (props) => {
  return (
    <form class="flex flex-row p-10 justify-center bg-white drop-shadow">
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
  );
}

export default RegisterStudentForm;