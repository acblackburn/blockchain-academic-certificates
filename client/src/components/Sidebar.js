import { Link } from 'react-router-dom';

const Sidebar = (props) => {
  return (
    <div class="flex flex-col justify-between sticky top-0 left-0 h-screen w-24 overflow-hidden bg-violet-500 shadow">
      <nav class="flex flex-col">
        <Link to="/" class="flex flex-col items-center justify-center h-20 w-full text-xs tracking-wide text-white hover:bg-violet-700 transition hover:duration-100">
            HOME
        </Link>
        <Link to="/verify" class="flex flex-col items-center justify-center h-20 w-full text-xs tracking-wide text-white hover:bg-violet-700 transition hover:duration-100">
          VERIFY
        </Link>
        <Link to="/publish" class="flex flex-col items-center justify-center h-20 w-full text-xs tracking-wide text-white hover:bg-violet-700 transition hover:duration-100">
          PUBLISH
        </Link>
        <Link to="/view" class="flex flex-col items-center justify-center h-20 w-full text-xs tracking-wide text-white hover:bg-violet-700 transition hover:duration-100">
          VIEW
        </Link>
        <Link to="/gun-test" class="flex flex-col items-center justify-center h-20 w-full text-xs tracking-wide text-white hover:bg-violet-700 transition hover:duration-100">
          gun-test
        </Link>
      </nav>
      <Link to="/help" class="flex flex-col items-center justify-center h-20 w-full text-xs tracking-wide text-white hover:bg-violet-700 transition hover:duration-100">
        HELP
      </Link>
    </div>
  );
}

export default Sidebar;