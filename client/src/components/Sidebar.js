import { Link } from 'react-router-dom';

const Sidebar = (props) => {
  return (
    <aside class="flex flex-col sticky top-0 left-0 h-screen w-24 overflow-hidden bg-teal-500">
      <nav class="flex flex-col">
        <Link to="/" class="flex flex-col items-center justify-center h-20 w-full hover:bg-teal-600 transition hover:duration-100">
            HOME
        </Link>
        <Link to="/verify" class="flex flex-col items-center justify-center h-20 w-full hover:bg-teal-600 transition hover:duration-100">
          VERIFY
        </Link>
        <Link to="/publish" class="flex flex-col items-center justify-center h-20 w-full hover:bg-teal-600 transition hover:duration-100">
          PUBLISH
        </Link>
        <Link to="/view" class="flex flex-col items-center justify-center h-20 w-full hover:bg-teal-600 transition hover:duration-100">
          VIEW
        </Link>
        <Link to="/gun-test" class="flex flex-col items-center justify-center h-20 w-full hover:bg-teal-600 transition hover:duration-100">
          gun-test
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;