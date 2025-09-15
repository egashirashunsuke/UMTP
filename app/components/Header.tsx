import { NavLink } from "react-router";

const Header = () => {
  return (
    <header className="bg-white shadow-md h-14 flex items-center px-6">
      {/* 左側：ロゴ */}
      <h1 className="text-2xl font-bold text-gray-900 mr-8">
        <NavLink to="/">UMTP Learning</NavLink>
      </h1>

      {/* 中央ナビ */}
      <nav>
        <ul className="flex space-x-2">
          <li>
            <NavLink
              to="/questions"
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-2 rounded bg-gray-100 text-gray-900 font-semibold"
                  : "px-3 py-2 rounded text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }
            >
              問題一覧
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-2 rounded bg-gray-100 text-gray-900 font-semibold"
                  : "px-3 py-2 rounded text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }
            >
              このサイトについて
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* 右側：ログイン */}
      <div className="ml-auto">
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-2 rounded bg-gray-100 text-gray-900 font-semibold"
              : "px-3 py-2 rounded text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          }
        >
          ログイン
        </NavLink>
      </div>
    </header>
  );
};

export default Header;
