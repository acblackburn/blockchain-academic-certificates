import { Link } from 'react-router-dom';
import homeIcon from '../icons/home-line.svg';
import verifyIcon from '../icons/checkbox-circle-line.svg';
import publishIcon from '../icons/file-upload-line.svg';
import viewIcon from '../icons/file-search-line.svg';
import helpIcon from '../icons/question-line.svg'

const Sidebar = (props) => {
  return (
    <div class="flex flex-col justify-between sticky top-0 left-0 h-screen w-24 overflow-hidden bg-violet-500 shadow">
      <nav class="flex flex-col">
        <Link to="/" class="flex flex-col items-center justify-center h-20 w-full text-xs tracking-wide text-white hover:bg-violet-700 transition hover:duration-100">
            <img src={homeIcon} alt="House icon" class="my-1"/>
            HOME
        </Link>
        <Link to="/verify" class="flex flex-col items-center justify-center h-20 w-full text-xs tracking-wide text-white hover:bg-violet-700 transition hover:duration-100">
          <img src={verifyIcon} alt="Verify icon" class="my-1"/>
          VERIFY
        </Link>
        <Link to="/publish" class="flex flex-col items-center justify-center h-20 w-full text-xs tracking-wide text-white hover:bg-violet-700 transition hover:duration-100">
          <img src={publishIcon} alt="Publish icon" class="my-1"/>
          PUBLISH
        </Link>
        <Link to="/view" class="flex flex-col items-center justify-center h-20 w-full text-xs tracking-wide text-white hover:bg-violet-700 transition hover:duration-100">
          <img src={viewIcon} alt="View icon" class="my-1"/>
          VIEW
        </Link>
        <Link to="/gun-test" class="flex flex-col items-center justify-center h-20 w-full text-xs tracking-wide text-white hover:bg-violet-700 transition hover:duration-100">
          gun-test
        </Link>
      </nav>
      <Link to="/help" class="flex flex-col items-center justify-center h-20 w-full text-xs tracking-wide text-white hover:bg-violet-700 transition hover:duration-100">
        <img src={helpIcon} alt="Help icon" class="my-1"/>
        HELP
      </Link>
    </div>
  );
}

export default Sidebar;