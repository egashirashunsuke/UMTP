import { NavLink } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";

const Header = () => {
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading } =
    useAuth0();

  return (
    <header className="bg-white shadow-md h-14 flex items-center px-6">
      {/* 左側：ロゴ */}
      <h1 className="text-2xl font-bold text-gray-900 mr-8">
        <NavLink to="/">UMTP Learning B</NavLink>
      </h1>

      {/* 中央ナビ */}
      <nav>
        <ul className="flex space-x-2">
          {/* <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-2 rounded bg-gray-100 text-gray-900 font-semibold"
                  : "px-3 py-2 rounded text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }
            >
              このサイトについて
            </NavLink>
          </li> */}
          <li>
            {/* <NavLink
              to="/tutorial"
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-2 rounded bg-gray-100 text-gray-900 font-semibold"
                  : "px-3 py-2 rounded text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }
            >
              チュートリアル
            </NavLink> */}
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
        </ul>
      </nav>

      <div className="ml-auto">
        {isLoading ? null : isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-50">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.picture || ""}
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback>
                    {(user?.name || user?.email || "U")
                      .slice(0, 1)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-gray-800 max-w-[14rem] truncate">
                  {user?.name || user?.email}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="truncate">
                {user?.name || user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <NavLink to="/profile">プロフィール</NavLink>
              </DropdownMenuItem>
              {/* 必要に応じて Settings などを追加 */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>{
                  localStorage.removeItem("anon_id");
                  logout({
                    logoutParams: { returnTo: window.location.origin },
                  })
                }}
              >
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className="rounded bg-gray-900 text-white px-3 py-2 hover:bg-black"
          >
            ログイン
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
